// app/[lang]/menu/page.tsx
'use client';

import { useState } from 'react';

// Menu kategorileri
const categories = ['Alle', 'Grill', 'Döner', 'Vorspeisen', 'Vegetarisch'];

// Örnek menü verileri - Supabase'den çekilecek
const menuItems = [
  { id: 1, name: 'Adana Kebap', category: 'Grill', price: '14.90', description: 'Würziges Hackfleisch vom Spieß' },
  { id: 2, name: 'Urfa Kebap', category: 'Grill', price: '14.90', description: 'Mild gewürztes Hackfleisch' },
  { id: 3, name: 'Kuzu Şiş', category: 'Grill', price: '18.90', description: 'Marinierte Lammfleischspieße' },
  { id: 4, name: 'Döner Teller', category: 'Döner', price: '12.90', description: 'Döner mit Reis und Salat' },
  { id: 5, name: 'Döner im Brot', category: 'Döner', price: '6.50', description: 'Klassischer Döner' },
  { id: 6, name: 'Mercimek Çorbası', category: 'Vorspeisen', price: '4.90', description: 'Rote Linsensuppe' },
  { id: 7, name: 'Sigara Böreği', category: 'Vorspeisen', price: '5.90', description: 'Blätterteigröllchen mit Käse' },
  { id: 8, name: 'Falafel Teller', category: 'Vegetarisch', price: '11.90', description: 'Kichererbsenbällchen mit Salat' },
];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('Alle');

  const filteredItems = selectedCategory === 'Alle' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-wider text-gray-900 mb-6">
            SPEISEKARTE
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Entdecken Sie unsere Auswahl an authentischen türkischen Gerichten, 
            täglich frisch zubereitet mit hochwertigen Zutaten
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-100 sticky top-20 z-40">
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 text-sm uppercase tracking-wide transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-300 text-gray-700 hover:border-gray-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          
          <div className="space-y-8">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className="bg-white p-8 border border-gray-200 hover:border-gray-400 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-light text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {item.description}
                    </p>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                  <div className="ml-8 text-right">
                    <p className="text-2xl font-light text-gray-900">
                      €{item.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500">Keine Gerichte in dieser Kategorie gefunden.</p>
            </div>
          )}

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl font-light tracking-wide mb-6">
            HABEN SIE FRAGEN?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Kontaktieren Sie uns gerne für spezielle Wünsche oder Allergien
          </p>
          <a 
            href="tel:023314899898"
            className="inline-block border-2 border-white text-white px-10 py-4 text-sm uppercase tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            Anrufen
          </a>
        </div>
      </section>

    </div>
  );
}