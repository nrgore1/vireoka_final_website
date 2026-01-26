Env vars required (set in Supabase Dashboard -> Edge Functions -> Secrets):

- RESEND_API_KEY=...
- APP_ORIGIN=https://your-domain.com
- INVESTOR_FROM_EMAIL=Vireoka <investors@vireoka.com>

Deploy:
  supabase functions deploy send-nda-invitation
