import './globals.css';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#1e1e1e] text-white flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}