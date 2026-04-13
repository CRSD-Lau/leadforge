import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Process',
  description:
    'From discovery call to live site in 5 days. See exactly how LeadForge AI builds your website — and how the AI agent found you.',
}

const timeline = [
  {
    day: 'Day 0',
    title: 'Discovery Call',
    subtitle: '15–20 minutes · Call 506-639-9083',
    description:
      'We get on a quick call to discuss your business goals, design preferences, required pages, and branding assets. No lengthy brief, no complicated forms — just a conversation. By the end we know everything needed to start building.',
    detail: 'Call 506-639-9083 or respond to the outreach email to book.',
  },
  {
    day: 'Day 1–2',
    title: 'We Build',
    subtitle: 'Claude Code scaffolds your site',
    description:
      'Claude Code scaffolds the entire Next.js project — page components, Tailwind styling, mobile layout, and contact form. Once built, your site deploys automatically to Vercel and you receive a preview URL to review.',
    detail: 'Tech: Next.js 14 · Tailwind CSS · Vercel · React',
  },
  {
    day: 'Day 3',
    title: 'You Review',
    subtitle: 'Vercel preview link shared',
    description:
      'You visit your preview site on any device and send feedback by email or phone. One full revision round is included. Note what you'd like changed — copy, colours, layout, images.',
    detail: 'Additional revisions beyond round 1: $75/hr, prorated to 10-min.',
  },
  {
    day: 'Day 4',
    title: 'Revisions',
    subtitle: 'Feedback implemented',
    description:
      'We implement your changes, verify mobile responsiveness across breakpoints, confirm the contact form works, and finalise all copy. Updated preview link sent for final sign-off.',
    detail: 'Mobile, tablet, and desktop verified before final approval.',
  },
  {
    day: 'Day 5',
    title: 'Launch',
    subtitle: 'Payment · Domain · Handoff',
    description:
      'You pay $650. We connect your domain, push the site live, and transfer the GitHub repo and Vercel project to you. You own the code and hosting — we hand over everything.',
    detail: 'Domain purchase: you buy it (~$15/yr), we configure DNS for free.',
  },
]

const agentSteps = [
  {
    num: '01',
    title: 'Lead Discovery',
    desc: 'Queries Google Maps using category-based searches across the Saint John region. Detects businesses with no website, broken URL, or social-only presence.',
  },
  {
    num: '02',
    title: 'Cold Outreach',
    desc: 'Crafts and sends a personalised email using your business name and category. Low-friction, direct — the goal is a reply, not a hard sell.',
  },
  {
    num: '03',
    title: 'Lead Tracking',
    desc: 'Every outreach event is recorded to a structured database. Statuses track the full funnel: Sent → Replied → Interested → Closed Won.',
  },
  {
    num: '04',
    title: 'Reply Handling',
    desc: 'Reads inbound replies, classifies intent (interested, question, price objection, unsure, not interested), and generates an appropriate response.',
  },
  {
    num: '05',
    title: 'Mockup Generation',
    desc: 'Generates a rough HTML mockup — hero, services, contact — tailored to your business category for interested leads.',
  },
  {
    num: '06',
    title: 'Close Flow',
    desc: 'Sends a closing message routing directly to a discovery call: 506-639-9083.',
  },
  {
    num: '07',
    title: 'Terms Explanation',
    desc: 'Communicates ownership, delivery timeline, and pricing clearly. React/Next.js build, Vercel deployment, code transfer on payment.',
  },
]

const stack = [
  { name: 'Claude AI (Anthropic)', role: 'Agent runtime + site builds' },
  { name: 'Google Maps API', role: 'Lead discovery — finds businesses without websites' },
  { name: 'Resend', role: 'Outbound email — free tier, 3,000 sends/month' },
  { name: 'SQLite', role: 'Lead database — no hosting cost' },
  { name: 'Next.js 14', role: 'Client deliverable tech stack' },
  { name: 'Tailwind CSS', role: 'Styling for all client sites' },
  { name: 'Vercel', role: 'Deployment — free tier, CDN + SSL included' },
  { name: 'GitHub Actions', role: 'Cron scheduler — fires Mon–Fri 6:00 AM' },
]

export default function ProcessPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-brand-dark pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label block mb-4">How It Works</span>
          <h1 className="font-serif text-5xl sm:text-6xl font-light text-white leading-tight mb-6">
            Discovery call to live site{' '}
            <span className="text-brand-gold italic">in five days.</span>
          </h1>
          <p className="font-sans text-base text-white/60 max-w-2xl leading-relaxed">
            A transparent, step-by-step process. No surprises, no scope creep — just a professional
            site delivered fast.
          </p>
        </div>
      </section>

      {/* 5-Day Timeline */}
      <section className="py-24 bg-brand-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[52px] top-0 bottom-0 w-px bg-brand-gold/20 hidden sm:block" />

            <div className="space-y-0">
              {timeline.map((step, i) => (
                <div key={step.day} className="relative flex gap-8 sm:gap-12">
                  {/* Day label */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-[104px] text-right">
                      <span className="font-mono text-xs text-brand-gold tracking-widest uppercase">
                        {step.day}
                      </span>
                    </div>
                    {/* Dot on timeline */}
                    <div className="w-3 h-3 rounded-full border-2 border-brand-gold bg-brand-bg hidden sm:block absolute left-[46px]" />
                  </div>

                  {/* Content */}
                  <div className={`pb-12 flex-1 ${i === timeline.length - 1 ? 'pb-0' : ''}`}>
                    <div className="bg-white border border-brand-light-gold p-8 hover:border-brand-gold/30 hover:shadow-sm transition-all duration-200">
                      <h3 className="font-serif text-2xl font-medium text-brand-dark mb-1">
                        {step.title}
                      </h3>
                      <p className="font-mono text-xs text-brand-gold mb-4">{step.subtitle}</p>
                      <p className="font-sans text-sm text-neutral-600 leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <div className="border-t border-brand-light-gold pt-4">
                        <p className="font-sans text-xs text-neutral-400">{step.detail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How the agent found you */}
      <section className="py-24 bg-brand-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="section-label block mb-4">Behind the Scenes</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-white leading-tight">
              How the agent <span className="text-brand-gold italic">found you.</span>
            </h2>
            <p className="font-sans text-base text-white/50 mt-4 max-w-2xl">
              LeadForge AI runs a Claude-powered agent every weekday morning at 6:00 AM. It runs for
              15 minutes and handles every step of the outbound sales cycle — automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentSteps.map((step) => (
              <div
                key={step.num}
                className="bg-white/5 border border-white/10 p-6 hover:border-brand-gold/30 transition-all duration-200"
              >
                <div className="font-mono text-2xl font-bold text-brand-gold/20 mb-3">
                  {step.num}
                </div>
                <h4 className="font-serif text-lg font-medium text-white mb-2">{step.title}</h4>
                <p className="font-sans text-sm text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-brand-accent/10 border border-brand-accent/20 p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
              <span className="font-mono text-xs text-brand-accent tracking-widest uppercase">
                Agent Status
              </span>
            </div>
            <p className="font-sans text-sm text-white/70">
              Running Mon–Fri · 6:00 AM Atlantic · 15-minute window · Powered by Claude Sonnet
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-white border-y border-brand-light-gold">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-light text-brand-dark mb-10">
            Every layer <span className="text-brand-gold italic">purpose-built.</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stack.map((item) => (
              <div key={item.name} className="border-l-2 border-brand-gold/30 pl-4 py-1">
                <div className="font-sans text-sm font-semibold text-brand-dark mb-1">
                  {item.name}
                </div>
                <div className="font-sans text-xs text-neutral-500">{item.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-light-gold">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-light text-brand-dark mb-4">
            Ready to start?
          </h2>
          <p className="font-sans text-base text-neutral-600 mb-8">
            Book a free discovery call — 15 minutes is all we need.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="bg-brand-dark text-white px-8 py-4 font-sans font-medium text-sm tracking-wide hover:bg-brand-dark/90 transition-all"
            >
              Book Discovery Call
            </Link>
            <a
              href="tel:5066399083"
              className="border border-brand-dark/30 text-brand-dark px-8 py-4 font-sans font-medium text-sm tracking-wide hover:border-brand-gold transition-all"
            >
              Call 506-639-9083
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
