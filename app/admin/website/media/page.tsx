'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface MediaFile {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: any;
  path: string;
  size?: number;
}

export default function MediaGalleryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function listPrefix(prefix: string): Promise<MediaFile[]> {
    const { data, error } = await supabase.storage.from('public-media').list(prefix, { limit: 100 });
    if (error) throw error;
    const list: MediaFile[] = [];
    for (const entry of data || []) {
      if ((entry as any).metadata && (entry as any).metadata.size === 0 && entry.name.endsWith('/')) {
        // folder marker; skip
        continue;
      }
      if ((entry as any).id && (entry as any).created_at === undefined) {
        // When folder, entry.id exists but we need to drill-down separately; treat as folder
        continue;
      }
      list.push({ name: entry.name, path: prefix ? `${prefix}/${entry.name}` : entry.name, size: (entry as any).metadata?.size });
    }
    return list;
  }

  async function load() {
    setLoading(true);
    try {
      // Try to list common folders
      const roots = await listPrefix('');
      const cat = await listPrefix('categories');
      const items = await listPrefix('items');
      setFiles([...roots, ...cat, ...items]);
    } catch (e: any) {
      toast.error('Medya listelenemedi: ' + e.message + '\nSupabase Storage\'da public-media bucket oluşturup Public yapın.');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const input = e.currentTarget; // Keep a reference to the input

    if (!file) return;
    setUploading(true);
    try {
      const filePath = `uploads/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('public-media').upload(filePath, file, { upsert: true });
      if (error) throw error;
      toast.success('Yüklendi');
      await load();
    } catch (e: any) {
      toast.error('Yüklenemedi: ' + e.message);
    } finally {
      setUploading(false);
      // Reset input value only if it exists
      if(input) {
        input.value = '';
      }
    }
  }

  async function remove(path: string) {
    if (!confirm('Bu dosyayı silmek istiyor musunuz?')) return;
    try {
      const { error } = await supabase.storage.from('public-media').remove([path]);
      if (error) throw error;
      toast.success('Silindi');
      await load();
    } catch (e: any) {
      toast.error('Silinemedi: ' + e.message);
    }
  }

  function publicUrl(path: string) {
    const { data } = supabase.storage.from('public-media').getPublicUrl(path);
    return data.publicUrl;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-light tracking-wide mb-6">🖼️ Medya Galerisi</h1>
        <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6 text-sm">
          <p className="font-semibold mb-2">⚠️ Önemli: Storage Bucket Ayarı</p>
          <ol className="list-decimal ml-5 space-y-1 text-gray-700">
            <li>Supabase Dashboard → Storage → Buckets</li>
            <li>"New bucket" → İsim: <code className="bg-gray-100 px-1">public-media</code> → <strong>Public</strong> checkbox işaretle → Create</li>
            <li>Veya mevcut bucket'a sağ menüden "Make public" seçin</li>
          </ol>
          <p className="mt-2 text-gray-600">Public ayarı olmadan görseller yüklenir ama görüntülenemez (404 hatası).</p>
        </div>
        <p className="text-sm text-gray-600 mb-6">Görsellerinizi buraya yükleyin. Menü yönetiminde direkt yükleme de yapabilirsiniz.</p>

        <div className="bg-white border border-gray-200 p-6 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">Yeni dosya yükle</p>
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="mt-2" />
          </div>
          <button onClick={load} className="border px-4 py-2 text-sm">Yenile</button>
        </div>

        {loading ? (
          <div className="p-6 text-gray-500">Yükleniyor...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {files.map(f => (
              <div key={f.path} className="bg-white border border-gray-200 p-3">
                <div className="aspect-video bg-gray-50 mb-2 overflow-hidden flex items-center justify-center">
                  <img src={publicUrl(f.path)} alt={f.name} className="object-cover w-full h-full" />
                </div>
                <div className="text-xs break-all mb-2">{f.path}</div>
                <div className="flex gap-2 text-xs">
                  <a target="_blank" href={publicUrl(f.path)} className="text-blue-600">Görüntüle</a>
                  <button onClick={() => remove(f.path)} className="text-red-600">Sil</button>
                </div>
              </div>
            ))}
            {files.length === 0 && <div className="text-sm text-gray-500">Henüz medya yok.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
