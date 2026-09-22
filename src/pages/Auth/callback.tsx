import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { takeReturnPath, useAuth } from "@/lib/auth";
import { creamInk, goldLine, serif } from "@/lib/bunii-theme";
import { SiteShell } from "@/components/bunii/SiteShell";

/** X and Supabase report failures as ?error_description=… (or in the hash). */
function readFailure(): string {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const raw =
    search.get("error_description") ?? hash.get("error_description") ?? search.get("error") ?? hash.get("error");
  return raw ? raw.replace(/\+/g, " ") : "";
}

export default function AuthCallback() {
  const [, navigate] = useLocation();
  const { signIn } = useAuth();
  const [error, setError] = useState("");

  // A PKCE code can only be exchanged once. StrictMode runs effects twice in
  // development, so guard it — the ref survives the double invoke.
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const failure = readFailure();
    if (failure) {
      setError(failure);
      return;
    }

    const code = new URLSearchParams(window.location.search).get("code");

    (async () => {
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          // A refresh on this page re-sends a spent code. If a session
          // already exists, that's fine — carry on.
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            console.error("auth exchange failed:", exchangeError);
            setError(exchangeError.message);
            return;
          }
        }
      } else {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setError("No sign-in code came back from X.");
          return;
        }
      }

      navigate(takeReturnPath(), { replace: true });
    })();
  }, [navigate]);

  return (
    <SiteShell>
      <style>{`
        .cb{
          flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
          gap:14px;padding:48px 20px;text-align:center;
        }
        .cb h1{margin:0;font-family:${serif};font-weight:800;font-size:clamp(1.7rem,5vw,2.3rem);line-height:1.1;}
        .cb p{margin:0;font-weight:300;font-size:.95rem;line-height:1.55;color:${creamInk}a6;max-width:40ch;}
        .cb__actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:8px;}
        .cb__spin{
          width:34px;height:34px;border-radius:50%;
          border:2px solid ${goldLine}33;border-top-color:${goldLine};
          animation:cbspin .8s linear infinite;
        }
        @keyframes cbspin{to{transform:rotate(360deg)}}
      `}</style>

      <main className="cb">
        {error ? (
          <>
            <p className="eyebrow">Sign-in failed</p>
            <h1>X didn't let you through.</h1>
            <p className="err">{error}</p>
            <div className="cb__actions">
              <button type="button" className="btn" onClick={() => signIn(takeReturnPath())}>
                Try again
              </button>
              <Link href="/" className="btn btn--ghost">
                Back home
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="cb__spin" aria-hidden />
            <h1>Signing you in…</h1>
            <p>Hang on while X hands you over.</p>
          </>
        )}
      </main>
    </SiteShell>
  );
}
