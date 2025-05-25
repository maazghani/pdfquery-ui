import './globals.css';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans bg-gray-50 p-8">
        {children}
      </body>
    </html>
  );
}
