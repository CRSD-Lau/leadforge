'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  )
}

// Mock browser-frame preview — shows a stylised site layout in a browser chrome
function BrowserPreview({
  accent,
  category,
  navItems,
  heroColor,
  heroTagline,
  heroHeadline,
  heroSub,
  ctaLabel,
  services,
  stat,
}: {
  accent: string
  category: string
  navItems: string[]
  heroColor: string
  heroTagline: string
  heroHeadline: string
  heroSub: string
  ctaLabel: string
  services: { icon: string; title: string; desc: string }[]
  stat: { val: string; label: string }
}) {
  const slug = category.toLowerCase().replace(/[^a-z0-9]/g, '-')
  return (
    <div className="rounded-xl overflow-hidden border border-navy-600 shadow-navy-lg select-none" style={{ fontSize: 0 }}>
      {/* Browser chrome */}
      <div className="bg-navy-700 px-3 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 mx-3 bg-navy-800 rounded text-[10px] font-mono text-slate-500 px-2 py-0.5 leading-4 tracking-wide">
          {slug}.vercel.app
        </div>
        <div className="w-3 h-3 opacity-30">
          <svg viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* Site body */}
      <div style={{ fontSize: 0 }}>
        {/* Nav */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ background: heroColor }}>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
            </div>
            <div className="w-14 h-2 rounded-full bg-white/50" />
          </div>
          <div className="flex items-center gap-3">
            {navItems.slice(0, 3).map((item, i) => (
              <div key={i} className="h-1.5 rounded-full bg-white/30" style={{ width: `${18 + i * 6}px` }} />
            ))}
            <div className="rounded px-2 py-1 flex items-center" style={{ background: accent }}>
              <div className="w-10 h-1 rounded-full bg-white/90" />
            </div>
          </div>
        </div>

        {/* Hero section */}
        <div className="relative px-4 pt-5 pb-4 overflow-hidden" style={{ background: `linear-gradient(135deg, ${heroColor} 0%, ${heroColor}dd 60%, ${heroColor}88 100%)` }}>
          {/* Decorative circle */}
          <div className="absolute right-4 top-2 w-16 h-16 rounded-full opacity-10" style={{ background: accent }} />
          {/* Tag */}
          <div className="inline-flex items-center gap-1 mb-2">
            <div className="w-1 h-1 rounded-full" style={{ background: accent }} />
            <div className="h-1.5 w-14 rounded-full opacity-70" style={{ background: accent }} />
          </div>
          {/* Headline lines */}
          <div className="w-40 h-3 rounded-full mb-1.5 bg-white/75" />
          <div className="w-28 h-3 rounded-full mb-3 bg-white/55" />
          {/* Sub text */}
          <div className="w-48 h-1.5 rounded-full mb-1 bg-white/25" />
          <div className="w-36 h-1.5 rounded-full mb-4 bg-white/20" />
          {/* CTAs */}
          <div className="flex gap-2 items-center">
            <div className="h-5 w-20 rounded flex items-center justify-center" style={{ background: accent }}>
              <div className="w-14 h-1 rounded-full bg-white/90" />
            </div>
            <div className="h-5 w-16 rounded border border-white/25 flex items-center justify-center">
              <div className="w-10 h-1 rounded-full bg-white/40" />
            </div>
          </div>
          {/* Stat badge */}
          <div className="absolute right-4 bottom-4 rounded-lg px-2 py-1.5 flex flex-col items-center" style={{ background: `${heroColor}cc`, border: `1px solid ${accent}44` }}>
            <div className="h-3 w-8 rounded-full mb-0.5" style={{ background: accent, opacity: 0.9 }} />
            <div className="h-1 w-10 rounded-full bg-white/30" />
          </div>
        </div>

        {/* Services section */}
        <div className="px-4 py-4 bg-white">
          {/* Section header */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-1.5 h-3 rounded-full" style={{ background: accent }} />
            <div className="h-2 w-16 rounded-full bg-slate-200" />
          </div>
          {/* Service cards */}
          <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${Math.min(services.length, 3)}, 1fr)` }}>
            {services.slice(0, 3).map((svc, i) => (
              <div key={i} className="rounded-lg p-2.5 border border-slate-100 bg-slate-50">
                {/* Icon blob */}
                <div className="w-6 h-6 rounded-lg mb-2 flex items-center justify-center" style={{ background: `${accent}18` }}>
                  <div className="w-3 h-3 rounded-sm" style={{ background: `${accent}80` }} />
                </div>
                {/* Title bar */}
                <div className="h-1.5 rounded-full mb-1.5 bg-slate-300" style={{ width: `${60 + i * 10}%` }} />
                {/* Desc lines */}
                <div className="h-1 rounded-full mb-1 bg-slate-200 w-full" />
                <div className="h-1 rounded-full bg-slate-200 w-3/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Trust bar */}
        <div className="px-4 py-2.5 flex items-center justify-between border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-sm" style={{ background: `${accent}70` }} />
            ))}
            <div className="ml-1 h-1.5 w-12 rounded-full bg-slate-200" />
          </div>
          <div className="h-1.5 w-20 rounded-full bg-slate-200" />
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: heroColor }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: accent, opacity: 0.7 }} />
            <div className="w-12 h-1 rounded-full bg-white/30" />
          </div>
          <div className="flex gap-3">
            {navItems.map((_, i) => (
              <div key={i} className="h-1 rounded-full bg-white/20" style={{ width: `${14 + i * 4}px` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const portfolioItems = [
  {
    name: 'Callahan Plumbing & Heating',
    category: 'Plumbing',
    location: 'Saint John, NB',
    days: '4 days',
    accent: '#F97316',
    heroColor: '#0d2540',
    navItems: ['Services', 'About', 'Contact'],
    heroTagline: 'Licensed & Insured',
    heroHeadline: 'Fast Plumbing, Right First Time',
    heroSub: 'Emergency response 24/7 across Saint John.',
    ctaLabel: 'Book a Call',
    services: [
      { icon: '🔧', title: 'Emergency Repairs', desc: 'Same-day response' },
      { icon: '🏠', title: 'Residential', desc: 'Full home service' },
      { icon: '🔥', title: 'Heating', desc: 'Furnace & boilers' },
    ],
    stat: { val: '24/7', label: 'Emergency Line' },
    description: 'Emergency plumbing and heating services for residential and commercial clients.',
    tags: ['Emergency 24/7', 'Online Booking', 'Google Maps'],
  },
  {
    name: 'Maison Élise Hair Studio',
    category: 'Salon & Beauty',
    location: 'Moncton, NB',
    days: '3 days',
    accent: '#A855F7',
    heroColor: '#1a0d2e',
    navItems: ['Services', 'Gallery', 'Book'],
    heroTagline: 'Moncton\'s Boutique Studio',
    heroHeadline: 'Hair That Speaks For Itself',
    heroSub: 'Cuts, colour, and treatments in a relaxed setting.',
    ctaLabel: 'Book Online',
    services: [
      { icon: '✂️', title: 'Cut & Style', desc: 'Precision cutting' },
      { icon: '🎨', title: 'Colour', desc: 'Balayage & highlights' },
      { icon: '💆', title: 'Treatments', desc: 'Keratin & repair' },
    ],
    stat: { val: '5★', label: 'Google Rating' },
    description: 'Boutique hair salon offering cuts, colour, and treatments in a relaxed setting.',
    tags: ['Online Booking', 'Gallery', 'Pricing Table'],
  },
  {
    name: 'Harbour Front Bistro',
    category: 'Restaurant',
    location: 'Saint John, NB',
    days: '5 days',
    accent: '#3B82F6',
    heroColor: '#071428',
    navItems: ['Menu', 'Reservations', 'About'],
    heroTagline: 'Waterfront Dining · Saint John',
    heroHeadline: 'Fresh Catch, Maritime Soul',
    heroSub: 'Local seafood served with a harbour view.',
    ctaLabel: 'Reserve a Table',
    services: [
      { icon: '🦞', title: 'Seafood', desc: 'Daily fresh catch' },
      { icon: '🍷', title: 'Wine List', desc: 'Curated Maritime' },
      { icon: '🎉', title: 'Private Events', desc: 'Groups up to 40' },
    ],
    stat: { val: '12yr', label: 'Est. 2012' },
    description: 'Fresh local seafood and Maritime cuisine on the Saint John waterfront.',
    tags: ['Full Menu', 'Reservations', 'Hours & Location'],
  },
  {
    name: 'Iron & Oak Fitness',
    category: 'Gym & Fitness',
    location: 'Fredericton, NB',
    days: '4 days',
    accent: '#10B981',
    heroColor: '#061812',
    navItems: ['Classes', 'Membership', 'Contact'],
    heroTagline: 'Fredericton\'s Independent Gym',
    heroHeadline: 'Strength Built Different',
    heroSub: 'No-fluff training for serious athletes.',
    ctaLabel: 'Free Trial Day',
    services: [
      { icon: '🏋️', title: 'Powerlifting', desc: 'Full rig & racks' },
      { icon: '🔄', title: 'Classes', desc: '20+ weekly sessions' },
      { icon: '📋', title: 'Programs', desc: 'Coach-led plans' },
    ],
    stat: { val: '$59', label: 'per month' },
    description: 'Independent strength and conditioning gym for serious athletes and beginners.',
    tags: ['Class Schedule', 'Membership Tiers', 'Trainer Bios'],
  },
  {
    name: 'Ridgeline Lawn & Landscape',
    category: 'Landscaping',
    location: 'Sussex, NB',
    days: '3 days',
    accent: '#22C55E',
    heroColor: '#061a0a',
    navItems: ['Services', 'Gallery', 'Quote'],
    heroTagline: 'Sussex & Surrounding Areas',
    heroHeadline: 'Curb Appeal, Year Round',
    heroSub: 'Lawn care, cleanup, and landscape design.',
    ctaLabel: 'Free Quote',
    services: [
      { icon: '🌿', title: 'Lawn Care', desc: 'Weekly maintenance' },
      { icon: '🍂', title: 'Seasonal', desc: 'Spring & fall cleanup' },
      { icon: '🌳', title: 'Landscaping', desc: 'Design & install' },
    ],
    stat: { val: '200+', label: 'Properties Served' },
    description: 'Full-service lawn care, seasonal cleanup, and landscape design for residential properties.',
    tags: ['Free Quote Form', 'Photo Gallery', 'Service Areas'],
  },
  {
    name: 'Sweet Crumb Bakery',
    category: 'Bakery',
    location: 'Saint John, NB',
    days: '3 days',
    accent: '#EAB308',
    heroColor: '#1a1002',
    navItems: ['Menu', 'Custom Orders', 'Visit Us'],
    heroTagline: 'Baked Fresh Daily',
    heroHeadline: 'Bread Worth Waking Up For',
    heroSub: 'Artisan loaves, pastries & custom cakes.',
    ctaLabel: 'See Today\'s Menu',
    services: [
      { icon: '🍞', title: 'Artisan Bread', desc: 'Sourdough & rye' },
      { icon: '🥐', title: 'Pastries', desc: 'Croissants & more' },
      { icon: '🎂', title: 'Custom Cakes', desc: 'Order 3 days ahead' },
    ],
    stat: { val: '6 AM', label: 'Daily Opening' },
    description: 'Artisan breads, pastries, and custom cakes baked fresh daily from local ingredients.',
    tags: ['Daily Menu', 'Custom Cakes', 'Online Orders'],
  },
]

export default function PortfolioPage() {
  return (
    <>
      {/* Header */}
      <section className="relative bg-navy-900 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-orange-500/6 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-tag mb-4 block">Our Work</span>
            <h1 className="font-sans font-extrabold text-5xl sm:text-6xl text-white leading-tight mb-5">
              Built by <span className="text-gradient-orange">LeadForge AI</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Every site delivered in React/Next.js, deployed on Vercel, and handed over with full code ownership.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming soon banner */}
      <section className="bg-navy-800 border-y border-navy-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
          <span className="dot-orange animate-pulse-slow flex-shrink-0" />
          <p className="font-mono text-xs text-slate-400">
            First production builds launching soon — previews below show our build style and deliverable quality.
            <Link href="/contact" className="text-orange-400 hover:text-orange-300 ml-2 underline">Be the first client →</Link>
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, i) => (
              <FadeUp key={item.name} delay={i * 0.08}>
                <div className="card-navy group overflow-hidden flex flex-col h-full p-0">
                  {/* Browser preview */}
                  <div className="p-4 pb-0">
                    <BrowserPreview
                      accent={item.accent}
                      category={item.category}
                      navItems={item.navItems}
                      heroColor={item.heroColor}
                      heroTagline={item.heroTagline}
                      heroHeadline={item.heroHeadline}
                      heroSub={item.heroSub}
                      ctaLabel={item.ctaLabel}
                      services={item.services}
                      stat={item.stat}
                    />
                  </div>

                  {/* Card body */}
                  <div className="p-5 pt-4 flex flex-col flex-1">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-sans font-bold text-white text-sm group-hover:text-orange-400 transition-colors leading-tight">
                          {item.name}
                        </h3>
                        <p className="font-mono text-xs text-slate-600 mt-0.5">{item.category} · {item.location}</p>
                      </div>
                      <span className="font-mono text-xs text-orange-500/80 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded-md flex-shrink-0 ml-3">
                        {item.days}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-slate-500 leading-relaxed mb-4 flex-1">{item.description}</p>

                    {/* Feature tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.tags.map((tag) => (
                        <span key={tag} className="font-mono text-xs text-slate-500 bg-navy-700 border border-navy-600 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-navy-700 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {['Next.js', 'Tailwind', 'Vercel'].map((t) => (
                          <span key={t} className="font-mono text-xs text-slate-600 bg-navy-700 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: `${item.accent}22` }}
                      >
                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none" style={{ color: item.accent }}>
                          <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* What's included callout */}
      <section className="py-16 bg-navy-800 border-y border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-10">
            <h2 className="font-sans font-bold text-2xl text-white">Every build includes</h2>
          </FadeUp>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-orange-500">
                    <path d="M10 2L6 10H10L7 18L16 9H11L14 2H10Z" fill="currentColor"/>
                  </svg>
                ),
                title: 'Vercel CDN', sub: 'Global edge — sub-100ms',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-orange-500">
                    <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="10" cy="13.5" r="1" fill="currentColor"/>
                  </svg>
                ),
                title: 'SSL Included', sub: 'HTTPS, auto-renewing',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-orange-500">
                    <rect x="6" y="2" width="8" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M9 14.5h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M4 17h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Mobile-First', sub: 'Tested across breakpoints',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-orange-500">
                    <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M7 9h4M9 7v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'SEO Structure', sub: 'Metadata, sitemap, OpenGraph',
              },
            ].map((item) => (
              <FadeUp key={item.title}>
                <div className="text-center card-navy py-5">
                  <div className="flex justify-center mb-3">{item.icon}</div>
                  <div className="font-sans font-semibold text-white text-sm mb-1">{item.title}</div>
                  <div className="font-sans text-xs text-slate-500">{item.sub}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-white mb-4">
              Want to be in the portfolio?
            </h2>
            <p className="text-slate-400 mb-8">$650 flat. 3–5 days. You own the code.</p>
            <Link href="/contact" className="btn-orange text-base px-8 py-4">
              Get Your Site Built
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
