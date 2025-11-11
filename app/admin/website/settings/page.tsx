'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface SettingRow { id: string; key: string; value: string; }

export default function SiteSettingsPage() {
  const [lieferandoUrl, setLieferandoUrl] = useState('');
  const [orderButtonLabel, setOrderButtonLabel] = useState('');
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
      setLieferandoUrl(map['lieferando_url'] || '');
      setOrderButtonLabel(map['online_order_button_label'] || 'Online Bestellen');
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
    setSaving(true);
    try {
      await saveSetting('lieferando_url', lieferandoUrl.trim());
      await saveSetting('online_order_button_label', orderButtonLabel.trim());
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
        <h1 className="text-3xl font-light tracking-wide mb-6">⚙️ Site Ayarları</h1>
        <p className="text-sm text-gray-600 mb-6">Lieferando yönlendirme ve online sipariş buton metni gibi genel ayarları yönetin.</p>

        {loading ? (
          <div className="p-6 text-gray-500">Yükleniyor...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 bg-white border border-gray-200 p-6">
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Lieferando URL</label>
              <input
                type="url"
                value={lieferandoUrl}
                onChange={e => setLieferandoUrl(e.target.value)}
                placeholder="https://www.lieferando.de/en/restaurant-adresiniz"
                className="w-full border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Online Sipariş Buton Metni</label>
              <input
                type="text"
                value={orderButtonLabel}
                onChange={e => setOrderButtonLabel(e.target.value)}
                className="w-full border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="bg-gray-900 text-white px-6 py-2 text-sm disabled:opacity-50">
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button type="button" onClick={load} className="border px-6 py-2 text-sm">Yenile</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
