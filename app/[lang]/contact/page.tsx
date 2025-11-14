// app/[lang]/contact/page.tsx
'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../../lib/supabaseClient';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: ''
  });
  
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadWhatsAppNumber();
  }, []);

  const loadWhatsAppNumber = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'whatsapp_business_number')
      .single();
    
    if (data?.value) {
      setWhatsappNumber(data.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!whatsappNumber) {
      toast.error('WhatsApp-Nummer ist nicht konfiguriert');
      return;
    }

    // WhatsApp mesajını oluştur
    const message = `🍽️ *NEUE RESERVIERUNG*

👤 *Name:* ${formData.name}
📱 *Telefon:* ${formData.phone}
📅 *Datum:* ${formData.date}
🕐 *Uhrzeit:* ${formData.time}
👥 *Personen:* ${formData.guests}${formData.message ? `\n\n💬 *Hinweise:*\n${formData.message}` : ''}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // WhatsApp'ı aç
    window.open(whatsappUrl, '_blank');
    
    // Formu sıfırla
    setFormData({
      name: '',
      phone: '',
      date: '',
      time: '',
      guests: '2',
      message: ''
    });
    
    toast.success('Sie werden zu WhatsApp weitergeleitet!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-wider text-gray-900 mb-6">
            KONTAKT & RESERVIERUNG
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Reservieren Sie Ihren Tisch oder kontaktieren Sie uns für weitere Informationen
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info & Map */}
          <div>
            
            {/* Contact Information */}
            <div className="bg-white p-8 border border-gray-200 mb-8">
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-6">
                KONTAKTINFORMATIONEN
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Adresse</h3>
                  <p className="text-gray-900">
                    Elberfelder Str. 51<br />
                    58095 Hagen, Deutschland
                  </p>
                </div>

                <div>
                  <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Telefon</h3>
                  <a href="tel:023314899898" className="text-gray-900 hover:text-gray-600 transition-colors">
                    02331 4899898
                  </a>
                </div>

                <div>
                  <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">E-Mail</h3>
                  <a href="mailto:info@kapadokya-hagen.de" className="text-gray-900 hover:text-gray-600 transition-colors">
                    info@kapadokya-hagen.de
                  </a>
                </div>

                <div>
                  <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Öffnungszeiten</h3>
                  <div className="space-y-1 text-gray-900">
                    <p>Montag - Donnerstag: 11:00 - 22:00</p>
                    <p>Freitag - Samstag: 11:00 - 23:00</p>
                    <p>Sonntag: 12:00 - 22:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-gray-200 h-80 border border-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Google Maps wird hier eingebettet</p>
              {/* Google Maps iframe buraya gelecek */}
            </div>

          </div>

          {/* Reservation Form */}
          <div>
            <div className="bg-white p-8 border border-gray-200">
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-6">
                TISCH RESERVIEREN
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <label htmlFor="name" className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                      Datum *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                      Uhrzeit *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="guests" className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                    Anzahl Gäste *
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    required
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'Personen'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                    Nachricht (optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors resize-none"
                    placeholder="Besondere Wünsche, Allergien etc."
                  />
                </div>

                <button
                  type="submit"
                  disabled={!whatsappNumber}
                  className="w-full bg-green-600 text-white py-4 text-sm uppercase tracking-wider hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Via WhatsApp reservieren
                </button>

                <p className="text-sm text-gray-500 text-center">
                  * Pflichtfelder
                </p>

              </form>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}