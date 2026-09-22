// Who's signed in, and how many points they have.
//
// Sign-in flow:
//   1. signIn() remembers where the player was, then sends them to X
//   2. X → Supabase → /auth/callback?code=…
//   3. pages/Auth/callback.tsx swaps the code for a session and sends
//      them back to where they started
//
// The header pill, the game and the social page all read from here, so
// banking a run or claiming a task updates the header instantly.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Provider, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { fetchStatus, type Status } from "@/lib/bunii-api";

// Supabase's X (OAuth 2.0) provider. Older supabase-js type definitions
// don't list "x" yet, hence the cast — the value is what the API expects.
export const X_AUTH_PROVIDER = "x" as Provider;

export const AUTH_CALLBACK_PATH = "/auth/callback";

/* ── return path ────────────────────────────────────────────────── */
// sessionStorage, so it survives the round trip to X but not a new tab.

const RETURN_KEY = "bunii_return_to";

function isSafePath(path: string | null): path is string {
  return !!path && path.startsWith("/") && !path.startsWith("//") && !path.startsWith(AUTH_CALLBACK_PATH);
}

function rememberReturnPath(path: string) {
  try {
    sessionStorage.setItem(RETURN_KEY, isSafePath(path) ? path : "/");
  } catch {
    // no storage — they'll land on the home page, which is fine
  }
}

/** Read and clear the saved path. Falls back to home. */
export function takeReturnPath(): string {
  try {
    const saved = sessionStorage.getItem(RETURN_KEY);
    sessionStorage.removeItem(RETURN_KEY);
    return isSafePath(saved) ? saved : "/";
  } catch {
    return "/";
  }
}

/* ── context ────────────────────────────────────────────────────── */

type Auth = {
  session: Session | null;
  loading: boolean;
  status: Status | null;
  statusError: string;
  authError: string;
  refresh: () => Promise<void>;
  applyStatus: (next: Status) => void;
  signIn: (returnPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status | null>(null);
  const [statusError, setStatusError] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let alive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setLoading(false);
    });

    // fires after the callback page exchanges its code, among other things
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user.id ?? null;

  const refresh = useCallback(async () => {
    if (!userId) {
      setStatus(null);
      return;
    }
    const res = await fetchStatus();
    if (res.ok) {
      setStatus(res.data);
      setStatusError("");
    } else {
      setStatusError(res.message);
    }
  }, [userId]);

  // refetch when the signed-in user changes, not on every token refresh
  useEffect(() => {
    refresh();
  }, [refresh]);

  const applyStatus = useCallback((next: Status) => setStatus(next), []);

  const signIn = useCallback(async (returnPath?: string) => {
    setAuthError("");
    rememberReturnPath(returnPath ?? `${window.location.pathname}${window.location.search}`);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: X_AUTH_PROVIDER,
      options: { redirectTo: `${window.location.origin}${AUTH_CALLBACK_PATH}` },
    });
    if (error) setAuthError(error.message);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setStatus(null);
  }, []);

  const value = useMemo<Auth>(
    () => ({ session, loading, status, statusError, authError, refresh, applyStatus, signIn, signOut }),
    [session, loading, status, statusError, authError, refresh, applyStatus, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}
