import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center max-w-lg">
        {/* Big 404 */}
        <div className="font-mono font-bold text-[120px] sm:text-[160px] leading-none text-white/5 select-none mb-2">
          404
        </div>

        {/* Tag */}
        <div className="-mt-8 mb-6">
          <span className="section-tag justify-center">Page Not Found</span>
        </div>

        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-white leading-tight mb-4">
          This page doesn&apos;t{' '}
          <span className="text-gradient-orange">exist yet.</span>
        </h1>

        <p className="font-sans text-slate-400 text-base leading-relaxed mb-10">
          Maybe your business website doesn&apos;t either. We can fix that —
          $650 flat, 3–5 days, you own the code.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href="/" className="btn-orange text-sm px-6 py-3">
            ← Back to Home
          </Link>
          <Link href="/contact" className="btn-outline text-sm px-6 py-3">
            Get Your Site Built
          </Link>
        </div>

        {/* Quick links */}
        <div className="border-t border-navy-700 pt-8">
          <p className="font-mono text-xs text-slate-600 uppercase tracking-widest mb-4">
            Quick links
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { href: '/portfolio', label: 'Portfolio' },
              { href: '/pricing',   label: 'Pricing' },
              { href: '/process',   label: 'Process' },
              { href: '/contact',   label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm text-slate-500 hover:text-orange-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
