import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-navy-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-orange rounded-lg flex items-center justify-center shadow-orange-sm">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L5 8H8L6 14L13 7H9L12 2H8Z" fill="white" />
                </svg>
              </div>
              <span className="font-sans font-bold text-base text-white">
                LeadForge <span className="text-orange-500">AI</span>
              </span>
            </div>
            <p className="font-sans text-sm text-slate-500 leading-relaxed max-w-xs mb-6">
              Micro-agency building professional websites for local businesses across New Brunswick.
              Powered by Claude AI. Run by Neil Mitchell.
            </p>
            <div className="flex items-center gap-2">
              <span className="dot-orange animate-pulse-slow" />
              <span className="font-mono text-xs text-slate-600">Agent active — Mon–Fri 6 AM</span>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h3 className="font-mono text-xs tracking-widest uppercase text-orange-500 mb-4">Pages</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/portfolio', label: 'Portfolio' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/process', label: 'Process' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-sans text-sm text-slate-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-mono text-xs tracking-widest uppercase text-orange-500 mb-4">Contact</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <span className="font-mono text-xs text-slate-600 uppercase tracking-wider block mb-0.5">Phone</span>
                <a href="tel:5066399083" className="font-sans text-sm text-slate-400 hover:text-orange-400 transition-colors">506-639-9083</a>
              </li>
              <li>
                <span className="font-mono text-xs text-slate-600 uppercase tracking-wider block mb-0.5">Email</span>
                <a href="mailto:neil@leadforge-ai.ca" className="font-sans text-sm text-slate-400 hover:text-orange-400 transition-colors">neil@leadforge-ai.ca</a>
              </li>
              <li>
                <span className="font-mono text-xs text-slate-600 uppercase tracking-wider block mb-0.5">Portfolio</span>
                <a href="https://neil-mitchell.vercel.app" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-slate-400 hover:text-orange-400 transition-colors">neil-mitchell.vercel.app</a>
              </li>
              <li>
                <span className="font-mono text-xs text-slate-600 uppercase tracking-wider block mb-0.5">Location</span>
                <span className="font-sans text-sm text-slate-400">Saint John, NB, Canada</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-navy-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-slate-700">
            &copy; {new Date().getFullYear()} LeadForge AI. All rights reserved.
          </p>
          <p className="font-mono text-xs text-slate-700">
            Built by Neil Mitchell · Saint John, NB · Next.js + Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
