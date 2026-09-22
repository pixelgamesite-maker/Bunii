// One place that knows who's signed in and how many points they have.
// The header pill, the game and the social page all read from here, so
// banking a run or claiming a task updates the header instantly.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Provider, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { fetchStatus, type Status } from "@/lib/bunii-api";

// Supabase's X provider. If your dashboard lists the newer
// "X / Twitter (OAuth 2.0)" provider instead, its key may differ —
// check Authentication → Providers and change this one line.
export const X_AUTH_PROVIDER: Provider = "twitter";

type Account = {
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

const AccountContext = createContext<Account | null>(null);

/** If X or Supabase bounced the sign-in, the reason arrives in the URL. */
function readAuthError(): string {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const desc = search.get("error_description") ?? hash.get("error_description");
  const code = search.get("error") ?? hash.get("error");
  if (!desc && !code) return "";

  const clean = new URL(window.location.href);
  ["error", "error_code", "error_description"].forEach((k) => clean.searchParams.delete(k));
  clean.hash = "";
  window.history.replaceState(null, "", clean.toString());

  return (desc ?? code ?? "").replace(/\+/g, " ");
}

export function BuniiProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status | null>(null);
  const [statusError, setStatusError] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    setAuthError(readAuthError());

    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setLoading(false);
    });

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
    const path = returnPath ?? window.location.pathname;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: X_AUTH_PROVIDER,
      options: { redirectTo: `${window.location.origin}${path}` },
    });
    if (error) setAuthError(error.message);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setStatus(null);
  }, []);

  const value = useMemo<Account>(
    () => ({ session, loading, status, statusError, authError, refresh, applyStatus, signIn, signOut }),
    [session, loading, status, statusError, authError, refresh, applyStatus, signIn, signOut],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const value = useContext(AccountContext);
  if (!value) throw new Error("useAccount must be used inside <BuniiProvider>");
  return value;
}
