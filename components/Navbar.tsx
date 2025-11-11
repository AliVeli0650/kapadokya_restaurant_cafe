// components/Navbar.tsx
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Mevcut dili pathname'den tespit et
  const currentLocale = pathname?.startsWith('/de') ? 'de' : pathname?.startsWith('/tr') ? 'tr' : 'de';

  // Admin, login, menu, speisekarte sayfalarında Navbar'ı gizle
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login') || pathname?.startsWith('/menu') || pathname?.startsWith('/speisekarte')) {
    return null;
  }

  // Anasayfa mı kontrol et (video arka plan için)
  const isHomePage = pathname === `/${currentLocale}` || pathname === '/de' || pathname === '/tr';

  const switchLocale = (newLocale: 'de' | 'tr') => {
    // Mevcut path'i yeni dil ile değiştir
    const newPath = pathname?.replace(/^\/(de|tr)/, `/${newLocale}`) || `/${newLocale}`;
    router.push(newPath);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isHomePage ? 'bg-transparent' : 'bg-white/95'} backdrop-blur-sm border-b ${isHomePage ? 'border-white/20' : 'border-gray-100'}`}>
      <nav className="container mx-auto px-6 lg:px-12 h-20 flex justify-between items-center">
        
        {/* Logo */}
        <div className={`text-xl lg:text-2xl font-light tracking-wider ${isHomePage ? 'text-white' : 'text-gray-900'}`}>
          <Link href={`/${currentLocale}`} className={`${isHomePage ? 'hover:text-gray-200' : 'hover:text-gray-600'} transition-colors`}>
            KAPADOKYA
          </Link>
        </div>

        {/* Center Navigation */}
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
        <div className="flex items-center space-x-6">
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

          {/* Reserve Button */}
          <Link 
            href={`/${currentLocale}/contact#reservation`}
            className={`hidden md:block border ${isHomePage ? 'border-white text-white hover:bg-white hover:text-gray-900' : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'} px-6 py-2 text-sm uppercase tracking-wide transition-all duration-300`}
          >
            Reservieren
          </Link>
        </div>

      </nav>
    </header>
  );
}