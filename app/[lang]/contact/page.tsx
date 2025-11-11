// app/[lang]/contact/page.tsx
'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submit işlemi buraya gelecek (Supabase)
    console.log('Form submitted:', formData);
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm uppercase tracking-wide text-gray-700 mb-2">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
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
                  className="w-full bg-gray-900 text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-800 transition-all duration-300"
                >
                  Reservierung anfragen
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