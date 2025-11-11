// app/admin/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

function Sidebar({ onSignOut, isOpen, onClose }: { onSignOut: () => void; isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 lg:h-20 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-light tracking-wide text-gray-900">Kapadokya</h2>
            <button onClick={onSignOut} className="text-xs text-gray-500 hover:text-gray-900 text-left">
              Çıkış Yap ↗
            </button>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="py-4 overflow-y-auto h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]">
          <div className="px-2 space-y-1">
            <p className="px-4 text-xs uppercase tracking-wide text-gray-500 font-semibold mt-2 mb-1">Finans Yönetimi</p>
            <Link href="/admin" onClick={onClose} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">📊 Dashboard</Link>
            <Link href="/admin/income" onClick={onClose} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">💰 Gelir Yönetimi</Link>
            <Link href="/admin/expenses" onClick={onClose} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">💸 Gider Yönetimi</Link>
            <Link href="/admin/reports" onClick={onClose} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">📈 Raporlar</Link>

            <p className="px-4 text-xs uppercase tracking-wide text-gray-500 font-semibold mt-4 mb-1">Müşteri Yönetimi</p>
            <Link href="/admin/reservations" onClick={onClose} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">📅 Rezervasyonlar</Link>

            <p className="px-4 text-xs uppercase tracking-wide text-gray-500 font-semibold mt-4 mb-1">Web Sitesi</p>
            <Link href="/admin/website/menus" onClick={onClose} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">📋 Menü Fotoğrafları</Link>
            <Link href="/admin/website/dishes" onClick={onClose} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">🍽️ Detaylı Menü</Link>
            <Link href="/admin/website/settings" onClick={onClose} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">⚙️ Site Ayarları</Link>

            <p className="px-4 text-xs uppercase tracking-wide text-gray-500 font-semibold mt-4 mb-1">Ayarlar</p>
            <Link href="/admin/settings/categories" onClick={onClose} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">📁 Gider Kategorileri</Link>
            <Link href="/admin/settings/income-sources" onClick={onClose} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">🏪 Gelir Kaynakları</Link>
            <Link href="/admin/settings/password" onClick={onClose} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded">🔐 Şifre Değiştir</Link>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar onSignOut={handleSignOut} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile Header */}
          <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-light tracking-wide text-gray-900">Kapadokya Admin</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
            {checking ? (
              <div className="text-sm text-gray-500">Oturum kontrol ediliyor...</div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </>
  );
}

