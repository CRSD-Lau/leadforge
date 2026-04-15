import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'LeadForge AI — Websites for Local Businesses'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#080D1A',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(249,115,22,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.06) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Orange glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #F97316, #EA580C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L5 8H8L6 14L13 7H9L12 2H8Z" fill="white" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
              LeadForge <span style={{ color: '#F97316' }}>AI</span>
            </span>
            <span style={{ fontSize: '14px', color: '#475569', marginTop: '4px' }}>Saint John, NB</span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '68px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: '-2px',
            marginBottom: '24px',
            maxWidth: '820px',
          }}
        >
          Your website,{' '}
          <span style={{ color: '#F97316' }}>live in 5 days.</span>
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: '24px',
            color: '#94A3B8',
            lineHeight: 1.5,
            marginBottom: '52px',
            maxWidth: '680px',
          }}
        >
          React/Next.js. Deployed on Vercel. You own the code. $650 flat.
        </div>

        {/* KPI strip */}
        <div style={{ display: 'flex', gap: '40px' }}>
          {[
            { val: '$650', label: 'Flat Rate' },
            { val: '5 days', label: 'Max Delivery' },
            { val: '89%', label: 'Profit Margin' },
            { val: '800+', label: 'Local Leads' },
          ].map((kpi) => (
            <div key={kpi.label} style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  color: '#F97316',
                  fontFamily: 'monospace',
                  lineHeight: 1,
                }}
              >
                {kpi.val}
              </span>
              <span style={{ fontSize: '13px', color: '#475569', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                {kpi.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom border accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #F97316, #EA580C, transparent)',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
