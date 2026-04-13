'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/process', label: 'Process' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isHome = pathname === '/'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-white/95 backdrop-blur-sm border-b border-brand-light-gold shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-dark flex items-center justify-center">
              <span className="text-brand-gold font-mono text-xs font-bold">LF</span>
            </div>
            <span
              className={`font-serif text-lg font-semibold tracking-wide transition-colors ${
                scrolled || !isHome ? 'text-brand-dark' : 'text-white'
              }`}
            >
              LeadForge AI
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-sm font-medium tracking-wide transition-colors relative group ${
                  scrolled || !isHome
                    ? 'text-neutral-600 hover:text-brand-dark'
                    : 'text-white/80 hover:text-white'
                } ${pathname === link.href ? (scrolled || !isHome ? 'text-brand-dark' : 'text-white') : ''}`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-brand-gold transition-all duration-200 ${
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-brand-dark text-white px-5 py-2 font-sans text-sm font-medium tracking-wide transition-all duration-200 hover:bg-brand-dark/90 hover:shadow-md"
            >
              Get Your Site
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors ${
              scrolled || !isHome ? 'text-brand-dark' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1">
              <span
                className={`block h-0.5 bg-current transition-all duration-200 ${
                  isOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-200 ${
                  isOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-200 ${
                  isOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white border-t border-brand-light-gold py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2.5 font-sans text-sm font-medium tracking-wide transition-colors ${
                  pathname === link.href
                    ? 'text-brand-dark bg-brand-light-gold'
                    : 'text-neutral-600 hover:text-brand-dark hover:bg-brand-bg'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Link
                href="/contact"
                className="block w-full text-center bg-brand-dark text-white px-5 py-2.5 font-sans text-sm font-medium tracking-wide"
              >
                Get Your Site
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
