'use client';

import { useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function PasswordChangePage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Tüm alanları doldurun');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor');
      return;
    }

    setLoading(true);

    try {
      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Şifre başarıyla değiştirildi');
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err: any) {
      console.error('Password change error:', err);
      toast.error(err.message || 'Şifre değiştirilemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">
          ← Dashboard'a Dön
        </Link>
        <h1 className="text-3xl font-light tracking-wide text-gray-900">Şifre Değiştir</h1>
        <p className="text-gray-600">Hesabınızın güvenliği için şifrenizi güncelleyin</p>
      </div>

      <div className="bg-white border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mevcut Şifre
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mevcut şifrenizi girin"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Güvenlik için mevcut şifrenizi doğrulayın
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yeni Şifre *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="En az 6 karakter"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yeni Şifre (Tekrar) *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Yeni şifrenizi tekrar girin"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
            </button>
            <Link
              href="/admin"
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:border-gray-900 transition-colors inline-block"
            >
              İptal
            </Link>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Güvenlik İpuçları</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Şifreniz en az 6 karakter uzunluğunda olmalıdır</li>
            <li>• Güçlü bir şifre için harf, rakam ve özel karakter kullanın</li>
            <li>• Şifrenizi düzenli olarak değiştirin</li>
            <li>• Şifrenizi kimseyle paylaşmayın</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
