// Every call the site makes to Supabase. Nothing here writes to a table
// directly — it all goes through the security-definer functions in
// supabase/bunii-schema.sql, which know who the caller is from auth.uid().

import { supabase } from "@/lib/supabase";

export const X_PROFILE_URL = "https://x.com/bunionrh";

// Display only. The server is the authority on both — see bunii_points_per_catch()
// and bunii_threshold() in the schema.
export const POINTS_PER_CATCH = 50;

export type Status = {
  handle: string;
  avatar: string | null;
  game_points: number;
  social_points: number;
  total: number;
  threshold: number;
  wallet: string | null;
  completed: string[];
};

export type SocialTask = {
  key: string;
  label: string;
  hint: string;
  points: number;
  url: string;
  needs_proof: boolean;
  sort: number;
};

export type RunResult = {
  catches: number;
  points: number;
  total: number;
  threshold: number;
};

export type Result<T> = { ok: true; data: T } | { ok: false; message: string };

/* ── error messages ─────────────────────────────────────────────── */
// The SQL functions raise short keys; these are what the player sees.

const MESSAGES: Record<string, string> = {
  not_signed_in: "Sign in with X first.",
  unknown_task: "That task doesn't exist.",
  bad_proof: "Paste the link to your post — it should look like x.com/you/status/…",
  proof_not_yours: "That post is from a different account. Use a link from your own X account.",
  proof_used: "That post has already been used for points.",
  bad_wallet: "That doesn't look like an EVM address (0x + 40 characters).",
  already_claimed: "You've already locked in a wallet.",
  not_enough_points: "You need more points before you can claim.",
  wallet_taken: "That wallet is already registered to another player.",
  run_not_found: "That run expired. Start a new one.",
  run_finished: "That run was already banked.",
};

type PgError = { code?: string; message?: string } | null;

function friendly(error: PgError): string {
  if (!error) return "Something went wrong.";

  const key = (error.message ?? "").trim();
  if (MESSAGES[key]) return MESSAGES[key];

  console.error("bunii api error:", error);

  // A request that never reached Postgres has no code — almost always an
  // ad blocker or wallet extension blocking supabase.co.
  if (!error.code) {
    return "Couldn't reach the server. An ad blocker or wallet extension may be blocking it.";
  }
  if (error.code === "23505") return "That's already been used.";
  return "Something went wrong. Try again.";
}

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<Result<T>> {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) return { ok: false, message: friendly(error) };
  return { ok: true, data: data as T };
}

/* ── calls ──────────────────────────────────────────────────────── */

export const fetchStatus = () => rpc<Status>("my_status");

export const startRun = () => rpc<string>("start_run");

export const finishRun = (runId: string, catches: number) =>
  rpc<RunResult>("finish_run", { p_run: runId, p_catches: catches });

export const claimTask = (key: string, proof?: string) =>
  rpc<Status>("claim_task", { p_key: key, p_proof: proof ?? null });

export const submitWallet = (wallet: string) => rpc<Status>("submit_wallet", { p_wallet: wallet });

export async function fetchTasks(): Promise<Result<SocialTask[]>> {
  const { data, error } = await supabase.from("social_tasks").select("*").order("sort");
  if (error) return { ok: false, message: friendly(error) };
  return { ok: true, data: (data ?? []) as SocialTask[] };
}

export function isEvmAddress(value: string) {
  return /^0x[0-9a-fA-F]{40}$/.test(value.trim());
}

export function shortAddress(value: string) {
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}
