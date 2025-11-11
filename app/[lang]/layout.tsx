// app/[lang]/layout.tsx
import React from 'react';

// Dil segmenti için yerel layout: html/body tanımlamaz, sadece children döner.
// Kök layout (app/layout.tsx) zaten <html>/<body>, Navbar ve Footer'ı içeriyor.
export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}