'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function WhatsAppSettingsPage() {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setInitialLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'whatsapp_business_number')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setWhatsappNumber(data.value || '');
      }
    } catch (error: any) {
      console.error('Ayarlar yüklenemedi:', error);
      toast.error('Ayarlar yüklenemedi');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!whatsappNumber.trim()) {
      toast.error('WhatsApp numarası boş olamaz');
      return;
    }

    // Basit format kontrolü (sadece rakamlar ve +)
    if (!/^[\d+]+$/.test(whatsappNumber.trim())) {
      toast.error('Geçersiz format. Sadece rakam ve + kullanın (örn: +4917612345678)');
      return;
    }

    setLoading(true);

    try {
      // Önce mevcut ayarı kontrol et
      const { data: existing } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'whatsapp_business_number')
        .single();

      if (existing) {
        // Güncelle
        const { error } = await supabase
          .from('site_settings')
          .update({ value: whatsappNumber.trim() })
          .eq('key', 'whatsapp_business_number');

        if (error) throw error;
      } else {
        // Yeni kayıt ekle
        const { error } = await supabase
          .from('site_settings')
          .insert({
            key: 'whatsapp_business_number',
            value: whatsappNumber.trim()
          });

        if (error) throw error;
      }

      toast.success('WhatsApp numarası başarıyla güncellendi!');
    } catch (error: any) {
      console.error('Güncelleme hatası:', error);
      toast.error('Güncelleme başarısız: ' + (error?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">
            ← Dashboard'a Dön
          </Link>
          <h1 className="text-4xl font-light tracking-wide text-gray-900">WhatsApp Ayarları</h1>
          <p className="text-gray-600 mt-2">Sipariş bildirimleri için WhatsApp Business numaranızı yönetin</p>
        </div>

        <div className="bg-white border border-gray-200 p-8">
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Bilgi</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Numarayı uluslararası formatta girin (örn: <code className="bg-blue-100 px-1">+4917612345678</code>)</li>
              <li>Başında <code className="bg-blue-100 px-1">+</code> işareti olmalı ve ülke kodu içermeli</li>
              <li>Bu numara, müşteriler sipariş verdiğinde WhatsApp mesajının gideceği numaradır</li>
              <li>Değişiklikler anında aktif olur, sayfa yenilemeye gerek yoktur</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                WhatsApp Business Numarası *
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+4917612345678"
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900 font-mono"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Örnek: +49 176 12345678 → <code className="bg-gray-100 px-1">+4917612345678</code> (boşluksuz)
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-gray-900 text-white px-8 py-3 uppercase text-sm tracking-wide hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <Link
                href="/admin"
                className="border border-gray-300 px-8 py-3 uppercase text-sm tracking-wide hover:border-gray-900 transition-colors inline-block"
              >
                İptal
              </Link>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-light tracking-wide mb-4">Test Et</h3>
            <p className="text-sm text-gray-600 mb-4">
              Numaranızın doğru olduğundan emin olmak için test mesajı gönderebilirsiniz:
            </p>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9+]/g, '')}?text=Test mesajı - Kapadokya Restaurant`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 text-sm uppercase tracking-wide hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp'ta Test Et
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
