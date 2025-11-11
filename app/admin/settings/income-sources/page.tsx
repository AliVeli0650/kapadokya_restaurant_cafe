'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface IncomeSource {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export default function IncomeSourcesPage() {
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const { data, error } = await supabase
        .from('income_sources')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSources(data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Gelir kaynağı adı gereklidir');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('income_sources')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Başarıyla güncellendi');
      } else {
        const { error } = await supabase
          .from('income_sources')
          .insert([{
            name: formData.name.trim(),
            description: formData.description.trim() || null,
          }]);

        if (error) throw error;
        toast.success('Başarıyla eklendi');
      }

      fetchSources();
      resetForm();
    } catch (err: any) {
      toast.error(`Hata: ${err.message}`);
    }
  };

  const handleEdit = (source: IncomeSource) => {
    setFormData({
      name: source.name,
      description: source.description || ''
    });
    setEditingId(source.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu gelir kaynağını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('income_sources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Başarıyla silindi');
      fetchSources();
    } catch (err: any) {
      toast.error(`Hata: ${err.message}`);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gelir Kaynakları Yönetimi</h1>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Gelir Kaynağını Düzenle' : 'Yeni Gelir Kaynağı Ekle'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gelir Kaynağı Adı *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: Lieferando, Bar Satışları, vb."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Gelir kaynağı hakkında kısa açıklama..."
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingId ? 'Güncelle' : 'Ekle'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Mevcut Gelir Kaynakları</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sources.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    Henüz gelir kaynağı eklenmemiş
                  </td>
                </tr>
              ) : (
                sources.map((source) => (
                  <tr key={source.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{source.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {source.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(source)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(source.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
