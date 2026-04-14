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
  title, price, priceNote, description, features, cta, ctaHref, featured = false, badge,
}: PricingCardProps) {
  return (
    <div className={`relative flex flex-col rounded-xl border p-8 transition-all duration-300 ${
      featured
        ? 'bg-gradient-to-br from-orange-500/10 to-navy-800 border-orange-500/40 shadow-orange-sm'
        : 'bg-navy-800 border-navy-600 hover:border-orange-500/30'
    }`}>
      {badge && (
        <div className="absolute -top-3 left-6">
          <span className="bg-orange-500 text-white font-mono text-xs font-bold px-3 py-1 rounded-full shadow-orange-sm">
            {badge}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-mono text-xs tracking-widest uppercase text-orange-500 mb-3">{title}</h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-sans font-extrabold text-5xl text-white">{price}</span>
          {priceNote && <span className="font-sans text-sm text-slate-500">{priceNote}</span>}
        </div>
        <p className="font-sans text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>

      <ul className="flex flex-col gap-3 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-orange-500 flex-shrink-0 mt-0.5">
              <path d="M2 7L5.5 10.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-sans text-sm text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={ctaHref} className={featured ? 'btn-orange w-full justify-center' : 'btn-outline w-full justify-center'}>
        {cta}
      </Link>
    </div>
  )
}
