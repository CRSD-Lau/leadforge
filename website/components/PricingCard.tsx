import Link from 'next/link'

interface PricingCardProps {
  title: string
  price: string
  priceNote?: string
  description: string
  features: string[]
  cta: string
  ctaHref: string
  featured?: boolean
  badge?: string
}

export default function PricingCard({
  title,
  price,
  priceNote,
  description,
  features,
  cta,
  ctaHref,
  featured = false,
  badge,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col ${
        featured
          ? 'bg-brand-dark text-white border border-brand-gold/30'
          : 'bg-white border border-brand-light-gold text-neutral-900'
      } p-8 transition-all duration-200 hover:shadow-xl`}
    >
      {badge && (
        <div className="absolute -top-3 left-8">
          <span className="bg-brand-gold text-brand-dark font-mono text-xs font-semibold px-3 py-1 tracking-wide uppercase">
            {badge}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3
          className={`font-mono text-xs tracking-widest uppercase mb-3 ${
            featured ? 'text-brand-gold' : 'text-brand-gold'
          }`}
        >
          {title}
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span
            className={`font-serif text-4xl font-semibold ${
              featured ? 'text-white' : 'text-brand-dark'
            }`}
          >
            {price}
          </span>
          {priceNote && (
            <span
              className={`font-sans text-sm ${
                featured ? 'text-white/50' : 'text-neutral-400'
              }`}
            >
              {priceNote}
            </span>
          )}
        </div>
        <p
          className={`font-sans text-sm leading-relaxed ${
            featured ? 'text-white/70' : 'text-neutral-600'
          }`}
        >
          {description}
        </p>
      </div>

      <ul className="flex flex-col gap-3 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center ${
                featured ? 'text-brand-gold' : 'text-brand-accent'
              }`}
            >
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path
                  d="M1 5L4.5 8.5L11 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span
              className={`font-sans text-sm ${
                featured ? 'text-white/80' : 'text-neutral-600'
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`w-full text-center py-3 font-sans text-sm font-medium tracking-wide transition-all duration-200 ${
          featured
            ? 'bg-brand-gold text-brand-dark hover:brightness-105'
            : 'bg-brand-dark text-white hover:bg-brand-dark/90'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}
