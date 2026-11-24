/**
 * The only résumé link that ever leaves the backoffice: a stable URL that
 * opens for signed-in admins and returns a 15-minute signed URL (see
 * app/api/resume/[id]/route.ts). Bucket URLs are never handed out directly.
 */
export function resumeLink(applicationId: string, req?: Request): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || (req ? new URL(req.url).origin : "")).replace(/\/$/, "");
  return `${base}/api/resume/${applicationId}`;
}

/** How long the signed URL behind that link lives. */
export const RESUME_SIGNED_TTL = 15 * 60;
