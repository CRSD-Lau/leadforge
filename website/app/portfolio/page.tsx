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
  sections,
}: {
  accent: string
  category: string
  navItems: string[]
  heroColor: string
  sections: { label: string; cols?: number }[]
}) {
  return (
    <div className="rounded-lg overflow-hidden border border-navy-600 shadow-navy-lg text-[0px] select-none">
      {/* Browser chrome */}
      <div className="bg-navy-700 px-3 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 mx-3 bg-navy-800 rounded text-[10px] font-mono text-slate-600 px-2 py-0.5 leading-4 tracking-wide">
          {category.toLowerCase().replace(/ /g, '-')}.vercel.app
        </div>
        <div className="w-4 h-4 rounded-sm bg-navy-600 opacity-40" />
      </div>

      {/* Fake website body */}
      <div className="bg-white" style={{ fontSize: '0' }}>
        {/* Nav */}
        <div className="flex items-center justify-between px-3 py-2" style={{ background: heroColor }}>
          <div className="flex gap-1 items-center">
            <div className="w-3 h-3 rounded-sm" style={{ background: accent }} />
            <div className="w-10 h-1.5 rounded-full bg-white/60" />
          </div>
          <div className="flex gap-2">
            {navItems.slice(0, 3).map((_, i) => (
              <div key={i} className="w-6 h-1 rounded-full bg-white/40" />
            ))}
            <div className="w-8 h-3 rounded px-1 flex items-center justify-center" style={{ background: accent }}>
              <div className="w-5 h-1 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="px-4 py-5 text-center" style={{ background: `${heroColor}dd` }}>
          <div className="w-28 h-2.5 rounded-full mx-auto mb-2" style={{ background: accent, opacity: 0.8 }} />
          <div className="w-40 h-1.5 rounded-full mx-auto mb-1 bg-white/60" />
          <div className="w-32 h-1.5 rounded-full mx-auto mb-3 bg-white/40" />
          <div className="inline-flex gap-1.5">
            <div className="w-14 h-4 rounded" style={{ background: accent }} />
            <div className="w-12 h-4 rounded border border-white/30" />
          </div>
        </div>

        {/* Content sections */}
        <div className="px-3 py-3 bg-white space-y-2">
          {sections.map((sec, i) => (
            <div key={i}>
              <div className="w-20 h-1 rounded-full bg-slate-200 mb-1.5" />
              <div className={`grid gap-1.5`} style={{ gridTemplateColumns: `repeat(${sec.cols ?? 3}, 1fr)` }}>
                {Array.from({ length: sec.cols ?? 3 }).map((_, j) => (
                  <div key={j} className="rounded bg-slate-100 p-2">
                    <div className="w-full h-1 rounded-full mb-1" style={{ background: `${accent}44` }} />
                    <div className="w-3/4 h-0.5 rounded-full bg-slate-200" />
                    <div className="w-1/2 h-0.5 rounded-full bg-slate-200 mt-1" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer bar */}
        <div className="px-3 py-2 flex items-center justify-between" style={{ background: heroColor }}>
          <div className="w-12 h-1 rounded-full bg-white/30" />
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-white/20" />
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
    heroColor: '#1a3a5c',
    navItems: ['Services', 'About', 'Contact'],
    sections: [{ label: 'Services', cols: 3 }, { label: 'Why Us', cols: 2 }],
    description: 'Emergency plumbing and heating services for residential and commercial clients.',
    tags: ['Emergency 24/7', 'Online Booking', 'Google Maps'],
  },
  {
    name: 'Maison Élise Hair Studio',
    category: 'Salon & Beauty',
    location: 'Moncton, NB',
    days: '3 days',
    accent: '#A855F7',
    heroColor: '#2d1a3a',
    navItems: ['Services', 'Gallery', 'Book'],
    sections: [{ label: 'Services', cols: 3 }, { label: 'Gallery', cols: 4 }],
    description: 'Boutique hair salon offering cuts, colour, and treatments in a relaxed setting.',
    tags: ['Online Booking', 'Gallery', 'Pricing Table'],
  },
  {
    name: 'Harbour Front Bistro',
    category: 'Restaurant',
    location: 'Saint John, NB',
    days: '5 days',
    accent: '#3B82F6',
    heroColor: '#0f2040',
    navItems: ['Menu', 'Reservations', 'About'],
    sections: [{ label: 'Menu', cols: 2 }, { label: 'Specials', cols: 3 }],
    description: 'Fresh local seafood and Maritime cuisine on the Saint John waterfront.',
    tags: ['Full Menu', 'Reservations', 'Hours & Location'],
  },
  {
    name: 'Iron & Oak Fitness',
    category: 'Gym & Fitness',
    location: 'Fredericton, NB',
    days: '4 days',
    accent: '#10B981',
    heroColor: '#0a1f18',
    navItems: ['Classes', 'Membership', 'Contact'],
    sections: [{ label: 'Classes', cols: 3 }, { label: 'Plans', cols: 3 }],
    description: 'Independent strength and conditioning gym for serious athletes and beginners.',
    tags: ['Class Schedule', 'Membership Tiers', 'Trainer Bios'],
  },
  {
    name: 'Ridgeline Lawn & Landscape',
    category: 'Landscaping',
    location: 'Sussex, NB',
    days: '3 days',
    accent: '#22C55E',
    heroColor: '#0a2010',
    navItems: ['Services', 'Gallery', 'Quote'],
    sections: [{ label: 'Services', cols: 2 }, { label: 'Gallery', cols: 3 }],
    description: 'Full-service lawn care, seasonal cleanup, and landscape design for residential properties.',
    tags: ['Free Quote Form', 'Photo Gallery', 'Service Areas'],
  },
  {
    name: 'Sweet Crumb Bakery',
    category: 'Bakery',
    location: 'Saint John, NB',
    days: '3 days',
    accent: '#EAB308',
    heroColor: '#2a1a05',
    navItems: ['Menu', 'Custom Orders', 'Visit Us'],
    sections: [{ label: 'Today\'s Menu', cols: 3 }, { label: 'Specials', cols: 2 }],
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
                      sections={item.sections}
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
              { icon: '⚡', title: 'Vercel CDN', sub: 'Global edge — sub-100ms' },
              { icon: '🔒', title: 'SSL Included', sub: 'HTTPS, auto-renewing' },
              { icon: '📱', title: 'Mobile-First', sub: 'Tested across breakpoints' },
              { icon: '🔍', title: 'SEO Structure', sub: 'Metadata, sitemap, OpenGraph' },
            ].map((item) => (
              <FadeUp key={item.title}>
                <div className="text-center card-navy py-5">
                  <div className="text-2xl mb-2">{item.icon}</div>
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
