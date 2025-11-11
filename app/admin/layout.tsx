// app/admin/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

function Sidebar({ onSignOut }: { onSignOut: () => void }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="h-20 border-b border-gray-200 flex items-center px-6">
        <div className="flex flex-col gap-1 w-full">
          <h2 className="text-xl font-light tracking-wide text-gray-900">Kapadokya</h2>
          <button onClick={onSignOut} className="text-xs text-gray-500 hover:text-gray-900 text-left">Çıkış Yap ↗</button>
        </div>
      </div>
      <nav className="py-4">
        <div className="px-2 space-y-1">
          <p className="px-4 text-xs uppercase tracking-wide text-gray-500 font-semibold mt-2 mb-1">Finans Yönetimi</p>
          <Link href="/admin" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">📊 Dashboard</Link>
          <Link href="/admin/income" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">💰 Gelir Yönetimi</Link>
          <Link href="/admin/expenses" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">💸 Gider Yönetimi</Link>
          <Link href="/admin/reports" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">📈 Raporlar</Link>

          <p className="px-4 text-xs uppercase tracking-wide text-gray-500 font-semibold mt-4 mb-1">Web Sitesi</p>
          <Link href="/admin/website/menus" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">📋 Menü Fotoğrafları</Link>
          <Link href="/admin/website/dishes" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">🍽️ Detaylı Menü</Link>
          <Link href="/admin/website/settings" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">⚙️ Site Ayarları</Link>

          <p className="px-4 text-xs uppercase tracking-wide text-gray-500 font-semibold mt-4 mb-1">Ayarlar</p>
          <Link href="/admin/settings/categories" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">📁 Gider Kategorileri</Link>
          <Link href="/admin/settings/income-sources" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">🏪 Gelir Kaynakları</Link>
        </div>
      </nav>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let ignore = false;
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!ignore) {
        setSession(data.session);
        setChecking(false);
        if (!data.session) {
          router.replace('/login');
        }
      }
    }
    loadSession();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        router.replace('/login');
      }
    });
    return () => {
      ignore = true;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <div className="flex h-screen bg-gray-100">
        <Sidebar onSignOut={handleSignOut} />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {checking ? (
            <div className="text-sm text-gray-500">Oturum kontrol ediliyor...</div>
          ) : (
            children
          )}
        </main>
      </div>
    </>
  );
}

