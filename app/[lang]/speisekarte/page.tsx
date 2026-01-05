'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface MenuImage {
  id: string;
  title: string;
  image_url: string;
  position: number;
}

export default function SpeisekartePage() {
  const pathname = usePathname();
  const currentLocale = pathname?.startsWith('/de') ? 'de' : pathname?.startsWith('/tr') ? 'tr' : 'de';
  const isGerman = currentLocale === 'de';

  const [menuImages, setMenuImages] = useState<MenuImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuImages();
  }, []);

  const loadMenuImages = async () => {
    try {
      const { data } = await supabase
        .from('menu_images')
        .select('*')
        .eq('is_active', true)
        .order('position');
      setMenuImages(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Menübilder:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section - Navbar için padding ekledik */}
      <div className="bg-gray-900 text-white pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-3">
                {isGerman ? 'Unsere Speisekarte' : 'Menümüz'}
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl leading-relaxed font-light">
                {isGerman 
                  ? 'Entdecken Sie unsere köstlichen Gerichte mit frischen Zutaten'
                  : 'Taze malzemelerle hazırlanan lezzetli yemeklerimizi keşfedin'}
              </p>
            </div>
            <a
              href={isGerman ? '/de/bestellen/redirect' : '/tr/bestellen/redirect'}
              className="bg-white text-gray-900 px-6 md:px-8 py-3 md:py-4 text-sm uppercase tracking-wide font-semibold hover:bg-gray-100 transition-colors inline-block text-center"
            >
              {isGerman ? 'Online Bestellen' : 'Online Sipariş'}
            </a>
          </div>
        </div>
      </div>

      {/* Menu Images Section - Menü Fotoğrafları */}
      {loading ? (
        <div className="py-16 text-center">
          <p className="text-gray-500">{isGerman ? 'Lädt...' : 'Yükleniyor...'}</p>
        </div>
      ) : menuImages.length > 0 ? (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
                {isGerman ? 'Unsere Menükarten' : 'Menü Kartlarımız'}
              </p>
              <h2 className="text-4xl font-light tracking-wide text-gray-900">
                {isGerman ? 'Speisekarten zum Download' : 'İndirilebilir Menüler'}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuImages.map((menu) => (
                <div key={menu.id} className="bg-white border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-gray-400 transition-all duration-300 group">
                  <a href={menu.image_url} target="_blank" rel="noopener noreferrer" className="block aspect-[3/4] bg-gray-50 relative overflow-hidden">
                    <img
                      src={menu.image_url}
                      alt={menu.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                        {isGerman ? 'Vergrößern' : 'Büyüt'}
                      </span>
                    </div>
                  </a>
                  <div className="p-5 bg-gray-900 text-white">
                    <h3 className="text-lg font-medium text-center">{menu.title}</h3>
                    <p className="text-xs text-gray-400 text-center mt-1">
                      {isGerman ? 'Klicken zum Vergrößern' : 'Büyütmek için tıklayın'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-500">
            {isGerman ? 'Keine Menübilder verfügbar' : 'Menü resmi bulunamadı'}
          </p>
        </div>
      )}

    </div>
  );
}
