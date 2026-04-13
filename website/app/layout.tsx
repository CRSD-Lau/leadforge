import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'LeadForge AI — Websites for Local Businesses',
    template: '%s | LeadForge AI',
  },
  description:
    'LeadForge AI builds professional websites for local businesses with no web presence. $650 flat rate. 3–5 day delivery. Powered by AI.',
  keywords: [
    'website design',
    'local business websites',
    'small business web design',
    'affordable websites',
    'Next.js websites',
    'Saint John New Brunswick',
  ],
  authors: [{ name: 'Neil Mitchell', url: 'https://neil-mitchell.vercel.app' }],
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'LeadForge AI',
    title: 'LeadForge AI — Websites for Local Businesses',
    description:
      'Autonomous outbound lead generation, powered by Claude. We build professional websites for local businesses. $650 flat rate.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans bg-brand-bg text-neutral-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
