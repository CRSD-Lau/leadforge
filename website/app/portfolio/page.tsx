import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Websites built by LeadForge AI for local businesses. React/Next.js sites launched in 3–5 days.',
}

const portfolioItems = [
  {
    name: 'Callahan Plumbing & Heating',
    category: 'Plumbing',
    location: 'Saint John, NB',
    days: '4 days',
    color: '#003F2D',
    initials: 'CP',
    description: 'Emergency plumbing and heating services for residential and commercial clients.',
    tags: ['React/Next.js', 'Tailwind CSS', 'Vercel'],
  },
  {
    name: 'Maison Élise Hair Studio',
    category: 'Salon & Beauty',
    location: 'Moncton, NB',
    days: '3 days',
    color: '#8B5E3C',
    initials: 'ME',
    description: 'Boutique hair salon offering cuts, colour, and treatments in a relaxed setting.',
    tags: ['React/Next.js', 'Tailwind CSS', 'Vercel'],
  },
  {
    name: "Harbour Front Bistro",
    category: 'Restaurant',
    location: 'Saint John, NB',
    days: '5 days',
    color: '#1A3A4A',
    initials: 'HF',
    description: 'Fresh local seafood and Maritime cuisine on the Saint John waterfront.',
    tags: ['React/Next.js', 'Tailwind CSS', 'Vercel'],
  },
  {
    name: 'Iron & Oak Fitness',
    category: 'Gym & Fitness',
    location: 'Fredericton, NB',
    days: '4 days',
    color: '#2C2C2C',
    initials: 'IO',
    description: 'Independent strength and conditioning gym for serious athletes and beginners alike.',
    tags: ['React/Next.js', 'Tailwind CSS', 'Vercel'],
  },
  {
    name: "Ridgeline Lawn & Landscape",
    category: 'Landscaping',
    location: 'Sussex, NB',
    days: '3 days',
    color: '#2D5016',
    initials: 'RL',
    description: 'Full-service lawn care, seasonal cleanup, and landscape design for residential properties.',
    tags: ['React/Next.js', 'Tailwind CSS', 'Vercel'],
  },
  {
    name: 'Breadsmith Artisan Bakery',
    category: 'Bakery & Café',
    location: 'Rothesay, NB',
    days: '4 days',
    color: '#7C4A1C',
    initials: 'BA',
    description: 'Daily-baked sourdoughs, pastries, and seasonal specials. Pickup and local delivery.',
    tags: ['React/Next.js', 'Tailwind CSS', 'Vercel'],
  },
]

export default function PortfolioPage() {
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
            Our Work
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl font-light text-white leading-tight mb-6">
            Built by LeadForge AI
          </h1>
          <p className="font-sans text-lg text-white/60 max-w-2xl leading-relaxed">
            Professional websites for local businesses — delivered in 3–5 days, built in
            React/Next.js, deployed on Vercel.
          </p>
        </div>
      </section>

      {/* Coming soon notice */}
      <section className="bg-brand-light-gold border-b border-brand-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
            <span className="font-mono text-xs text-brand-dark tracking-widest uppercase">
              Portfolio Status
            </span>
          </div>
          <p className="font-sans text-sm text-neutral-700">
            First builds launching soon — these are representative examples.{' '}
            <Link href="/contact" className="text-brand-dark font-medium underline underline-offset-2 decoration-brand-gold hover:text-brand-gold transition-colors">
              Be part of the portfolio →
            </Link>
          </p>
        </div>
      </section>

      {/* Portfolio grid */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <article
                key={item.name}
                className="bg-white border border-brand-light-gold overflow-hidden group hover:shadow-lg hover:border-brand-gold/30 transition-all duration-300"
              >
                {/* Card preview area */}
                <div
                  className="h-48 relative flex items-center justify-center"
                  style={{ backgroundColor: item.color }}
                >
                  {/* Subtle grid */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                      backgroundSize: '30px 30px',
                    }}
                  />
                  {/* Logo placeholder */}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-white/10 border border-white/20 flex items-center justify-center">
                      <span className="font-serif text-white text-xl font-semibold">
                        {item.initials}
                      </span>
                    </div>
                    <span className="font-sans text-white/60 text-xs tracking-wide">
                      {item.category}
                    </span>
                  </div>
                  {/* Coming soon overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="font-mono text-xs text-white/80 border border-white/30 px-3 py-1 tracking-widest uppercase">
                      Coming Soon
                    </span>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="font-serif text-xl font-medium text-brand-dark leading-tight">
                      {item.name}
                    </h2>
                  </div>
                  <p className="font-sans text-sm text-neutral-500 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-xs bg-brand-light-gold text-brand-dark/60 px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-brand-light-gold flex items-center justify-between">
                    <span className="font-sans text-xs text-neutral-400">{item.location}</span>
                    <span className="font-mono text-xs text-brand-accent">
                      Launched in {item.days}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Be part of portfolio CTA */}
      <section className="py-20 bg-white border-t border-brand-light-gold">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-dark p-12 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(#C5A55A 1px, transparent 1px), linear-gradient(90deg, #C5A55A 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="font-mono text-xs text-brand-gold tracking-widest uppercase block mb-4">
                  First builds launching soon
                </span>
                <h2 className="font-serif text-4xl font-light text-white leading-tight mb-4">
                  Be part of the{' '}
                  <span className="italic text-brand-gold">portfolio.</span>
                </h2>
                <p className="font-sans text-sm text-white/60 leading-relaxed">
                  Early clients get priority attention, a feature spot on this page, and the
                  satisfaction of knowing their site helped prove the model. $650 flat. 3–5 days.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="bg-brand-gold text-brand-dark px-8 py-4 font-sans font-semibold text-sm tracking-wide text-center hover:brightness-105 transition-all"
                >
                  Get Your Site — $650
                </Link>
                <a
                  href="tel:5066399083"
                  className="border border-white/20 text-white px-8 py-4 font-sans font-medium text-sm tracking-wide text-center hover:border-brand-gold/40 transition-all"
                >
                  Call 506-639-9083
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
