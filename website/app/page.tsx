'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useInView, useMotionValue, animate } from 'framer-motion'

const ScrollHero = dynamic(() => import('@/components/ScrollHero'), { ssr: false })

/* ── Fade-up animation wrapper ─────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Animated counter ──────────────────────────────────────────────────── */
function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const motionVal = useMotionValue(0)
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView) return
    const controls = animate(motionVal, to, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    })
    return controls.stop
  }, [inView, motionVal, to])

  return <span ref={ref}>{prefix}{display}{suffix}</span>
}

/* ── Agent terminal animation ──────────────────────────────────────────── */
const terminalLines = [
  { delay: 0.2, text: '$ leadforge scan --region "Saint John NB"', type: 'cmd' },
  { delay: 0.8, text: '→ Found: Callahan Plumbing — no website', type: 'found' },
  { delay: 1.3, text: '→ Found: Harbour Bistro — Facebook only', type: 'found' },
  { delay: 1.8, text: '→ Found: Iron & Oak Fitness — broken URL', type: 'found' },
  { delay: 2.3, text: '$ leadforge outreach --send --limit 10', type: 'cmd' },
  { delay: 2.9, text: '✓ Email sent → callahan@plumbing.ca', type: 'success' },
  { delay: 3.4, text: '✓ Email sent → info@harbourbistro.ca', type: 'success' },
  { delay: 3.9, text: '✓ Reply received — Callahan: "Interested!"', type: 'reply' },
  { delay: 4.5, text: '$ leadforge mockup --business "Callahan"', type: 'cmd' },
  { delay: 5.1, text: '✓ Mockup generated → routed to Neil', type: 'success' },
]

function AgentTerminal() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    if (!inView) return
    terminalLines.forEach((line, i) => {
      const t = setTimeout(() => setVisibleLines(i + 1), line.delay * 1000)
      return () => clearTimeout(t)
    })
  }, [inView])

  return (
    <div ref={ref} className="relative bg-navy-950 rounded-2xl border border-navy-600 overflow-hidden shadow-navy-lg">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-navy-700 bg-navy-800">
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <span className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="font-mono text-xs text-slate-500 ml-2">leadforge-agent v1.0 — live</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse-slow" />
          <span className="font-mono text-xs text-orange-400">ACTIVE</span>
        </div>
      </div>

      {/* Scan line */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent animate-scan" style={{ zIndex: 2 }} />

      {/* Terminal body */}
      <div className="p-5 font-mono text-xs space-y-2 min-h-[280px]">
        {terminalLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={i < visibleLines ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3 }}
            className={
              line.type === 'cmd' ? 'text-slate-300' :
              line.type === 'found' ? 'text-yellow-400 pl-2' :
              line.type === 'success' ? 'text-green-400 pl-2' :
              'text-orange-400 pl-2'
            }
          >
            {line.text}
            {i === visibleLines - 1 && (
              <span className="animate-cursor ml-0.5 text-orange-500">▋</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-navy-950 to-transparent pointer-events-none" />
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      {/* ── 3D SCROLL HERO ────────────────────────────────────────────── */}
      <ScrollHero />

      {/* ── KPI STRIP ────────────────────────────────────────────────── */}
      <section className="bg-navy-800 border-y border-navy-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-navy-600">
            {[
              { val: 650, prefix: '$', suffix: '', label: 'Flat Rate' },
              { val: 5, prefix: '', suffix: ' days', label: 'Max Delivery' },
              { val: 89, prefix: '', suffix: '%', label: 'Profit Margin' },
              { val: 800, prefix: '', suffix: '+', label: 'Local Leads' },
            ].map((kpi) => (
              <FadeUp key={kpi.label} className="text-center py-4 px-6">
                <div className="font-mono text-3xl font-bold text-orange-500 mb-1">
                  <CountUp to={kpi.val} prefix={kpi.prefix} suffix={kpi.suffix} />
                </div>
                <div className="font-sans text-xs text-slate-500 uppercase tracking-widest">{kpi.label}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────── */}
      <section className="py-28 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="mb-16 max-w-2xl">
            <span className="section-tag mb-4 block">The Problem</span>
            <h2 className="font-sans font-extrabold text-4xl sm:text-5xl text-white leading-tight mb-4">
              Your competitors are{' '}
              <span className="text-gradient-orange">searchable.</span>
              <br />Are you?
            </h2>
            <p className="text-slate-400 text-lg">
              35% of Canadian small businesses have no effective web presence. Every day without a site is a lost customer.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: '○',
                title: 'No Website At All',
                desc: 'You lose every customer who Googles your service. They go to whoever shows up — and it isn\'t you.',
                color: 'from-red-500/10 to-transparent',
                border: 'hover:border-red-500/30',
              },
              {
                icon: '◻',
                title: 'Facebook-Only',
                desc: 'A Facebook page isn\'t a business. It\'s rented land — one algorithm change from invisible.',
                color: 'from-yellow-500/10 to-transparent',
                border: 'hover:border-yellow-500/30',
              },
              {
                icon: '△',
                title: 'Outdated Site',
                desc: 'A 2012 website tells customers you stopped caring. Poor mobile = zero trust before they read a word.',
                color: 'from-orange-500/10 to-transparent',
                border: 'hover:border-orange-500/30',
              },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.12}>
                <div className={`relative card-navy overflow-hidden group ${item.border}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="w-10 h-10 border border-orange-500/30 rounded-lg flex items-center justify-center mb-5">
                      <span className="font-mono text-orange-500 text-lg">{item.icon}</span>
                    </div>
                    <h3 className="font-sans font-bold text-lg text-white mb-3">{item.title}</h3>
                    <p className="font-sans text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────────────────────────── */}
      <section className="py-28 bg-navy-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <span className="section-tag mb-4 block">The Solution</span>
              <h2 className="font-sans font-extrabold text-4xl sm:text-5xl text-white leading-tight mb-6">
                We build it.{' '}
                <span className="text-gradient-orange">The agent finds you.</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-6">
                LeadForge AI runs a Claude-powered agent every weekday morning at 6 AM. It scans local
                directories, Google Maps, and social media to find businesses that need a website.
              </p>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                Once you respond, Neil gets on a 15-minute call, builds your site in 3–5 days using
                React/Next.js, and hands over a fully deployed production codebase. You own everything.
              </p>
              <Link href="/process" className="btn-orange">
                See The Full Process →
              </Link>
            </FadeUp>

            {/* Steps */}
            <div className="space-y-3">
              {[
                { num: '01', title: 'Agent Discovers Lead', desc: 'Scans Google Maps for businesses with no website' },
                { num: '02', title: 'Cold Outreach Sent', desc: 'Personalised email sent via Resend — low friction' },
                { num: '03', title: 'Reply Handled by AI', desc: 'Claude classifies intent, responds automatically' },
                { num: '04', title: 'Mockup Generated', desc: 'Tailored HTML preview built and sent in minutes' },
                { num: '05', title: 'Neil Builds the Site', desc: 'Next.js + Tailwind, live on Vercel in 3–5 days' },
              ].map((step, i) => (
                <FadeUp key={step.num} delay={i * 0.1}>
                  <div className="flex gap-4 items-start card-navy group">
                    <span className="font-mono text-2xl font-bold text-orange-500/30 group-hover:text-orange-500/60 transition-colors flex-shrink-0 leading-none mt-0.5">
                      {step.num}
                    </span>
                    <div>
                      <h4 className="font-sans font-semibold text-white text-sm mb-0.5">{step.title}</h4>
                      <p className="font-sans text-xs text-slate-500">{step.desc}</p>
                    </div>
                    <svg className="ml-auto text-orange-500/0 group-hover:text-orange-500/60 transition-colors flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS PREVIEW ──────────────────────────────────────────── */}
      <section className="py-28 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <FadeUp>
              <span className="section-tag mb-4 block">How It Works</span>
              <h2 className="font-sans font-extrabold text-4xl sm:text-5xl text-white leading-tight">
                Call to launch{' '}
                <span className="text-gradient-orange">in 5 days.</span>
              </h2>
            </FadeUp>
            <FadeUp>
              <Link href="/process" className="btn-outline flex-shrink-0">
                Full process →
              </Link>
            </FadeUp>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-navy-600 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {[
                { day: 'Day 0', title: 'Discovery Call', desc: '15 min — goals, pages, branding' },
                { day: 'Day 1–2', title: 'Claude Builds', desc: 'Next.js scaffolded, Vercel preview' },
                { day: 'Day 3', title: 'You Review', desc: 'Share feedback by email or call' },
                { day: 'Day 4', title: 'Revisions', desc: 'Changes applied, mobile verified' },
                { day: 'Day 5', title: '🚀 Launch', desc: '$650 paid → domain → code handoff' },
              ].map((step, i) => (
                <FadeUp key={step.day} delay={i * 0.1}>
                  <div className="relative card-navy text-center group">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-navy-800 border-2 border-orange-500/40 group-hover:border-orange-500 group-hover:shadow-orange-sm transition-all duration-300" />
                    <div className="font-mono text-xs text-orange-500 mb-3 mt-2">{step.day}</div>
                    <h3 className="font-sans font-bold text-white text-sm mb-2">{step.title}</h3>
                    <p className="font-sans text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ───────────────────────────────────────────── */}
      <section className="py-28 bg-navy-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-orange-500/6 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <span className="section-tag mb-4 justify-center">Simple Pricing</span>
            <h2 className="font-sans font-extrabold text-4xl sm:text-5xl text-white leading-tight">
              One price. <span className="text-gradient-orange">No surprises.</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                label: 'Website Build',
                price: '$650',
                note: 'flat rate · one-time',
                features: ['Fully deployed production site', 'React/Next.js + Tailwind', 'Vercel hosting + SSL', 'Mobile responsive', 'SEO-ready structure', 'You own the code'],
                cta: 'Get Started',
                href: '/contact',
                featured: false,
              },
              {
                label: 'Ongoing Updates',
                price: '$75',
                note: 'per hour · 10-min billing',
                features: ['Content & copy updates', 'New page additions', 'Design adjustments', 'Feature additions', 'No minimum hours', 'Fair prorate billing'],
                cta: 'See Full Pricing',
                href: '/pricing',
                featured: true,
              },
            ].map((card) => (
              <FadeUp key={card.label}>
                <div className={`relative card-navy flex flex-col h-full ${card.featured ? 'border-orange-500/40 bg-gradient-to-br from-orange-500/5 to-navy-800' : ''}`}>
                  {card.featured && (
                    <div className="absolute -top-3 left-6">
                      <span className="bg-orange-500 text-white font-mono text-xs font-bold px-3 py-1 rounded-full">
                        Most Common
                      </span>
                    </div>
                  )}
                  <div className="font-mono text-xs text-orange-500 tracking-widest uppercase mb-3">{card.label}</div>
                  <div className="font-sans font-extrabold text-5xl text-white mb-1">{card.price}</div>
                  <div className="font-sans text-sm text-slate-500 mb-6">{card.note}</div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-orange-500 flex-shrink-0">
                          <path d="M2 7L5.5 10.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-sans text-sm text-slate-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={card.href} className={card.featured ? 'btn-orange w-full justify-center' : 'btn-outline w-full justify-center'}>
                    {card.cta}
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="py-24 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-900/95 to-navy-900" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-orange-500/8 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="font-sans font-extrabold text-4xl sm:text-5xl text-white leading-tight mb-5">
              Ready to be{' '}
              <span className="text-gradient-orange">found online?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Book a free 15-minute discovery call. No pressure, no commitment — just a conversation
              about what your business needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-orange text-base px-8 py-4">
                Book Discovery Call
              </Link>
              <a href="tel:5066399083" className="btn-outline text-base px-8 py-4">
                Call 506-639-9083
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
