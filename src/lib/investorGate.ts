// Server-only guard for investor pages.
// Keeps backward compatibility: `investorGate()` is an alias of `requireInvestorAccess()`.
//
// NOTE: This file must only be imported by Server Components / Route Handlers.
import "server-only";

/**
 * Your codebase already has this function (based on Turbopack error suggestion).
 * If you rename/remove it later, update exports accordingly.
 */
export async function requireInvestorAccess() {
  // If you already had an implementation before, restore it from the .bak file.
  // For now, we intentionally throw with a clear message so it's never silently broken.
  // Replace this with your existing logic if it was lost.
  throw new Error(
    "requireInvestorAccess() is not implemented in src/lib/investorGate.ts. Restore it from the backup or re-add your logic."
  );
}

/**
 * Backwards-compatible alias expected by older imports.
 */
export const investorGate = requireInvestorAccess;
