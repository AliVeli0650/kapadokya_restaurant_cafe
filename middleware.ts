// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Desteklediğimiz dillerin listesi
  locales: ['de', 'tr'],

  // Kullanıcı bir dil seçmezse varsayılan dil
  defaultLocale: 'de',

  // Dil seçimini her zaman URL'de göster (SEO için en iyisi)
  localePrefix: 'always',
});

export const config = {
  // Middleware'in hangi URL'lerde çalışacağını (veya çalışmayacağını) belirler.
  matcher: [
    // Admin, login, menu, API, statik dosyalar ve media dosyalarını atla
    '/((?!api|_next/static|_next/image|favicon.ico|admin|login|menu|.*\\.mp4|.*\\.jpg|.*\\.png|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)',
    // Kök URL'yi de dahil et
    '/'
  ]
};