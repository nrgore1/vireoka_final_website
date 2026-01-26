import { Resend } from 'resend'

export async function sendEmail(params: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('Missing RESEND_API_KEY')

  const from = process.env.EMAIL_FROM || 'no-reply@yourdomain.com'
  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  })

  if (error) throw new Error(`Email send failed: ${error.message}`)
}
