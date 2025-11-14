'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface SettingRow { id: string; key: string; value: string; }

export default function SiteSettingsPage() {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      const map: Record<string, string> = {};
      (data || []).forEach((r: SettingRow) => { map[r.key] = r.value; });
      setWhatsappNumber(map['whatsapp_business_number'] || '');
    } catch (e: any) {
      toast.error('Ayarlar yüklenemedi: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveSetting(key: string, value: string) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value }, { onConflict: 'key' });
    if (error) throw error;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!whatsappNumber.trim()) {
      toast.error('WhatsApp numarası boş olamaz');
      return;
    }
    if (!/^[\d+]+$/.test(whatsappNumber.trim())) {
      toast.error('Geçersiz format. Sadece rakam ve + kullanın (örn: +4917612345678)');
      return;
    }
    setSaving(true);
    try {
      await saveSetting('whatsapp_business_number', whatsappNumber.trim());
      toast.success('Kaydedildi');
      load();
    } catch (e: any) {
      toast.error('Kaydedilemedi: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-light tracking-wide mb-2">⚙️ WhatsApp & Site Ayarları</h1>
        <p className="text-sm text-gray-600 mb-6">WhatsApp Business numarasını ve site genel ayarlarını yönetin.</p>

        {loading ? (
          <div className="p-6 text-gray-500">Yükleniyor...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 bg-white border border-gray-200 p-6">
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">WhatsApp Business Numarası</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
                placeholder="+4917612345678"
                className="w-full border px-3 py-2 text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-2">Sadece rakam ve + işareti kullanın. Örn: +4917612345678</p>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="bg-gray-900 text-white px-6 py-2 text-sm disabled:opacity-50">
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button type="button" onClick={load} className="border px-6 py-2 text-sm">Yenile</button>
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9+]/g, '')}?text=Test mesajı - Kapadokya Restaurant`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 text-sm hover:bg-green-700"
                >
                  Test Mesajı Gönder
                </a>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
