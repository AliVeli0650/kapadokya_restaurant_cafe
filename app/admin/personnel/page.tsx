'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Personnel {
  id: string;
  first_name: string;
  last_name: string;
  role: string | null;
  start_date: string | null;
  phone: string | null;
  email: string | null;
  base_salary: number | null;
  is_active: boolean;
}

export default function PersonnelPage() {
  const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Hours Form State
  const [showHoursForm, setShowHoursForm] = useState(false);
  const [hoursDate, setHoursDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPersonnel, setSelectedPersonnel] = useState('');
  const [missingHours, setMissingHours] = useState('');
  const [overtimeHours, setOvertimeHours] = useState('');
  const [hoursDesc, setHoursDesc] = useState('');
  const [submittingHours, setSubmittingHours] = useState(false);

  // New Personnel Form State
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [submittingPerson, setSubmittingPerson] = useState(false);

  useEffect(() => {
    loadPersonnel();
  }, []);

  const loadPersonnel = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .order('first_name');

      if (error) throw error;
      setPersonnelList(data || []);
    } catch (error: any) {
      console.error('Personel yüklenirken hata:', error);
      toast.error('Personel listesi yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleHoursSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPersonnel || !hoursDate) {
      toast.error('Tarih ve personel seçimi zorunludur.');
      return;
    }
    
    const mHours = parseFloat(missingHours || '0');
    const oHours = parseFloat(overtimeHours || '0');
    
    if (mHours === 0 && oHours === 0) {
      toast.error('Lütfen eksik veya fazla mesai saati girin.');
      return;
    }

    try {
      setSubmittingHours(true);
      const { error } = await supabase.from('personnel_hours').insert({
        personnel_id: selectedPersonnel,
        record_date: hoursDate,
        missing_hours: mHours,
        overtime_hours: oHours,
        description: hoursDesc
      });

      if (error) throw error;
      toast.success('Saat kaydı başarıyla eklendi!');
      
      // Reset form
      setMissingHours('');
      setOvertimeHours('');
      setHoursDesc('');
      setSelectedPersonnel('');
      setShowHoursForm(false);
    } catch (error: any) {
      console.error('Saat kaydedilirken hata:', error);
      toast.error('Saat kaydedilemedi.');
    } finally {
      setSubmittingHours(false);
    }
  };

  const handlePersonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      toast.error('Ad ve Soyad zorunludur.');
      return;
    }

    try {
      setSubmittingPerson(true);
      const { error } = await supabase.from('personnel').insert({
        first_name: firstName,
        last_name: lastName,
        role: role || null,
        start_date: startDate || null,
        phone: phone || null,
        email: email || null,
        base_salary: baseSalary ? parseFloat(baseSalary) : null,
        is_active: true
      });

      if (error) throw error;
      toast.success('Personel başarıyla eklendi!');
      
      // Reset form
      setFirstName('');
      setLastName('');
      setRole('');
      setStartDate('');
      setPhone('');
      setEmail('');
      setBaseSalary('');
      setShowPersonForm(false);
      
      loadPersonnel();
    } catch (error: any) {
      console.error('Personel eklenirken hata:', error);
      toast.error('Personel eklenemedi.');
    } finally {
      setSubmittingPerson(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-light tracking-wide text-gray-900">Personel Yönetimi</h1>
            <p className="text-gray-600 mt-2">Çalışanlarınızı, mesaileri ve personel giderlerini yönetin.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setShowHoursForm(!showHoursForm); setShowPersonForm(false); }}
              className="bg-blue-600 text-white px-5 py-2 uppercase text-sm tracking-wide hover:bg-blue-700 transition-colors"
            >
              ⏱ Hızlı Saat Girişi
            </button>
            <button
              onClick={() => { setShowPersonForm(!showPersonForm); setShowHoursForm(false); }}
              className="bg-gray-900 text-white px-5 py-2 uppercase text-sm tracking-wide hover:bg-gray-700 transition-colors"
            >
              + Yeni Personel
            </button>
          </div>
        </div>

        {/* Quick Hours Form */}
        {showHoursForm && (
          <div className="bg-white border border-blue-200 p-6 mb-8 rounded-lg shadow-sm">
            <h2 className="text-xl font-medium tracking-wide mb-4 text-blue-900 flex items-center gap-2">
              <span className="text-2xl">⏱</span> Hızlı Saat / Mesai Girişi
            </h2>
            <form onSubmit={handleHoursSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Tarih *</label>
                <input type="date" value={hoursDate} onChange={e => setHoursDate(e.target.value)} required className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Personel Seçimi *</label>
                <select value={selectedPersonnel} onChange={e => setSelectedPersonnel(e.target.value)} required className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                  <option value="">Seçiniz...</option>
                  {personnelList.filter(p => p.is_active).map(p => (
                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Eksik Saat</label>
                <input type="number" step="0.5" min="0" value={missingHours} onChange={e => setMissingHours(e.target.value)} placeholder="Örn: 2" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Fazla Mesai Saati</label>
                <input type="number" step="0.5" min="0" value={overtimeHours} onChange={e => setOvertimeHours(e.target.value)} placeholder="Örn: 1.5" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Açıklama</label>
                <input type="text" value={hoursDesc} onChange={e => setHoursDesc(e.target.value)} placeholder="Doktora gitti, yoğunluk mesaisi vs." className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div className="md:col-span-3 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setShowHoursForm(false)} className="px-4 py-2 text-sm uppercase tracking-wide text-gray-600 hover:text-gray-900 border border-transparent hover:border-gray-200">İptal</button>
                <button type="submit" disabled={submittingHours} className="bg-blue-600 text-white px-6 py-2 uppercase text-sm tracking-wide hover:bg-blue-700 disabled:opacity-50">
                  {submittingHours ? 'Kaydediliyor...' : 'Saatleri Kaydet'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* New Person Form */}
        {showPersonForm && (
          <div className="bg-white border border-gray-200 p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-medium tracking-wide mb-6">Yeni Personel Ekle</h2>
            <form onSubmit={handlePersonSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Ad *</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Soyad *</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Görev / Pozisyon</label>
                  <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Örn: Garson, Aşçı" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">İşe Başlama Tarihi</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Telefon</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-600 mb-1">Varsayılan Maaş (€) (Opsiyonel)</label>
                  <input type="number" step="10" value={baseSalary} onChange={e => setBaseSalary(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowPersonForm(false)} className="px-4 py-2 text-sm uppercase tracking-wide border border-gray-300 hover:border-gray-900">İptal</button>
                <button type="submit" disabled={submittingPerson} className="bg-gray-900 text-white px-6 py-2 uppercase text-sm tracking-wide hover:bg-gray-700 disabled:opacity-50">
                  {submittingPerson ? 'Ekleniyor...' : 'Personel Ekle'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Personnel List */}
        <div className="bg-white border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-light tracking-wide">Aktif Personeller</h2>
          </div>
          
          {loading ? (
             <div className="p-12 text-center text-gray-500">Yükleniyor...</div>
          ) : personnelList.length === 0 ? (
             <div className="p-12 text-center text-gray-500">Henüz personel bulunmuyor.</div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-100">
                {personnelList.map(p => (
                  <div key={p.id} className="p-4 bg-white hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg">
                          {p.first_name[0]}{p.last_name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{p.first_name} {p.last_name}</div>
                          <div className="text-sm text-gray-600">{p.role || '-'}</div>
                        </div>
                      </div>
                      {!p.is_active && <span className="text-[10px] uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded">Pasif</span>}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 mt-3 pt-3 border-t border-gray-50">
                      <div>
                        {p.phone && <div className="text-gray-900">{p.phone}</div>}
                        {p.start_date && <div className="text-xs text-gray-500 mt-0.5">İşe Giriş: {new Date(p.start_date).toLocaleDateString('tr-TR')}</div>}
                      </div>
                      <Link href={`/admin/personnel/${p.id}`} className="bg-gray-900 text-white px-4 py-2 rounded text-xs uppercase tracking-wide hover:bg-gray-700 transition-colors">
                        Detay
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-xs uppercase tracking-wide text-gray-600 font-light">Personel</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wide text-gray-600 font-light">Görev</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wide text-gray-600 font-light">Başlangıç</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wide text-gray-600 font-light">İletişim</th>
                      <th className="px-6 py-4 text-right text-xs uppercase tracking-wide text-gray-600 font-light">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personnelList.map(p => (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg">
                              {p.first_name[0]}{p.last_name[0]}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{p.first_name} {p.last_name}</div>
                              {!p.is_active && <span className="text-[10px] uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded mt-0.5 inline-block">Pasif</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{p.role || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {p.start_date ? new Date(p.start_date).toLocaleDateString('tr-TR') : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {p.phone && <div>{p.phone}</div>}
                          {p.email && <div className="text-gray-500 text-xs mt-0.5">{p.email}</div>}
                          {!p.phone && !p.email && '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/admin/personnel/${p.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Detay & Döküm →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
