'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface MenuImage {
  id: string;
  title: string;
  image_url: string;
  position: number;
  is_active: boolean;
}

export default function MenusPage() {
  const [menus, setMenus] = useState<MenuImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [position, setPosition] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    loadMenus();
  }, []);

  async function loadMenus() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_images')
        .select('*')
        .order('position');
      
      if (error) throw error;
      setMenus(data || []);
    } catch (e: any) {
      toast.error('Menüler yüklenemedi: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title) {
      toast.error('Başlık zorunludur');
      return;
    }

    try {
      setUploading(true);
      let imageUrl = previewUrl;

      // Yeni fotoğraf yüklendi mi?
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `menu-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('public-media')
          .upload(fileName, imageFile, { upsert: true });
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('public-media')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      if (!imageUrl && !editingId) {
        toast.error('Lütfen bir fotoğraf yükleyin');
        return;
      }

      if (editingId) {
        // Güncelleme
        const { error } = await supabase
          .from('menu_images')
          .update({ title, position, is_active: isActive, ...(imageUrl && { image_url: imageUrl }) })
          .eq('id', editingId);
        
        if (error) throw error;
        toast.success('Menü güncellendi');
      } else {
        // Yeni ekleme
        const { error } = await supabase
          .from('menu_images')
          .insert({ title, position, is_active: isActive, image_url: imageUrl });
        
        if (error) throw error;
        toast.success('Menü eklendi');
      }

      resetForm();
      loadMenus();
    } catch (e: any) {
      toast.error('İşlem başarısız: ' + e.message);
    } finally {
      setUploading(false);
    }
  }

  function handleEdit(menu: MenuImage) {
    setEditingId(menu.id);
    setTitle(menu.title);
    setPosition(menu.position);
    setIsActive(menu.is_active);
    setPreviewUrl(menu.image_url);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu menüyü silmek istediğinizden emin misiniz?')) return;
    
    try {
      const { error } = await supabase.from('menu_images').delete().eq('id', id);
      if (error) throw error;
      toast.success('Menü silindi');
      loadMenus();
    } catch (e: any) {
      toast.error('Silme başarısız: ' + e.message);
    }
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setTitle('');
    setPosition(1);
    setIsActive(true);
    setImageFile(null);
    setPreviewUrl('');
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light tracking-wide mb-2">📋 Menü Yönetimi</h1>
            <p className="text-gray-600">Hazır menü fotoğraflarınızı buradan yükleyin ve yönetin</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-900 text-white px-6 py-3 text-sm uppercase tracking-wide hover:bg-gray-700 transition-colors"
          >
            {showForm ? 'Formu Kapat' : '+ Yeni Menü Ekle'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-light mb-4">{editingId ? 'Menü Düzenle' : 'Yeni Menü Ekle'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="örn: Ana Menü, İçecekler Menüsü"
                  className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gray-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sıra</label>
                  <input
                    type="number"
                    value={position}
                    onChange={(e) => setPosition(Number(e.target.value))}
                    min="1"
                    className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div className="flex items-center gap-2 pt-7">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Aktif (yayında göster)</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Menü Fotoğrafı {!editingId && '*'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 px-4 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">JPEG, PNG formatında hazır menü fotoğrafınızı yükleyin</p>
              </div>

              {previewUrl && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Önizleme:</p>
                  <img src={previewUrl} alt="Preview" className="max-w-xs border border-gray-200" />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-gray-900 text-white px-6 py-2 text-sm uppercase tracking-wide hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Kaydediliyor...' : (editingId ? 'Güncelle' : 'Kaydet')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-gray-300 px-6 py-2 text-sm uppercase tracking-wide hover:border-gray-900 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
        ) : menus.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500">
            <p className="text-lg">Henüz menü eklenmemiş</p>
            <p className="text-sm mt-2">Yukarıdaki "Yeni Menü Ekle" butonuna tıklayarak başlayın</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <div key={menu.id} className="bg-white border border-gray-200 overflow-hidden">
                <div className="aspect-[3/4] bg-gray-100">
                  <img src={menu.image_url} alt={menu.title} className="w-full h-full object-contain" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{menu.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${menu.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {menu.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">Sıra: {menu.position}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(menu)}
                      className="flex-1 border border-gray-300 px-3 py-2 text-sm hover:border-gray-900 transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(menu.id)}
                      className="flex-1 border border-red-300 text-red-600 px-3 py-2 text-sm hover:bg-red-50 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
