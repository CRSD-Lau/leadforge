import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center">
                <span className="text-brand-gold font-mono text-xs font-bold">LF</span>
              </div>
              <span className="font-serif text-lg font-semibold text-white tracking-wide">
                LeadForge AI
              </span>
            </div>
            <p className="font-sans text-sm text-white/60 leading-relaxed max-w-xs">
              Micro-agency building professional websites for local businesses. Powered by AI.
              Run by Neil Mitchell.
            </p>
            <div className="mt-6 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
              <span className="font-mono text-xs text-white/40">Agent active</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-mono text-xs tracking-widest uppercase text-brand-gold mb-4">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/portfolio', label: 'Portfolio' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/process', label: 'Process' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-mono text-xs tracking-widest uppercase text-brand-gold mb-4">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <span className="font-sans text-xs text-white/40 uppercase tracking-wider block mb-0.5">
                  Phone
                </span>
                <a
                  href="tel:5066399083"
                  className="font-sans text-sm text-white/80 hover:text-white transition-colors"
                >
                  506-639-9083
                </a>
              </li>
              <li>
                <span className="font-sans text-xs text-white/40 uppercase tracking-wider block mb-0.5">
                  Email
                </span>
                <a
                  href="mailto:neil@leadforge.ai"
                  className="font-sans text-sm text-white/80 hover:text-white transition-colors"
                >
                  neil@leadforge.ai
                </a>
              </li>
              <li>
                <span className="font-sans text-xs text-white/40 uppercase tracking-wider block mb-0.5">
                  Portfolio
                </span>
                <a
                  href="https://neil-mitchell.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-white/80 hover:text-white transition-colors"
                >
                  neil-mitchell.vercel.app
                </a>
              </li>
              <li>
                <span className="font-sans text-xs text-white/40 uppercase tracking-wider block mb-0.5">
                  Location
                </span>
                <span className="font-sans text-sm text-white/80">
                  Saint John, NB, Canada
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-white/30">
            &copy; {new Date().getFullYear()} LeadForge AI. All rights reserved.
          </p>
          <p className="font-mono text-xs text-white/30">
            Built by Neil Mitchell · Saint John, NB
          </p>
        </div>
      </div>
    </footer>
  )
}
