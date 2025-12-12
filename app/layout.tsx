// app/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from "@vercel/analytics/next"

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloating from '../components/WhatsAppFloating';

export const metadata: Metadata = {
  title: 'Kapadokya Cafe Restaurant',
  description: 'Authentische türkische Küche im Herzen von Hagen',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <WhatsAppFloating />
        <Analytics />
      </body>
    </html>
  );
}