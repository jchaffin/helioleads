'use client'

import { SessionProvider } from 'next-auth/react'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>HelioLeads - Voice AI for Commercial Solar</title>
        <meta name="description" content="AI-powered voice solutions for commercial solar installers" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        {/** Tailwind is built locally via PostCSS (no CDN) */}
      </head>
      <body className="font-sans antialiased bg-surface text-slate-900" style={{ margin: 0 }}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
