'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface IncomeSource {
  id: string;
  name: string;
  description: string | null;
}

interface IncomeTransaction {
  id: string;
  source_id: string;
  amount: number;
  amount_official: number;
  description: string | null;
  transaction_date: string;
  created_at: string;
  income_sources?: {
    name: string;
  };
}

interface DailySummary {
  date: string;
  transactions: IncomeTransaction[];
  total: number;
}

export default function IncomePage() {
  const [transactions, setTransactions] = useState<IncomeTransaction[]>([]);
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSource, setSelectedSource] = useState('');
  const [amount, setAmount] = useState('');
  const [amountOfficial, setAmountOfficial] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  );
  const [filterEndDate, setFilterEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => { loadData(); }, [filterStartDate, filterEndDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data: sourcesData, error: sourcesError } = await supabase.from('income_sources').select('*').order('name', { ascending: true });
      if (sourcesError) throw sourcesError;
      setSources(sourcesData || []);
      const { data: transactionsData, error: transactionsError } = await supabase.from('income_transactions').select('*, income_sources(name)').gte('transaction_date', filterStartDate).lte('transaction_date', filterEndDate).order('transaction_date', { ascending: false }).order('created_at', { ascending: false });
      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);
    } catch (error: any) {
      toast.error('Veriler yüklenemedi: ' + (error?.message || 'bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSource || !amount) {
      toast.error('Lütfen gelir kaynağı ve tutar giriniz.');
      return;
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Lütfen geçerli bir tutar giriniz.');
      return;
    }
    
    // Resmi tutar girilmemişse, gerçek tutara eşitle
    const amountOfficialNum = amountOfficial ? parseFloat(amountOfficial) : amountNum;
    if (isNaN(amountOfficialNum) || amountOfficialNum < 0) {
      toast.error('Lütfen geçerli bir resmi tutar giriniz.');
      return;
    }
    
    try {
      setSubmitting(true);
      if (editingId) {
        const { error } = await supabase.from('income_transactions').update({ 
          source_id: selectedSource, 
          amount: amountNum,
          amount_official: amountOfficialNum,
          description: description.trim() || null, 
          transaction_date: selectedDate 
        }).eq('id', editingId);
        if (error) throw error;
        toast.success('Gelir kaydı güncellendi!');
      } else {
        const { error } = await supabase.from('income_transactions').insert({ 
          source_id: selectedSource, 
          amount: amountNum,
          amount_official: amountOfficialNum,
          description: description.trim() || null, 
          transaction_date: selectedDate 
        });
        if (error) throw error;
        toast.success('Gelir kaydı başarıyla eklendi!');
      }
      setShowForm(false);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error('Gelir kaydı eklenemedi: ' + (error?.message || 'Bilinmeyen hata'));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedSource('');
    setAmount('');
    setAmountOfficial('');
    setDescription('');
  };

  const handleEdit = (transaction: IncomeTransaction) => {
    setEditingId(transaction.id);
    setSelectedDate(transaction.transaction_date);
    setSelectedSource(transaction.source_id);
    setAmount(transaction.amount.toString());
    setAmountOfficial(transaction.amount_official ? transaction.amount_official.toString() : '');
    setDescription(transaction.description || '');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu gelir kaydını silmek istediğinizden emin misiniz?')) return;
    try {
      const { error } = await supabase.from('income_transactions').delete().eq('id', id);
      if (error) throw error;
      toast.success('Gelir kaydı silindi.');
      loadData();
    } catch (error: any) {
      toast.error('Gelir kaydı silinemedi: ' + (error?.message || 'bilinmeyen hata'));
    }
  };

  const dailySummaries: DailySummary[] = transactions.reduce((acc, transaction) => {
    const existingSummary = acc.find(s => s.date === transaction.transaction_date);
    if (existingSummary) {
      existingSummary.transactions.push(transaction);
      existingSummary.total += Number(transaction.amount);
    } else {
      acc.push({ date: transaction.transaction_date, transactions: [transaction], total: Number(transaction.amount) });
    }
    return acc;
  }, [] as DailySummary[]);

  const grandTotal = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const grandTotalOfficial = transactions.reduce((sum, t) => sum + Number(t.amount_official || t.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block"> Dashboard</Link>
            <h1 className="text-4xl font-light tracking-wide text-gray-900">Gelir Yönetimi</h1>
            <p className="text-gray-600 mt-2">Her bir gelir işlemini ayrı ayrı kaydedin</p>
          </div>
          <button 
            onClick={() => {
              if (showForm && editingId) resetForm();
              setShowForm(!showForm);
            }} 
            className="bg-gray-900 text-white px-6 py-3 uppercase text-sm tracking-wide hover:bg-gray-700 transition-colors"
          >
            {showForm ? 'Formu Kapat' : '+ Yeni Gelir Ekle'}
          </button>
        </div>
        {showForm && (
          <div className="bg-white border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-light tracking-wide mb-2">{editingId ? 'Gelir Kaydını Düzenle' : 'Yeni Gelir İşlemi'}</h2>
            <p className="text-sm text-gray-600 mb-6">Her bir geliri (nakit, kart, online sipariş) ayrı ayrı kaydedin. Gün sonunda tüm işlemler otomatik toplanır.</p>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div><label className="block text-sm uppercase tracking-wide text-gray-700 mb-2">Tarih *</label><input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900" required /></div>
                <div><label className="block text-sm uppercase tracking-wide text-gray-700 mb-2">Gelir Kaynağı *</label><select value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)} className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900" required><option value="">Seçiniz...</option>{sources.map(source => (<option key={source.id} value={source.id}>{source.name}</option>))}</select><p className="text-xs text-gray-500 mt-1">Gelir kaynakları <Link href="/admin/settings/income-sources" className="text-blue-600 hover:underline">ayarlar</Link> sayfasından yönetilebilir.</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm uppercase tracking-wide text-gray-700 mb-2">Tutar (€) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    placeholder="0.00" 
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900" 
                    required 
                  />
                  <p className="text-xs text-gray-500 mt-1">Kasaya giren toplam tutar</p>
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-wide text-gray-700 mb-2">Esas Tutar (€)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    value={amountOfficial} 
                    onChange={(e) => setAmountOfficial(e.target.value)} 
                    placeholder="Boş bırakılırsa tutara eşit olur" 
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900" 
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm uppercase tracking-wide text-gray-700 mb-2">Açıklama (Opsiyonel)</label>
                <input 
                  type="text" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Ek bilgi..." 
                  className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900" 
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={submitting} className="bg-gray-900 text-white px-8 py-3 uppercase text-sm tracking-wide hover:bg-gray-700 transition-colors disabled:opacity-50">{submitting ? 'Kaydediliyor...' : (editingId ? 'Güncelle' : 'Kaydet')}</button>
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="border border-gray-300 px-8 py-3 uppercase text-sm tracking-wide hover:border-gray-900 transition-colors">İptal</button>
              </div>
            </form>
          </div>
        )}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-light tracking-wide mb-4">Tarih Filtresi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div><label className="block text-sm text-gray-700 mb-2">Başlangıç Tarihi</label><input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gray-900" /></div>
            <div><label className="block text-sm text-gray-700 mb-2">Bitiş Tarihi</label><input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gray-900" /></div>
            <div><button onClick={loadData} className="w-full bg-gray-900 text-white px-4 py-2 uppercase text-sm tracking-wide hover:bg-gray-700 transition-colors">Filtrele</button></div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 mb-6 border border-green-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm uppercase tracking-wide opacity-90">Toplam Gelir</p>
              <p className="text-4xl font-light mt-2">€{grandTotal.toFixed(2)}</p>
              <p className="text-xs opacity-75 mt-1 bg-green-700 inline-block px-2 py-1 rounded">Esas: €{grandTotalOfficial.toFixed(2)}</p>
              <p className="text-sm opacity-75 mt-2">{transactions.length} işlem</p>
            </div>
            <div className="text-right"><p className="text-sm opacity-90">{new Date(filterStartDate).toLocaleDateString('tr-TR')} - {new Date(filterEndDate).toLocaleDateString('tr-TR')}</p></div>
          </div>
        </div>
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white border border-gray-200 p-12 text-center"><p className="text-gray-500">Yükleniyor...</p></div>
          ) : dailySummaries.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center"><p className="text-gray-500">Seçilen tarih aralığında gelir kaydı bulunmuyor.</p></div>
          ) : (
            dailySummaries.map((summary) => (
              <div key={summary.date} className="bg-white border border-gray-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{new Date(summary.date).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                    <p className="text-sm text-gray-600 mt-1">{summary.transactions.length} işlem</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Gün Sonu Toplamı</p>
                    <p className="text-2xl font-semibold text-gray-900">€{summary.total.toFixed(2)}</p>
                    <p className="text-xs text-green-600 mt-1">Esas: €{summary.transactions.reduce((sum, t) => sum + Number(t.amount_official || t.amount), 0).toFixed(2)}</p>
                  </div>
                </div>
                <>
                  {/* Mobile Card View */}
                  <div className="md:hidden divide-y divide-gray-100">
                    {summary.transactions.map((transaction) => (
                      <div key={transaction.id} className="p-4 bg-white hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-gray-900">{transaction.income_sources?.name || 'Bilinmeyen'}</div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">€{Number(transaction.amount).toFixed(2)}</div>
                            <div className="text-[10px] text-green-600 mt-0.5">Esas: €{Number(transaction.amount_official || transaction.amount).toFixed(2)}</div>
                          </div>
                        </div>
                        
                        {transaction.description && (
                          <div className="text-sm text-gray-600 mb-2">{transaction.description}</div>
                        )}
                        
                        <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-50">
                          <div>{new Date(transaction.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                          <div>
                            <button onClick={() => handleEdit(transaction)} className="text-blue-500 hover:text-blue-700 font-medium mr-4">Düzenle</button>
                            <button onClick={() => handleDelete(transaction.id)} className="text-red-500 hover:text-red-700 font-medium">Sil</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-gray-600 font-light whitespace-nowrap">Kaynak</th>
                          <th className="px-6 py-3 text-right text-xs uppercase tracking-wide text-gray-600 font-light">Tutar</th>
                          <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-gray-600 font-light">Açıklama</th>
                          <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-gray-600 font-light whitespace-nowrap">Eklenme Zamanı</th>
                          <th className="px-6 py-3 text-center text-xs uppercase tracking-wide text-gray-600 font-light">İşlem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.transactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{transaction.income_sources?.name || 'Bilinmeyen'}</td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <div className="font-medium text-gray-900">€{Number(transaction.amount).toFixed(2)}</div>
                              <div className="text-xs text-green-600 mt-0.5">€{Number(transaction.amount_official || transaction.amount).toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{transaction.description || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{new Date(transaction.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</td>
                            <td className="px-6 py-4 text-center">
                              <button onClick={() => handleEdit(transaction)} className="text-blue-600 hover:text-blue-800 text-sm mr-3">Düzenle</button>
                              <button onClick={() => handleDelete(transaction.id)} className="text-red-600 hover:text-red-800 text-sm">Sil</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
