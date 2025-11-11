// components/Navbar.tsx
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mevcut dili pathname'den tespit et
  const currentLocale = pathname?.startsWith('/de') ? 'de' : pathname?.startsWith('/tr') ? 'tr' : 'de';

  // Admin, login, menu sayfalarında Navbar'ı gizle
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login') || pathname?.startsWith('/menu')) {
    return null;
  }

  // Anasayfa mı kontrol et (video arka plan için)
  const isHomePage = pathname === `/${currentLocale}` || pathname === '/de' || pathname === '/tr';

  const switchLocale = (newLocale: 'de' | 'tr') => {
    // Mevcut path'i yeni dil ile değiştir
    const newPath = pathname?.replace(/^\/(de|tr)/, `/${newLocale}`) || `/${newLocale}`;
    router.push(newPath);
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 ${isHomePage ? 'bg-transparent' : 'bg-white/95'} backdrop-blur-sm border-b ${isHomePage ? 'border-white/20' : 'border-gray-100'}`}>
        <nav className="container mx-auto px-6 lg:px-12 h-20 flex justify-between items-center">
          
          {/* Logo */}
          <div className={`text-xl lg:text-2xl font-light tracking-wider ${isHomePage ? 'text-white' : 'text-gray-900'}`}>
            <Link href={`/${currentLocale}`} className={`${isHomePage ? 'hover:text-gray-200' : 'hover:text-gray-600'} transition-colors`}>
              KAPADOKYA
            </Link>
          </div>

          {/* Center Navigation - Desktop */}
          <ul className="hidden md:flex space-x-8 text-sm uppercase tracking-wide">
            <li>
              <Link href={`/${currentLocale}`} className={`${isHomePage ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/speisekarte" className={`${isHomePage ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
                Speisekarte
              </Link>
            </li>
            <li>
              <Link href={`/${currentLocale}/about`} className={`${isHomePage ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
                Über uns
              </Link>
            </li>
            <li>
              <Link href={`/${currentLocale}/contact`} className={`${isHomePage ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
                Kontakt
              </Link>
            </li>
          </ul>

          {/* Right Side - Language & Reserve */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Language Switcher */}
            <div className="flex items-center space-x-2 text-sm">
              <button 
                onClick={() => switchLocale('de')}
                className={`${currentLocale === 'de' ? (isHomePage ? 'text-white font-medium' : 'text-gray-900 font-medium') : (isHomePage ? 'text-gray-300' : 'text-gray-400')} ${isHomePage ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}
              >
                DE
              </button>
              <span className={isHomePage ? 'text-gray-400' : 'text-gray-300'}>|</span>
              <button 
                onClick={() => switchLocale('tr')}
                className={`${currentLocale === 'tr' ? (isHomePage ? 'text-white font-medium' : 'text-gray-900 font-medium') : (isHomePage ? 'text-gray-300' : 'text-gray-400')} ${isHomePage ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}
              >
                TR
              </button>
            </div>

            {/* Reserve Button - Desktop */}
            <Link 
              href={`/${currentLocale}/contact#reservation`}
              className={`hidden md:block border ${isHomePage ? 'border-white text-white hover:bg-white hover:text-gray-900' : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'} px-6 py-2 text-sm uppercase tracking-wide transition-all duration-300`}
            >
              Reservieren
            </Link>

            {/* Hamburger Menu Button - Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 ${isHomePage ? 'text-white' : 'text-gray-900'}`}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeMobileMenu}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-20 left-0 right-0 bg-white shadow-lg">
            <nav className="px-6 py-6 space-y-4">
              <Link 
                href={`/${currentLocale}`} 
                onClick={closeMobileMenu}
                className="block py-3 text-gray-900 hover:text-gray-600 text-lg border-b border-gray-100"
              >
                Home
              </Link>
              <Link 
                href="/speisekarte" 
                onClick={closeMobileMenu}
                className="block py-3 text-gray-900 hover:text-gray-600 text-lg border-b border-gray-100"
              >
                Speisekarte
              </Link>
              <Link 
                href={`/${currentLocale}/about`} 
                onClick={closeMobileMenu}
                className="block py-3 text-gray-900 hover:text-gray-600 text-lg border-b border-gray-100"
              >
                Über uns
              </Link>
              <Link 
                href={`/${currentLocale}/contact`} 
                onClick={closeMobileMenu}
                className="block py-3 text-gray-900 hover:text-gray-600 text-lg border-b border-gray-100"
              >
                Kontakt
              </Link>
              <Link 
                href={`/${currentLocale}/contact#reservation`}
                onClick={closeMobileMenu}
                className="block mt-4 w-full text-center border-2 border-gray-900 text-gray-900 px-6 py-3 text-sm uppercase tracking-wide hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                Reservieren
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}