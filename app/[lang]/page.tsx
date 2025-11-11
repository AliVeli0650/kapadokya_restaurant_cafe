// app/[lang]/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface DishOfTheDay {
  id: string;
  name_de: string;
  name_tr: string;
  description_de: string;
  description_tr: string;
  price: number;
  image_url: string;
  category_id: string;
}

export default function HomePage() {
  const pathname = usePathname();
  const currentLocale = pathname?.startsWith('/de') ? 'de' : pathname?.startsWith('/tr') ? 'tr' : 'de';
  const isGerman = currentLocale === 'de';
  const [dishOfTheDay, setDishOfTheDay] = useState<DishOfTheDay | null>(null);

  useEffect(() => {
    async function loadDishOfTheDay() {
      const { data } = await supabase
        .from('dishes')
        .select('*')
        .eq('is_dish_of_the_day', true)
        .eq('is_active', true)
        .single();
      
      if (data) setDishOfTheDay(data);
    }
    loadDishOfTheDay();
  }, []);

  return (
    <div>
      
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          onError={(e) => {
            console.error('Video yüklenemedi:', e);
            // Video hata verirse arka planı görünür yap
            e.currentTarget.style.display = 'none';
          }}
        >
          <source src="/Sunum.mp4" type="video/mp4" />
          Tarayıcınız video etiketini desteklemiyor.
        </video>

        {/* Dark Overlay for Text Readability */}
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-0"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-wider text-white mb-6 drop-shadow-2xl">
            KAPADOKYA
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-lg">
            {isGerman ? (
              <>ERLEBEN SIE AUTHENTISCHE TÜRKISCHE KÜCHE<br />IN MODERNEM AMBIENTE IM HERZEN VON HAGEN</>
            ) : (
              <>OTANTİK TÜRK MUTFAĞINI YAŞAYIN<br />HAGEN'İN KALBİNDE MODERN ATMOSFER</>
            )}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/speisekarte"
              className="border-2 border-white text-white px-10 py-4 text-sm uppercase tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300 min-w-[200px] backdrop-blur-sm"
            >
              {isGerman ? 'Speisekarte' : 'Menü'}
            </Link>
            <Link 
              href={`/${currentLocale}/contact`}
              className="bg-white text-gray-900 px-10 py-4 text-sm uppercase tracking-wider hover:bg-gray-100 transition-all duration-300 min-w-[200px]"
            >
              {isGerman ? 'Reservieren' : 'Rezervasyon'}
            </Link>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl text-center">
          <h2 className="text-4xl font-light tracking-wide text-gray-900 mb-8">
            {isGerman ? 'WILLKOMMEN' : 'HOŞ GELDİNİZ'}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {isGerman ? (
              <>
                Im Herzen von Hagen servieren wir Ihnen täglich frische, authentische türkische Spezialitäten. 
                Unsere Küche verbindet traditionelle Rezepte mit modernen Akzenten und verwendet ausschließlich 
                hochwertige, regionale Zutaten.
              </>
            ) : (
              <>
                Hagen'in kalbinde sizlere her gün taze ve otantik Türk lezzetleri sunuyoruz. 
                Mutfağımız geleneksel tarifleri modern dokunuşlarla birleştiriyor ve yalnızca 
                yüksek kaliteli, bölgesel malzemeler kullanıyor.
              </>
            )}
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            {isGerman ? (
              <>
                Ob Grill, Döner oder vegetarische Köstlichkeiten – bei uns finden Sie für jeden Geschmack 
                das passende Gericht in gemütlicher Atmosphäre.
              </>
            ) : (
              <>
                Izgara, döner veya vejetaryen lezzetler – bizde her damak zevkine uygun yemekleri 
                rahat bir atmosferde bulabilirsiniz.
              </>
            )}
          </p>
        </div>
      </section>

      {/* Dish of the Day Section */}
      {dishOfTheDay && (
        <section className="py-24 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="container mx-auto px-6 lg:px-12">
            
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest text-orange-600 mb-2">
                {isGerman ? 'Empfehlung des Chefs' : 'Şefin Önerisi'}
              </p>
              <h2 className="text-4xl font-light tracking-wide text-gray-900">
                {isGerman ? 'TAGESGERICHT' : 'GÜNÜN YEMEĞİ'}
              </h2>
            </div>

            <div className="max-w-5xl mx-auto bg-white shadow-2xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                
                {/* Image */}
                <div className="relative h-64 md:h-auto">
                  <img 
                    src={dishOfTheDay.image_url} 
                    alt={isGerman ? dishOfTheDay.name_de : dishOfTheDay.name_tr}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-12 flex flex-col justify-center">
                  <h3 className="text-3xl font-light tracking-wide text-gray-900 mb-4">
                    {isGerman ? dishOfTheDay.name_de : (dishOfTheDay.name_tr || dishOfTheDay.name_de)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                    {isGerman ? dishOfTheDay.description_de : (dishOfTheDay.description_tr || dishOfTheDay.description_de)}
                  </p>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-4xl font-light text-orange-600">
                      €{dishOfTheDay.price.toFixed(2)}
                    </span>
                  </div>
                  <Link 
                    href="/speisekarte"
                    className="border-2 border-gray-900 text-gray-900 px-8 py-3 text-sm uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300 text-center"
                  >
                    {isGerman ? 'Zur Speisekarte' : 'Menüye Git'}
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </section>
      )}

      {/* Highlights Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12">
          
          <h2 className="text-4xl font-light tracking-wide text-gray-900 mb-16 text-center">
            {isGerman ? 'UNSERE HIGHLIGHTS' : 'ÖNE ÇIKANLAR'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Card 1 */}
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide">
                {isGerman ? 'AUTHENTISCHE REZEPTE' : 'OTANTİK TARİFLER'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {isGerman 
                  ? 'Traditionelle türkische Gerichte nach überlieferten Familienrezepten'
                  : 'Nesillerden nesillere aktarılan geleneksel Türk yemekleri'}
              </p>
            </div>

            {/* Card 2 */}
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide">
                {isGerman ? 'FRISCHE ZUTATEN' : 'TAZE MALZEMELER'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {isGerman 
                  ? 'Täglich frisch zubereitet mit Produkten aus der Region'
                  : 'Her gün bölgesel ürünlerle taze olarak hazırlanıyor'}
              </p>
            </div>

            {/* Card 3 */}
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide">
                {isGerman ? 'GEMÜTLICHES AMBIENTE' : 'RAHAT ATMOSFER'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {isGerman 
                  ? 'Moderne Einrichtung trifft auf herzliche Gastfreundschaft'
                  : 'Modern dekorasyon ve sıcak misafirperverlik'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl font-light tracking-wide mb-8">
            {isGerman ? 'BESUCHEN SIE UNS' : 'BİZİ ZİYARET EDİN'}
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {isGerman 
              ? 'Reservieren Sie jetzt Ihren Tisch und genießen Sie ein unvergessliches kulinarisches Erlebnis'
              : 'Şimdi masanızı rezerve edin ve unutulmaz bir lezzet deneyimi yaşayın'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href={`/${currentLocale}/contact`}
              className="border-2 border-white text-white px-10 py-4 text-sm uppercase tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              {isGerman ? 'Tisch reservieren' : 'Masa Rezervasyonu'}
            </Link>
            <a 
              href="tel:02331 4899898"
              className="bg-white text-gray-900 px-10 py-4 text-sm uppercase tracking-wider hover:bg-gray-100 transition-all duration-300"
            >
              {isGerman ? 'Anrufen' : 'Ara'}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}