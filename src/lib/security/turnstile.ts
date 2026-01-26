export async function verifyTurnstileToken(params: { token: string; ip?: string }) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) throw new Error('Missing TURNSTILE_SECRET_KEY')

  const form = new FormData()
  form.append('secret', secret)
  form.append('response', params.token)
  if (params.ip) form.append('remoteip', params.ip)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  })

  if (!res.ok) return { ok: false, reason: `turnstile_http_${res.status}` }

  const data = (await res.json()) as { success: boolean; ['error-codes']?: string[] }
  return { ok: !!data.success, reason: data['error-codes']?.join(',') || null }
}
