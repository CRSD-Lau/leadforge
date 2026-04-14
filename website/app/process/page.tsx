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

const timeline = [
  { day: 'Day 0', title: 'Discovery Call', subtitle: '15–20 min · 506-639-9083',
    description: "We get on a quick call to discuss your business goals, design preferences, required pages, and branding assets. No lengthy brief — just a conversation. By the end we know everything needed to start.",
    detail: 'Call or reply to our outreach email to book.' },
  { day: 'Day 1–2', title: 'We Build', subtitle: 'Claude Code scaffolds your site',
    description: 'Claude Code scaffolds the entire Next.js project — page components, Tailwind styling, mobile layout, contact form. Once built, your site deploys to Vercel and you get a preview URL.',
    detail: 'Stack: Next.js 14 · Tailwind CSS · Vercel · React' },
  { day: 'Day 3', title: 'You Review', subtitle: 'Vercel preview link shared',
    description: "Visit your preview site on any device and send feedback by email or phone. One full revision round is included. Note what you'd like changed — copy, colours, layout, images.",
    detail: 'Additional revisions beyond round 1: $75/hr, prorated to 10-min.' },
  { day: 'Day 4', title: 'Revisions', subtitle: 'Feedback implemented',
    description: 'We implement your changes, verify mobile responsiveness across breakpoints, confirm the contact form works, and finalise copy. Updated preview link sent for final sign-off.',
    detail: 'Mobile, tablet, and desktop verified before final approval.' },
  { day: 'Day 5', title: '🚀 Launch', subtitle: 'Payment · Domain · Handoff',
    description: 'You pay $650. We connect your domain, push the site live, and transfer the GitHub repo and Vercel project to you. You own the code and hosting.',
    detail: 'Domain: you buy it (~$15/yr), we configure DNS for free.' },
]

const agentSteps = [
  { num: '01', title: 'Lead Discovery', desc: 'Queries Google Maps for businesses with no website, broken URL, or social-only presence.' },
  { num: '02', title: 'Cold Outreach', desc: 'Personalised email sent using your business name and category. Low friction — the goal is a reply.' },
  { num: '03', title: 'Lead Tracking', desc: 'Every event recorded to SQLite. Status tracks: Sent → Replied → Interested → Closed Won.' },
  { num: '04', title: 'Reply Handling', desc: 'Claude classifies intent into 5 buckets and generates an appropriate conversational response.' },
  { num: '05', title: 'Mockup Generation', desc: 'Tailored HTML preview — hero, services, contact — built for your business category in minutes.' },
  { num: '06', title: 'Close Flow', desc: 'Booking message sent routing to 506-639-9083 for a discovery call.' },
  { num: '07', title: 'Terms Explanation', desc: 'Communicates ownership, delivery, and pricing clearly before Neil gets involved.' },
]

const stack = [
  { name: 'Claude AI (Anthropic)', role: 'Agent runtime + site builds' },
  { name: 'Google Maps API', role: 'Lead discovery — no-website detection' },
  { name: 'Resend', role: 'Outbound email — 3,000/month free tier' },
  { name: 'SQLite', role: 'Lead database — zero hosting cost' },
  { name: 'Next.js 14', role: 'Client deliverable tech stack' },
  { name: 'Tailwind CSS', role: 'Styling for all client sites' },
  { name: 'Vercel', role: 'Deployment — CDN + SSL included' },
  { name: 'GitHub Actions', role: 'Cron scheduler — Mon–Fri 6:00 AM' },
]

export default function ProcessPage() {
  return (
    <>
      {/* Header */}
      <section className="relative bg-navy-900 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/6 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-tag mb-4 block">How It Works</span>
            <h1 className="font-sans font-extrabold text-5xl sm:text-6xl text-white leading-tight mb-5">
              Call to launch{' '}
              <span className="text-gradient-orange">in five days.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              A transparent, step-by-step process. No surprises, no scope creep — just a professional site delivered fast.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 5-Day Timeline */}
      <section className="py-24 bg-navy-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Vertical connector */}
            <div className="absolute left-5 sm:left-6 top-6 bottom-6 w-px bg-gradient-to-b from-orange-500/60 via-navy-600 to-transparent hidden sm:block" />

            <div className="space-y-5">
              {timeline.map((step, i) => (
                <FadeUp key={step.day} delay={i * 0.1}>
                  <div className="flex gap-6 sm:gap-8 items-start">
                    {/* Node */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-mono text-xs font-bold border ${
                        i === 4
                          ? 'bg-orange-500 border-orange-600 text-white shadow-orange-md'
                          : 'bg-navy-800 border-navy-600 text-orange-500'
                      }`}>
                        {i + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="card-navy flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-sans font-bold text-white text-lg">{step.title}</h3>
                          <p className="font-mono text-xs text-orange-500 mt-0.5">{step.subtitle}</p>
                        </div>
                        <span className="font-mono text-xs text-slate-600 bg-navy-700 border border-navy-600 px-2.5 py-1 rounded-lg flex-shrink-0 ml-4">{step.day}</span>
                      </div>
                      <p className="font-sans text-sm text-slate-400 leading-relaxed mb-3">{step.description}</p>
                      <p className="font-sans text-xs text-slate-600 border-t border-navy-700 pt-3">{step.detail}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Agent steps */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="mb-14">
            <span className="section-tag mb-4 block">Behind The Scenes</span>
            <h2 className="font-sans font-extrabold text-4xl sm:text-5xl text-white leading-tight">
              How the agent <span className="text-gradient-orange">found you.</span>
            </h2>
            <p className="text-slate-400 text-base mt-4 max-w-2xl">
              LeadForge AI runs a Claude-powered agent every weekday at 6:00 AM. It handles the entire outbound sales cycle — automatically, in 15 minutes.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {agentSteps.map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.08}>
                <div className="card-navy group h-full">
                  <div className="font-mono text-3xl font-bold text-orange-500/20 group-hover:text-orange-500/40 transition-colors mb-3">{step.num}</div>
                  <h4 className="font-sans font-bold text-white text-sm mb-2">{step.title}</h4>
                  <p className="font-sans text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </FadeUp>
            ))}

            {/* Status card */}
            <FadeUp delay={agentSteps.length * 0.08}>
              <div className="card-navy h-full bg-orange-500/5 border-orange-500/20 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="dot-orange animate-pulse-slow" />
                  <span className="font-mono text-xs text-orange-400 uppercase tracking-widest">Live</span>
                </div>
                <p className="font-sans text-xs text-slate-400 leading-relaxed">
                  Running Mon–Fri · 6:00 AM Atlantic · 15-min window · Claude Sonnet
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-20 bg-navy-800 border-y border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="mb-10">
            <h2 className="font-sans font-bold text-2xl text-white">
              Every layer <span className="text-gradient-orange">purpose-built.</span>
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stack.map((item, i) => (
              <FadeUp key={item.name} delay={i * 0.06}>
                <div className="flex gap-3 items-start">
                  <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-orange-500/0 rounded-full flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-sans text-sm font-semibold text-white mb-0.5">{item.name}</div>
                    <div className="font-sans text-xs text-slate-500">{item.role}</div>
                  </div>
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
              Ready to start?
            </h2>
            <p className="text-slate-400 mb-8">15-minute discovery call is all we need.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-orange text-base px-8 py-4">Book Discovery Call</Link>
              <a href="tel:5066399083" className="btn-outline text-base px-8 py-4">Call 506-639-9083</a>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
