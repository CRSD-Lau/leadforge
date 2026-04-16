import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const { name, business, email, phone, message } = await req.json()

    if (!name || !business || !email) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: 'LeadForge AI <onboarding@resend.dev>',
      to: ['neil_mitchell89@hotmail.com'],
      replyTo: email,
      subject: `Website enquiry — ${business}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
          <div style="background:#080D1A;padding:28px 32px;border-radius:12px 12px 0 0">
            <p style="margin:0;font-family:monospace;font-size:11px;color:#F97316;letter-spacing:2px;text-transform:uppercase">LeadForge AI — New Enquiry</p>
          </div>
          <div style="background:#0F1629;padding:32px;border-radius:0 0 12px 12px;border:1px solid #1E2D4A;border-top:none">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#94A3B8;font-size:13px;width:100px">Name</td>
                  <td style="padding:8px 0;color:#fff;font-size:13px;font-weight:600">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#94A3B8;font-size:13px">Business</td>
                  <td style="padding:8px 0;color:#fff;font-size:13px;font-weight:600">${business}</td></tr>
              <tr><td style="padding:8px 0;color:#94A3B8;font-size:13px">Email</td>
                  <td style="padding:8px 0;font-size:13px"><a href="mailto:${email}" style="color:#F97316">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px 0;color:#94A3B8;font-size:13px">Phone</td>
                  <td style="padding:8px 0;color:#fff;font-size:13px">${phone}</td></tr>` : ''}
            </table>
            ${message ? `
            <div style="margin-top:20px;padding:16px;background:#080D1A;border-radius:8px;border:1px solid #1E2D4A">
              <p style="margin:0 0 8px;color:#94A3B8;font-size:11px;text-transform:uppercase;letter-spacing:1px">Message</p>
              <p style="margin:0;color:#CBD5E1;font-size:14px;line-height:1.6">${message.replace(/\n/g, '<br>')}</p>
            </div>` : ''}
            <div style="margin-top:24px;padding-top:20px;border-top:1px solid #1E2D4A">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(`Your website enquiry — ${business}`)}"
                style="display:inline-block;background:#F97316;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
                Reply to ${name} →
              </a>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
