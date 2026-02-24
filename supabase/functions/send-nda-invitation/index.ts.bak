import { serve } from 'https://deno.land/std/http/server.ts';
import { Resend } from 'https://esm.sh/resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') || '');
const APP_ORIGIN = Deno.env.get('APP_ORIGIN') || 'http://localhost:3000';
const FROM_EMAIL = Deno.env.get('INVESTOR_FROM_EMAIL') || 'Vireoka <investors@vireoka.com>';

serve(async (req) => {
  try {
    if (req.method() !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const { email, reference_code } = await req.json();

    if (!email || !reference_code) {
      return new Response(JSON.stringify({ error: 'Missing email or reference_code' }), { status: 400 });
    }

    const ndaUrl = `${APP_ORIGIN}/investors/nda?ref=${encodeURIComponent(reference_code)}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Vireoka NDA Invitation',
      html: `
        <p>Thank you for your interest in Vireoka.</p>

        <p>
          Your investor access request (<strong>${reference_code}</strong>) has been approved.
          To proceed, please review and accept our NDA:
        </p>

        <p>
          <a href="${ndaUrl}">Review and accept the NDA</a>
        </p>

        <p>
          Once the NDA is accepted, you will be granted time-bound access to the investor portal.
        </p>

        <p>— Vireoka Team</p>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
