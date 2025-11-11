'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import toast from 'react-hot-toast';
// Using plain <img> to avoid Next.js remote image domain config for Supabase public URLs

interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  position: number;
  image_url: string | null;
  is_active: boolean;
}

interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  position: number;
}

export default function MenuManagementPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Category form state
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Item form state
  const [itemCategoryId, setItemCategoryId] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCurrency, setItemCurrency] = useState('EUR');
  const [itemFeatured, setItemFeatured] = useState(false);
  const [itemAvailable, setItemAvailable] = useState(true);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { data: catData, error: catErr } = await supabase
        .from('menu_categories')
        .select('*')
        .order('position', { ascending: true });
      if (catErr) throw catErr;
      setCategories(catData || []);

      const { data: itemData, error: itemErr } = await supabase
        .from('menu_items')
        .select('*')
        .order('position', { ascending: true });
      if (itemErr) throw itemErr;
      setItems(itemData || []);
    } catch (e: any) {
      toast.error('Veriler yüklenemedi: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!catName.trim()) { toast.error('Kategori adı gerekli'); return; }
    const payload = { name: catName.trim(), description: catDescription.trim() || null };
    try {
      if (editingCategoryId) {
        const { error } = await supabase.from('menu_categories').update(payload).eq('id', editingCategoryId);
        if (error) throw error;
        toast.success('Kategori güncellendi');
      } else {
        const position = categories.length + 1;
        const { error } = await supabase.from('menu_categories').insert({ ...payload, position });
        if (error) throw error;
        toast.success('Kategori eklendi');
      }
      resetCategoryForm();
      load();
    } catch (e: any) {
      toast.error('Kategori kaydedilemedi: ' + e.message);
    }
  }

  function resetCategoryForm() {
    setCatName('');
    setCatDescription('');
    setEditingCategoryId(null);
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Bu kategoriyi silmek istiyor musunuz? Ilgili ürünler de silinecek.')) return;
    try {
      const { error } = await supabase.from('menu_categories').delete().eq('id', id);
      if (error) throw error;
      toast.success('Kategori silindi');
      load();
    } catch (e: any) {
      toast.error('Silinemedi: ' + e.message);
    }
  }

  async function handleSaveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!itemCategoryId || !itemName.trim() || !itemPrice) { toast.error('Eksik alanlar var'); return; }
    const priceNum = parseFloat(itemPrice);
    if (isNaN(priceNum) || priceNum < 0) { toast.error('Fiyat geçersiz'); return; }
    const payload = {
      category_id: itemCategoryId,
      name: itemName.trim(),
      description: itemDescription.trim() || null,
      price: priceNum,
      currency: itemCurrency,
      is_featured: itemFeatured,
      is_available: itemAvailable
    };
    try {
      if (editingItemId) {
        const { error } = await supabase.from('menu_items').update(payload).eq('id', editingItemId);
        if (error) throw error;
        toast.success('Ürün güncellendi');
      } else {
        const position = items.filter(i => i.category_id === itemCategoryId).length + 1;
        const { error } = await supabase.from('menu_items').insert({ ...payload, position });
        if (error) throw error;
        toast.success('Ürün eklendi');
      }
      resetItemForm();
      load();
    } catch (e: any) {
      toast.error('Ürün kaydedilemedi: ' + e.message);
    }
  }

  function resetItemForm() {
    setItemCategoryId('');
    setItemName('');
    setItemDescription('');
    setItemPrice('');
    setItemCurrency('EUR');
    setItemFeatured(false);
    setItemAvailable(true);
    setEditingItemId(null);
  }

  async function handleDeleteItem(id: string) {
    if (!confirm('Bu ürünü silmek istiyor musunuz?')) return;
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      toast.success('Ürün silindi');
      load();
    } catch (e: any) {
      toast.error('Silinemedi: ' + e.message);
    }
  }

  async function handleCategoryImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editingCategoryId) { toast.error('Önce bir kategori düzenleyin'); return; }
    setUploading(true);
    try {
      const filePath = `categories/${editingCategoryId}-${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from('public-media').upload(filePath, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from('public-media').getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;
      const { error: updateErr } = await supabase.from('menu_categories').update({ image_url: publicUrl }).eq('id', editingCategoryId);
      if (updateErr) throw updateErr;
      toast.success('Kategori resmi yüklendi');
      load();
    } catch (e: any) {
      toast.error('Resim yüklenemedi: ' + e.message + '\nSupabase Storage bucket "public-media" oluşturulmuş mu?');
    } finally {
      setUploading(false);
    }
  }

  async function handleItemImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editingItemId) { toast.error('Önce bir ürünü düzenleyin'); return; }
    setUploading(true);
    try {
      const filePath = `items/${editingItemId}-${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from('public-media').upload(filePath, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from('public-media').getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;
      const { error: updateErr } = await supabase.from('menu_items').update({ image_url: publicUrl }).eq('id', editingItemId);
      if (updateErr) throw updateErr;
      toast.success('Ürün resmi yüklendi');
      load();
    } catch (e: any) {
      toast.error('Resim yüklenemedi: ' + e.message + '\nSupabase Storage bucket "public-media" oluşturulmuş mu?');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-light tracking-wide mb-6">🍽️ Dinamik Menü Yönetimi</h1>
        <p className="text-sm text-gray-600 mb-8">Kategori ve ürünleri yönetin, görseller ekleyin. Supabase Storage'da "public-media" bucket oluşturmayı unutmayın.</p>

        {loading && <div className="p-4 text-gray-500">Yükleniyor...</div>}

        {/* Category Form */}
        <div className="bg-white border border-gray-200 p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">{editingCategoryId ? 'Kategori Düzenle' : 'Yeni Kategori'}</h2>
          <form onSubmit={handleSaveCategory} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-1">
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Ad *</label>
              <input value={catName} onChange={e => setCatName(e.target.value)} className="w-full border px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Açıklama</label>
              <input value={catDescription} onChange={e => setCatDescription(e.target.value)} className="w-full border px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-1 flex gap-2 items-end">
              <button type="submit" className="bg-gray-900 text-white px-4 py-2 text-sm">{editingCategoryId ? 'Güncelle' : 'Ekle'}</button>
              {editingCategoryId && <button type="button" onClick={resetCategoryForm} className="border px-4 py-2 text-sm">İptal</button>}
            </div>
          </form>
          {editingCategoryId && (
            <div className="mt-4">
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Kategori Resmi Yükle</label>
              <input type="file" accept="image/*" onChange={handleCategoryImageUpload} disabled={uploading} />
            </div>
          )}
        </div>

        {/* Category List */}
        <div className="mb-12">
          <h3 className="text-lg font-medium mb-3">Kategoriler</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="bg-white border border-gray-200 p-4 flex flex-col">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{cat.name}</h4>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100">#{cat.position}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{cat.description || '—'}</p>
                  {cat.image_url && (
                    <img src={cat.image_url} alt={cat.name} className="object-cover w-full h-32 mb-2 rounded" />
                  )}
                  <div className="text-xs mb-2">Durum: {cat.is_active ? <span className="text-green-600">Aktif</span> : <span className="text-red-600">Pasif</span>}</div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => { setEditingCategoryId(cat.id); setCatName(cat.name); setCatDescription(cat.description || ''); }} className="text-blue-600 text-xs">Düzenle</button>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 text-xs">Sil</button>
                </div>
              </div>
            ))}
            {categories.length === 0 && <div className="text-sm text-gray-500">Henüz kategori yok.</div>}
          </div>
        </div>

        {/* Item Form */}
        <div className="bg-white border border-gray-200 p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">{editingItemId ? 'Ürün Düzenle' : 'Yeni Ürün'}</h2>
          <form onSubmit={handleSaveItem} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Kategori *</label>
              <select value={itemCategoryId} onChange={e => setItemCategoryId(e.target.value)} className="w-full border px-3 py-2 text-sm">
                <option value="">Seçiniz...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Ad *</label>
              <input value={itemName} onChange={e => setItemName(e.target.value)} className="w-full border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Fiyat *</label>
              <input type="number" step="0.01" value={itemPrice} onChange={e => setItemPrice(e.target.value)} className="w-full border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Para Birimi</label>
              <select value={itemCurrency} onChange={e => setItemCurrency(e.target.value)} className="w-full border px-3 py-2 text-sm">
                <option value="EUR">EUR</option>
                <option value="TRY">TRY</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Açıklama</label>
              <input value={itemDescription} onChange={e => setItemDescription(e.target.value)} className="w-full border px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={itemAvailable} onChange={e => setItemAvailable(e.target.checked)} />Mevcut</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={itemFeatured} onChange={e => setItemFeatured(e.target.checked)} />Öne Çıkan</label>
            </div>
            <div className="flex gap-2 items-end">
              <button type="submit" className="bg-gray-900 text-white px-4 py-2 text-sm">{editingItemId ? 'Güncelle' : 'Ekle'}</button>
              {editingItemId && <button type="button" onClick={resetItemForm} className="border px-4 py-2 text-sm">İptal</button>}
            </div>
          </form>
          {editingItemId && (
            <div className="mt-4">
              <label className="block text-xs uppercase tracking-wide text-gray-600 mb-2">Ürün Resmi Yükle</label>
              <input type="file" accept="image/*" onChange={handleItemImageUpload} disabled={uploading} />
            </div>
          )}
        </div>

        {/* Item List */}
        <div className="mb-12">
          <h3 className="text-lg font-medium mb-3">Ürünler</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {items.map(it => (
              <div key={it.id} className="bg-white border border-gray-200 p-4 flex flex-col">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{it.name}</h4>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100">€{Number(it.price).toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mb-2">{it.description || '—'}</p>
                  {it.image_url && <img src={it.image_url} alt={it.name} className="object-cover w-full h-32 mb-2 rounded" />}
                  <div className="text-xs mb-2 flex gap-2 flex-wrap">
                    <span className={it.is_available ? 'text-green-600' : 'text-red-600'}>{it.is_available ? 'Mevcut' : 'Yok'}</span>
                    {it.is_featured && <span className="text-yellow-600">Öne Çıkan</span>}
                  </div>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <button onClick={() => { setEditingItemId(it.id); setItemCategoryId(it.category_id); setItemName(it.name); setItemDescription(it.description || ''); setItemPrice(String(it.price)); setItemCurrency(it.currency); setItemFeatured(it.is_featured); setItemAvailable(it.is_available); }} className="text-blue-600 text-xs">Düzenle</button>
                  <button onClick={() => handleDeleteItem(it.id)} className="text-red-600 text-xs">Sil</button>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="text-sm text-gray-500">Henüz ürün yok.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
