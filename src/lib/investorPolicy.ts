/**
 * Investor policy primitives
 * These are BUSINESS RULES, not UI logic.
 */

/**
 * How long an approved investor gets access (days)
 */
export function accessTtlDays(): number {
  return 30; // changeable without migrations
}

/**
 * Active NDA version.
 * Increment this when NDA terms materially change.
 */
export function activeNdaVersion(): number {
  return 1;
}

/**
 * Engagement score threshold to flag "hot" investors
 */
export function hotInvestorThreshold(): number {
  return 75;
}

/**
 * Does this investor need to accept (or re-accept) NDA?
 */
export function needsNdaAcceptance(inv: {
  nda_accepted_at?: string | null;
  nda_version_accepted?: number | null;
}): boolean {
  if (!inv.nda_accepted_at) return true;
  return inv.nda_version_accepted !== activeNdaVersion();
}
