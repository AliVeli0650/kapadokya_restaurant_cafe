'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Personnel {
  id: string;
  first_name: string;
  last_name: string;
  role: string | null;
  start_date: string | null;
  phone: string | null;
  email: string | null;
  base_salary: number | null;
  is_active: boolean;
}

interface PersonnelHour {
  id: string;
  record_date: string;
  missing_hours: number;
  overtime_hours: number;
  description: string;
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  expense_date: string;
  expense_categories: {
    name: string;
  };
}

export default function PersonnelDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [person, setPerson] = useState<Personnel | null>(null);
  const [hours, setHours] = useState<PersonnelHour[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Personnel>>({});
  const [updating, setUpdating] = useState(false);

  // Date filter
  const [filterType, setFilterType] = useState<'month' | 'custom'>('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (id) {
      loadPersonnelData();
    }
  }, [id, filterType, selectedMonth, startDate, endDate]);

  const loadPersonnelData = async () => {
    try {
      setLoading(true);

      // 1. Load Personnel Info
      const { data: personData, error: personError } = await supabase
        .from('personnel')
        .select('*')
        .eq('id', id)
        .single();

      if (personError) throw personError;
      setPerson(personData);

      let startFilter = '';
      let endFilter = '';

      if (filterType === 'month') {
        startFilter = `${selectedMonth}-01`;
        endFilter = new Date(new Date(startFilter).getFullYear(), new Date(startFilter).getMonth() + 1, 0).toISOString().split('T')[0];
      } else {
        startFilter = startDate || '2000-01-01';
        endFilter = endDate || '2100-01-01';
      }

      // 2. Load Hours for selected date range
      const { data: hoursData, error: hoursError } = await supabase
        .from('personnel_hours')
        .select('*')
        .eq('personnel_id', id)
        .gte('record_date', startFilter)
        .lte('record_date', endFilter)
        .order('record_date', { ascending: false });

      if (hoursError) throw hoursError;
      setHours(hoursData || []);

      // 3. Load Expenses (Advances/Salaries) for selected date range
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select(`
          id, amount, description, expense_date,
          expense_categories (name)
        `)
        .eq('personnel_id', id)
        .gte('expense_date', startFilter)
        .lte('expense_date', endFilter)
        .order('expense_date', { ascending: false });

      if (expensesError) throw expensesError;
      setExpenses(expensesData || []);

    } catch (error: any) {
      console.error('Personel detayları yüklenirken hata:', error);
      toast.error('Personel detayları yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePersonnel = async () => {
    if (!confirm('Bu personeli silmek istediğinizden emin misiniz? İlgili tüm mesai kayıtları da silinecektir.')) return;
    try {
      const { error } = await supabase.from('personnel').delete().eq('id', id);
      if (error) throw error;
      toast.success('Personel silindi.');
      router.replace('/admin/personnel');
    } catch (error: any) {
      toast.error('Silme işlemi başarısız.');
    }
  };

  const handleEditClick = () => {
    setEditForm({
      first_name: person?.first_name,
      last_name: person?.last_name,
      role: person?.role,
      start_date: person?.start_date,
      phone: person?.phone,
      email: person?.email,
      base_salary: person?.base_salary,
      is_active: person?.is_active
    });
    setIsEditing(true);
    setShowProfile(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.first_name || !editForm.last_name) {
      toast.error('Ad ve Soyad zorunludur.');
      return;
    }
    
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('personnel')
        .update({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          role: editForm.role || null,
          start_date: editForm.start_date || null,
          phone: editForm.phone || null,
          email: editForm.email || null,
          base_salary: editForm.base_salary ? Number(editForm.base_salary) : null,
          is_active: editForm.is_active
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Personel bilgileri güncellendi.');
      setIsEditing(false);
      loadPersonnelData();
    } catch (error: any) {
      toast.error('Güncelleme başarısız oldu.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Yükleniyor...</div>;
  }

  if (!person) {
    return <div className="p-12 text-center text-red-500">Personel bulunamadı.</div>;
  }

  // Summaries
  const totalMissingHours = hours.reduce((sum, h) => sum + Number(h.missing_hours), 0);
  const totalOvertimeHours = hours.reduce((sum, h) => sum + Number(h.overtime_hours), 0);
  const totalAdvances = expenses.filter(e => e.expense_categories?.name === 'Avans').reduce((sum, e) => sum + Number(e.amount), 0);
  const totalSalaryPayments = expenses.filter(e => e.expense_categories?.name === 'Maaş').reduce((sum, e) => sum + Number(e.amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <Link href="/admin/personnel" className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Personel Listesine Dön
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-light">
                {person.first_name[0]}{person.last_name[0]}
              </div>
              <div>
                <h1 className="text-3xl font-light tracking-wide text-gray-900">
                  {person.first_name} {person.last_name}
                </h1>
                <p className="text-gray-500 mt-1">{person.role || 'Görev Belirtilmemiş'} {person.is_active ? '' : ' (Pasif)'}</p>
              </div>
            </div>
            <div>
              {!isEditing && (
                <button onClick={handleEditClick} className="text-gray-600 hover:text-gray-900 text-sm border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors mr-3">
                  Düzenle
                </button>
              )}
              <button onClick={handleDeletePersonnel} className="text-red-500 hover:text-red-700 text-sm border border-red-200 px-4 py-2 hover:bg-red-50 transition-colors">
                Personeli Sil
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info Card */}
        {isEditing ? (
          <div className="bg-white border border-blue-200 p-6 mb-8 rounded shadow-sm">
            <h2 className="text-lg font-medium tracking-wide mb-4 text-blue-900">Personel Bilgilerini Düzenle</h2>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Ad *</label>
                  <input type="text" value={editForm.first_name || ''} onChange={e => setEditForm({...editForm, first_name: e.target.value})} required className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Soyad *</label>
                  <input type="text" value={editForm.last_name || ''} onChange={e => setEditForm({...editForm, last_name: e.target.value})} required className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Görev / Pozisyon</label>
                  <input type="text" value={editForm.role || ''} onChange={e => setEditForm({...editForm, role: e.target.value})} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">İşe Başlama Tarihi</label>
                  <input type="date" value={editForm.start_date || ''} onChange={e => setEditForm({...editForm, start_date: e.target.value})} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Telefon</label>
                  <input type="text" value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">E-Posta</label>
                  <input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Aylık Temel Maaş (€)</label>
                  <input type="number" step="10" value={editForm.base_salary || ''} onChange={e => setEditForm({...editForm, base_salary: Number(e.target.value)})} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editForm.is_active || false} onChange={e => setEditForm({...editForm, is_active: e.target.checked})} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Aktif Çalışan</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm uppercase tracking-wide border border-gray-300 hover:border-gray-900">İptal</button>
                <button type="submit" disabled={updating} className="bg-blue-600 text-white px-6 py-2 uppercase text-sm tracking-wide hover:bg-blue-700 disabled:opacity-50">
                  {updating ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </form>
          </div>
        ) : showProfile ? (
          <div className="bg-white border border-gray-200 p-6 mb-8 relative shadow-sm">
            <button onClick={() => setShowProfile(false)} className="absolute top-4 right-4 text-xs text-gray-400 hover:text-gray-600 px-2 py-1 bg-gray-50 rounded">Kapat ✕</button>
            <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-4 font-semibold">Personel Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">İşe Başlama</span>
                <span className="text-gray-900 font-medium">{person.start_date ? new Date(person.start_date).toLocaleDateString('tr-TR') : '-'}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Telefon</span>
                <span className="text-gray-900 font-medium">{person.phone || '-'}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">E-Posta</span>
                <span className="text-gray-900 font-medium">{person.email || '-'}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Aylık Temel Maaş</span>
                <span className="text-gray-900 font-medium">{person.base_salary ? `€${person.base_salary}` : '-'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <button 
              onClick={() => setShowProfile(true)} 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 bg-blue-50 px-4 py-2 rounded transition-colors"
            >
              <span>👤</span> Profil ve İletişim Bilgilerini Göster
            </button>
          </div>
        )}

        {/* Date Filter */}
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4 bg-white p-4 border border-gray-200">
          <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Dönem Seçimi:</label>
          <div className="flex items-center gap-4">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value as 'month' | 'custom')}
              className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900 bg-gray-50"
            >
              <option value="month">Aylık</option>
              <option value="custom">Özel Tarih Aralığı</option>
            </select>

            {filterType === 'month' ? (
              <input 
                type="month" 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
              />
            ) : (
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                />
                <span className="text-gray-500">-</span>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                />
              </div>
            )}
          </div>
          <span className="text-sm text-gray-500 italic md:ml-2">Veriler seçili döneme göre hesaplanır.</span>
        </div>

        {/* Unified Minimal Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 flex flex-col xl:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-wrap gap-8 w-full xl:w-auto justify-center xl:justify-start">
            <div className="text-center xl:text-left">
              <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Eksik Mesai</span>
              <span className="text-xl text-red-500 font-medium">{totalMissingHours} <span className="text-sm font-normal">saat</span></span>
            </div>
            <div className="text-center xl:text-left">
              <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Fazla Mesai</span>
              <span className="text-xl text-blue-500 font-medium">{totalOvertimeHours} <span className="text-sm font-normal">saat</span></span>
            </div>
            <div className="w-px bg-gray-100 hidden md:block"></div>
            <div className="text-center xl:text-left">
              <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Avanslar</span>
              <span className="text-xl text-orange-500 font-medium">€{totalAdvances.toFixed(2)}</span>
            </div>
            <div className="text-center xl:text-left">
              <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Maaş Ödemeleri</span>
              <span className="text-xl text-gray-700 font-medium">€{totalSalaryPayments.toFixed(2)}</span>
            </div>
          </div>

          {person.base_salary ? (
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-6 py-3 rounded-xl w-full xl:w-auto justify-center">
              <div className="text-right">
                <span className="block text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Temel Maaş</span>
                <span className="text-sm font-medium text-gray-900">€{person.base_salary.toFixed(2)}</span>
              </div>
              <div className="text-gray-300 font-light">-</div>
              <div className="text-center">
                <span className="block text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Ödenen Toplam</span>
                <span className="text-sm font-medium text-red-500">€{totalExpenses.toFixed(2)}</span>
              </div>
              <div className="text-gray-300 font-light">=</div>
              <div className="text-left pl-2">
                <span className="block text-[10px] uppercase tracking-widest text-gray-800 font-bold mb-0.5">Kalan Bakiye</span>
                <span className={`text-2xl font-bold ${person.base_salary - totalExpenses >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  €{(person.base_salary - totalExpenses).toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-400 italic text-center w-full xl:w-auto">
              Bakiye hesaplaması için personeli düzenleyip maaş belirleyin.
            </div>
          )}

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Financial Records */}
          <div className="bg-white border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-medium tracking-wide">Avans ve Maaş Dökümü</h2>
              <span className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded-full">Toplam: €{totalExpenses.toFixed(2)}</span>
            </div>
            {expenses.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">Bu ay için finansal kayıt bulunmuyor.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {expenses.map(e => (
                  <li key={e.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                    <div>
                      <div className="font-medium text-gray-900">{e.expense_categories?.name || 'Diğer'}</div>
                      <div className="text-sm text-gray-500">{e.description}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(e.expense_date).toLocaleDateString('tr-TR')}</div>
                    </div>
                    <div className="font-medium text-lg text-gray-900">
                      €{e.amount.toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
              <Link href="/admin/expenses" className="text-sm text-blue-600 hover:underline">
                Yeni Gider/Avans Ekle →
              </Link>
            </div>
          </div>

          {/* Hour Records */}
          <div className="bg-white border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-medium tracking-wide">Saat & Mesai Dökümü</h2>
            </div>
            {hours.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">Bu ay için saat kaydı bulunmuyor.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {hours.map(h => {
                  const net = h.overtime_hours - h.missing_hours;
                  return (
                  <li key={h.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                    <div>
                      <div className="font-medium text-gray-900">{new Date(h.record_date).toLocaleDateString('tr-TR')}</div>
                      {h.description && <div className="text-sm text-gray-500 italic mt-1">{h.description}</div>}
                    </div>
                    <div className="flex items-center gap-4 md:gap-6 text-sm text-right">
                      {h.missing_hours > 0 ? (
                        <div className="w-12"><span className="text-gray-400 text-[10px] uppercase block">Eksik</span><span className="text-red-600 font-medium">-{h.missing_hours}s</span></div>
                      ) : <div className="w-12"></div>}
                      
                      {h.overtime_hours > 0 ? (
                        <div className="w-12"><span className="text-gray-400 text-[10px] uppercase block">Fazla</span><span className="text-blue-600 font-medium">+{h.overtime_hours}s</span></div>
                      ) : <div className="w-12"></div>}
                      
                      <div className="w-16 bg-gray-100 py-1 rounded">
                        <span className="text-gray-500 text-[10px] uppercase block">Net</span>
                        <span className={`font-bold ${net > 0 ? 'text-blue-600' : net < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {net > 0 ? '+' : ''}{net}s
                        </span>
                      </div>
                    </div>
                  </li>
                )})}
              </ul>
            )}
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
              <Link href="/admin/personnel" className="text-sm text-blue-600 hover:underline">
                Yeni Saat Kaydı Ekle (Ana Sayfa) →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
