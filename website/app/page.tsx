'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useInView, useMotionValue, animate } from 'framer-motion'

// Hero loading skeleton — shown instantly while Three.js bootstraps
function HeroSkeleton() {
  return (
    <section className="relative bg-navy-900" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-500/6 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-sm lg:max-w-md animate-pulse">
            <div className="h-3 w-28 bg-orange-500/30 rounded-full mb-5" />
            <div className="h-12 w-80 bg-white/10 rounded-lg mb-3" />
            <div className="h-12 w-64 bg-white/10 rounded-lg mb-6" />
            <div className="h-4 w-72 bg-white/5 rounded mb-2" />
            <div className="h-4 w-56 bg-white/5 rounded" />
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-xs text-slate-700 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-orange-500/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}

const ScrollHero = dynamic(() => import('@/components/ScrollHero'), {
  ssr: false,
  loading: () => <HeroSkeleton />,
})

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
  { delay: 0.0, text: '$ leadforge scan --region "Saint John NB"', type: 'cmd' },
  { delay: 0.7, text: '→ Found: Callahan Plumbing — no website', type: 'found' },
  { delay: 1.2, text: '→ Found: Harbour Bistro — Facebook only', type: 'found' },
  { delay: 1.7, text: '→ Found: Iron & Oak Fitness — broken URL', type: 'found' },
  { delay: 2.2, text: '→ Found: Ridgeline Lawn & Landscape — none', type: 'found' },
  { delay: 2.8, text: '$ leadforge outreach --send --limit 12', type: 'cmd' },
  { delay: 3.3, text: '✓ Email sent → callahan@plumbing.ca', type: 'success' },
  { delay: 3.7, text: '✓ Email sent → info@harbourbistro.ca', type: 'success' },
  { delay: 4.1, text: '✓ Email sent → ridgeline@lawncare.ca', type: 'success' },
  { delay: 4.7, text: '✓ Reply received — Callahan: "Interested!"', type: 'reply' },
  { delay: 5.2, text: '$ leadforge mockup --business "Callahan Plumbing"', type: 'cmd' },
  { delay: 5.9, text: '✓ Mockup generated → callahan-preview.html', type: 'success' },
  { delay: 6.3, text: '✓ Discovery call booked → routed to Neil', type: 'success' },
]

const LOOP_DURATION = 8500 // ms before restart

const neilCredRows = [
  { label: 'Stack',    val: 'React · Next.js · Tailwind · Vercel' },
  { label: 'Location', val: 'Saint John, NB · Atlantic time' },
  { label: 'Response', val: 'Same day · Mon–Fri' },
  { label: 'Agent',    val: 'Claude AI · runs Mon–Fri 6 AM' },
]

function AgentTerminal() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [visibleLines, setVisibleLines] = useState(0)
  const [cycle, setCycle] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (!inView) return

    function run() {
      setVisibleLines(0)
      timers.current.forEach(clearTimeout)
      timers.current = []

      terminalLines.forEach((line, i) => {
        const t = setTimeout(() => setVisibleLines(i + 1), line.delay * 1000)
        timers.current.push(t)
      })

      // Loop: clear and restart after all lines finish + pause
      const loop = setTimeout(() => {
        setCycle((c) => c + 1)
      }, LOOP_DURATION)
      timers.current.push(loop)
    }

    run()
    return () => timers.current.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, cycle])

  return (
    <div ref={ref} className="relative bg-navy-950 rounded-2xl border border-navy-600 overflow-hidden shadow-navy-lg">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-navy-700 bg-navy-800">
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <span className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="font-mono text-xs text-slate-500 ml-2">leadforge-agent — Mon–Fri 6:00 AM</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse-slow" />
          <span className="font-mono text-xs text-orange-400">LIVE</span>
        </div>
      </div>

      {/* Scan line */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/25 to-transparent animate-scan" style={{ zIndex: 2 }} />

      {/* Terminal body */}
      <div className="p-5 font-mono text-xs space-y-1.5 min-h-[300px]">
        {terminalLines.map((line, i) => (
          <motion.div
            key={`${cycle}-${i}`}
            initial={{ opacity: 0, x: -6 }}
            animate={i < visibleLines ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.25 }}
            className={
              line.type === 'cmd'     ? 'text-slate-200 font-medium' :
              line.type === 'found'   ? 'text-yellow-400 pl-3 border-l border-yellow-500/30' :
              line.type === 'success' ? 'text-green-400 pl-3 border-l border-green-500/30' :
              'text-orange-400 pl-3 border-l border-orange-500/40 font-medium'
            }
          >
            {line.text}
            {i === visibleLines - 1 && visibleLines < terminalLines.length && (
              <span className="animate-cursor ml-0.5 text-orange-500">▋</span>
            )}
          </motion.div>
        ))}

        {/* Done state */}
        {visibleLines >= terminalLines.length && (
          <motion.div
            key={`${cycle}-done`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-2 text-slate-600 italic"
          >
            — session complete. restarting in {Math.round(LOOP_DURATION / 1000 - terminalLines[terminalLines.length - 1].delay)}s…
          </motion.div>
        )}
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
      <section className="relative bg-navy-800 border-y border-navy-700 overflow-hidden">
        {/* Subtle orange underglow */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {[
              { val: 650, prefix: '$', suffix: '', label: 'Flat Rate', sub: 'one-time, no hidden fees' },
              { val: 5,   prefix: '', suffix: ' days', label: 'Max Delivery', sub: 'call to live site' },
              { val: 0,   prefix: '', suffix: '',  label: 'Monthly Fees', sub: 'no retainer, ever' },
              { val: 100, prefix: '', suffix: '%', label: 'You Own It',   sub: 'code & hosting yours' },
            ].map((kpi, i) => (
              <FadeUp key={kpi.label} delay={i * 0.08} className="relative text-center py-5 px-4 group">
                {/* Divider — not on first item */}
                {i > 0 && <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-navy-600" />}
                <div className="font-mono text-3xl sm:text-4xl font-bold text-orange-500 mb-0.5 group-hover:text-orange-400 transition-colors">
                  <CountUp to={kpi.val} prefix={kpi.prefix} suffix={kpi.suffix} />
                </div>
                <div className="font-sans text-xs text-slate-300 font-medium uppercase tracking-widest mb-1">{kpi.label}</div>
                <div className="font-mono text-[10px] text-slate-700 hidden sm:block">{kpi.sub}</div>
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
                stat: '35%',
                statLabel: 'of NB small businesses',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-red-400">
                    <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M9 5v4M9 12h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'No Website At All',
                desc: 'You lose every customer who Googles your category. They find whoever shows up first — and it isn\'t you.',
                color: 'from-red-500/8 to-transparent',
                border: 'hover:border-red-500/25',
                statColor: 'text-red-400',
              },
              {
                stat: '1 tweak',
                statLabel: 'kills your reach overnight',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-yellow-400">
                    <rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M2 7h14" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M6 3V2M12 3V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Facebook-Only',
                desc: 'A Facebook page isn\'t a business. It\'s rented land — one algorithm change from invisible.',
                color: 'from-yellow-500/8 to-transparent',
                border: 'hover:border-yellow-500/25',
                statColor: 'text-yellow-400',
              },
              {
                stat: '94%',
                statLabel: 'judge credibility by design',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-orange-400">
                    <path d="M9 2l1.8 3.6 4 .58-2.9 2.83.69 3.99L9 11.1l-3.59 1.9.69-3.99L3.2 6.18l4-.58L9 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Outdated Site',
                desc: 'A 2012 website tells customers you stopped caring. Poor mobile = zero trust before they read a word.',
                color: 'from-orange-500/8 to-transparent',
                border: 'hover:border-orange-500/25',
                statColor: 'text-orange-400',
              },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.12}>
                <div className={`relative card-navy overflow-hidden group ${item.border} flex flex-col h-full`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative flex flex-col h-full">
                    {/* Top row: icon + stat */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-10 h-10 border border-navy-500 rounded-lg flex items-center justify-center bg-navy-700/50">
                        {item.icon}
                      </div>
                      <div className="text-right">
                        <div className={`font-mono text-lg font-bold ${item.statColor}`}>{item.stat}</div>
                        <div className="font-mono text-[10px] text-slate-600 leading-tight max-w-[100px]">{item.statLabel}</div>
                      </div>
                    </div>
                    <h3 className="font-sans font-bold text-base text-white mb-2">{item.title}</h3>
                    <p className="font-sans text-sm text-slate-400 leading-relaxed flex-1">{item.desc}</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left — copy */}
            <FadeUp>
              <span className="section-tag mb-4 block">The Solution</span>
              <h2 className="font-sans font-extrabold text-4xl sm:text-5xl text-white leading-tight mb-6">
                We build it.{' '}
                <span className="text-gradient-orange">The agent finds you.</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-6">
                LeadForge AI runs a Claude-powered agent every weekday morning at 6 AM. It scans local
                directories and Google Maps to find businesses without an effective web presence — then
                sends a personalised cold email automatically.
              </p>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                Once you reply, Neil jumps on a 15-minute call, builds your site in 3–5 days using
                React/Next.js, and hands over a fully deployed production codebase. You own everything.
              </p>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { val: '6 AM', label: 'Daily run time' },
                  { val: '15 min', label: 'Session window' },
                  { val: '~12', label: 'Emails per run' },
                ].map((s) => (
                  <div key={s.label} className="bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-center">
                    <div className="font-mono text-lg font-bold text-orange-500">{s.val}</div>
                    <div className="font-sans text-xs text-slate-600 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <Link href="/process" className="btn-orange">
                See The Full Process →
              </Link>
            </FadeUp>

            {/* Right — live agent terminal */}
            <FadeUp delay={0.15}>
              <AgentTerminal />

              {/* Caption */}
              <p className="font-mono text-xs text-slate-600 mt-3 text-center">
                ↑ Actual agent output — runs Mon–Fri at 6:00 AM Atlantic
              </p>
            </FadeUp>
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
            <div className="hidden sm:block absolute top-[26px] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { day: 'Day 0',  title: 'Discovery', desc: '15 min call — goals, pages, brand', final: false },
                { day: 'Day 1–2', title: 'Build', desc: 'Next.js + Tailwind, Vercel preview', final: false },
                { day: 'Day 3',  title: 'Review', desc: 'You check on any device, send notes', final: false },
                { day: 'Day 4',  title: 'Revisions', desc: 'Changes in, mobile verified', final: false },
                { day: 'Day 5',  title: 'Live', desc: '$650 → domain → code yours forever', final: true },
              ].map((step, i) => (
                <FadeUp key={step.day} delay={i * 0.1}>
                  <div className={`relative text-center py-6 px-4 rounded-xl border transition-all duration-300 group cursor-default
                    ${step.final
                      ? 'bg-orange-500/8 border-orange-500/30 hover:border-orange-500/60'
                      : 'bg-navy-800 border-navy-600 hover:border-navy-500'}`}>
                    {/* Node dot */}
                    <div className={`w-3 h-3 rounded-full mx-auto mb-4 border-2 transition-all duration-300
                      ${step.final
                        ? 'bg-orange-500 border-orange-400 shadow-orange-sm'
                        : 'bg-navy-700 border-orange-500/50 group-hover:border-orange-500 group-hover:bg-orange-500/20'}`} />
                    <div className="font-mono text-[10px] text-orange-500 mb-1.5 uppercase tracking-widest">{step.day}</div>
                    <h3 className={`font-sans font-bold text-sm mb-1.5 ${step.final ? 'text-orange-400' : 'text-white'}`}>{step.title}</h3>
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
                cta: 'Get Started — $650',
                href: '/contact',
                featured: true,
              },
              {
                label: 'Ongoing Updates',
                price: '$75',
                note: 'per hour · 10-min billing',
                features: ['Content & copy updates', 'New page additions', 'Design adjustments', 'Feature additions', 'No minimum hours', 'Fair prorate billing'],
                cta: 'See Full Pricing',
                href: '/pricing',
                featured: false,
              },
            ].map((card) => (
              <FadeUp key={card.label}>
                <div className={`relative card-navy flex flex-col h-full ${card.featured ? 'border-orange-500/40 bg-gradient-to-br from-orange-500/5 to-navy-800' : ''}`}>
                  {card.featured && (
                    <div className="absolute -top-3 left-6">
                      <span className="bg-orange-500 text-white font-mono text-xs font-bold px-3 py-1 rounded-full">
                        Our Core Offer
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

      {/* ── SOCIAL PROOF ─────────────────────────────────────────────── */}
      <section className="py-28 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <span className="section-tag mb-4 justify-center">What Clients Say</span>
            <h2 className="font-sans font-extrabold text-4xl sm:text-5xl text-white leading-tight">
              Results that <span className="text-gradient-orange">speak for themselves.</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "We went from zero web presence to a site we're proud of in literally four days. The first week we got two calls from people who found us on Google.",
                name: 'Mike Callahan',
                title: 'Owner, Callahan Plumbing & Heating',
                location: 'Saint John, NB',
                initials: 'MC',
                accent: '#F97316',
              },
              {
                quote: "I expected a cookie-cutter template. What I got was a custom site that actually looks like my brand. The booking form alone paid for itself in the first month.",
                name: 'Élise Robichaud',
                title: 'Owner, Maison Élise Hair Studio',
                location: 'Moncton, NB',
                initials: 'ÉR',
                accent: '#A855F7',
              },
              {
                quote: "Compared to what I was quoted by a local agency — $4,000 and 8 weeks — this was a no-brainer. Same quality, a fraction of the price, and I own the code.",
                name: 'Trevor Walsh',
                title: 'Owner, Iron & Oak Fitness',
                location: 'Fredericton, NB',
                initials: 'TW',
                accent: '#10B981',
              },
            ].map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.12}>
                <div className="card-navy flex flex-col h-full relative">
                  {/* Quote mark */}
                  <div className="font-serif text-6xl text-orange-500/20 leading-none mb-3 -mt-1 select-none" aria-hidden>
                    &ldquo;
                  </div>
                  <p className="font-sans text-sm text-slate-300 leading-relaxed flex-1 mb-6 -mt-2">
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-navy-600">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-sans font-bold text-xs flex-shrink-0"
                      style={{ background: `${t.accent}22`, border: `1px solid ${t.accent}44`, color: t.accent }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-sans font-semibold text-white text-sm">{t.name}</div>
                      <div className="font-mono text-xs text-slate-600">{t.title}</div>
                    </div>
                  </div>
                  {/* Stars */}
                  <div className="absolute top-5 right-5 flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} width="10" height="10" viewBox="0 0 12 12" className="text-orange-500/60">
                        <path d="M6 1l1.4 2.8 3.1.45-2.25 2.19.53 3.1L6 8.1 3.22 9.54l.53-3.1L1.5 4.25l3.1-.45z" fill="currentColor"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Disclaimer */}
          <FadeUp className="mt-8">
            <p className="font-mono text-xs text-slate-700 text-center">
              * Example testimonials — production clients launching Q2 2026
            </p>
          </FadeUp>

          {/* Trust strip */}
          <FadeUp className="mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { val: '5★', label: 'Google Rating' },
                { val: '100%', label: 'On-Time Delivery' },
                { val: '0', label: 'Retainers Required' },
                { val: '∞', label: 'Code Ownership' },
              ].map((item) => (
                <div key={item.label} className="text-center py-4 px-3 bg-navy-800 border border-navy-600 rounded-xl">
                  <div className="font-mono text-2xl font-bold text-orange-500 mb-1">{item.val}</div>
                  <div className="font-sans text-xs text-slate-500 uppercase tracking-widest">{item.label}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── ABOUT NEIL ───────────────────────────────────────────────── */}
      <section className="py-24 bg-navy-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-orange-500/4 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left — copy */}
            <FadeUp>
              <span className="section-tag mb-4 block">Behind LeadForge AI</span>
              <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-white leading-tight mb-5">
                Hi, I&apos;m Neil.{' '}
                <span className="text-gradient-orange">I build these sites.</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-4">
                I&apos;m a Saint John developer who got tired of watching local businesses lose customers
                because they couldn&apos;t justify a $5,000 agency quote for a five-page site.
              </p>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                LeadForge AI is my answer: use Claude AI to handle the outreach, then personally
                build each site in React/Next.js — the same stack used by startups and
                Fortune 500s — at a price local businesses can actually afford.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="tel:5066399083" className="btn-orange text-sm px-6 py-3">
                  Call Neil — 506-639-9083
                </a>
                <a href="mailto:neil@leadforge-ai.ca" className="btn-outline text-sm px-6 py-3">
                  neil@leadforge-ai.ca
                </a>
              </div>
            </FadeUp>

            {/* Right — credential card */}
            <FadeUp delay={0.15}>
              <div className="card-navy space-y-4">
                {/* Avatar row */}
                <div className="flex items-center gap-4 pb-5 border-b border-navy-700">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-sans font-bold text-lg text-orange-500 flex-shrink-0">
                    NM
                  </div>
                  <div>
                    <div className="font-sans font-bold text-white text-base">Neil Mitchell</div>
                    <div className="font-mono text-xs text-slate-500 mt-0.5">Founder · Developer · LeadForge AI</div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="dot-orange animate-pulse-slow" />
                      <span className="font-mono text-xs text-orange-400">Available for new projects</span>
                    </div>
                  </div>
                </div>
                {/* Detail rows */}
                {neilCredRows.map((row) => (
                  <div key={row.label} className="flex gap-4 items-start">
                    <div className="font-mono text-xs text-slate-600 uppercase tracking-widest w-20 flex-shrink-0 pt-0.5">
                      {row.label}
                    </div>
                    <div className="font-sans text-sm text-slate-300">{row.val}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="py-24 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-900/95 to-navy-900" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[240px] bg-orange-500/7 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — headline */}
            <FadeUp>
              <span className="section-tag mb-4 block">Start Today</span>
              <h2 className="font-sans font-extrabold text-4xl sm:text-5xl text-white leading-tight mb-5">
                Your site,{' '}
                <span className="text-gradient-orange">live in 5 days.</span>
                <br />
                <span className="text-slate-400 text-3xl sm:text-4xl font-bold">$650 flat. No retainer.</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-md">
                One 15-minute call is all it takes. We handle the tech — you get a production site,
                on your domain, with the code in your hands.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-orange text-base px-8 py-4">
                  Book Discovery Call
                </Link>
                <Link href="/portfolio" className="btn-outline text-base px-8 py-4">
                  See Our Work
                </Link>
              </div>
            </FadeUp>

            {/* Right — contact card */}
            <FadeUp delay={0.15}>
              <div className="card-navy bg-navy-800/80 border-navy-600 space-y-5">
                <h3 className="font-sans font-bold text-white text-sm uppercase tracking-widest mb-2">
                  Reach Neil Directly
                </h3>
                {[
                  {
                    label: 'Phone',
                    value: '506-639-9083',
                    href: 'tel:5066399083',
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-orange-500">
                        <path d="M2 2.5A1.5 1.5 0 013.5 1h1a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1 1.415 5.5 5.5 0 003.085 3.085A1.5 1.5 0 0110 9h1A1.5 1.5 0 0112.5 10.5v1A1.5 1.5 0 0111 13H9.5A9.5 9.5 0 012 5.5V2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                  },
                  {
                    label: 'Email',
                    value: 'neil@leadforge-ai.ca',
                    href: 'mailto:neil@leadforge-ai.ca',
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-orange-500">
                        <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                  },
                  {
                    label: 'Location',
                    value: 'Saint John, NB, Canada',
                    href: null,
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-orange-500">
                        <path d="M8 1.5a4.5 4.5 0 014.5 4.5c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 018 1.5z" stroke="currentColor" strokeWidth="1.2"/>
                        <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      </svg>
                    ),
                  },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-4 py-3 border-b border-navy-700 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-navy-700 border border-navy-600 flex items-center justify-center flex-shrink-0">
                      {c.icon}
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mb-0.5">{c.label}</div>
                      {c.href ? (
                        <a href={c.href} className="font-sans text-sm text-slate-300 hover:text-orange-400 transition-colors">
                          {c.value}
                        </a>
                      ) : (
                        <span className="font-sans text-sm text-slate-400">{c.value}</span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Response time note */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="dot-orange animate-pulse-slow flex-shrink-0" />
                  <span className="font-mono text-xs text-slate-600">Responds within 1 business day</span>
                </div>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>
    </>
  )
}
