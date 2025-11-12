// app/admin/expenses/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface ExpenseCategory {
  id: string;
  name: string;
  parent_id: string | null;
}

interface Expense {
  id: string;
  category_id: string;
  amount: number;
  amount_official: number;
  description: string;
  expense_date: string;
  invoice_number: string | null;
  vendor: string | null;
  payment_method: string | null;
  created_at: string;
  expense_categories: {
    name: string;
  };
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form states
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [amountOfficial, setAmountOfficial] = useState('');
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Nakit');
  const [submitting, setSubmitting] = useState(false);

  // Filter states
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('expense_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Load expenses
      await loadExpenses();
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
      toast.error('Veriler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const loadExpenses = async () => {
    try {
      let query = supabase
        .from('expenses')
        .select(`
          *,
          expense_categories (
            name
          )
        `)
        .order('expense_date', { ascending: false })
        .limit(100);

      if (filterCategory) {
        query = query.eq('category_id', filterCategory);
      }

      if (filterStartDate) {
        query = query.gte('expense_date', filterStartDate);
      }

      if (filterEndDate) {
        query = query.lte('expense_date', filterEndDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setExpenses(data || []);
    } catch (error: any) {
      console.error('Giderler yüklenirken hata:', error);
      toast.error(`Giderler yüklenemedi: ${error?.message || 'bilinmeyen hata'}`);
    }
  };

  useEffect(() => {
    if (!loading) {
      loadExpenses();
    }
  }, [filterCategory, filterStartDate, filterEndDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryId || !amount || !description) {
      toast.error('Kategori, tutar ve açıklama zorunludur.');
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

      const { data, error } = await supabase
        .from('expenses')
        .insert({
          category_id: categoryId,
          amount: amountNum,
          amount_official: amountOfficialNum,
          description,
          expense_date: selectedDate,
          vendor: vendor || null,
          invoice_number: invoiceNumber || null,
          payment_method: paymentMethod,
        })
        .select();

      if (error) throw error;

      toast.success('Gider kaydı başarıyla eklendi!');
      setShowForm(false);
      resetForm();
      loadExpenses();
    } catch (error: any) {
      console.error('Gider kaydı eklenirken hata:', error);
      toast.error(`Gider kaydı eklenemedi: ${error?.message || 'bilinmeyen hata'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setCategoryId('');
    setAmount('');
    setAmountOfficial('');
    setDescription('');
    setVendor('');
    setInvoiceNumber('');
    setPaymentMethod('Nakit');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu gider kaydını silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Gider kaydı silindi.');
      loadExpenses();
    } catch (error: any) {
      console.error('Gider kaydı silinirken hata:', error);
      toast.error(`Gider kaydı silinemedi: ${error?.message || 'bilinmeyen hata'}`);
    }
  };

  const getCategoryName = (category: ExpenseCategory) => {
    if (!category.parent_id) return category.name;
    
    const parent = categories.find(c => c.id === category.parent_id);
    return parent ? `${parent.name} → ${category.name}` : category.name;
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const totalExpensesOfficial = expenses.reduce((sum, exp) => sum + Number(exp.amount_official || exp.amount), 0);

  // Group categories for nicer selects
  const topLevel = categories.filter(c => !c.parent_id);
  const childrenMap: Record<string, ExpenseCategory[]> = categories.reduce((acc, c) => {
    if (c.parent_id) {
      if (!acc[c.parent_id]) acc[c.parent_id] = [];
      acc[c.parent_id].push(c);
    }
    return acc;
  }, {} as Record<string, ExpenseCategory[]>);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">
              ← Dashboard'a Dön
            </Link>
            <h1 className="text-4xl font-light tracking-wide text-gray-900">Gider Yönetimi</h1>
            <p className="text-gray-600 mt-2">Gider kayıtlarını yönetin ve kategorilere göre filtreleyin</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-900 text-white px-6 py-3 uppercase text-sm tracking-wide hover:bg-gray-700 transition-colors"
          >
            {showForm ? 'Formu Kapat' : '+ Yeni Gider Ekle'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-light tracking-wide mb-6">Yeni Gider Kaydı</h2>
            <form onSubmit={handleSubmit}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                    Tarih *
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {topLevel.map((parent) => (
                      <React.Fragment key={parent.id}>
                        {/* Parent selectable */}
                        <option key={`${parent.id}-self`} value={parent.id}>
                          {parent.name}
                        </option>
                        {/* Children as optgroup if any */}
                        {childrenMap[parent.id] && childrenMap[parent.id].length > 0 && (
                          <optgroup key={`${parent.id}-group`} label={parent.name}>
                            {childrenMap[parent.id].map((child) => (
                              <option key={child.id} value={child.id}>
                                {child.name}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </React.Fragment>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                    Tutar (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Kasadan çıkan toplam tutar</p>
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                    Esas Tutar (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amountOfficial}
                    onChange={(e) => setAmountOfficial(e.target.value)}
                    placeholder="Boş bırakılırsa tutara eşit olur"
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                    Ödeme Yöntemi
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                  >
                    <option value="Nakit">Nakit</option>
                    <option value="Kredi Kartı">Kredi Kartı</option>
                    <option value="Banka Transferi">Banka Transferi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                    Fatura Numarası
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="Fatura no..."
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                  Açıklama *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Gider açıklaması..."
                  rows={3}
                  className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                  Tedarikçi
                </label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="Tedarikçi adı..."
                  className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gray-900 text-white px-8 py-3 uppercase text-sm tracking-wide hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="border border-gray-300 px-8 py-3 uppercase text-sm tracking-wide hover:border-gray-900 transition-colors"
                >
                  İptal
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-light uppercase tracking-wide mb-4">Filtreler</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Kategori</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
              >
                <option value="">Tüm Kategoriler</option>
                {topLevel.map((parent) => (
                  <React.Fragment key={parent.id}>
                    {/* Parent selectable */}
                    <option key={`${parent.id}-filter-self`} value={parent.id}>
                      {parent.name}
                    </option>
                    {/* Children as optgroup if any */}
                    {childrenMap[parent.id] && childrenMap[parent.id].length > 0 && (
                      <optgroup key={`${parent.id}-filter-group`} label={parent.name}>
                        {childrenMap[parent.id].map((child) => (
                          <option key={`${child.id}-filter`} value={child.id}>
                            {child.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </React.Fragment>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Başlangıç Tarihi</label>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Bitiş Tarihi</label>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterCategory('');
                  setFilterStartDate('');
                  setFilterEndDate('');
                }}
                className="w-full border border-gray-300 px-4 py-2 text-sm uppercase tracking-wide hover:border-gray-900 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-light uppercase tracking-wide">Toplam Gider</h3>
              <p className="text-3xl font-light text-gray-900 mt-2">€{totalExpenses.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1 bg-green-50 inline-block px-2 py-1 rounded">Esas: €{totalExpensesOfficial.toFixed(2)}</p>
            </div>
            <p className="text-sm text-gray-500">{expenses.length} kayıt gösteriliyor</p>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-light tracking-wide">Gider Kayıtları</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">Yükleniyor...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">Henüz gider kaydı bulunmuyor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-gray-600 font-light">Tarih</th>
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-gray-600 font-light">Kategori</th>
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-gray-600 font-light">Açıklama</th>
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-gray-600 font-light">Tedarikçi</th>
                    <th className="px-6 py-4 text-right text-xs uppercase tracking-wide text-gray-600 font-light">Tutar</th>
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-gray-600 font-light">Ödeme</th>
                    <th className="px-6 py-4 text-center text-xs uppercase tracking-wide text-gray-600 font-light">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(expense.expense_date).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {expense.expense_categories?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {expense.vendor || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-medium text-gray-900">€{Number(expense.amount).toFixed(2)}</div>
                        <div className="text-xs text-green-600 mt-0.5">€{Number(expense.amount_official || expense.amount).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {expense.payment_method || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
