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

/**
 * Two tracks, not three: Team (fixed reserve) and Mintable (allowlist +
 * public combined). The contract pools allowlist and public into one
 * MINTABLE_SUPPLY with rollover — Allowlist and Public were never really
 * separate ceilings, just two prices on the same pool — so showing them
 * as one number here matches the actual mechanics instead of implying a
 * fixed public allocation that doesn't exist.
 */
export default function PhaseTracks({
  phase, teamMinted, teamCap, allowlistMinted, publicMinted, mintableSupply, elig, isConnected,
}: {
  phase: number;
  teamMinted: unknown; teamCap: unknown;
  allowlistMinted: unknown; publicMinted: unknown; mintableSupply: unknown;
  elig: Elig;
  isConnected: boolean;
}) {
  const tMinted = num(teamMinted), tCap = num(teamCap);
  const alMinted = num(allowlistMinted), pubMinted = num(publicMinted), mintable = num(mintableSupply);
  const mintableMinted = alMinted !== null && pubMinted !== null ? alMinted + pubMinted : null;

  const isAllowlist = phase === PHASE.ALLOWLIST;
  const isPublic = phase === PHASE.PUBLIC;
  const tint = isPublic ? "#E3A915" : color.brand;

  function mintableStatus(): [string, Tone] {
    if (isPublic) return ["Open to everyone.", "good"];
    if (isAllowlist) {
      if (isConnected) {
        if (elig === "checking") return ["Checking your wallet…", "muted"];
        if (elig === "yes") return ["You're on the allowlist.", "good"];
        if (elig === "no") return ["This wallet isn't on the allowlist.", "bad"];
        if (elig === "error") return ["Couldn't check eligibility right now.", "bad"];
        return ["", "muted"];
      }
      return ["Connect your wallet to check your spot.", "muted"];
    }
    return ["Minting hasn't opened yet.", "muted"];
  }

  const [status, tone] = mintableStatus();

  return (
    <section style={{ background: color.card, borderRadius: radius.lg, padding: "22px 12px 14px", boxShadow: `inset 0 0 0 1px ${color.line}` }}>
      <h2 style={{ ...displayType, fontWeight: 650, fontSize: "1.45rem", letterSpacing: "-0.02em", margin: "0 8px 12px" }}>
        Supply
      </h2>

      <Track
        name="Team" minted={tMinted} cap={tCap} active={false} tint={color.ink}
        status="Reserved. Minted by the team, never sold." tone="muted"
      />
      <Track
        name="Mintable" minted={mintableMinted} cap={mintable} active={isAllowlist || isPublic} tint={tint}
        status={status || undefined} tone={tone}
      />
    </section>
  );
}
