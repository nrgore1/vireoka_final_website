/**
 * @deprecated
 * This file exists for backward compatibility.
 * All email sending is now handled via `@/lib/notify`.
 */

export {
  emailRequestReceived,
  emailApproved,
  emailRejected,
  emailFollowUp,
} from "@/lib/notify";
