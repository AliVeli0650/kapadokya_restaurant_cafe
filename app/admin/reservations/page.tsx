// app/admin/reservations/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        // Tablo yoksa kullanıcıya bilgi ver
        if (error.code === '42P01') {
          console.error('Reservations table does not exist. Please run the SQL migration.');
          toast.error('Rezervasyon tablosu henüz oluşturulmamış. Lütfen SQL migration dosyasını Supabase\'de çalıştırın.');
        } else {
          throw error;
        }
        setReservations([]);
        return;
      }
      setReservations(data || []);
    } catch (error) {
      console.error('Error loading reservations:', error);
      toast.error('Fehler beim Laden der Reservierungen');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: Reservation['status']) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Status erfolgreich aktualisiert');
      loadReservations();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Fehler beim Aktualisieren des Status');
    }
  };

  const deleteReservation = async (id: string) => {
    if (!confirm('Möchten Sie diese Reservierung wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Reservierung erfolgreich gelöscht');
      loadReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('Fehler beim Löschen der Reservierung');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Ausstehend';
      case 'confirmed': return 'Bestätigt';
      case 'cancelled': return 'Storniert';
      case 'completed': return 'Abgeschlossen';
      default: return status;
    }
  };

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filter);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-light tracking-wide">Reservierungen</h1>
        <button 
          onClick={loadReservations}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors"
        >
          Aktualisieren
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded text-sm ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Alle ({reservations.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded text-sm ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
        >
          Ausstehend ({reservations.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          className={`px-4 py-2 rounded text-sm ${filter === 'confirmed' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
        >
          Bestätigt ({reservations.filter(r => r.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded text-sm ${filter === 'cancelled' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
        >
          Storniert ({reservations.filter(r => r.status === 'cancelled').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded text-sm ${filter === 'completed' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Abgeschlossen ({reservations.filter(r => r.status === 'completed').length})
        </button>
      </div>

      {/* Reservations List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">Keine Reservierungen gefunden</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-medium">{reservation.name}</h3>
                  <p className="text-gray-600">{reservation.email}</p>
                  <p className="text-gray-600">{reservation.phone}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                  {getStatusLabel(reservation.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Datum</p>
                  <p className="font-medium">{new Date(reservation.date).toLocaleDateString('de-DE')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Uhrzeit</p>
                  <p className="font-medium">{reservation.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gäste</p>
                  <p className="font-medium">{reservation.guests} {reservation.guests === 1 ? 'Person' : 'Personen'}</p>
                </div>
              </div>

              {reservation.message && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500 mb-1">Nachricht</p>
                  <p className="text-gray-800">{reservation.message}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                {reservation.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(reservation.id, 'confirmed')}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Bestätigen
                  </button>
                )}
                {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                  <button
                    onClick={() => updateStatus(reservation.id, 'cancelled')}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Stornieren
                  </button>
                )}
                {reservation.status === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(reservation.id, 'completed')}
                    className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                  >
                    Abschließen
                  </button>
                )}
                <button
                  onClick={() => deleteReservation(reservation.id)}
                  className="px-4 py-2 bg-white border border-red-600 text-red-600 text-sm rounded hover:bg-red-50 transition-colors"
                >
                  Löschen
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Eingereicht: {new Date(reservation.created_at).toLocaleString('de-DE')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
