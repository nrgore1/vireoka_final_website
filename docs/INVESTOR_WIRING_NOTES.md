# Wiring Notes (Non-breaking)

You asked not to break current UI/flows. This repo adds *components + helpers* only.

## Investor Access Page
- Import and render:
  - src/components/investor/InvestorAccessStatusCard.tsx

## NDA Page
- Keep your existing signing UX
- Use src/components/investor/NdaViewer.tsx to render the active template
- Your existing sign submission stays unchanged

## Investor Portal
- Wrap your portal entry with:
  - InvestorPortalGate
  - Fallback should route/display your Investor Access page

## Admin UI
- Wrap admin screens with:
  - AdminGuard
- Add MFA enforcement on top:
  - AdminMfaGate

## Watermarked downloads
- Deploy Edge Function `watermarked-download`
- Call it from your portal documents UI:
  /functions/v1/watermarked-download?bucket=<b>&path=<p>&doc_id=<id>
  with Authorization: Bearer <user jwt>

## Assign Investor Admin
Run once after naren@vireoka.com logs in:
insert into public.user_roles (user_id, role)
select id, 'INVESTOR_ADMIN' from auth.users where email='naren@vireoka.com'
on conflict do nothing;
