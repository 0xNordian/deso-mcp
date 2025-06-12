import React from 'react';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth/AuthProvider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'DeSo Messaging App',
  description: 'Decentralized messaging on the DeSo blockchain',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
} 