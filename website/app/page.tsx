import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'LeadForge AI — Websites for Local Businesses',
  description:
    'Autonomous outbound lead generation, powered by Claude. We build professional websites for local businesses with no web presence. $650 flat rate. 3–5 day delivery.',
}

const kpis = [
  {
    value: '$650',
    label: 'Flat rate',
    note: 'No hidden fees. No retainers.',
    mono: true,
  },
  {
    value: '3–5',
    label: 'Day delivery',
    note: 'From discovery call to live site.',
    mono: true,
  },
  {
    value: '89%',
    label: 'Margin model',
    note: 'Transparent. AI-native. Lean.',
    mono: true,
  },
]

const problems = [
  {
    icon: '○',
    title: 'No Website',
    description:
      'You lose every customer who Googles your service before picking up the phone. They go to whoever shows up — and it isn\'t you.',
  },
  {
    icon: '◻',
    title: 'Facebook-Only',
    description:
      'A Facebook page isn\'t a business. It\'s rented land. Algorithm changes, policy shifts, or a ban can erase your online presence overnight.',
  },
  {
    icon: '△',
    title: 'Outdated Site',
    description:
      'A website from 2012 tells customers you\'ve stopped caring. Poor mobile experience kills trust before they\'ve read a single word.',
  },
]

const processSteps = [
  { day: 'Day 0', title: 'Discovery Call', desc: 'A 15-minute call to gather your info, goals, and preferences.' },
  { day: 'Day 1–2', title: 'We Build', desc: 'Claude Code scaffolds your Next.js site. You get a Vercel preview link.' },
  { day: 'Day 3', title: 'Review', desc: 'You review the preview and send feedback via email or phone.' },
  { day: 'Day 4', title: 'Revisions', desc: 'We implement your changes and confirm mobile/desktop looks.' },
  { day: 'Day 5', title: 'Launch', desc: 'Payment, domain connection, and code handoff. You own it.' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen bg-brand-dark flex flex-col justify-center overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#C5A55A 1px, transparent 1px), linear-gradient(90deg, #C5A55A 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-brand-gold/30" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="max-w-3xl">
            {/* Label */}
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
              <span className="font-mono text-xs text-white/50 tracking-widest uppercase">
                LeadForge AI — Saint John, NB
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-tight mb-6">
              Autonomous outbound lead generation,{' '}
              <span className="text-brand-gold italic">powered by Claude.</span>
            </h1>

            {/* Subtext */}
            <p className="font-sans text-lg text-white/60 leading-relaxed mb-10 max-w-2xl">
              An AI agent finds local businesses with no web presence. We reach out, build a
              professional site in React/Next.js, and hand it over — all within a week.{' '}
              <span className="text-white/80 font-medium">$650 flat rate. 3–5 day delivery.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-brand-gold text-brand-dark px-8 py-4 font-sans font-semibold text-sm tracking-wide transition-all duration-200 hover:brightness-105 hover:shadow-xl"
              >
                Get Your Site — $650
              </Link>
              <Link
                href="/portfolio"
                className="border border-white/20 text-white px-8 py-4 font-sans font-medium text-sm tracking-wide transition-all duration-200 hover:border-brand-gold/50 hover:bg-white/5"
              >
                See Our Work
              </Link>
            </div>

            {/* Social proof hint */}
            <p className="mt-8 font-mono text-xs text-white/30">
              Built in the same stack we sell — Next.js 14, Tailwind, Vercel
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-8 bg-brand-gold/50" />
          <span className="font-mono text-xs text-white/40 tracking-widest">scroll</span>
        </div>
      </section>

      {/* KPI Strip */}
      <section className="bg-brand-light-gold border-y border-brand-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-brand-gold/20">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="py-6 sm:py-4 sm:px-8 first:pl-0 last:pr-0 text-center sm:text-left">
                <div className="font-mono text-3xl font-semibold text-brand-dark mb-1">
                  {kpi.value}
                </div>
                <div className="font-serif text-lg text-brand-dark mb-1">{kpi.label}</div>
                <div className="font-sans text-xs text-neutral-500">{kpi.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-24 bg-brand-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="section-label block mb-4">The Problem</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-brand-dark max-w-2xl leading-tight">
              Your competitors are searchable.{' '}
              <span className="italic text-brand-gold">Are you?</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div
                key={p.title}
                className="bg-white border border-brand-light-gold p-8 hover:border-brand-gold/30 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 border border-brand-gold/30 flex items-center justify-center mb-6">
                  <span className="font-mono text-brand-gold text-lg">{p.icon}</span>
                </div>
                <h3 className="font-serif text-xl font-medium text-brand-dark mb-3">
                  {p.title}
                </h3>
                <p className="font-sans text-sm text-neutral-600 leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution section */}
      <section className="py-24 bg-white border-y border-brand-light-gold">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label block mb-4">The Solution</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-light text-brand-dark leading-tight mb-6">
                We build it.{' '}
                <span className="italic text-brand-gold">The agent finds you.</span>
              </h2>
              <p className="font-sans text-base text-neutral-600 leading-relaxed mb-6">
                LeadForge AI runs an outbound agent — built on Claude — that scans local directories,
                Google Maps, and social media to find businesses that have no website or an outdated
                one. The agent sends a personalised outreach, generates a mockup, and routes warm
                leads to Neil.
              </p>
              <p className="font-sans text-base text-neutral-600 leading-relaxed mb-8">
                Once you respond, we get on a 15-minute call, build your site in 3–5 days, and hand
                over a fully deployed production codebase. You own everything.
              </p>
              <Link
                href="/process"
                className="inline-flex items-center gap-2 font-sans text-sm font-medium text-brand-dark border-b border-brand-gold pb-px hover:text-brand-gold transition-colors"
              >
                See the full process
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7H12M12 7L8 3M12 7L8 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            {/* Agent workflow visual */}
            <div className="bg-brand-dark p-8 font-mono text-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-white/40 text-xs tracking-widest">AGENT ACTIVE</span>
              </div>
              <div className="space-y-3">
                {[
                  { step: '01', action: 'Scan Google Maps — no website tag', status: 'done' },
                  { step: '02', action: 'Cross-ref Facebook, Yelp, GMB', status: 'done' },
                  { step: '03', action: 'Score lead quality + category', status: 'done' },
                  { step: '04', action: 'Generate personalised outreach', status: 'done' },
                  { step: '05', action: 'Send email + track opens', status: 'active' },
                  { step: '06', action: 'Route warm reply to Neil', status: 'waiting' },
                  { step: '07', action: 'Schedule discovery call', status: 'waiting' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4">
                    <span className="text-white/20 text-xs w-6">{item.step}</span>
                    <span
                      className={`text-xs ${
                        item.status === 'done'
                          ? 'text-brand-accent'
                          : item.status === 'active'
                          ? 'text-brand-gold'
                          : 'text-white/30'
                      }`}
                    >
                      {item.status === 'done' ? '✓' : item.status === 'active' ? '→' : '○'}
                    </span>
                    <span
                      className={`text-xs ${
                        item.status === 'done'
                          ? 'text-white/60'
                          : item.status === 'active'
                          ? 'text-white'
                          : 'text-white/25'
                      }`}
                    >
                      {item.action}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <span className="text-white/20 text-xs">claude-3-5-sonnet · leadforge-agent v1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process preview */}
      <section className="py-24 bg-brand-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="section-label block mb-4">How It Works</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-light text-brand-dark leading-tight">
                From call to launch <span className="italic text-brand-gold">in 5 days.</span>
              </h2>
            </div>
            <Link
              href="/process"
              className="inline-flex items-center gap-2 font-sans text-sm font-medium text-brand-gold border border-brand-gold/30 px-5 py-2.5 hover:bg-brand-light-gold transition-colors flex-shrink-0"
            >
              Full process
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {processSteps.map((step, i) => (
              <div
                key={step.day}
                className="bg-white border border-brand-light-gold p-6 hover:border-brand-gold/30 hover:shadow-sm transition-all duration-200"
              >
                <div className="font-mono text-xs text-brand-gold tracking-wider mb-3">
                  {step.day}
                </div>
                <h3 className="font-serif text-lg font-medium text-brand-dark mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-xs text-neutral-500 leading-relaxed">{step.desc}</p>
                <div className="mt-4 text-brand-dark/20 font-mono text-2xl font-bold">
                  0{i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-24 bg-brand-dark relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#C5A55A 1px, transparent 1px), linear-gradient(90deg, #C5A55A 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="font-mono text-xs text-brand-gold tracking-widest uppercase block mb-4">
              Simple Pricing
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-white leading-tight">
              One price. No surprises.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* $650 card */}
            <div className="bg-white/5 border border-white/10 p-8 hover:border-brand-gold/30 transition-all duration-200">
              <div className="font-mono text-xs text-brand-gold tracking-widest uppercase mb-4">
                Website Build
              </div>
              <div className="font-serif text-5xl text-white font-light mb-2">$650</div>
              <div className="font-sans text-sm text-white/50 mb-6">flat rate, one-time</div>
              <ul className="space-y-2 mb-8">
                {['Fully deployed production site', 'React/Next.js + Vercel', 'Mobile responsive', 'SEO-ready structure', '3–5 day delivery', 'You own the code'].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-brand-accent text-xs">✓</span>
                    <span className="font-sans text-sm text-white/70">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="block w-full text-center bg-brand-gold text-brand-dark py-3 font-sans text-sm font-semibold tracking-wide hover:brightness-105 transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* $75/hr card */}
            <div className="bg-white/5 border border-white/10 p-8 hover:border-brand-gold/30 transition-all duration-200">
              <div className="font-mono text-xs text-brand-gold tracking-widest uppercase mb-4">
                Hourly Updates
              </div>
              <div className="font-serif text-5xl text-white font-light mb-2">$75</div>
              <div className="font-sans text-sm text-white/50 mb-6">per hour · 10-min billing</div>
              <ul className="space-y-2 mb-8">
                {['Content updates', 'New pages', 'Design adjustments', 'Feature additions', 'No minimum', 'Billed to 10-min intervals'].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-brand-accent text-xs">✓</span>
                    <span className="font-sans text-sm text-white/70">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center border border-white/20 text-white py-3 font-sans text-sm font-medium tracking-wide hover:border-brand-gold/50 hover:bg-white/5 transition-all"
              >
                See Full Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20 bg-brand-light-gold border-y border-brand-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-brand-dark mb-6 leading-tight">
            Ready to be found online?
          </h2>
          <p className="font-sans text-base text-neutral-600 mb-8 max-w-xl mx-auto">
            Book a free 15-minute discovery call. No pressure, no commitment — just a conversation
            about what your business needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="bg-brand-dark text-white px-8 py-4 font-sans font-medium text-sm tracking-wide hover:bg-brand-dark/90 hover:shadow-lg transition-all duration-200"
            >
              Book Discovery Call
            </Link>
            <a
              href="tel:5066399083"
              className="border border-brand-dark/30 text-brand-dark px-8 py-4 font-sans font-medium text-sm tracking-wide hover:border-brand-gold hover:bg-white transition-all duration-200"
            >
              Call 506-639-9083
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
