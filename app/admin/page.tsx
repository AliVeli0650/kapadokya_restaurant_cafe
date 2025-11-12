// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

interface DashboardStats {
  todayIncome: number;
  todayIncomeOfficial: number;
  todayExpense: number;
  todayExpenseOfficial: number;
  todayProfit: number;
  todayProfitOfficial: number;
  monthIncome: number;
  monthIncomeOfficial: number;
  monthExpense: number;
  monthExpenseOfficial: number;
  monthProfit: number;
  monthProfitOfficial: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todayIncome: 0,
    todayIncomeOfficial: 0,
    todayExpense: 0,
    todayExpenseOfficial: 0,
    todayProfit: 0,
    todayProfitOfficial: 0,
    monthIncome: 0,
    monthIncomeOfficial: 0,
    monthExpense: 0,
    monthExpenseOfficial: 0,
    monthProfit: 0,
    monthProfitOfficial: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

      // Bugünün geliri
      const { data: todayIncomeData } = await supabase
        .from('income_transactions')
        .select('amount, amount_official')
        .eq('transaction_date', today);

      // Bugünün gideri
      const { data: todayExpenseData } = await supabase
        .from('expenses')
        .select('amount, amount_official')
        .eq('expense_date', today);

      // Ayın geliri
      const { data: monthIncomeData } = await supabase
        .from('income_transactions')
        .select('amount, amount_official')
        .gte('transaction_date', firstDayOfMonth)
        .lte('transaction_date', lastDayOfMonth);

      // Ayın gideri
      const { data: monthExpenseData } = await supabase
        .from('expenses')
        .select('amount, amount_official')
        .gte('expense_date', firstDayOfMonth)
        .lte('expense_date', lastDayOfMonth);

      const todayIncome = todayIncomeData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const todayIncomeOfficial = todayIncomeData?.reduce((sum, t) => sum + Number(t.amount_official || t.amount), 0) || 0;
      const todayExpense = todayExpenseData?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      const todayExpenseOfficial = todayExpenseData?.reduce((sum, e) => sum + Number(e.amount_official || e.amount), 0) || 0;
      const monthIncome = monthIncomeData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const monthIncomeOfficial = monthIncomeData?.reduce((sum, t) => sum + Number(t.amount_official || t.amount), 0) || 0;
      const monthExpense = monthExpenseData?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      const monthExpenseOfficial = monthExpenseData?.reduce((sum, e) => sum + Number(e.amount_official || e.amount), 0) || 0;

      setStats({
        todayIncome,
        todayIncomeOfficial,
        todayExpense,
        todayExpenseOfficial,
        todayProfit: todayIncome - todayExpense,
        todayProfitOfficial: todayIncomeOfficial - todayExpenseOfficial,
        monthIncome,
        monthIncomeOfficial,
        monthExpense,
        monthExpenseOfficial,
        monthProfit: monthIncome - monthExpense,
        monthProfitOfficial: monthIncomeOfficial - monthExpenseOfficial,
      });
    } catch (error) {
      console.error('Dashboard stats yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light tracking-wide text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Kapadokya Cafe & Restaurant - Yönetim Paneli</p>
        </div>

        {/* Quick Stats - Today */}
        <div className="mb-8">
          <h2 className="text-lg font-light uppercase tracking-wide text-gray-700 mb-4">Bugün</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 border border-gray-200">
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Ciro</p>
              <p className="text-3xl font-light text-gray-900">€{stats.todayIncome.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1 bg-green-50 inline-block px-2 py-0.5 rounded">Esas: €{stats.todayIncomeOfficial.toFixed(2)}</p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Gider</p>
              <p className="text-3xl font-light text-gray-900">€{stats.todayExpense.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1 bg-green-50 inline-block px-2 py-0.5 rounded">Esas: €{stats.todayExpenseOfficial.toFixed(2)}</p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Kar/Zarar</p>
              <p className={`text-3xl font-light ${stats.todayProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                €{stats.todayProfit.toFixed(2)}
              </p>
              <p className="text-xs text-green-600 mt-1 bg-green-50 inline-block px-2 py-0.5 rounded">Esas: €{stats.todayProfitOfficial.toFixed(2)}</p>
            </div>

          </div>
        </div>

        {/* Quick Stats - This Month .....*/}
        <div className="mb-12">
          <h2 className="text-lg font-light uppercase tracking-wide text-gray-700 mb-4">Bu Ay</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 border border-gray-200">
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Ciro</p>
              <p className="text-3xl font-light text-gray-900">€{stats.monthIncome.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1 bg-green-50 inline-block px-2 py-0.5 rounded">Esas: €{stats.monthIncomeOfficial.toFixed(2)}</p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Toplam Gider</p>
              <p className="text-3xl font-light text-gray-900">€{stats.monthExpense.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1 bg-green-50 inline-block px-2 py-0.5 rounded">Esas: €{stats.monthExpenseOfficial.toFixed(2)}</p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Net Kar/Zarar</p>
              <p className={`text-3xl font-light ${stats.monthProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                €{stats.monthProfit.toFixed(2)}
              </p>
              <p className="text-xs text-green-600 mt-1 bg-green-50 inline-block px-2 py-0.5 rounded">Esas: €{stats.monthProfitOfficial.toFixed(2)}</p>
            </div>

          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-light uppercase tracking-wide text-gray-700 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Link 
              href="/admin/income"
              className="bg-white p-6 border border-gray-200 hover:border-gray-900 transition-all text-center group"
            >
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm uppercase tracking-wide font-light">Gelir Ekle</p>
            </Link>

            <Link 
              href="/admin/expenses"
              className="bg-white p-6 border border-gray-200 hover:border-gray-900 transition-all text-center group"
            >
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-sm uppercase tracking-wide font-light">Gider Ekle</p>
            </Link>

            <Link 
              href="/admin/reports"
              className="bg-white p-6 border border-gray-200 hover:border-gray-900 transition-all text-center group"
            >
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm uppercase tracking-wide font-light">Raporlar</p>
            </Link>

            <Link 
              href="/admin/menu-management"
              className="bg-white p-6 border border-gray-200 hover:border-gray-900 transition-all text-center group"
            >
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-sm uppercase tracking-wide font-light">Menü Yönetimi</p>
            </Link>

          </div>
        </div>

        {/* Settings */}
        <div className="mb-8">
          <h2 className="text-lg font-light uppercase tracking-wide text-gray-700 mb-4">Ayarlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Link 
              href="/admin/settings/password"
              className="bg-white p-6 border border-gray-200 hover:border-gray-900 transition-all text-center group"
            >
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <p className="text-sm uppercase tracking-wide font-light">Şifre Değiştir</p>
            </Link>

            <Link 
              href="/admin/settings/categories"
              className="bg-white p-6 border border-gray-200 hover:border-gray-900 transition-all text-center group"
            >
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <p className="text-sm uppercase tracking-wide font-light">Gider Kategorileri</p>
            </Link>

            <Link 
              href="/admin/settings/income-sources"
              className="bg-white p-6 border border-gray-200 hover:border-gray-900 transition-all text-center group"
            >
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-sm uppercase tracking-wide font-light">Gelir Kaynakları</p>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
