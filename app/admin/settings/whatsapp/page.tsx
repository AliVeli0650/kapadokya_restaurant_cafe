'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeprecatedWhatsAppSettingsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/website/settings');
  }, [router]);
  return null;
}
