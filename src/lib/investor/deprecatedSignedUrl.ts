/**
 * ⚠️ DEPRECATED – DO NOT USE FOR CONFIDENTIAL DOCS
 *
 * This file exists ONLY to prevent accidental usage of
 * Supabase Storage signed URLs for investor documents.
 *
 * Safe for:
 * - Public assets
 * - Non-confidential previews
 *
 * NOT SAFE for:
 * - Investor PDFs
 * - Financial docs
 * - Data rooms
 */

export function deprecatedSignedUrlWarning(): never {
  throw new Error(
    'Direct signed URLs are disabled for investor documents. Use downloadInvestorDocument().'
  );
}
