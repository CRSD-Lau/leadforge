import type { Metadata } from 'next'
import Link from 'next/link'
import PricingCard from '@/components/PricingCard'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'LeadForge AI pricing: $650 flat-rate website build, $75/hr for updates. No hidden fees, no retainers. Transparent AI-native pricing.',
}

const comparisonData = [
  {
    label: 'Cost',
    leadforge: '$650 flat',
    diy: '$15–25/mo forever',
    freelancer: '$1,500–5,000+',
    agency: '$5,000–20,000+',
  },
  {
    label: 'Delivery',
    leadforge: '3–5 days',
    diy: 'Self-serve (weeks)',
    freelancer: '4–12 weeks',
    agency: '8–24 weeks',
  },
  {
    label: 'Code quality',
    leadforge: 'Production React',
    diy: 'Proprietary drag-drop',
    freelancer: 'Varies widely',
    agency: 'Usually custom',
  },
  {
    label: 'You own it',
    leadforge: '✓ Full codebase',
    diy: '✗ Platform lock-in',
    freelancer: '✓ Usually',
    agency: '~ Sometimes',
  },
  {
    label: 'Ongoing cost',
    leadforge: '$75/hr as needed',
    diy: '$15–25/mo + apps',
    freelancer: '$75–150/hr',
    agency: '$500–3,000/mo',
  },
  {
    label: 'SEO-ready',
    leadforge: '✓ Built in',
    diy: '~ Plugin required',
    freelancer: '~ Varies',
    agency: '✓ Usually',
  },
]

const faqs = [
  {
    q: 'What exactly do I get for $650?',
    a: 'A fully deployed, production-ready website built in React/Next.js and hosted on Vercel. This includes: responsive design (mobile, tablet, desktop), SEO-friendly page structure, your content (text and images you provide), a custom domain connection, and the complete source code. You own everything when we\'re done.',
  },
  {
    q: 'What if I need changes after launch?',
    a: 'Ongoing work is billed at $75/hr, charged to the nearest 10-minute interval. There\'s no minimum commitment — if you need 20 minutes of work, you pay $25. Just email or call and we\'ll get it done.',
  },
  {
    q: 'Do I need to provide content?',
    a: 'You\'ll need to give us your business name, contact info, services/menu, and any photos you want to use. We handle all the layout and copywriting from there. If you have nothing, we can work with placeholder copy that you refine after launch.',
  },
  {
    q: 'What about hosting costs?',
    a: 'Vercel\'s free Hobby tier covers most small business sites at zero monthly cost. If your site gets significant traffic, a Pro plan is $20/mo — but that\'s a good problem to have. Domain registration (e.g. yourname.com) is typically $12–15/yr through Namecheap or Google Domains.',
  },
  {
    q: 'Can I migrate my site to another host later?',
    a: 'Absolutely. Because we hand over the full source code (a standard Next.js repository), you can deploy it anywhere that supports Node.js — Vercel, Netlify, Railway, your own VPS, or any cloud provider. No lock-in.',
  },
]

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-brand-dark pt-32 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#C5A55A 1px, transparent 1px), linear-gradient(90deg, #C5A55A 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="font-mono text-xs text-brand-gold tracking-widest uppercase block mb-4">
            Pricing
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl font-light text-white leading-tight mb-6">
            Simple. Transparent. Flat.
          </h1>
          <p className="font-sans text-lg text-white/60 max-w-2xl leading-relaxed">
            No discovery fees. No retainers. No surprises. One price gets you a production website.
            Everything else is hourly, billed to 10-minute intervals.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard
              title="Website Build"
              price="$650"
              priceNote="flat rate"
              description="Everything you need to get your business online. A production-grade site in React/Next.js, deployed and live."
              features={[
                'Fully deployed production site',
                'Modern responsive design',
                'SEO-friendly structure',
                'React/Next.js codebase',
                'Vercel deployment included',
                '3–5 business day delivery',
                'You own the full source code',
              ]}
              cta="Get Started"
              ctaHref="/contact"
            />
            <PricingCard
              title="Build + Support"
              price="$650"
              priceNote="+ $75/hr after"
              description="The full website build, with ongoing support available whenever you need changes — no commitment required."
              features={[
                'Everything in Website Build',
                'Post-launch updates at $75/hr',
                'Billed to 10-minute interval',
                'No minimum commitment',
                'Content & copy updates',
                'New pages or sections',
                'Feature additions',
              ]}
              cta="Get Started"
              ctaHref="/contact"
              featured={true}
              badge="Most Popular"
            />
            <PricingCard
              title="Hourly Updates"
              price="$75"
              priceNote="per hour"
              description="Already have a site built by us? Get updates, fixes, and improvements billed precisely to 10-minute intervals."
              features={[
                'Content updates',
                'New pages',
                'Design adjustments',
                'Feature additions',
                'Bug fixes',
                'Prorated to 10-min intervals',
                'No retainer or minimum',
              ]}
              cta="Request Update"
              ctaHref="/contact"
            />
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 bg-white border-y border-brand-light-gold">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="section-label block mb-4">How We Compare</span>
            <h2 className="font-serif text-4xl font-light text-brand-dark leading-tight">
              LeadForge AI vs the alternatives
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-brand-light-gold">
                  <th className="text-left py-4 pr-6 font-mono text-xs text-neutral-400 uppercase tracking-wider w-32">
                    Factor
                  </th>
                  <th className="text-left py-4 px-6 bg-brand-dark">
                    <span className="font-mono text-xs text-brand-gold tracking-wider uppercase block">
                      LeadForge AI
                    </span>
                  </th>
                  <th className="text-left py-4 px-6">
                    <span className="font-mono text-xs text-neutral-400 tracking-wider uppercase block">
                      DIY (Wix)
                    </span>
                  </th>
                  <th className="text-left py-4 px-6">
                    <span className="font-mono text-xs text-neutral-400 tracking-wider uppercase block">
                      Freelancer
                    </span>
                  </th>
                  <th className="text-left py-4 px-6">
                    <span className="font-mono text-xs text-neutral-400 tracking-wider uppercase block">
                      Agency
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b border-brand-light-gold ${i % 2 === 0 ? 'bg-brand-bg/30' : 'bg-white'}`}
                  >
                    <td className="py-4 pr-6 font-mono text-xs text-neutral-500 uppercase tracking-wider">
                      {row.label}
                    </td>
                    <td className="py-4 px-6 bg-brand-dark/5 border-x border-brand-dark/10">
                      <span className="font-sans text-sm font-medium text-brand-dark">
                        {row.leadforge}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-sans text-sm text-neutral-500">{row.diy}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-sans text-sm text-neutral-500">{row.freelancer}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-sans text-sm text-neutral-500">{row.agency}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="section-label block mb-4">FAQ</span>
            <h2 className="font-serif text-4xl font-light text-brand-dark leading-tight">
              Common questions
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-brand-light-gold p-8 hover:border-brand-gold/30 transition-all duration-200"
              >
                <h3 className="font-serif text-xl font-medium text-brand-dark mb-4 leading-snug">
                  {faq.q}
                </h3>
                <p className="font-sans text-sm text-neutral-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-white border border-brand-light-gold max-w-5xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-xl font-medium text-brand-dark mb-2">
                  Still have questions?
                </h3>
                <p className="font-sans text-sm text-neutral-500">
                  Call Neil directly or send a message — no sales team, no queue.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <a
                  href="tel:5066399083"
                  className="border border-brand-dark/20 text-brand-dark px-6 py-2.5 font-sans text-sm font-medium tracking-wide hover:border-brand-gold hover:bg-brand-light-gold transition-all text-center"
                >
                  506-639-9083
                </a>
                <Link
                  href="/contact"
                  className="bg-brand-dark text-white px-6 py-2.5 font-sans text-sm font-medium tracking-wide hover:bg-brand-dark/90 transition-all text-center"
                >
                  Send a Message
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
