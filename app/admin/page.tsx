// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

interface DashboardStats {
  todayIncome: number;
  todayExpense: number;
  todayProfit: number;
  monthIncome: number;
  monthExpense: number;
  monthProfit: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todayIncome: 0,
    todayExpense: 0,
    todayProfit: 0,
    monthIncome: 0,
    monthExpense: 0,
    monthProfit: 0,
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
        .select('amount')
        .eq('transaction_date', today);

      // Bugünün gideri
      const { data: todayExpenseData } = await supabase
        .from('expenses')
        .select('amount')
        .eq('expense_date', today);

      // Ayın geliri
      const { data: monthIncomeData } = await supabase
        .from('income_transactions')
        .select('amount')
        .gte('transaction_date', firstDayOfMonth)
        .lte('transaction_date', lastDayOfMonth);

      // Ayın gideri
      const { data: monthExpenseData } = await supabase
        .from('expenses')
        .select('amount')
        .gte('expense_date', firstDayOfMonth)
        .lte('expense_date', lastDayOfMonth);

      const todayIncome = todayIncomeData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const todayExpense = todayExpenseData?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      const monthIncome = monthIncomeData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const monthExpense = monthExpenseData?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      setStats({
        todayIncome,
        todayExpense,
        todayProfit: todayIncome - todayExpense,
        monthIncome,
        monthExpense,
        monthProfit: monthIncome - monthExpense,
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
              <p className="text-3xl font-light text-green-600">€{stats.todayIncome.toFixed(2)}</p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Gider</p>
              <p className="text-3xl font-light text-red-600">€{stats.todayExpense.toFixed(2)}</p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Kar/Zarar</p>
              <p className={`text-3xl font-light ${stats.todayProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                €{stats.todayProfit.toFixed(2)}
              </p>
            </div>

          </div>
        </div>

        {/* Quick Stats - This Month */}
        <div className="mb-12">
          <h2 className="text-lg font-light uppercase tracking-wide text-gray-700 mb-4">Bu Ay</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 border border-gray-200">
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Ciro</p>
              <p className="text-3xl font-light text-green-600">€{stats.monthIncome.toFixed(2)}</p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Toplam Gider</p>
              <p className="text-3xl font-light text-red-600">€{stats.monthExpense.toFixed(2)}</p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Net Kar/Zarar</p>
              <p className={`text-3xl font-light ${stats.monthProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                €{stats.monthProfit.toFixed(2)}
              </p>
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

      </div>
    </div>
  );
}
