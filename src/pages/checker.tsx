import { useState } from "react";
import { useAccount } from "wagmi";
import { isAddress, getAddress } from "viem";
import { color, displayType, radius, offset } from "@/lib/theme";
import { ALLOWLIST_API_URL } from "@/lib/buniiPadContract";
import NavLink from "@/components/nav-link";

type Result = { state: "idle" | "checking" | "yes" | "no" | "error"; address?: string };

export default function Checker() {
  const { address: connected, isConnected } = useAccount();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result>({ state: "idle" });

  async function check(raw: string) {
    const trimmed = raw.trim();
    if (!isAddress(trimmed, { strict: false })) {
      setResult({ state: "error", address: trimmed });
      return;
    }
    const address = getAddress(trimmed);
    setResult({ state: "checking", address });
    try {
      const res = await fetch(`${ALLOWLIST_API_URL}/api/allowlist-proof?address=${address}`);
      if (!res.ok) throw new Error();
      const { eligible } = await res.json();
      setResult({ state: eligible ? "yes" : "no", address });
    } catch {
      setResult({ state: "error", address });
    }
  }

  const card: React.CSSProperties = {
    background: color.card, borderRadius: radius.lg, padding: "28px",
    boxShadow: `inset 0 0 0 1px ${color.line}`,
  };
  const input_: React.CSSProperties = {
    width: "100%", padding: "15px 18px", borderRadius: radius.pill, border: "none",
    background: color.paperDeep, color: color.ink, fontSize: "0.98rem", outline: "none",
  };

  const badWalletFormat = result.state === "error" && !isAddress(result.address ?? "", { strict: false });

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "72px 20px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h1
          style={{
            ...displayType, fontWeight: 700, fontSize: "clamp(2.4rem, 7vw, 3.4rem)",
            letterSpacing: "-0.04em", lineHeight: 1, margin: "0 0 14px",
          }}
        >
          Check your spot
        </h1>
        <p style={{ color: color.inkSoft, fontSize: "1.02rem", lineHeight: 1.55, margin: 0 }}>
          Paste a wallet address to see if it's on the Bunii allowlist.
        </p>
      </div>

      <div style={card}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check(input)}
          placeholder="0x…"
          spellCheck={false}
          style={input_}
        />

        {isConnected && connected && (
          <button
            onClick={() => { setInput(connected); check(connected); }}
            className="press"
            style={{
              marginTop: "12px", width: "100%", padding: "13px", borderRadius: radius.pill,
              border: "none", background: "transparent", boxShadow: `inset 0 0 0 1px ${color.line}`,
              color: color.inkSoft, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
            }}
          >
            Use my connected wallet
          </button>
        )}

        <button
          onClick={() => check(input)}
          disabled={!input.trim() || result.state === "checking"}
          className={input.trim() ? "press" : undefined}
          style={{
            marginTop: "16px", width: "100%", height: "56px", borderRadius: radius.pill, border: "none",
            fontWeight: 700, fontSize: "1rem",
            cursor: input.trim() && result.state !== "checking" ? "pointer" : "not-allowed",
            background: input.trim() ? color.ink : color.paperDeep,
            color: input.trim() ? color.moon : color.inkFaint,
          }}
        >
          {result.state === "checking" ? "Checking…" : "Check eligibility"}
        </button>
      </div>

      {result.state !== "idle" && result.state !== "checking" && (
        <div
          style={{
            ...card, marginTop: "18px",
            background: result.state === "yes" ? color.deep : card.background,
            color: result.state === "yes" ? color.moon : color.ink,
            boxShadow: result.state === "yes" ? "none" : card.boxShadow,
            textAlign: "center",
          }}
        >
          {result.state === "yes" && (
            <>
              <p style={{ ...displayType, fontWeight: 650, fontSize: "1.6rem", margin: "0 0 8px" }}>
                You're on the allowlist 🐇
              </p>
              <p style={{ color: "rgba(255,246,226,0.7)", margin: "0 0 20px", fontSize: "0.95rem" }}>
                {result.address}
              </p>
              <NavLink
                href="/mint"
                className="press"
                style={{
                  display: "inline-block", fontWeight: 700, padding: "14px 26px", borderRadius: radius.pill,
                  background: color.sun, color: color.ink,
                }}
              >
                Go mint
              </NavLink>
            </>
          )}
          {result.state === "no" && (
            <>
              <p style={{ ...displayType, fontWeight: 650, fontSize: "1.4rem", margin: "0 0 8px" }}>
                Not on the allowlist yet
              </p>
              <p style={{ color: color.inkSoft, margin: 0, fontSize: "0.95rem" }}>
                This wallet can still mint once the public phase opens.
              </p>
            </>
          )}
          {result.state === "error" && (
            <p style={{ color: color.tongue, margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>
              {badWalletFormat ? "That doesn't look like a valid wallet address." : "Couldn't check eligibility right now — try again shortly."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
