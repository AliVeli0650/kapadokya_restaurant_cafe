import { redirect } from 'next/navigation';

export default function MenuPage() {
  // Artık tüm menü içeriği /speisekarte sayfasında
  redirect('/speisekarte');
}
