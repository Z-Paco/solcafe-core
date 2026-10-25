// The /contact front door: one address, four reasons.
// The address lives here only, so the page, the form and (later) the Resend
// sender all read the same value. contact@solcafe.ca forwards to the
// builder's Gmail through ImprovMX; the subject tags drive Gmail filters.

export const CONTACT_EMAIL = "contact@solcafe.ca";

export const CONTACT_REASONS = [
  { id: "general", label: "General question", tag: "[General]" },
  { id: "publishing", label: "Become a publisher", tag: "[Publishing]" },
  { id: "correction", label: "Correction or source issue", tag: "[Correction]" },
  { id: "collaboration", label: "Collaboration", tag: "[Collaboration]" },
] as const;

export type ContactReason = (typeof CONTACT_REASONS)[number]["id"];

/** mailto: links get unreliable past ~2000 characters, so v1 caps the message. */
export const MESSAGE_MAX = 1500;

/** ?reason=publishing preselects a reason; anything else falls back to General. */
export function reasonFromParam(param: unknown): ContactReason {
  const value = Array.isArray(param) ? param[0] : param;
  const match = CONTACT_REASONS.find((r) => r.id === value);
  return match ? match.id : "general";
}

/**
 * v1 delivery: a mailto: link with the subject and body filled in, so the
 * visitor sends from their own mail app and no backend is needed.
 *
 *   mailtoHref({ reason: "publishing", name: "Ada", email: "ada@example.com", message: "Hi" })
 *   // subject: "[Publishing] Become a publisher (Ada)"
 */
export function mailtoHref(fields: {
  reason: ContactReason;
  name: string;
  email: string;
  message: string;
}) {
  const reason = CONTACT_REASONS.find((r) => r.id === fields.reason) ?? CONTACT_REASONS[0];
  const name = fields.name.trim();
  const subject = `${reason.tag} ${reason.label}${name ? ` (${name})` : ""}`;
  // RFC 6068: line breaks in a mailto body are CRLF.
  const body = [
    fields.message.trim().replace(/\r?\n/g, "\r\n"),
    "",
    "--",
    ...(name ? [`Name: ${name}`] : []),
    `Reply to: ${fields.email.trim()}`,
    "Sent from solcafe.ca/contact",
  ].join("\r\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
