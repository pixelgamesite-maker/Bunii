import { useState } from "react";
import { creamInk, goldLine, plum, plumDeep, plumLift, serif } from "@/lib/bunii-theme";
import { useAccount } from "@/lib/bunii-account";
import { XGlyph } from "@/components/bunii/SiteShell";

export function SignInCard({ title, body }: { title: string; body: string }) {
  const { signIn, authError } = useAccount();
  const [busy, setBusy] = useState(false);

  return (
    <div className="signin">
      <style>{`
        .signin{
          width:100%;max-width:440px;margin:0 auto;
          display:flex;flex-direction:column;align-items:center;gap:12px;
          text-align:center;padding:34px 26px 28px;border-radius:24px;
          background:
            radial-gradient(90% 60% at 50% 0%, ${plumLift} 0%, transparent 70%),
            linear-gradient(180deg, ${plum} 0%, ${plumDeep} 100%);
          box-shadow:inset 0 0 0 1px ${goldLine}40, 0 40px 80px -40px #000;
        }
        .signin__mark{
          width:56px;height:56px;border-radius:50%;margin-bottom:4px;
          display:flex;align-items:center;justify-content:center;
          color:${plumDeep};background:radial-gradient(circle at 34% 30%, #F0E2C4, ${goldLine});
          box-shadow:0 0 34px -8px ${goldLine}aa;
        }
        .signin h2{margin:0;font-family:${serif};font-weight:800;font-size:1.6rem;line-height:1.1;}
        .signin p{margin:0;font-weight:300;font-size:.94rem;line-height:1.55;color:${creamInk}a6;max-width:32ch;}
        .signin .btn{margin-top:8px;}
        .signin small{font-size:.72rem;color:${creamInk}59;}
      `}</style>

      <div className="signin__mark">
        <XGlyph size={22} />
      </div>
      <h2>{title}</h2>
      <p>{body}</p>

      {authError && <p className="err">Sign-in didn't go through: {authError}</p>}

      <button
        type="button"
        className="btn btn--block"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await signIn();
          setBusy(false);
        }}
      >
        <XGlyph size={13} />
        {busy ? "Opening X…" : "Sign in with X"}
      </button>
      <small>Read-only. Bunii never posts for you.</small>
    </div>
  );
}
