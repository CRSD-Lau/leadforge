'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({
    name: '',
    business: '',
    email: '',
    phone: '',
    message: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)

    // Build a mailto: link as the submission mechanism (no backend needed)
    const subject = encodeURIComponent(
      `Website enquiry — ${form.business || form.name}`
    )
    const body = encodeURIComponent(
      `Name: ${form.name}\nBusiness: ${form.business}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
    )
    window.location.href = `mailto:neil@leadforge-ai.ca?subject=${subject}&body=${body}`

    // Optimistically show success after a brief delay
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <>
      {/* Header */}
      <section className="bg-brand-dark pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label block mb-4">Get In Touch</span>
          <h1 className="font-serif text-5xl sm:text-6xl font-light text-white leading-tight mb-6">
            Let's build your <span className="text-brand-gold italic">website.</span>
          </h1>
          <p className="font-sans text-base text-white/60 max-w-xl leading-relaxed">
            Fill in the form and Neil will respond within one business day. Or skip the form and
            call directly.
          </p>
        </div>
      </section>

      <section className="py-24 bg-brand-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact form */}
            <div>
              {submitted ? (
                <div className="bg-brand-accent/10 border border-brand-accent/30 p-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-brand-accent text-xl">✓</span>
                  </div>
                  <h3 className="font-serif text-2xl text-brand-dark mb-2">Message sent!</h3>
                  <p className="font-sans text-sm text-neutral-600">
                    Neil will get back to you within one business day. You can also call{' '}
                    <a href="tel:5066399083" className="text-brand-dark font-medium underline">
                      506-639-9083
                    </a>{' '}
                    directly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-xs font-semibold text-brand-dark tracking-wide uppercase mb-2">
                        Your Name <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Jane Smith"
                        className="w-full border border-brand-light-gold bg-white px-4 py-3 font-sans text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-xs font-semibold text-brand-dark tracking-wide uppercase mb-2">
                        Business Name <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        type="text"
                        name="business"
                        required
                        value={form.business}
                        onChange={handleChange}
                        placeholder="Smith Plumbing Co."
                        className="w-full border border-brand-light-gold bg-white px-4 py-3 font-sans text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-xs font-semibold text-brand-dark tracking-wide uppercase mb-2">
                        Email <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="jane@smithplumbing.ca"
                        className="w-full border border-brand-light-gold bg-white px-4 py-3 font-sans text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-xs font-semibold text-brand-dark tracking-wide uppercase mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="506-555-0100"
                        className="w-full border border-brand-light-gold bg-white px-4 py-3 font-sans text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-dark tracking-wide uppercase mb-2">
                      Tell us about your business
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="What does your business do? What pages do you need? Any design preferences?"
                      className="w-full border border-brand-light-gold bg-white px-4 py-3 font-sans text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-brand-gold transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-brand-dark text-white py-4 font-sans font-semibold text-sm tracking-wide hover:bg-brand-dark/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>

                  <p className="font-sans text-xs text-neutral-400 text-center">
                    Or reply to our outreach email — we'll get the conversation going from there.
                  </p>
                </form>
              )}
            </div>

            {/* Contact info sidebar */}
            <div className="space-y-8">
              {/* Direct contact */}
              <div className="bg-white border border-brand-light-gold p-8">
                <h3 className="font-serif text-xl font-medium text-brand-dark mb-6">
                  Prefer to call?
                </h3>
                <div className="space-y-4">
                  <a
                    href="tel:5066399083"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 border border-brand-gold/30 flex items-center justify-center group-hover:bg-brand-light-gold transition-colors">
                      <span className="font-mono text-brand-gold text-sm">☎</span>
                    </div>
                    <div>
                      <div className="font-sans text-xs text-neutral-400 uppercase tracking-wide">Phone</div>
                      <div className="font-sans text-sm font-semibold text-brand-dark group-hover:text-brand-gold transition-colors">
                        506-639-9083
                      </div>
                    </div>
                  </a>

                  <a
                    href="mailto:neil@leadforge-ai.ca"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 border border-brand-gold/30 flex items-center justify-center group-hover:bg-brand-light-gold transition-colors">
                      <span className="font-mono text-brand-gold text-sm">@</span>
                    </div>
                    <div>
                      <div className="font-sans text-xs text-neutral-400 uppercase tracking-wide">Email</div>
                      <div className="font-sans text-sm font-semibold text-brand-dark group-hover:text-brand-gold transition-colors">
                        neil@leadforge-ai.ca
                      </div>
                    </div>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-brand-gold/30 flex items-center justify-center">
                      <span className="font-mono text-brand-gold text-sm">◎</span>
                    </div>
                    <div>
                      <div className="font-sans text-xs text-neutral-400 uppercase tracking-wide">Location</div>
                      <div className="font-sans text-sm font-semibold text-brand-dark">
                        Saint John, NB, Canada
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to expect */}
              <div className="bg-brand-light-gold border border-brand-gold/20 p-8">
                <h3 className="font-serif text-xl font-medium text-brand-dark mb-4">
                  What happens next?
                </h3>
                <ol className="space-y-3">
                  {[
                    'Neil responds within 1 business day',
                    'We schedule a 15-minute discovery call',
                    'Build starts within 24 hours of the call',
                    'You have a live site in 3–5 days',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="font-mono text-xs text-brand-gold mt-0.5 w-4 flex-shrink-0">
                        0{i + 1}
                      </span>
                      <span className="font-sans text-sm text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Pricing reminder */}
              <div className="bg-brand-dark p-6">
                <div className="font-mono text-xs text-brand-gold tracking-widest uppercase mb-2">
                  Pricing
                </div>
                <div className="font-serif text-3xl text-white font-light mb-1">$650</div>
                <div className="font-sans text-sm text-white/50 mb-3">flat rate · one-time</div>
                <div className="font-sans text-xs text-white/40">
                  Post-launch updates: $75/hr · No minimum · Prorated to 10-min
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
