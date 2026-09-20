// Arcade gate: the one-time task list a visitor clears before the game opens.
//
// Cleared state lives in localStorage, so a returning visitor goes straight
// through. If storage is unavailable (private mode, blocked), every helper
// degrades to "not cleared" and the visitor simply sees the tasks again —
// annoying, never broken.

const KEY = "bunii_arcade_gate_v1";

export const X_PROFILE_URL = "https://x.com/bunionrh?s=20";
export const PINNED_TWEET_URL = "https://x.com/bunionrh/status/2101356079699439883?s=20";

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

export function clearGate(handle: string, commentUrl: string) {
  const record: GateRecord = {
    handle: handle.replace(/^@/, "").trim(),
    commentUrl: commentUrl.trim(),
    clearedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    // nothing to do — the visitor will be asked again next time
  }
  return record;
}

/** X allows 1–15 characters, letters, numbers and underscore. */
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
