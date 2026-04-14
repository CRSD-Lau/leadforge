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

const portfolioItems = [
  { name: 'Callahan Plumbing & Heating', category: 'Plumbing', location: 'Saint John, NB', days: '4 days', initials: 'CP', accent: '#F97316',
    description: 'Emergency plumbing and heating services for residential and commercial clients.' },
  { name: 'Maison Élise Hair Studio', category: 'Salon & Beauty', location: 'Moncton, NB', days: '3 days', initials: 'ME', accent: '#A855F7',
    description: 'Boutique hair salon offering cuts, colour, and treatments in a relaxed setting.' },
  { name: 'Harbour Front Bistro', category: 'Restaurant', location: 'Saint John, NB', days: '5 days', initials: 'HF', accent: '#3B82F6',
    description: 'Fresh local seafood and Maritime cuisine on the Saint John waterfront.' },
  { name: 'Iron & Oak Fitness', category: 'Gym & Fitness', location: 'Fredericton, NB', days: '4 days', initials: 'IO', accent: '#10B981',
    description: 'Independent strength and conditioning gym for serious athletes and beginners.' },
  { name: 'Ridgeline Lawn & Landscape', category: 'Landscaping', location: 'Sussex, NB', days: '3 days', initials: 'RL', accent: '#22C55E',
    description: 'Full-service lawn care, seasonal cleanup, and landscape design for residential properties.' },
  { name: "Sweet Crumb Bakery", category: 'Bakery', location: 'Saint John, NB', days: '3 days', initials: 'SC', accent: '#EAB308',
    description: 'Artisan breads, pastries, and custom cakes baked fresh daily from local ingredients.' },
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
            First production builds launching soon — portfolio cards below are examples of our build style.
            <Link href="/contact" className="text-orange-400 hover:text-orange-300 ml-2 underline">Be the first client →</Link>
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item, i) => (
              <FadeUp key={item.name} delay={i * 0.08}>
                <div className="card-navy group overflow-hidden flex flex-col h-full">
                  {/* Avatar bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-sans font-bold text-white text-sm"
                      style={{ backgroundColor: item.accent + '22', border: `1px solid ${item.accent}44` }}
                    >
                      <span style={{ color: item.accent }}>{item.initials}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-mono text-xs text-slate-600 bg-navy-700 border border-navy-600 px-2 py-1 rounded-md">
                        React/Next.js
                      </span>
                      <span className="font-mono text-xs text-orange-500/80 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded-md">
                        {item.days}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-sans font-bold text-white text-base mb-1 group-hover:text-orange-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="font-mono text-xs text-slate-600 mb-3">{item.category} · {item.location}</p>
                  <p className="font-sans text-sm text-slate-500 leading-relaxed flex-1">{item.description}</p>

                  <div className="mt-5 pt-4 border-t border-navy-700 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {['Next.js', 'Tailwind', 'Vercel'].map((t) => (
                        <span key={t} className="font-mono text-xs text-slate-600 bg-navy-700 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                    <svg className="text-slate-700 group-hover:text-orange-500 transition-colors" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-800 border-t border-navy-700">
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
