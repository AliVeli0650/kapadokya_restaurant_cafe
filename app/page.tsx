// app/page.tsx
'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="pt-20">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-wider text-gray-900 mb-6">
            KAPADOKYA
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            ERLEBEN SIE AUTHENTISCHE TÜRKISCHE KÜCHE<br />
            IN MODERNEM AMBIENTE IM HERZEN VON HAGEN
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/menu"
              className="border-2 border-gray-900 text-gray-900 px-10 py-4 text-sm uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300 min-w-[200px]"
            >
              Speisekarte
            </Link>
            <Link 
              href="/contact"
              className="bg-gray-900 text-white px-10 py-4 text-sm uppercase tracking-wider hover:bg-gray-800 transition-all duration-300 min-w-[200px]"
            >
              Reservieren
            </Link>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl text-center">
          <h2 className="text-4xl font-light tracking-wide text-gray-900 mb-8">
            WILLKOMMEN
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Im Herzen von Hagen servieren wir Ihnen täglich frische, authentische türkische Spezialitäten. 
            Unsere Küche verbindet traditionelle Rezepte mit modernen Akzenten und verwendet ausschließlich 
            hochwertige, regionale Zutaten.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Ob Grill, Döner oder vegetarische Köstlichkeiten – bei uns finden Sie für jeden Geschmack 
            das passende Gericht in gemütlicher Atmosphäre.
          </p>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12">
          
          <h2 className="text-4xl font-light tracking-wide text-gray-900 mb-16 text-center">
            UNSERE HIGHLIGHTS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Card 1 */}
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide">AUTHENTISCHE REZEPTE</h3>
              <p className="text-gray-600 leading-relaxed">
                Traditionelle türkische Gerichte nach überlieferten Familienrezepten
              </p>
            </div>

            {/* Card 2 */}
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide">FRISCHE ZUTATEN</h3>
              <p className="text-gray-600 leading-relaxed">
                Täglich frisch zubereitet mit Produkten aus der Region
              </p>
            </div>

            {/* Card 3 */}
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide">GEMÜTLICHES AMBIENTE</h3>
              <p className="text-gray-600 leading-relaxed">
                Moderne Einrichtung trifft auf herzliche Gastfreundschaft
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl font-light tracking-wide mb-8">
            BESUCHEN SIE UNS
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Reservieren Sie jetzt Ihren Tisch und genießen Sie ein unvergessliches kulinarisches Erlebnis
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/contact"
              className="border-2 border-white text-white px-10 py-4 text-sm uppercase tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              Tisch reservieren
            </Link>
            <a 
              href="tel:023314899898"
              className="bg-white text-gray-900 px-10 py-4 text-sm uppercase tracking-wider hover:bg-gray-100 transition-all duration-300"
            >
              Anrufen
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
