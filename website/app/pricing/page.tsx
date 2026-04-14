'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import PricingCard from '@/components/PricingCard'

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

const compRows = [
  { label: 'Cost',         lf: '$650 flat',        diy: '$15–25/mo forever', freelancer: '$1,500–5,000+',  agency: '$5,000–20,000+' },
  { label: 'Delivery',     lf: '3–5 days',         diy: 'Self-serve (weeks)', freelancer: '4–12 weeks',    agency: '8–24 weeks' },
  { label: 'Tech stack',   lf: 'React / Next.js',  diy: 'Drag-drop builder',  freelancer: 'Varies',        agency: 'Usually custom' },
  { label: 'You own it',   lf: '✓ Full codebase',  diy: '✗ Platform lock-in', freelancer: '✓ Usually',     agency: '~ Sometimes' },
  { label: 'Ongoing cost', lf: '$75/hr as needed', diy: '$15–25/mo + apps',  freelancer: '$75–150/hr',     agency: '$500–3,000/mo' },
  { label: 'SEO ready',    lf: '✓ Built in',       diy: '~ Plugin required',  freelancer: '~ Varies',      agency: '✓ Usually' },
]

const faqs = [
  { q: 'Do I own the website after it\'s built?', a: 'Yes — fully. On payment, the GitHub repo and Vercel project transfer to you. You control hosting, code, and everything else.' },
  { q: 'What if I need changes after launch?', a: 'Post-launch updates are $75/hr, billed to the 10-minute interval. No minimum. No retainer. Just book time as you need it.' },
  { q: 'Do I need to buy a domain?', a: 'Yes — you purchase your own domain (~$15/yr from Namecheap or GoDaddy). We configure the DNS for free as part of the launch process.' },
  { q: 'What\'s included in the $650?', a: 'Full Next.js site, Tailwind styling, Vercel deployment, SSL, CDN, mobile responsiveness, SEO structure, contact form, and one revision round.' },
  { q: 'How fast is 3–5 days really?', a: 'It\'s real. Day 0 is the call. Day 1–2 is the build. Day 3 is review. Day 4 revisions. Day 5 launch. We keep scope tight to hit that window every time.' },
]

export default function PricingPage() {
  return (
    <>
      <section className="relative bg-navy-900 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/6 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-tag mb-4 block">Pricing</span>
            <h1 className="font-sans font-extrabold text-5xl sm:text-6xl text-white leading-tight mb-5">
              Simple. Flat.{' '}
              <span className="text-gradient-orange">No surprises.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              One price for a complete production website. No retainers, no monthly fees, no hidden costs.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeUp delay={0}>
              <PricingCard title="Website Build" price="$650" priceNote="flat rate · one-time"
                description="A complete production website, deployed and handed over. One revision round included."
                features={['Fully deployed production site','React/Next.js + Tailwind CSS','Vercel CDN + SSL','Mobile responsive','SEO-friendly structure','3–5 business day delivery']}
                cta="Get Started" ctaHref="/contact" />
            </FadeUp>
            <FadeUp delay={0.1}>
              <PricingCard title="Build + Support" price="$650 + $75/hr" priceNote="build + ongoing"
                description="Everything in the build package, plus priority access to hourly updates post-launch."
                features={['Everything in Website Build','Post-launch updates at $75/hr','Billed to 10-minute interval','No minimum commitment','Priority response','Fair prorate billing']}
                cta="Most Popular — Start Here" ctaHref="/contact" featured badge="Most Common" />
            </FadeUp>
            <FadeUp delay={0.2}>
              <PricingCard title="Hourly Updates" price="$75" priceNote="per hour"
                description="Already have a site? Book time for content updates, new pages, or feature additions."
                features={['Content & copy updates','New page additions','Design adjustments','Feature additions','No monthly retainer','Prorated to 10-min intervals']}
                cta="Book Update Time" ctaHref="/contact" />
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="py-24 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="mb-12">
            <span className="section-tag mb-4 block">Market Comparison</span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-white">Where $650 sits in the market.</h2>
          </FadeUp>
          <FadeUp>
            <div className="overflow-x-auto rounded-xl border border-navy-600">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy-800 border-b border-navy-600">
                    <th className="text-left px-5 py-4 font-mono text-xs text-slate-500 uppercase tracking-widest">Feature</th>
                    <th className="text-left px-5 py-4 font-mono text-xs text-orange-500 uppercase tracking-widest bg-orange-500/5">LeadForge AI</th>
                    <th className="text-left px-5 py-4 font-mono text-xs text-slate-500 uppercase tracking-widest">DIY (Wix)</th>
                    <th className="text-left px-5 py-4 font-mono text-xs text-slate-500 uppercase tracking-widest">Freelancer</th>
                    <th className="text-left px-5 py-4 font-mono text-xs text-slate-500 uppercase tracking-widest">Agency</th>
                  </tr>
                </thead>
                <tbody>
                  {compRows.map((row, i) => (
                    <tr key={row.label} className={`border-b border-navy-700 ${i % 2 === 0 ? 'bg-navy-900' : 'bg-navy-800/40'}`}>
                      <td className="px-5 py-3.5 font-sans text-xs text-slate-500 font-medium uppercase tracking-wide">{row.label}</td>
                      <td className="px-5 py-3.5 font-sans text-sm font-semibold text-orange-400 bg-orange-500/5">{row.lf}</td>
                      <td className="px-5 py-3.5 font-sans text-sm text-slate-400">{row.diy}</td>
                      <td className="px-5 py-3.5 font-sans text-sm text-slate-400">{row.freelancer}</td>
                      <td className="px-5 py-3.5 font-sans text-sm text-slate-400">{row.agency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
          <FadeUp className="mt-5">
            <div className="bg-orange-500/8 border border-orange-500/20 rounded-xl p-5">
              <p className="font-sans text-sm text-slate-300 leading-relaxed">
                <span className="text-orange-400 font-semibold">Value insight:</span> The $650 flat rate is 55–70% cheaper than the floor of Canadian freelancer pricing while delivering a superior tech stack. DIY builders accumulate $200–600/year — LeadForge AI pays for itself within 12 months.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-24 bg-navy-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="mb-12">
            <span className="section-tag mb-4 block">FAQ</span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-white">Common questions.</h2>
          </FadeUp>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="card-navy">
                  <h4 className="font-sans font-bold text-white text-sm mb-2">{faq.q}</h4>
                  <p className="font-sans text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy-900 border-t border-navy-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-white mb-4">
              Ready to get <span className="text-gradient-orange">started?</span>
            </h2>
            <p className="text-slate-400 mb-8">15-minute discovery call. No pressure.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-orange text-base px-8 py-4">Book a Call</Link>
              <a href="tel:5066399083" className="btn-outline text-base px-8 py-4">Call 506-639-9083</a>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
