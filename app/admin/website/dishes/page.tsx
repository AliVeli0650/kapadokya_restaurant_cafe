'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name_de: string;
  name_tr: string;
  position: number;
  is_active: boolean;
}

interface Dish {
  id: string;
  category_id: string;
  name_de: string;
  name_tr: string;
  description_de: string;
  description_tr: string;
  price: number;
  image_url: string;
  position: number;
  is_active: boolean;
  is_dish_of_the_day: boolean;
}

export default function DishesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'categories' | 'dishes'>('categories');

  // Filters for dishes tab
  const [filterCategoryId, setFilterCategoryId] = useState<string>('');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterHasImage, setFilterHasImage] = useState<'all' | 'with' | 'without'>('all');
  const [filterDishOfDay, setFilterDishOfDay] = useState<'all' | 'yes' | 'no'>('all');
  const [filterPriceMin, setFilterPriceMin] = useState<string>('');
  const [filterPriceMax, setFilterPriceMax] = useState<string>('');
  const [sortBy, setSortBy] = useState<'position' | 'name' | 'priceAsc' | 'priceDesc'>('position');

  // Category Form State
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name_de: '',
    name_tr: '',
    position: 0,
    is_active: true,
  });

  // Dish Form State
  const [editingDish, setEditingDish] = useState<string | null>(null);
  const [dishForm, setDishForm] = useState({
    category_id: '',
    name_de: '',
    name_tr: '',
    description_de: '',
    description_tr: '',
    price: '' as string | number,
    position: 0,
    is_active: true,
    is_dish_of_the_day: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDishModal, setShowDishModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: cats } = await supabase.from('dish_categories').select('*').order('position');
      const { data: dshs } = await supabase.from('dishes').select('*').order('position');
      setCategories(cats || []);
      setDishes(dshs || []);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      toast.error('Veri yüklenemedi');
    } finally {
      setLoading(false);
    }
  }

  // Category CRUD
  async function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Kategori kaydediliyor:', categoryForm);
    try {
      if (editingCategory) {
        const { error } = await supabase.from('dish_categories').update(categoryForm).eq('id', editingCategory);
        if (error) {
          console.error('Update hatası:', error);
          throw error;
        }
        toast.success('Kategori güncellendi');
      } else {
        const { data, error } = await supabase.from('dish_categories').insert([categoryForm]).select();
        console.log('Insert sonucu:', { data, error });
        if (error) {
          console.error('Insert hatası:', error);
          throw error;
        }
        toast.success('Kategori eklendi');
      }
      closeCategoryModal();
      loadData();
    } catch (error: any) {
      console.error('Kategori kaydetme hatası:', error);
      toast.error(error?.message || 'Kategori kaydedilemedi');
    }
  }

  function handleEditCategory(cat: Category) {
    setEditingCategory(cat.id);
    setCategoryForm({ name_de: cat.name_de, name_tr: cat.name_tr, position: cat.position, is_active: cat.is_active });
    setShowCategoryModal(true);
  }

  function handleNewCategory() {
    setEditingCategory(null);
    setCategoryForm({ name_de: '', name_tr: '', position: 0, is_active: true });
    setShowCategoryModal(true);
  }

  function closeCategoryModal() {
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCategoryForm({ name_de: '', name_tr: '', position: 0, is_active: true });
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Bu kategoriyi ve tüm ürünlerini silmek istediğinizden emin misiniz?')) return;
    try {
      const { error } = await supabase.from('dish_categories').delete().eq('id', id);
      if (error) throw error;
      toast.success('Kategori silindi');
      loadData();
    } catch (error) {
      console.error('Kategori silme hatası:', error);
      toast.error('Kategori silinemedi');
    }
  }

  // Dish CRUD
  async function handleDishSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Ürün kaydediliyor:', dishForm);
    try {
      let imageUrl = '';
      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const fileName = `dishes/${Date.now()}.${ext}`;
        const { data, error: uploadError } = await supabase.storage.from('public-media').upload(fileName, imageFile);
        if (uploadError) {
          console.error('Upload hatası:', uploadError);
          throw uploadError;
        }
        const { data: { publicUrl } } = supabase.storage.from('public-media').getPublicUrl(data.path);
        imageUrl = publicUrl;
      }

      const payload = { ...dishForm, ...(imageUrl ? { image_url: imageUrl } : {}) };
      // Price'ı number'a çevir
      const finalPayload = {
        ...payload,
        price: typeof payload.price === 'string' ? parseFloat(payload.price) || 0 : payload.price
      };
      console.log('Kaydedilecek payload:', finalPayload);

      if (editingDish) {
        const { data, error } = await supabase.from('dishes').update(finalPayload).eq('id', editingDish).select();
        console.log('Update sonucu:', { data, error });
        if (error) {
          console.error('Update hatası:', error);
          throw error;
        }
        toast.success('Ürün güncellendi');
      } else {
        const { data, error } = await supabase.from('dishes').insert([finalPayload]).select();
        console.log('Insert sonucu:', { data, error });
        if (error) {
          console.error('Insert hatası:', error);
          throw error;
        }
        toast.success('Ürün eklendi');
      }

      closeDishModal();
      loadData();
    } catch (error: any) {
      console.error('Ürün kaydetme hatası:', error);
      toast.error(error?.message || 'Ürün kaydedilemedi');
    }
  }

  function handleEditDish(dish: Dish) {
    setEditingDish(dish.id);
    setDishForm({
      category_id: dish.category_id,
      name_de: dish.name_de,
      name_tr: dish.name_tr,
      description_de: dish.description_de,
      description_tr: dish.description_tr,
      price: dish.price,
      position: dish.position,
      is_active: dish.is_active,
      is_dish_of_the_day: dish.is_dish_of_the_day || false,
    });
    setImagePreview(dish.image_url || '');
    setShowDishModal(true);
  }

  function handleNewDish() {
    setEditingDish(null);
    setDishForm({ category_id: '', name_de: '', name_tr: '', description_de: '', description_tr: '', price: '', position: 0, is_active: true, is_dish_of_the_day: false });
    setImageFile(null);
    setImagePreview('');
    setShowDishModal(true);
  }

  function closeDishModal() {
    setShowDishModal(false);
    setEditingDish(null);
    setDishForm({ category_id: '', name_de: '', name_tr: '', description_de: '', description_tr: '', price: '', position: 0, is_active: true, is_dish_of_the_day: false });
    setImageFile(null);
    setImagePreview('');
  }

  async function handleDeleteDish(id: string) {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    try {
      const { error } = await supabase.from('dishes').delete().eq('id', id);
      if (error) throw error;
      toast.success('Ürün silindi');
      loadData();
    } catch (error) {
      console.error('Ürün silme hatası:', error);
      toast.error('Ürün silinemedi');
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Detaylı Menü Yönetimi</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded ${activeTab === 'categories' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Kategoriler
        </button>
        <button
          onClick={() => setActiveTab('dishes')}
          className={`px-4 py-2 rounded ${activeTab === 'dishes' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Ürünler
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <>
          <div className="mb-6">
            <button
              onClick={handleNewCategory}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              + Yeni Kategori Ekle
            </button>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Kategoriler</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Almanca</th>
                  <th className="text-left p-2">Türkçe</th>
                  <th className="text-left p-2">Sıra</th>
                  <th className="text-left p-2">Durum</th>
                  <th className="text-left p-2">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b">
                    <td className="p-2">{cat.name_de}</td>
                    <td className="p-2">{cat.name_tr}</td>
                    <td className="p-2">{cat.position}</td>
                    <td className="p-2">{cat.is_active ? '✅' : '❌'}</td>
                    <td className="p-2">
                      <button onClick={() => handleEditCategory(cat)} className="text-blue-600 mr-2">Düzenle</button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Dishes Tab */}
      {activeTab === 'dishes' && (
        <>
          {/* Add New Dish Button */}
          <div className="mb-6">
            <button
              onClick={handleNewDish}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              + Yeni Ürün Ekle
            </button>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded shadow mb-6 sticky top-0 z-10 border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Kategori</label>
                <select
                  value={filterCategoryId}
                  onChange={(e) => setFilterCategoryId(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Tümü</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name_de}</option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">Ara</label>
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="İsim veya açıklama..."
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Durum</label>
                <select
                  value={filterActive}
                  onChange={(e) => setFilterActive(e.target.value as any)}
                  className="w-full border p-2 rounded"
                >
                  <option value="all">Tümü</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Resim</label>
                <select
                  value={filterHasImage}
                  onChange={(e) => setFilterHasImage(e.target.value as any)}
                  className="w-full border p-2 rounded"
                >
                  <option value="all">Farketmez</option>
                  <option value="with">Resimli</option>
                  <option value="without">Resimsiz</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Günün Yemeği</label>
                <select
                  value={filterDishOfDay}
                  onChange={(e) => setFilterDishOfDay(e.target.value as any)}
                  className="w-full border p-2 rounded"
                >
                  <option value="all">Tümü</option>
                  <option value="yes">Evet</option>
                  <option value="no">Hayır</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 mt-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min €</label>
                <input
                  type="number"
                  step="0.01"
                  value={filterPriceMin}
                  onChange={(e) => setFilterPriceMin(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max €</label>
                <input
                  type="number"
                  step="0.01"
                  value={filterPriceMax}
                  onChange={(e) => setFilterPriceMax(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">Sırala</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full border p-2 rounded"
                >
                  <option value="position">Sıra</option>
                  <option value="name">İsim (A→Z)</option>
                  <option value="priceAsc">Fiyat (Artan)</option>
                  <option value="priceDesc">Fiyat (Azalan)</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilterCategoryId('');
                    setFilterSearch('');
                    setFilterActive('all');
                    setFilterHasImage('all');
                    setFilterDishOfDay('all');
                    setFilterPriceMin('');
                    setFilterPriceMax('');
                    setSortBy('position');
                  }}
                  className="border px-4 py-2 rounded"
                >
                  Filtreleri Sıfırla
                </button>
              </div>
            </div>
          </div>
          <form onSubmit={handleDishSubmit} className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">{editingDish ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <select
                value={dishForm.category_id}
                onChange={(e) => setDishForm({ ...dishForm, category_id: e.target.value })}
                className="border p-2 rounded"
                required
              >
                <option value="">Kategori Seçin</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name_de}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Ürün Adı (Almanca)"
                value={dishForm.name_de}
                onChange={(e) => setDishForm({ ...dishForm, name_de: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Ürün Adı (Türkçe)"
                value={dishForm.name_tr}
                onChange={(e) => setDishForm({ ...dishForm, name_tr: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Fiyat (€)"
                value={dishForm.price}
                onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <textarea
                placeholder="Açıklama (Almanca)"
                value={dishForm.description_de}
                onChange={(e) => setDishForm({ ...dishForm, description_de: e.target.value })}
                className="border p-2 rounded col-span-2"
                rows={2}
              />
              <textarea
                placeholder="Açıklama (Türkçe)"
                value={dishForm.description_tr}
                onChange={(e) => setDishForm({ ...dishForm, description_tr: e.target.value })}
                className="border p-2 rounded col-span-2"
                rows={2}
              />
              <input
                type="number"
                placeholder="Sıra"
                value={dishForm.position}
                onChange={(e) => setDishForm({ ...dishForm, position: parseInt(e.target.value) })}
                className="border p-2 rounded"
              />
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={dishForm.is_active}
                    onChange={(e) => setDishForm({ ...dishForm, is_active: e.target.checked })}
                  />
                  Aktif
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={dishForm.is_dish_of_the_day}
                    onChange={(e) => setDishForm({ ...dishForm, is_dish_of_the_day: e.target.checked })}
                  />
                  <span className="text-orange-600 font-semibold">⭐ Günün Yemeği</span>
                </label>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2 rounded col-span-2" />
              {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {editingDish ? 'Güncelle' : 'Ekle'}
              </button>
              {editingDish && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingDish(null);
                    setDishForm({ category_id: '', name_de: '', name_tr: '', description_de: '', description_tr: '', price: '', position: 0, is_active: true, is_dish_of_the_day: false });
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  İptal
                </button>
              )}
            </div>
          </form>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Ürünler</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Resim</th>
                  <th className="text-left p-2">Kategori</th>
                  <th className="text-left p-2">Almanca</th>
                  <th className="text-left p-2">Fiyat</th>
                  <th className="text-left p-2">Sıra</th>
                  <th className="text-left p-2">Durum</th>
                  <th className="text-left p-2">Günün Yemeği</th>
                  <th className="text-left p-2">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {dishes
                  .filter((dish) => {
                    if (filterCategoryId && dish.category_id !== filterCategoryId) return false;
                    if (filterActive === 'active' && !dish.is_active) return false;
                    if (filterActive === 'inactive' && dish.is_active) return false;
                    if (filterHasImage === 'with' && !dish.image_url) return false;
                    if (filterHasImage === 'without' && dish.image_url) return false;
                    if (filterDishOfDay === 'yes' && !dish.is_dish_of_the_day) return false;
                    if (filterDishOfDay === 'no' && dish.is_dish_of_the_day) return false;
                    if (filterPriceMin && dish.price < Number(filterPriceMin)) return false;
                    if (filterPriceMax && dish.price > Number(filterPriceMax)) return false;
                    if (filterSearch) {
                      const q = filterSearch.toLowerCase();
                      const hay = `${dish.name_de||''} ${dish.name_tr||''} ${dish.description_de||''} ${dish.description_tr||''}`.toLowerCase();
                      if (!hay.includes(q)) return false;
                    }
                    return true;
                  })
                  .sort((a, b) => {
                    if (sortBy === 'position') return (a.position || 0) - (b.position || 0);
                    if (sortBy === 'name') return (a.name_de || '').localeCompare(b.name_de || '');
                    if (sortBy === 'priceAsc') return (a.price || 0) - (b.price || 0);
                    if (sortBy === 'priceDesc') return (b.price || 0) - (a.price || 0);
                    return 0;
                  })
                  .map((dish) => {
                  const cat = categories.find((c) => c.id === dish.category_id);
                  return (
                    <tr key={dish.id} className="border-b">
                      <td className="p-2">
                        {dish.image_url && <img src={dish.image_url} alt={dish.name_de} className="w-16 h-16 object-cover rounded" />}
                      </td>
                      <td className="p-2">{cat?.name_de}</td>
                      <td className="p-2">{dish.name_de}</td>
                      <td className="p-2">€{dish.price.toFixed(2)}</td>
                      <td className="p-2">{dish.position}</td>
                      <td className="p-2">{dish.is_active ? '✅' : '❌'}</td>
                      <td className="p-2">{dish.is_dish_of_the_day ? '⭐' : '-'}</td>
                      <td className="p-2">
                        <button onClick={() => handleEditDish(dish)} className="text-blue-600 mr-2">Düzenle</button>
                        <button onClick={() => handleDeleteDish(dish.id)} className="text-red-600">Sil</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleCategorySubmit} className="p-6">
              <h2 className="text-2xl font-semibold mb-6">{editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori Adı (Almanca) *</label>
                  <input
                    type="text"
                    placeholder="z.B. Suppen"
                    value={categoryForm.name_de}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name_de: e.target.value })}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori Adı (Türkçe)</label>
                  <input
                    type="text"
                    placeholder="Örn: Çorbalar"
                    value={categoryForm.name_tr}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name_tr: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sıra</label>
                  <input
                    type="number"
                    value={categoryForm.position}
                    onChange={(e) => setCategoryForm({ ...categoryForm, position: parseInt(e.target.value) })}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={categoryForm.is_active}
                      onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="font-medium">Aktif</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 justify-end border-t pt-4">
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                >
                  İptal
                </button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  {editingCategory ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dish Modal */}
      {showDishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleDishSubmit} className="p-6">
              <h2 className="text-2xl font-semibold mb-6">{editingDish ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori *</label>
                  <select
                    value={dishForm.category_id}
                    onChange={(e) => setDishForm({ ...dishForm, category_id: e.target.value })}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name_de}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fiyat (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={dishForm.price}
                    onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ürün Adı (Almanca) *</label>
                  <input
                    type="text"
                    placeholder="z.B. Linseneintopf"
                    value={dishForm.name_de}
                    onChange={(e) => setDishForm({ ...dishForm, name_de: e.target.value })}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ürün Adı (Türkçe)</label>
                  <input
                    type="text"
                    placeholder="Örn: Mercimek Çorbası"
                    value={dishForm.name_tr}
                    onChange={(e) => setDishForm({ ...dishForm, name_tr: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Açıklama (Almanca)</label>
                <textarea
                  placeholder="Produktbeschreibung..."
                  value={dishForm.description_de}
                  onChange={(e) => setDishForm({ ...dishForm, description_de: e.target.value })}
                  className="w-full border p-2 rounded"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Açıklama (Türkçe)</label>
                <textarea
                  placeholder="Ürün açıklaması..."
                  value={dishForm.description_tr}
                  onChange={(e) => setDishForm({ ...dishForm, description_tr: e.target.value })}
                  className="w-full border p-2 rounded"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sıra</label>
                  <input
                    type="number"
                    value={dishForm.position}
                    onChange={(e) => setDishForm({ ...dishForm, position: parseInt(e.target.value) })}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dishForm.is_active}
                      onChange={(e) => setDishForm({ ...dishForm, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="font-medium">Aktif</span>
                  </label>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dishForm.is_dish_of_the_day}
                      onChange={(e) => setDishForm({ ...dishForm, is_dish_of_the_day: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-orange-600 font-semibold">⭐ Günün Yemeği</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Ürün Resmi</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="w-full border p-2 rounded" 
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover rounded border" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end border-t pt-4">
                <button
                  type="button"
                  onClick={closeDishModal}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                >
                  İptal
                </button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  {editingDish ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
