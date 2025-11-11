'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Giriş başarılı');
      router.replace('/admin');
    } catch (e: any) {
      toast.error(e.message || 'Giriş yapılamadı');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 border border-gray-200">
        <h1 className="text-2xl font-light tracking-wide mb-2">Yönetici Girişi</h1>
        <p className="text-sm text-gray-600 mb-6">E-posta ve şifrenizle giriş yapın.</p>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">E-posta</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Şifre</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-3 uppercase text-sm tracking-wide disabled:opacity-50">
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-4">Not: Şifreyi Supabase Auth → Users alanından admin kullanıcısı oluşturarak belirleyin.</p>
      </div>
    </div>
  );
}
