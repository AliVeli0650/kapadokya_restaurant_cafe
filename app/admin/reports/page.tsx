// app/admin/reports/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';

function formatDate(d: Date) {
  return d.toISOString().split('T')[0];
}

interface IncomeTransaction {
  amount: number;
  transaction_date: string;
  income_sources: { name: string } | null;
}

interface ExpenseData {
  amount: number;
  expense_date: string;
  expense_categories: { name: string; parent_id: string | null } | null;
}

interface CategoryBreakdown {
  name: string;
  value: number;
  percentage: number;
}

interface TrendPoint {
  date: string;
  gelir: number;
  gider: number;
  kar: number;
}

interface TopExpense {
  category: string;
  amount: number;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function ReportsPage() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [start, setStart] = useState(formatDate(firstOfMonth));
  const [end, setEnd] = useState(formatDate(today));
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Chart data
  const [incomeSourceData, setIncomeSourceData] = useState<CategoryBreakdown[]>([]);
  const [expenseCategoryData, setExpenseCategoryData] = useState<CategoryBreakdown[]>([]);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [topExpenses, setTopExpenses] = useState<TopExpense[]>([]);
  const [avgDailyIncome, setAvgDailyIncome] = useState(0);
  const [avgDailyExpense, setAvgDailyExpense] = useState(0);

  // Comparison data
  const [comparisonPeriod, setComparisonPeriod] = useState<'previous' | 'none'>('none');
  const [prevIncome, setPrevIncome] = useState(0);
  const [prevExpense, setPrevExpense] = useState(0);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Load income transactions with sources
      const { data: incomeData, error: incErr } = await supabase
        .from('income_transactions')
        .select(`
          amount,
          transaction_date,
          income_sources (
            name
          )
        `)
        .gte('transaction_date', start)
        .lte('transaction_date', end)
        .order('transaction_date', { ascending: true });
      
      if (incErr) throw incErr;

      // Load expenses with categories
      const { data: expenseData, error: expErr } = await supabase
        .from('expenses')
        .select(`
          amount,
          expense_date,
          expense_categories (
            name,
            parent_id
          )
        `)
        .gte('expense_date', start)
        .lte('expense_date', end);
      
      if (expErr) throw expErr;

      const incData = (incomeData || []) as IncomeTransaction[];
      const expData = (expenseData || []) as any[];

      // Calculate totals
      const totalInc = incData.reduce((s, r) => s + Number(r.amount || 0), 0);
      const totalExp = expData.reduce((s, r) => s + Number(r.amount || 0), 0);
      
      setIncome(totalInc);
      setExpense(totalExp);

      // Calculate averages
      const uniqueDates = new Set(incData.map(r => r.transaction_date));
      const dayCount = uniqueDates.size || 1;
      setAvgDailyIncome(totalInc / dayCount);
      setAvgDailyExpense(totalExp / dayCount);

      // Income source breakdown
      const sourceMap = new Map<string, number>();
      incData.forEach(inc => {
        const sourceName = inc.income_sources?.name || 'Diğer';
        sourceMap.set(sourceName, (sourceMap.get(sourceName) || 0) + Number(inc.amount));
      });

      setIncomeSourceData(Array.from(sourceMap.entries())
        .map(([name, value]) => ({
          name,
          value,
          percentage: (value / totalInc) * 100,
        }))
        .filter(d => d.value > 0));

      // Expense category breakdown
      const categoryMap = new Map<string, number>();
      expData.forEach(exp => {
        const catName = exp.expense_categories?.name || 'Diğer';
        categoryMap.set(catName, (categoryMap.get(catName) || 0) + Number(exp.amount));
      });

      const expCatData = Array.from(categoryMap.entries())
        .map(([name, value]) => ({
          name,
          value,
          percentage: (value / totalExp) * 100,
        }))
        .sort((a, b) => b.value - a.value);

      setExpenseCategoryData(expCatData);
      setTopExpenses(expCatData.slice(0, 5).map(d => ({ category: d.name, amount: d.value })));

      // Daily trend
      const dailyMap = new Map<string, { gelir: number; gider: number }>();
      
      incData.forEach(inc => {
        const existing = dailyMap.get(inc.transaction_date) || { gelir: 0, gider: 0 };
        existing.gelir += Number(inc.amount || 0);
        dailyMap.set(inc.transaction_date, existing);
      });

      expData.forEach(exp => {
        const existing = dailyMap.get(exp.expense_date) || { gelir: 0, gider: 0 };
        existing.gider += Number(exp.amount);
        dailyMap.set(exp.expense_date, existing);
      });

      const trend = Array.from(dailyMap.entries())
        .map(([date, { gelir, gider }]) => ({
          date: new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
          gelir,
          gider,
          kar: gelir - gider,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setTrendData(trend);

      // Load comparison period if enabled
      if (comparisonPeriod === 'previous') {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        const prevStart = new Date(startDate);
        prevStart.setDate(prevStart.getDate() - daysDiff - 1);
        const prevEnd = new Date(startDate);
        prevEnd.setDate(prevEnd.getDate() - 1);

        const { data: prevIncData } = await supabase
          .from('income_transactions')
          .select('amount')
          .gte('transaction_date', formatDate(prevStart))
          .lte('transaction_date', formatDate(prevEnd));

        const { data: prevExpData } = await supabase
          .from('expenses')
          .select('amount')
          .gte('expense_date', formatDate(prevStart))
          .lte('expense_date', formatDate(prevEnd));

        setPrevIncome((prevIncData || []).reduce((s: number, r: any) => s + Number(r.amount || 0), 0));
        setPrevExpense((prevExpData || []).reduce((s: number, r: any) => s + Number(r.amount || 0), 0));
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [start, end, comparisonPeriod]);

  const presets = [
    { label: 'Bu Ay', range: () => ({ s: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)), e: formatDate(today) }) },
    { label: 'Geçen Ay', range: () => {
      const s = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const e = new Date(today.getFullYear(), today.getMonth(), 0);
      return { s: formatDate(s), e: formatDate(e) };
    }},
    { label: 'Son 6 Ay', range: () => ({ s: formatDate(new Date(today.getFullYear(), today.getMonth() - 5, 1)), e: formatDate(today) }) },
    { label: 'Bu Yıl', range: () => ({ s: formatDate(new Date(today.getFullYear(), 0, 1)), e: formatDate(today) }) },
  ];

  const profit = income - expense;
  const incomeChange = prevIncome > 0 ? ((income - prevIncome) / prevIncome) * 100 : 0;
  const expenseChange = prevExpense > 0 ? ((expense - prevExpense) / prevExpense) * 100 : 0;

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">← Dashboard'a Dön</Link>
        <h1 className="text-3xl font-light tracking-wide text-gray-900">Detaylı Raporlar</h1>
        <p className="text-gray-600">Kapsamlı finansal analiz ve görselleştirmeler</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Başlangıç</label>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Bitiş</label>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Karşılaştırma</label>
            <select value={comparisonPeriod} onChange={(e) => setComparisonPeriod(e.target.value as any)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900">
              <option value="none">Yok</option>
              <option value="previous">Önceki Dönem</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={load} className="w-full bg-gray-900 text-white px-5 py-2 text-sm uppercase tracking-wide hover:bg-gray-700 disabled:opacity-50" disabled={loading}>
              {loading ? 'Yükleniyor...' : 'Uygula'}
            </button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {presets.map(p => (
            <button key={p.label} onClick={() => { const r = p.range(); setStart(r.s); setEnd(r.e); }} className="border border-gray-300 px-3 py-2 text-xs uppercase tracking-wide hover:border-gray-900">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-700 mb-8 text-sm">{errorMsg}</div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 border border-gray-200">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Toplam Ciro</p>
          <p className="text-2xl font-light text-green-600 mb-1">€{income.toFixed(2)}</p>
          {comparisonPeriod === 'previous' && prevIncome > 0 && (
            <p className={`text-xs ${incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {incomeChange >= 0 ? '↑' : '↓'} {Math.abs(incomeChange).toFixed(1)}%
            </p>
          )}
        </div>
        <div className="bg-white p-6 border border-gray-200">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Toplam Gider</p>
          <p className="text-2xl font-light text-red-600 mb-1">€{expense.toFixed(2)}</p>
          {comparisonPeriod === 'previous' && prevExpense > 0 && (
            <p className={`text-xs ${expenseChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {expenseChange >= 0 ? '↑' : '↓'} {Math.abs(expenseChange).toFixed(1)}%
            </p>
          )}
        </div>
        <div className="bg-white p-6 border border-gray-200">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Net Kar/Zarar</p>
          <p className={`text-2xl font-light ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>€{profit.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">{((profit / income) * 100).toFixed(1)}% marj</p>
        </div>
        <div className="bg-white p-6 border border-gray-200">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Ort. Günlük Ciro</p>
          <p className="text-2xl font-light text-gray-900">€{avgDailyIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 border border-gray-200">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Ort. Günlük Gider</p>
          <p className="text-2xl font-light text-gray-900">€{avgDailyExpense.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts Row 1: Income Sources & Expense Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Income Sources Pie Chart */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-light tracking-wide mb-4">Gelir Kaynakları Dağılımı</h3>
          {incomeSourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `€${Number(value).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">Veri yok</p>
          )}
        </div>

        {/* Expense Categories Pie Chart */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-light tracking-wide mb-4">Gider Kategorileri Dağılımı</h3>
          {expenseCategoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `€${Number(value).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">Veri yok</p>
          )}
        </div>
      </div>

      {/* Trend Line Chart */}
      <div className="bg-white border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-light tracking-wide mb-4">Günlük Trend Analizi</h3>
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: any) => `€${Number(value).toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="gelir" stroke="#10b981" strokeWidth={2} name="Gelir" />
              <Line type="monotone" dataKey="gider" stroke="#ef4444" strokeWidth={2} name="Gider" />
              <Line type="monotone" dataKey="kar" stroke="#3b82f6" strokeWidth={2} name="Kar/Zarar" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-12">Veri yok</p>
        )}
      </div>

      {/* Top Expenses Bar Chart */}
      <div className="bg-white border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-light tracking-wide mb-4">En Yüksek 5 Gider Kalemi</h3>
        {topExpenses.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value: any) => `€${Number(value).toFixed(2)}`} />
              <Bar dataKey="amount" fill="#ef4444" name="Tutar" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-12">Veri yok</p>
        )}
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown Table */}
        <div className="bg-white border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-light tracking-wide">Gelir Detayı</h3>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-600 font-light">Kaynak</th>
                  <th className="text-right py-2 text-xs uppercase tracking-wide text-gray-600 font-light">Tutar</th>
                  <th className="text-right py-2 text-xs uppercase tracking-wide text-gray-600 font-light">Oran</th>
                </tr>
              </thead>
              <tbody>
                {incomeSourceData.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2">{item.name}</td>
                    <td className="text-right py-2 text-green-600">€{item.value.toFixed(2)}</td>
                    <td className="text-right py-2">{item.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
                <tr className="font-medium">
                  <td className="py-2">Toplam</td>
                  <td className="text-right py-2 text-green-600">€{income.toFixed(2)}</td>
                  <td className="text-right py-2">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Breakdown Table */}
        <div className="bg-white border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-light tracking-wide">Gider Detayı</h3>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-600 font-light">Kategori</th>
                  <th className="text-right py-2 text-xs uppercase tracking-wide text-gray-600 font-light">Tutar</th>
                  <th className="text-right py-2 text-xs uppercase tracking-wide text-gray-600 font-light">Oran</th>
                </tr>
              </thead>
              <tbody>
                {expenseCategoryData.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2">{item.name}</td>
                    <td className="text-right py-2 text-red-600">€{item.value.toFixed(2)}</td>
                    <td className="text-right py-2">{item.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
                <tr className="font-medium">
                  <td className="py-2">Toplam</td>
                  <td className="text-right py-2 text-red-600">€{expense.toFixed(2)}</td>
                  <td className="text-right py-2">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
