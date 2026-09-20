// Arcade gate: the one-time task list a visitor clears before the game opens.
//
// localStorage decides what the visitor SEES (cleared visitors skip the tasks).
// Supabase holds the actual record. The two are kept in step, but storage is
// never trusted as the source of truth — if it's unavailable the visitor just
// gets asked again.

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
 * Write the gate entry to `bunii` and mark this device as cleared.
 * A handle that already exists counts as success — they're registered,
 * which is the whole point.
 */
export async function recordEntry(handle: string, commentUrl: string): Promise<{ ok: boolean; message?: string }> {
  const clean = handle.replace(/^@/, "").trim();

  const { error } = await supabase.from("bunii").insert([{ handle: clean, comment_url: commentUrl.trim() }]);

  if (error && (error as { code?: string }).code !== DUPLICATE) {
    return { ok: false, message: "Couldn't save your entry. Check your connection and try again." };
  }

  saveGate(clean, commentUrl);
  return { ok: true };
}

/**
 * Fill in the wallet on this player's row after a perfect run.
 * The RLS policy only allows an update where wallet is still null,
 * so a claimed spot can't be overwritten.
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
    .eq("handle", gate.handle)
    .is("wallet", null)
    .select("id");

  if (error) {
    if ((error as { code?: string }).code === DUPLICATE) {
      return { ok: false, message: "That wallet already holds a spot." };
    }
    return { ok: false, message: "Something went wrong. Try again." };
  }

  if (!data || data.length === 0) {
    return { ok: false, message: `@${gate.handle} has already claimed a spot.` };
  }

  return { ok: true };
}
