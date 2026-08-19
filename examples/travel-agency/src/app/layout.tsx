import type { Metadata } from 'next'
import { IBM_Plex_Mono, Newsreader, Public_Sans } from 'next/font/google'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { MotionInit } from '@/components/MotionInit'
import { site } from '@/lib/site'
import '@/styles/global.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  adjustFontFallback: false,
  style: ['normal', 'italic'],
})

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Marram: Small-group weeks in one landscape',
    template: '%s · Marram',
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    type: 'website',
    locale: 'en_GB',
  },
  icons: { icon: '/favicon.svg' },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')}catch(e){}",
          }}
        />
      </head>
      <body className={`${newsreader.variable} ${publicSans.variable} ${plexMono.variable}`}>
        <MotionInit />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
