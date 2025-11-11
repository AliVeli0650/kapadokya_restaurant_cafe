// app/admin/settings/categories/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  description: string | null;
}

export default function CategorySettingsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*')
      .order('parent_id', { ascending: true })
      .order('name', { ascending: true });
    if (!error && data) setCategories(data as Category[]);
    setLoading(false);
  };

  const resetForm = () => {
    setName('');
    setParentId('');
    setDescription('');
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('İsim gerekli');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('expense_categories')
          .update({
            name: name.trim(),
            parent_id: parentId || null,
            description: description || null,
          })
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('expense_categories')
          .insert({
            name: name.trim(),
            parent_id: parentId || null,
            description: description || null,
          });
        if (error) throw error;
      }
      resetForm();
      setShowForm(false);
      loadCategories();
    } catch (err) {
      console.error(err);
      alert('Kaydetme sırasında hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setParentId(cat.parent_id || '');
    setDescription(cat.description || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    const { error } = await supabase
      .from('expense_categories')
      .delete()
      .eq('id', id);
    if (error) {
      alert('Silme hatası: ilişkili kayıtlar olabilir');
    } else {
      loadCategories();
    }
  };

  const topLevel = categories.filter(c => !c.parent_id);
  const childrenMap: Record<string, Category[]> = {};
  categories.forEach(c => {
    if (c.parent_id) {
      if (!childrenMap[c.parent_id]) childrenMap[c.parent_id] = [];
      childrenMap[c.parent_id].push(c);
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide mb-2">Gider Kalemleri</h1>
        <p className="text-gray-600">Yeni kalem ekleyin, düzenleyin veya silin.</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
              setShowForm(false);
            } else {
              setShowForm(true);
            }
          }}
          className="bg-gray-900 text-white px-6 py-2 text-sm uppercase tracking-wide hover:bg-gray-700"
        >
          {showForm ? 'Formu Kapat' : '+ Yeni Kalem'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-light tracking-wide mb-4">
            {editingId ? 'Kalemi Düzenle' : 'Yeni Kalem'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm uppercase tracking-wide mb-2">İsim *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-wide mb-2">Üst Kategori (Opsiyonel)</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gray-900"
              >
                <option value="">Yok</option>
                {topLevel.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm uppercase tracking-wide mb-2">Açıklama</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gray-900"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-gray-900 text-white px-6 py-2 text-sm uppercase tracking-wide hover:bg-gray-700 disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : (editingId ? 'Güncelle' : 'Kaydet')}
              </button>
              <button
                type="button"
                onClick={() => { resetForm(); setShowForm(false); }}
                className="border border-gray-300 px-6 py-2 text-sm uppercase tracking-wide hover:border-gray-900"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-light tracking-wide">Mevcut Kalemler</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Henüz kayıt yok.</div>
        ) : (
          <div className="p-4">
            {topLevel.map(parent => (
              <div key={parent.id} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-gray-900 font-medium">{parent.name}</h3>
                  <div className="flex gap-3 text-sm">
                    <button onClick={() => handleEdit(parent)} className="text-blue-600 hover:text-blue-800">Düzenle</button>
                    <button onClick={() => handleDelete(parent.id)} className="text-red-600 hover:text-red-800">Sil</button>
                  </div>
                </div>
                {parent.description && (
                  <p className="text-sm text-gray-600 mb-2">{parent.description}</p>
                )}
                <ul className="pl-4 border-l border-gray-200 space-y-1">
                  {(childrenMap[parent.id] || []).map(child => (
                    <li key={child.id} className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">{child.name}</span>
                      <div className="flex gap-3 text-xs">
                        <button onClick={() => handleEdit(child)} className="text-blue-600 hover:text-blue-800">Düzenle</button>
                        <button onClick={() => handleDelete(child.id)} className="text-red-600 hover:text-red-800">Sil</button>
                      </div>
                    </li>
                  ))}
                  {!(childrenMap[parent.id] || []).length && (
                    <li className="text-xs text-gray-400 italic">Alt kalem yok</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
