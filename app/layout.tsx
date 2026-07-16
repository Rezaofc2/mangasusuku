import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KomikCat — Baca Komik Manhwa Manga Manhua Bahasa Indonesia',
  description:
    'Baca komik, manhwa, manga, dan manhua bahasa Indonesia gratis. Update setiap hari. Bypass blokir otomatis tanpa VPN.',
  generator: 'Next.js',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b0d12',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased bg-[#0b0d12] text-slate-100 min-h-screen selection:bg-amber-400/30 selection:text-amber-100">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
