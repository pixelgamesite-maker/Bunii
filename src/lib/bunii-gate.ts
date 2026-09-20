// Arcade gate: the one-time task list a visitor clears before the game opens.
//
// localStorage decides what the visitor SEES (cleared visitors skip the tasks).
// Supabase holds the record. Storage is never trusted as the source of truth —
// if it's unavailable the visitor is simply asked again.

import { supabase } from "@/lib/supabase";

const KEY = "bunii_arcade_gate_v1";

export const X_PROFILE_URL = "https://x.com/bunionrh?s=20";
export const PINNED_TWEET_URL = "https://x.com/bunionrh/status/2101356079699439883?s=20";

const DUPLICATE = "23505"; // Postgres unique_violation

export type GateRecord = {
  handle: string;
  commentUrl: string;
  clearedAt: string;
};

export function readGate(): GateRecord | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GateRecord>;
    if (!parsed?.handle || !parsed?.commentUrl) return null;
    return parsed as GateRecord;
  } catch {
    return null;
  }
}

export function isGateCleared() {
  return readGate() !== null;
}

function saveGate(handle: string, commentUrl: string) {
  const record: GateRecord = {
    handle: handle.replace(/^@/, "").trim(),
    commentUrl: commentUrl.trim(),
    clearedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    // the visitor will be asked again next time — nothing else to do
  }
  return record;
}

/** X allows 1–15 characters: letters, numbers and underscore. */
export function isValidHandle(raw: string) {
  return /^@?[A-Za-z0-9_]{1,15}$/.test(raw.trim());
}

/** A comment link has to actually point at x.com or twitter.com. */
export function isXStatusUrl(raw: string) {
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const host = u.hostname.replace(/^www\./, "");
    return host === "x.com" || host === "twitter.com";
  } catch {
    return false;
  }
}

/**
 * A request that never reached the server has no Postgres code — that's
 * almost always an ad blocker or wallet extension eating the call, so it
 * gets its own message rather than a vague "try again".
 */
function isNetworkError(error: unknown) {
  return !(error as { code?: string })?.code;
}

/**
 * Write the gate entry to `bunii` and mark this device as cleared.
 * A handle that already exists counts as success — they're registered,
 * which is the whole point.
 */
export async function recordEntry(handle: string, commentUrl: string): Promise<{ ok: boolean; message?: string }> {
  const clean = handle.replace(/^@/, "").trim();

  const { error } = await supabase.from("bunii").insert([{ handle: clean, comment_url: commentUrl.trim() }]);

  if (error && (error as { code?: string }).code !== DUPLICATE) {
    console.error("bunii entry failed:", error);
    return {
      ok: false,
      message: isNetworkError(error)
        ? "Couldn't reach the server. An ad blocker or wallet extension may be blocking it — try turning extensions off for this site."
        : "Couldn't save your entry. Try again.",
    };
  }

  saveGate(clean, commentUrl);
  return { ok: true };
}

/**
 * Fill in the wallet on this player's row after a perfect run.
 *
 * Two things to know about the query below.
 *
 * 1. `ilike` with no wildcards is an exact case-insensitive match, lining up
 *    with the lower(handle) unique index — @Baron and @baron are one person.
 *
 * 2. There is deliberately no `.is("wallet", null)` filter. Naming a column
 *    in a WHERE clause requires SELECT privilege on it, and anon must never
 *    be able to read `wallet`. The guard is not lost: the RLS policy's
 *    `using (wallet is null)` hides already-claimed rows from the update, so
 *    a claimed spot still can't be overwritten and still comes back as zero
 *    rows affected.
 *
 * `handle` and `id` do need a column-level grant — see bunii-grant-fix.sql.
 */
export async function claimWallet(
  wallet: string,
  fastestMs: number,
  averageMs: number,
): Promise<{ ok: boolean; message?: string }> {
  const gate = readGate();
  if (!gate) {
    return { ok: false, message: "We lost your entry on this device. Clear the tasks again to claim." };
  }

  const { data, error } = await supabase
    .from("bunii")
    .update({
      wallet: wallet.trim(),
      fastest_ms: fastestMs,
      average_ms: averageMs,
      claimed_at: new Date().toISOString(),
    })
    .ilike("handle", gate.handle)
    .select("id");

  if (error) {
    console.error("bunii claim failed:", error);
    if ((error as { code?: string }).code === DUPLICATE) {
      return { ok: false, message: "That wallet already holds a spot." };
    }
    return {
      ok: false,
      message: isNetworkError(error)
        ? "Couldn't reach the server. An ad blocker or wallet extension may be blocking it."
        : "Something went wrong. Try again.",
    };
  }

  if (!data || data.length === 0) {
    return { ok: false, message: `No open spot found for @${gate.handle}. It may already be claimed.` };
  }

  return { ok: true };
}
