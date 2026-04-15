import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact — Book a Discovery Call',
  description: 'Get in touch with LeadForge AI. Book a free 15-minute discovery call. Website built in 3–5 days for $650 flat. Saint John, NB.',
}

export default function ContactPage() {
  return <ContactForm />
}
