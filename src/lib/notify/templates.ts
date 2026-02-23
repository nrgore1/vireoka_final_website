type TemplateArgs = {
  email: string;
  commId: string;
  siteUrl: string;
};

function trackPixel({ email, commId, siteUrl }: TemplateArgs) {
  const u = `${siteUrl}/api/track/open?commId=${encodeURIComponent(
    commId
  )}&email=${encodeURIComponent(email)}`;
  return `<img src="${u}" width="1" height="1" style="display:none" alt="" />`;
}

function trackLink(rawUrl: string, { email, commId, siteUrl }: TemplateArgs) {
  return `${siteUrl}/api/track/click?commId=${encodeURIComponent(
    commId
  )}&email=${encodeURIComponent(email)}&url=${encodeURIComponent(rawUrl)}`;
}

/* ---------------- REQUEST RECEIVED ---------------- */

export function requestReceivedTemplate(args: TemplateArgs) {
  const loginUrl = trackLink(`/login`, args);

  const html = `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; max-width:560px; margin:auto;">
    <h2>Thank you for your interest in Vireoka</h2>
    <p>Your request for investor access has been received and is currently under review.</p>
    <p>We’ll follow up if additional information is needed or once a decision has been made.</p>
    <p><a href="${loginUrl}">Log in</a> if you’ve already been invited.</p>
    <hr />
    <p style="font-size:12px;color:#666;">Sent to ${args.email}</p>
    ${trackPixel(args)}
  </div>`;

  const text = `Thank you for your interest in Vireoka.

Your request for investor access has been received and is currently under review.
We’ll follow up if additional information is needed or once a decision has been made.

Log in: ${args.siteUrl}/login
`;

  return {
    subject: "We’ve received your access request",
    html,
    text,
  };
}

/* ---------------- APPROVED ---------------- */

export function approvedTemplate(args: TemplateArgs) {
  const deckUrl = trackLink(`/api/intelligence/deck?commId=${args.commId}`, args);

  const html = `
  <div style="font-family:system-ui;max-width:560px;margin:auto;">
    <h2>Your investor access is approved</h2>
    <p>You can now access Vireoka investor materials.</p>
    <p><a href="${deckUrl}">Download investor deck (watermarked)</a></p>
    ${trackPixel(args)}
  </div>`;

  const text = `Your investor access is approved.

Download investor deck:
${args.siteUrl}/api/intelligence/deck?commId=${args.commId}
`;

  return {
    subject: "Strategic Access approved — Vireoka",
    html,
    text,
  };
}

/* ---------------- REJECTED ---------------- */

export function rejectedTemplate(args: TemplateArgs) {
  const requestUrl = trackLink(`/request-access`, args);

  const html = `
  <div style="font-family:system-ui;max-width:560px;margin:auto;">
    <h2>Update on your Vireoka request</h2>
    <p>At this time, we’re unable to grant investor access.</p>
    <p>You may submit a new request here: <a href="${requestUrl}">Request access</a></p>
    ${trackPixel(args)}
  </div>`;

  const text = `Update on your Vireoka request.

At this time, we’re unable to grant investor access.
You may submit a new request at:
${args.siteUrl}/request-access
`;

  return {
    subject: "Update on investor access — Vireoka",
    html,
    text,
  };
}

/* ---------------- FOLLOW UP ---------------- */

export function followUpTemplate(args: TemplateArgs) {
  const html = `
  <div style="font-family:system-ui;max-width:560px;margin:auto;">
    <p>Your investor access request is still under review.</p>
    <p>We appreciate your patience and will be in touch soon.</p>
    ${trackPixel(args)}
  </div>`;

  const text = `Your investor access request is still under review.
We appreciate your patience and will be in touch soon.
`;

  return {
    subject: "Following up on your Vireoka request",
    html,
    text,
  };
}
