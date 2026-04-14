'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

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
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setIsOpen(false) }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-900/95 backdrop-blur-md border-b border-navy-600/60 shadow-navy-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-orange-500 rounded-lg opacity-20 group-hover:opacity-40 transition-opacity duration-200 blur-sm" />
              <div className="relative w-8 h-8 bg-gradient-orange rounded-lg flex items-center justify-center shadow-orange-sm">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L5 8H8L6 14L13 7H9L12 2H8Z" fill="white" />
                </svg>
              </div>
            </div>
            <span className="font-sans font-bold text-base tracking-tight text-white">
              LeadForge <span className="text-orange-500">AI</span>
            </span>
            <span className="hidden sm:block text-navy-400 text-sm font-normal">
              — Saint John, NB
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 font-sans text-sm font-medium rounded-lg transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-white bg-navy-700'
                    : 'text-slate-400 hover:text-white hover:bg-navy-800'
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500"
                  />
                )}
              </Link>
            ))}
            <div className="w-px h-5 bg-navy-600 mx-2" />
            <Link href="/contact" className="btn-orange text-sm py-2 px-5">
              Get Your Site
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="block h-0.5 bg-current rounded-full"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                animate={isOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
                className="block h-0.5 bg-current rounded-full"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="block h-0.5 bg-current rounded-full"
                transition={{ duration: 0.2 }}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden border-t border-navy-700"
            >
              <div className="bg-navy-900/98 backdrop-blur-md py-3 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 font-sans text-sm font-medium rounded-lg mx-1 transition-colors ${
                      pathname === link.href
                        ? 'text-white bg-navy-700 border-l-2 border-orange-500 pl-3'
                        : 'text-slate-400 hover:text-white hover:bg-navy-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="px-1 pt-2">
                  <Link href="/contact" className="btn-orange w-full justify-center">
                    Get Your Site — $650
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
