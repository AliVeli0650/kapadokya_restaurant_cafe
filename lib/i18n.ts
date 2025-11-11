// i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Desteklenen diller
const locales = ['de', 'tr'];

export default getRequestConfig(async ({ locale }) => {
  // Geçerli bir dil kodu olup olmadığını kontrol et
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // `messages/de.json` veya `messages/tr.json` dosyasını
  // dinamik olarak import et ve döndür.
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});