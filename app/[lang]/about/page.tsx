'use client';

import { usePathname } from 'next/navigation';

export default function AboutPage() {
  const pathname = usePathname();
  const currentLocale = pathname?.startsWith('/de') ? 'de' : pathname?.startsWith('/tr') ? 'tr' : 'de';
  const isGerman = currentLocale === 'de';

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-light tracking-wide mb-4">
            {isGerman ? 'Über uns' : 'Hakkımızda'}
          </h1>
          <p className="text-xl text-gray-300">
            {isGerman 
              ? 'Authentische türkische Küche im Herzen von Hagen'
              : 'Hagen\'in kalbinde otantik Türk mutfağı'}
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-8 text-center">
            {isGerman ? 'Unsere Geschichte' : 'Hikayemiz'}
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            {isGerman ? (
              <>
                <p>
                  Willkommen im Kapadokya Restaurant – Ihrem Ort für authentische türkische Küche 
                  im Herzen von Hagen. Seit unserer Gründung ist es unser Ziel, die reiche kulinarische 
                  Tradition der Türkei mit modernen Akzenten zu verbinden.
                </p>
                <p>
                  Unsere Küche zeichnet sich durch die Verwendung frischer, hochwertiger Zutaten und 
                  traditioneller Zubereitungsmethoden aus. Jedes Gericht wird mit Liebe zum Detail 
                  und Respekt vor den überlieferten Rezepten zubereitet.
                </p>
                <p>
                  Ob Sie ein schnelles Mittagessen genießen oder einen gemütlichen Abend mit Familie 
                  und Freunden verbringen möchten – bei uns sind Sie herzlich willkommen.
                </p>
              </>
            ) : (
              <>
                <p>
                  Kapadokya Restaurant'a hoş geldiniz – Hagen'in kalbinde otantik Türk mutfağı için yeriniz. 
                  Kuruluşumuzdan bu yana amacımız, Türkiye'nin zengin mutfak geleneğini modern dokunuşlarla birleştirmektir.
                </p>
                <p>
                  Mutfağımız, taze ve kaliteli malzemeler kullanımı ve geleneksel pişirme yöntemleri ile öne çıkar. 
                  Her yemek, detaylara gösterilen özen ve geleneksel tariflere saygı ile hazırlanır.
                </p>
                <p>
                  Hızlı bir öğle yemeğinin tadını çıkarmak veya aile ve arkadaşlarınızla rahat bir akşam geçirmek 
                  isterseniz – sizi içtenlikle bekliyoruz.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-12 text-center">
            {isGerman ? 'Unsere Werte' : 'Değerlerimiz'}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Value 1 */}
            <div className="bg-white p-8 text-center shadow-sm border border-gray-200">
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">
                {isGerman ? 'Qualität' : 'Kalite'}
              </h3>
              <p className="text-gray-600">
                {isGerman 
                  ? 'Wir verwenden nur frische, hochwertige Zutaten für unsere Gerichte'
                  : 'Yemeklerimiz için sadece taze ve kaliteli malzemeler kullanıyoruz'}
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-8 text-center shadow-sm border border-gray-200">
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">
                {isGerman ? 'Tradition' : 'Gelenek'}
              </h3>
              <p className="text-gray-600">
                {isGerman 
                  ? 'Authentische Rezepte, die über Generationen weitergegeben wurden'
                  : 'Nesillerden nesillere aktarılan otantik tarifler'}
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-8 text-center shadow-sm border border-gray-200">
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">
                {isGerman ? 'Gastfreundschaft' : 'Misafirperverlik'}
              </h3>
              <p className="text-gray-600">
                {isGerman 
                  ? 'Herzlicher Service und gemütliche Atmosphäre für jeden Gast'
                  : 'Her misafir için sıcak hizmet ve rahat atmosfer'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light tracking-wide mb-6">
            {isGerman ? 'Besuchen Sie uns' : 'Bizi Ziyaret Edin'}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {isGerman 
              ? 'Wir freuen uns auf Ihren Besuch!'
              : 'Ziyaretinizi dört gözle bekliyoruz!'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`/${currentLocale}/contact`}
              className="border-2 border-white text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              {isGerman ? 'Kontakt' : 'İletişim'}
            </a>
            <a 
              href="tel:02331 4899898"
              className="bg-white text-gray-900 px-8 py-3 text-sm uppercase tracking-wider hover:bg-gray-100 transition-all duration-300"
            >
              {isGerman ? 'Anrufen' : 'Ara'}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
