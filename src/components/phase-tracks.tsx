import { color, displayType, radius } from "@/lib/theme";
import { PHASE } from "@/lib/buniiPadContract";

type Elig = "idle" | "checking" | "yes" | "no" | "error";
type Tone = "good" | "bad" | "muted";

function num(v: unknown) {
  return v === undefined || v === null ? null : Number(v);
}

function Track({
  name, minted, cap, active, status, tone, tint,
}: {
  name: string; minted: number | null; cap: number | null; active: boolean;
  status?: string; tone?: Tone; tint: string;
}) {
  const pct = minted !== null && cap ? Math.min(100, (minted / cap) * 100) : 0;

  return (
    <div
      style={{
        padding: "16px 18px", borderRadius: radius.md,
        background: active ? color.paper : "transparent",
        boxShadow: active ? `inset 0 0 0 1px ${color.line}` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <span
          style={{
            width: "9px", height: "9px", borderRadius: "50%", flexShrink: 0,
            background: active ? tint : color.inkFaint,
            animation: active ? "pulse 1.8s ease-in-out infinite" : "none",
          }}
        />
        <span style={{ fontWeight: 700, fontSize: "1rem" }}>{name}</span>
        {active && (
          <span style={{ fontSize: "0.76rem", fontWeight: 600, color: color.inkSoft, background: color.paperDeep, padding: "2px 9px", borderRadius: radius.pill }}>
            Live
          </span>
        )}
        <span style={{ marginLeft: "auto", fontSize: "0.92rem", fontWeight: 600, whiteSpace: "nowrap" }}>
          {minted !== null ? minted.toLocaleString() : "—"}
          <span style={{ color: color.inkFaint, fontWeight: 500 }}> / {cap !== null ? cap.toLocaleString() : "—"}</span>
        </span>
      </div>

      <div style={{ height: "8px", borderRadius: radius.pill, background: color.paperDeep, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: tint, borderRadius: radius.pill, transition: "width 0.6s cubic-bezier(0.2,0,0,1)" }} />
      </div>

      {status && (
        <p
          style={{
            fontSize: "0.86rem", margin: "9px 0 0", lineHeight: 1.45,
            color: tone === "good" ? "#2E9E6A" : tone === "bad" ? color.tongue : color.inkSoft,
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}

export default function PhaseTracks({
  phase, teamMinted, teamCap, allowlistMinted, allowlistCap,
  publicMinted, mintableSupply, elig, isConnected,
}: {
  phase: number;
  teamMinted: unknown; teamCap: unknown;
  allowlistMinted: unknown; allowlistCap: unknown;
  publicMinted: unknown; mintableSupply: unknown;
  elig: Elig;
  isConnected: boolean;
}) {
  const tMinted = num(teamMinted), tCap = num(teamCap);
  const alMinted = num(allowlistMinted), alCap = num(allowlistCap);
  const pubMinted = num(publicMinted), mintable = num(mintableSupply);

  // Public draws from whatever the allowlist didn't use — one shared pool.
  const publicCeiling = mintable !== null && alMinted !== null ? mintable - alMinted : null;

  function allowlistStatus(): [string, Tone] {
    if (isConnected) {
      if (elig === "checking") return ["Checking your wallet…", "muted"];
      if (elig === "yes") return ["You're on the allowlist.", "good"];
      if (elig === "no") return ["This wallet isn't on the allowlist.", "bad"];
      if (elig === "error") return ["Couldn't check eligibility right now. Try again shortly.", "bad"];
      return ["", "muted"];
    }
    if (phase === PHASE.PUBLIC) return ["", "muted"];
    return ["Connect your wallet to check your spot.", "muted"];
  }

  const [alStatus, alTone] = allowlistStatus();

  return (
    <section style={{ background: color.card, borderRadius: radius.lg, padding: "22px 12px 14px", boxShadow: `inset 0 0 0 1px ${color.line}` }}>
      <h2 style={{ ...displayType, fontWeight: 650, fontSize: "1.45rem", letterSpacing: "-0.02em", margin: "0 8px 12px" }}>
        Supply by phase
      </h2>

      <Track
        name="Team reserve" minted={tMinted} cap={tCap} active={false} tint={color.ink}
        status="Minted by the team, never sold." tone="muted"
      />
      <Track
        name="Allowlist" minted={alMinted} cap={alCap} active={phase === PHASE.ALLOWLIST} tint={color.brand}
        status={alStatus || undefined} tone={alTone}
      />
      <Track
        name="Public" minted={pubMinted} cap={publicCeiling} active={phase === PHASE.PUBLIC} tint="#E3A915"
        status={phase === PHASE.PUBLIC ? "Open to everyone." : "Unclaimed allowlist supply rolls into this phase."}
        tone={phase === PHASE.PUBLIC ? "good" : "muted"}
      />

      <p style={{ fontSize: "0.84rem", color: color.inkFaint, margin: "8px 18px 0", lineHeight: 1.5 }}>
        Allowlist and public share one pool of {mintable !== null ? mintable.toLocaleString() : "—"}.
      </p>
    </section>
  );
}
