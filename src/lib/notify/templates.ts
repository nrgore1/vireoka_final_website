type TemplateArgs = {
  email: string;
  commId: string;
  siteUrl: string;
};

function trackPixel({ email, commId, siteUrl }: TemplateArgs) {
  const u = `${siteUrl}/api/track/open?commId=${encodeURIComponent(commId)}&email=${encodeURIComponent(email)}`;
  return `<img src="${u}" width="1" height="1" style="display:none" alt="" />`;
}

function trackLink(rawUrl: string, { email, commId, siteUrl }: TemplateArgs) {
  const u = `${siteUrl}/api/track/click?commId=${encodeURIComponent(commId)}&email=${encodeURIComponent(email)}&url=${encodeURIComponent(rawUrl)}`;
  return u;
}

export function requestReceivedTemplate(args: TemplateArgs) {
  const loginUrl = trackLink(`${args.siteUrl}/login`, args);
  const html = `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto; color:#111;">
    <h2 style="font-weight:700;">Thank you for your interest in Vireoka</h2>
    <p>Your request for investor access has been received and is currently under review.</p>
    <p>We’ll follow up if additional information is needed or once a decision has been made.</p>
    <p style="margin-top:18px;">
      Already invited? <a href="${loginUrl}">Log in</a>
    </p>
    <hr style="margin:24px 0; border:none; border-top:1px solid #eee;" />
    <p style="font-size:12px; color:#666;">
      Sent to <strong>${args.email}</strong>. You can reply to reach us.
    </p>
    <p style="font-size:12px; color:#888;">Vireoka — Governed AI for real-world accountability</p>
    ${trackPixel(args)}
  </div>`;
  const text =
`Thank you for your interest in Vireoka.

Your request for investor access has been received and is currently under review.
We’ll follow up if additional information is needed or once a decision has been made.

Already invited? Log in: ${args.siteUrl}/login

— Vireoka
Sent to: ${args.email}
`;
  return { subject: "We’ve received your access request", html, text };
}

export function approvedTemplate(args: TemplateArgs) {
  const investorsUrl = trackLink(`${args.siteUrl}/investors`, args);
  const ndaUrl = trackLink(`${args.siteUrl}/investors/nda`, args);

  const html = `
  <div style="font-family: system-ui; max-width:560px; margin:0 auto;">
    <h2 style="font-weight:700;">Your Vireoka investor access is approved</h2>
    <p>You can now access the investor portal.</p>
    <p><a href="${investorsUrl}">Open investor portal</a></p>
    <p>If prompted, please complete the NDA: <a href="${ndaUrl}">NDA page</a></p>
    <hr style="margin:24px 0; border:none; border-top:1px solid #eee;" />
    <p style="font-size:12px; color:#666;">This message was sent to ${args.email}.</p>
    ${trackPixel(args)}
  </div>`;

  const text =
`Your Vireoka investor access is approved.

Open investor portal: ${args.siteUrl}/investors
NDA (if prompted): ${args.siteUrl}/investors/nda

— Vireoka
`;
  return { subject: "Investor access approved — Vireoka", html, text };
}

export function rejectedTemplate(args: TemplateArgs) {
  const requestUrl = trackLink(`${args.siteUrl}/request-access`, args);
  const html = `
  <div style="font-family: system-ui; max-width:560px; margin:0 auto;">
    <h2 style="font-weight:700;">Update on your Vireoka request</h2>
    <p>Thanks again for your interest. At this time, we’re unable to grant investor access.</p>
    <p>If circumstances change, you can submit a new request here: <a href="${requestUrl}">Request access</a></p>
    <hr style="margin:24px 0; border:none; border-top:1px solid #eee;" />
    <p style="font-size:12px; color:#666;">This message was sent to ${args.email}.</p>
    ${trackPixel(args)}
  </div>`;

  const text =
`Update on your Vireoka request:

At this time, we’re unable to grant investor access.
If circumstances change, you can submit a new request: ${args.siteUrl}/request-access

— Vireoka
`;
  return { subject: "Update on investor access — Vireoka", html, text };
}

export function followUpTemplate(args: TemplateArgs) {
  const html = `
  <div style="font-family: system-ui; max-width:560px; margin:0 auto;">
    <h3>Quick follow-up from Vireoka</h3>
    <p>Your investor access request is still under review. We appreciate your patience and will be in touch soon.</p>
    ${trackPixel(args)}
  </div>`;
  const text =
`Quick follow-up from Vireoka:

Your investor access request is still under review. We appreciate your patience.

— Vireoka
`;
  return { subject: "Following up on your Vireoka request", html, text };
}

// --- LINKING TO INVESTOR DECK (APPROVED EMAIL) ---
// Usage: const deckUrl = investorDeckUrl(commId)

export function investorDeckUrl(commId: string) {
  return `/api/investors/deck?commId=${encodeURIComponent(commId)}`;
}
