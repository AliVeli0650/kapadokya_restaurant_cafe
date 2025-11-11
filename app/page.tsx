// app/page.tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to German homepage by default
  redirect('/de');
}
