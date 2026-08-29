import { PortalUserRole } from "@/lib/types";

/**
 * Maps a visible login ID + role to a deterministic internal email.
 * This email is never shown to the user and never receives real mail —
 * it exists only so Supabase Auth (which requires an email) can be used
 * with an ID-based login UI. Including role lets a parent share the same
 * visible ID as their child while getting a fully distinct auth account.
 */
export function loginIdToInternalEmail(loginId: string, role: PortalUserRole): string {
  const normalized = loginId.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  return `${normalized}.${role}@portal.bahriahanif.internal`;
}
