import { Resend } from 'resend'

export function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function envoyerEmail({
  to,
  subject,
  html,
  pdfBuffer,
  pdfFilename,
}: {
  to: string
  subject: string
  html: string
  pdfBuffer?: Buffer
  pdfFilename?: string
}) {
  const resend = getResendClient()

  const attachments = pdfBuffer && pdfFilename
    ? [{ filename: pdfFilename, content: pdfBuffer }]
    : undefined

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'QuotiPro <noreply@quotipro.fr>',
    to,
    subject,
    html,
    attachments,
  })

  if (error) throw error
  return data
}
