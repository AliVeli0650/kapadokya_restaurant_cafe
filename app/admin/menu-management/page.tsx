// app/admin/menu-management/page.tsx
'use client';

import Link from 'next/link';

export default function MenuManagementPlaceholder() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">← Dashboard'a Dön</Link>
        <h1 className="text-3xl font-light tracking-wide text-gray-900">Menü Yönetimi</h1>
        <p className="text-gray-600">Bu sayfa henüz hazır değil. Yakında ürün, kategori ve fiyat yönetimi burada olacak.</p>
      </div>

      <div className="bg-white border border-gray-200 p-8 text-gray-500">
        Şimdilik placeholder. İhtiyaçlarınıza göre bilgi toplayıp tasarlayacağım.
      </div>
    </div>
  );
}
