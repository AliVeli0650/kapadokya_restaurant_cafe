// components/Footer.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Admin altında Footer'ı gizle
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Detect current language
  const currentLocale = pathname?.startsWith('/de') ? 'de' : pathname?.startsWith('/tr') ? 'tr' : 'de';
  const isGerman = currentLocale === 'de';
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Restaurant Info */}
          <div>
            <h3 className="text-white text-xl font-light mb-4 tracking-wide">KAPADOKYA</h3>
            <p className="text-sm leading-relaxed mb-4">
              {isGerman 
                ? <>Genießen Sie authentische türkische Küche<br />in modernem Ambiente im Herzen von Hagen.</>
                : <>Hagen'in kalbinde modern bir atmosferde<br />otantik Türk mutfağının tadını çıkarın.</>
              }
            </p>
            <div className="space-y-2 text-sm">
              <p>Elberfelder Str. 51</p>
              <p>58095 Hagen</p>
              <p className="pt-2">Tel: 02331 4899898</p>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-white text-lg font-light mb-4 tracking-wide uppercase">
              {isGerman ? 'Öffnungszeiten' : 'Açılış Saatleri'}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{isGerman ? 'Montag - Donnerstag' : 'Pazartesi - Perşembe'}</span>
                <span>11:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>{isGerman ? 'Freitag - Samstag' : 'Cuma - Cumartesi'}</span>
                <span>11:00 - 23:00</span>
              </div>
              <div className="flex justify-between">
                <span>{isGerman ? 'Sonntag' : 'Pazar'}</span>
                <span>12:00 - 22:00</span>
              </div>
            </div>
          </div>

          {/* Quick Links & Social */}
          <div>
            <h3 className="text-white text-lg font-light mb-4 tracking-wide uppercase">
              {isGerman ? 'Links' : 'Bağlantılar'}
            </h3>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <Link href={`/${currentLocale}/speisekarte`} className="hover:text-white transition-colors">
                  {isGerman ? 'Speisekarte' : 'Menü'}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/about`} className="hover:text-white transition-colors">
                  {isGerman ? 'Über uns' : 'Hakkımızda'}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/contact`} className="hover:text-white transition-colors">
                  {isGerman ? 'Reservierung' : 'Rezervasyon'}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/bestellen`} className="hover:text-white transition-colors">
                  {isGerman ? 'Online bestellen' : 'Online sipariş'}
                </Link>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/kapadokya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/kapadokya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2025 Kapadokya Restaurant & Cafe. {isGerman ? 'Alle Rechte vorbehalten.' : 'Tüm hakları saklıdır.'}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/impressum" className="hover:text-white transition-colors">
              {isGerman ? 'Impressum' : 'Künye'}
            </Link>
            <Link href="/datenschutz" className="hover:text-white transition-colors">
              {isGerman ? 'Datenschutz' : 'Gizlilik'}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}