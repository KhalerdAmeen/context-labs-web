import "server-only";

// Loops (https://loops.so/docs/api-reference). Two traps shape this file:
//  · a contact created through the API is *subscribed by default*, and
//  · sending `subscribed: false` *unsubscribes* an existing contact.
// So we look the contact up first, and an unticked "send me new kits" box never unsubscribes anyone.

const API = "https://app.loops.so/api/v1";

export class LoopsError extends Error {}

type ContactBody = { email: string; source?: string; subscribed?: boolean; mailingLists?: Record<string, boolean> };

/** The upsert body for a download. `source` records the latest entry downloaded. */
export function downloadContact(o: { email: string; slug: string; optIn: boolean; exists: boolean }): ContactBody {
  if (!o.exists) return { email: o.email, source: o.slug, subscribed: o.optIn };
  return { email: o.email, source: o.slug, ...(o.optIn ? { subscribed: true } : {}) };
}

/** The upsert body for the waitlist: subscribed to the Launch list; `source` set only on creation. */
export function waitlistContact(o: { email: string; listId: string; exists: boolean }): ContactBody {
  return { email: o.email, ...(o.exists ? {} : { source: "waitlist" }), subscribed: true, mailingLists: { [o.listId]: true } };
}

export function loops(apiKey: string, f: typeof fetch = fetch) {
  async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await f(API + path, {
      ...init,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", ...init.headers },
      signal: AbortSignal.timeout(8000),
    });
    const body = (await res.json().catch(() => null)) as T & { success?: boolean; message?: string };
    if (!res.ok || body?.success === false) throw new LoopsError(`${init.method ?? "GET"} ${path} → ${res.status} ${body?.message ?? ""}`.trim());
    return body;
  }

  return {
    async contactExists(email: string) {
      const found = await call<unknown[]>(`/contacts/find?email=${encodeURIComponent(email)}`);
      return Array.isArray(found) && found.length > 0;
    },
    updateContact(body: ContactBody) {
      return call("/contacts/update", { method: "PUT", body: JSON.stringify(body) });
    },
    sendTransactional(o: { transactionalId: string; email: string; dataVariables: Record<string, string>; idempotencyKey: string }) {
      return call("/transactional", {
        method: "POST",
        headers: { "Idempotency-Key": o.idempotencyKey },
        body: JSON.stringify({ transactionalId: o.transactionalId, email: o.email, dataVariables: o.dataVariables }),
      });
    },
  };
}
