import { useState } from "react";
import { creamInk, goldLine, plum, plumDeep, plumLift, serif } from "@/lib/bunii-theme";
import { useAuth } from "@/lib/auth";
import { isEvmAddress, shortAddress, submitWallet } from "@/lib/bunii-api";

export function WalletClaim() {
  const { status, applyStatus } = useAuth();
  const [wallet, setWallet] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!status) return null;

  const unlocked = status.total >= status.threshold;
  const remaining = Math.max(0, status.threshold - status.total);

  async function submit() {
    if (!isEvmAddress(wallet)) {
      setErr("That doesn't look like an EVM address (0x + 40 characters).");
      return;
    }
    setErr("");
    setBusy(true);
    const res = await submitWallet(wallet);
    setBusy(false);
    if (!res.ok) {
      setErr(res.message);
      return;
    }
    applyStatus(res.data);
  }

  return (
    <section className={`wc${status.wallet ? " wc--done" : unlocked ? " wc--open" : ""}`}>
      <style>{`
        .wc{
          position:relative;border-radius:22px;padding:24px 22px;
          display:flex;flex-direction:column;gap:10px;
          background:linear-gradient(180deg, ${plum} 0%, ${plumDeep} 100%);
          box-shadow:inset 0 0 0 1px ${goldLine}2e;
        }
        .wc--open{
          background:
            radial-gradient(90% 70% at 50% 0%, ${plumLift} 0%, transparent 72%),
            linear-gradient(180deg, ${plum} 0%, ${plumDeep} 100%);
          box-shadow:inset 0 0 0 1px ${goldLine}80, 0 0 60px -24px ${goldLine}88;
        }
        .wc--done{box-shadow:inset 0 0 0 1px ${goldLine}, 0 0 60px -24px ${goldLine}aa;}
        .wc h2{margin:0;font-family:${serif};font-weight:800;font-size:1.4rem;line-height:1.15;}
        .wc p{margin:0;font-weight:300;font-size:.92rem;line-height:1.55;color:${creamInk}a6;}
        .wc__row{display:flex;gap:8px;margin-top:4px;}
        .wc__row .btn{flex-shrink:0;}
        .wc__addr{
          display:inline-flex;align-self:flex-start;align-items:center;gap:8px;margin-top:4px;
          padding:10px 16px;border-radius:999px;
          font-family:${serif};font-weight:800;font-size:1rem;color:${goldLine};
          background:${goldLine}14;box-shadow:inset 0 0 0 1px ${goldLine}4d;
        }
        .wc__fine{font-size:.74rem !important;color:${creamInk}59 !important;}
        @media (max-width:480px){.wc__row{flex-direction:column;}.wc__row .btn{width:100%;}}
      `}</style>

      {status.wallet ? (
        <>
          <p className="eyebrow">Spot secured</p>
          <h2>You're in.</h2>
          <p>This wallet is locked to @{status.handle}. Nothing else to do.</p>
          <span className="wc__addr">{shortAddress(status.wallet)}</span>
        </>
      ) : unlocked ? (
        <>
          <p className="eyebrow">Unlocked</p>
          <h2>Claim your spot.</h2>
          <p>You've cleared {status.threshold.toLocaleString()} points. One wallet per account — it can't be changed.</p>
          <div className="wc__row">
            <input
              className="field"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="0x..."
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />
            <button type="button" className="btn" onClick={submit} disabled={busy || !wallet.trim()}>
              {busy ? "Claiming…" : "Claim"}
            </button>
          </div>
          {err && <p className="err">{err}</p>}
          <p className="wc__fine">Public address only. Never share a seed phrase or private key.</p>
        </>
      ) : (
        <>
          <p className="eyebrow">Wallet slot · locked</p>
          <h2>{remaining.toLocaleString()} points to go.</h2>
          <p>Reach {status.threshold.toLocaleString()} points from tasks and arcade runs to unlock your wallet slot.</p>
        </>
      )}
    </section>
  );
}
