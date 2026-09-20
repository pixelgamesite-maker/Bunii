import { useEffect, useRef, useState, type FocusEvent } from "react";
import { BUNII_IMAGES } from "@/lib/bunii-data";
import { supabase } from "@/lib/supabase";
import { isValidEvm } from "@/lib/validators";

/**
 * Whitelist claw-machine game. Pseudo-3D (CSS perspective on the glass
 * case, flat sprites for the claw/prizes) — no 3D engine needed.
 *
 * Rule: grab 3+ prizes (winCount > 2) and a wallet-claim panel unlocks
 * below the machine. Submitting a valid EVM address writes a row to the
 * `bunii` table in Supabase — see supabase/bunii-table.sql for the schema.
 *
 * All game positioning is percentage-based (not pixel-measured) so it
 * stays correct across screen sizes without a resize observer.
 */

const CAP = 1000;
const WINS_TO_UNLOCK = 2; // "above 2" — i.e. the 3rd successful grab unlocks the claim
const RAIL_PAD = 6; // matches the rail's left/right inset, in %
const PRIZE_COUNT = 9;

type Prize = {
  id: number;
  img: string;
  xPct: number;
  bottomPct: number;
  rot: number;
  scale: number;
};

let prizeIdCounter = 0;

function makePrizes(): Prize[] {
  const usableL = RAIL_PAD + 4;
  const usableR = 100 - RAIL_PAD - 4;
  const arr: Prize[] = [];
  for (let i = 0; i < PRIZE_COUNT; i++) {
    arr.push({
      id: prizeIdCounter++,
      img: BUNII_IMAGES[i % BUNII_IMAGES.length],
      xPct: usableL + Math.random() * (usableR - usableL),
      bottomPct: 6 + Math.random() * 10,
      rot: Math.random() * 30 - 15,
      scale: 0.85 + Math.random() * 0.3,
    });
  }
  return arr;
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function ClawMachine() {
  const [claimed, setClaimed] = useState(247); // seeded so the counter feels alive
  const [winCount, setWinCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [clawPct, setClawPct] = useState(50); // 0-100 across the rail
  const [knobOffset, setKnobOffset] = useState(0);
  const [status, setStatus] = useState("Slide to aim, then GRAB");
  const [clawPhase, setClawPhase] = useState<"idle" | "open" | "grip">("idle");
  const [stringHeight, setStringHeight] = useState(20);
  const [prizes, setPrizes] = useState<Prize[]>(() => makePrizes());
  const [risingPrize, setRisingPrize] = useState<{ id: number; xPct: number } | null>(null);
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: "", show: false });

  // wallet claim panel
  const [wallet, setWallet] = useState("");
  const [claimSending, setClaimSending] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [claimError, setClaimError] = useState("");

  const clawPctRef = useRef(clawPct);
  clawPctRef.current = clawPct;
  const busyRef = useRef(busy);
  busyRef.current = busy;
  const joystickRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const unlocked = winCount > WINS_TO_UNLOCK;

  function showToast(msg: string, ms = 2200) {
    setToast({ msg, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), ms);
  }

  function clampPct(v: number) {
    return Math.max(RAIL_PAD, Math.min(100 - RAIL_PAD, v));
  }

  // ---- joystick drag ----
  useEffect(() => {
    let dragging = false;
    let startX = 0;
    const maxOffsetPx = 18;

    function start(e: MouseEvent | TouchEvent) {
      if (busyRef.current) return;
      dragging = true;
      startX = "touches" in e ? e.touches[0].clientX : e.clientX;
    }
    function move(e: MouseEvent | TouchEvent) {
      if (!dragging || busyRef.current) return;
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const dx = cx - startX;
      const clamped = Math.max(-maxOffsetPx, Math.min(maxOffsetPx, dx));
      setKnobOffset(clamped);
      const next = clampPct(clawPctRef.current + (clamped / maxOffsetPx) * 4.5);
      setClawPct(next);
      if ("touches" in e) e.preventDefault();
    }
    function end() {
      if (!dragging) return;
      dragging = false;
      setKnobOffset(0);
    }

    const zone = joystickRef.current;
    zone?.addEventListener("mousedown", start);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    zone?.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
    return () => {
      zone?.removeEventListener("mousedown", start);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      zone?.removeEventListener("touchstart", start);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };
  }, []);

  function nearestPrize(list: Prize[]) {
    let best: Prize | null = null;
    let bestD = Infinity;
    for (const p of list) {
      const d = Math.abs(p.xPct - clawPctRef.current);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    return { prize: best, dist: bestD };
  }

  async function doGrab() {
    if (busy) return;
    setBusy(true);
    setStatus("Dropping...");

    const dropDistance = 200; // matches the glass's fixed 230px height, minus head clearance
    setStringHeight(20 + dropDistance);
    setClawPhase("open");
    await wait(520);

    const { prize, dist } = nearestPrize(prizes);
    const success = !!prize && dist < 6 && Math.random() < 0.62;

    setClawPhase("grip");
    await wait(220);

    if (success && prize) {
      setStatus("Got one!");
      setRisingPrize({ id: prize.id, xPct: clawPctRef.current });
    } else {
      setStatus("Slipped away...");
    }

    await wait(400);
    setStringHeight(20);
    await wait(520);
    setClawPhase("idle");

    if (success && prize) {
      setPrizes((cur) => {
        const remaining = cur.filter((p) => p.id !== prize.id);
        return remaining.length < 4 ? makePrizes() : remaining;
      });
      setRisingPrize(null);

      setWinCount((c) => {
        const next = c + 1;
        if (next === WINS_TO_UNLOCK + 1) {
          showToast("Unlocked! Enter your wallet below to claim your spot.", 3200);
        } else if (next < WINS_TO_UNLOCK + 1) {
          showToast(`Nice grab! ${next}/${WINS_TO_UNLOCK + 1} to unlock wallet claim.`, 2200);
        } else {
          showToast("Nice grab!", 1800);
        }
        return next;
      });
      setStatus("Got one!");
    } else {
      setStatus("Slide to aim, then GRAB");
    }

    setBusy(false);
  }

  async function submitWallet() {
    if (!isValidEvm(wallet)) {
      setClaimError("That doesn't look like a valid EVM address (0x + 40 hex characters).");
      return;
    }
    if (claimSubmitted) return;

    setClaimError("");
    setClaimSending(true);

    const { error } = await supabase.from("bunii").insert([{ wallet: wallet.trim(), grabs: winCount }]);

    setClaimSending(false);

    if (error) {
      // Postgres unique_violation — this wallet already has a row
      if ((error as { code?: string }).code === "23505") {
        setClaimError("This wallet has already claimed a spot.");
      } else {
        setClaimError("Something went wrong submitting your wallet. Try again.");
      }
      return;
    }

    setClaimSubmitted(true);
    setClaimed((c) => Math.min(CAP, c + 1));
    showToast("You're on the BuniiList!", 2800);
  }

  function focusInp(e: FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = "rgba(126,227,224,0.66)";
  }
  function blurInp(e: FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = "rgba(126,227,224,0.22)";
  }

  const clawLeftPct = clawPct;
  const progressPct = Math.min(100, (claimed / CAP) * 100);

  return (
    <div style={containerStyle}>
      <style>{keyframes}</style>

      <div style={counterWrapStyle}>
        <div style={counterRowStyle}>
          <span>Spots claimed</span>
          <span>
            <b style={{ color: "var(--bunii-lime)" }}>{claimed}</b> / {CAP}
          </span>
        </div>
        <div style={barTrackStyle}>
          <div style={{ ...barFillStyle, width: `${progressPct}%` }} />
        </div>
      </div>

      <div style={machineStyle}>
        <div style={cabinetTopStyle}>
          <div style={marqueeStyle}>FREE MINT WHITELIST • FIRST 1000</div>
        </div>

        <div style={{ perspective: "900px", marginTop: "14px" }}>
          <div style={glassStyle}>
            <div style={glassShadeStyle} />
            <div style={railStyle} />

            <div style={{ ...clawRigStyle, left: `${clawLeftPct}%` }}>
              <div style={{ width: "2px", background: "rgba(255,255,255,0.5)", height: `${stringHeight}px`, transition: "height .5s cubic-bezier(.4,0,.2,1)" }} />
              <div style={{ width: "34px", height: "26px", position: "relative" }}>
                <div style={{ ...prongStyle, left: "4px", transform: clawPhase === "open" ? "rotate(-34deg)" : clawPhase === "grip" ? "rotate(-6deg)" : "rotate(-18deg)" }} />
                <div style={{ ...prongStyle, right: "4px", left: "auto", transform: clawPhase === "open" ? "rotate(34deg)" : clawPhase === "grip" ? "rotate(6deg)" : "rotate(18deg)" }} />
                <div style={knuckleStyle} />
              </div>
            </div>

            {prizes.map((p) => {
              const isRising = risingPrize?.id === p.id;
              return (
                <div
                  key={p.id}
                  style={{
                    position: "absolute",
                    width: "30px",
                    height: "30px",
                    left: `${isRising ? risingPrize!.xPct : p.xPct}%`,
                    bottom: isRising ? "82%" : `${p.bottomPct}%`,
                    transform: `translateX(-50%) rotate(${p.rot}deg) scale(${p.scale})`,
                    transition: "left .5s ease, bottom .5s ease",
                    zIndex: 3,
                    filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.4))",
                  }}
                >
                  <img src={p.img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                </div>
              );
            })}

            <div style={binFloorStyle} />
          </div>
        </div>

        <div style={cabinetBottomStyle}>
          <div ref={joystickRef} style={joystickZoneStyle}>
            <div style={{ ...joystickKnobStyle, transform: `translateX(${knobOffset}px)` }} />
          </div>
          <div style={statusTextStyle}>{status}</div>
          <button onClick={doGrab} disabled={busy} style={grabBtnStyle}>
            GRAB
          </button>
        </div>
      </div>

      <div style={progressRowStyle}>
        {Array.from({ length: WINS_TO_UNLOCK + 1 }).map((_, i) => (
          <div key={i} style={{ ...pipStyle, background: i < winCount ? "#c6ff5e" : "rgba(255,255,255,0.15)" }} />
        ))}
        <span style={progressLabelStyle}>{unlocked ? "Wallet claim unlocked" : `${winCount}/${WINS_TO_UNLOCK + 1} grabs to unlock wallet claim`}</span>
      </div>

      {unlocked && (
        <div style={claimPanelStyle}>
          {claimSubmitted ? (
            <p style={{ margin: 0, fontWeight: 700, color: "#c6ff5e", fontSize: "13px" }}>✓ Spot claimed — you're on the BuniiList.</p>
          ) : (
            <>
              <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#c9c0e8", fontWeight: 600 }}>Enter your EVM wallet to claim your spot</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="0x..."
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitWallet();
                  }}
                  onFocus={focusInp}
                  onBlur={blurInp}
                  style={claimInputStyle}
                />
                <button onClick={submitWallet} disabled={claimSending} style={claimBtnStyle}>
                  {claimSending ? "..." : "Claim"}
                </button>
              </div>
              {claimError && <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#ff6b6b" }}>{claimError}</p>}
            </>
          )}
        </div>
      )}

      <p style={footnoteStyle}>One wallet per spot — duplicate submissions are rejected. Grabs use placeholder odds for this prototype.</p>

      <div style={{ ...toastStyle, opacity: toast.show ? 1 : 0, transform: toast.show ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(20px)" }}>
        {toast.msg}
      </div>
    </div>
  );
}

/* ---- styles (scoped to this component; uses its own arcade palette) ---- */

const containerStyle: React.CSSProperties = {
  ["--bunii-lime" as any]: "#c6ff5e",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  color: "#f4efe6",
  fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
};

const keyframes = `
  @keyframes cardIn { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
`;

const counterWrapStyle: React.CSSProperties = { width: "100%", maxWidth: "420px", marginBottom: "14px" };
const counterRowStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#c9c0e8", marginBottom: "5px", fontWeight: 600 };
const barTrackStyle: React.CSSProperties = { height: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.08)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" };
const barFillStyle: React.CSSProperties = { height: "100%", background: "linear-gradient(90deg, #c6ff5e, #7ee3e0)", transition: "width .5s ease" };

const machineStyle: React.CSSProperties = { width: "100%", maxWidth: "420px", position: "relative" };
const cabinetTopStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #4c2270, #3a1a52)",
  borderRadius: "18px 18px 0 0",
  padding: "10px 14px 22px",
  boxShadow: "inset 0 -6px 14px rgba(0,0,0,0.35), 0 10px 30px rgba(0,0,0,0.4)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderBottom: "none",
};
const marqueeStyle: React.CSSProperties = {
  textAlign: "center",
  fontWeight: 800,
  fontSize: "13px",
  letterSpacing: "0.04em",
  color: "#160a2b",
  background: "linear-gradient(180deg, #ffd23f, #ffb347)",
  borderRadius: "10px",
  padding: "6px 0",
  boxShadow: "0 3px 0 rgba(0,0,0,0.25)",
};

const glassStyle: React.CSSProperties = {
  position: "relative",
  height: "230px",
  borderRadius: "10px",
  transform: "rotateX(6deg)",
  transformStyle: "preserve-3d",
  background: "linear-gradient(180deg, rgba(126,227,224,0.12), rgba(126,227,224,0.03) 60%), #26103a",
  border: "2px solid rgba(126,227,224,0.35)",
  boxShadow: "inset 0 0 30px rgba(126,227,224,0.15), inset 0 -40px 40px rgba(0,0,0,0.45)",
  overflow: "hidden",
};
const glassShadeStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(90deg, rgba(0,0,0,0.35), transparent 12%, transparent 88%, rgba(0,0,0,0.35))",
  pointerEvents: "none",
};
const binFloorStyle: React.CSSProperties = {
  position: "absolute",
  left: "6%",
  right: "6%",
  bottom: 0,
  height: "16px",
  background: "linear-gradient(180deg, rgba(126,227,224,0.25), transparent)",
  borderRadius: "50%",
  filter: "blur(2px)",
};
const railStyle: React.CSSProperties = { position: "absolute", top: "14px", left: "6%", right: "6%", height: "3px", background: "rgba(255,255,255,0.18)", borderRadius: "3px" };
const clawRigStyle: React.CSSProperties = { position: "absolute", top: "10px", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 };
const prongStyle: React.CSSProperties = {
  position: "absolute",
  top: "9px",
  width: "5px",
  height: "18px",
  background: "linear-gradient(180deg,#ffe27a, #ffd23f)",
  borderRadius: "2px",
  transformOrigin: "top center",
  boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
  transition: "transform .2s ease",
};
const knuckleStyle: React.CSSProperties = {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  background: "radial-gradient(circle at 35% 30%, #fff6d8, #ffd23f)",
  position: "absolute",
  top: 0,
  left: "11px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
};

const cabinetBottomStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #3a1a52, #26103a)",
  borderRadius: "0 0 16px 16px",
  padding: "16px 20px 18px",
  border: "1px solid rgba(255,255,255,0.06)",
  borderTop: "none",
  boxShadow: "0 16px 30px rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "14px",
};
const joystickZoneStyle: React.CSSProperties = {
  width: "78px",
  height: "78px",
  borderRadius: "50%",
  background: "radial-gradient(circle at 35% 30%, #57306f, #1c0d30)",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  touchAction: "none",
  cursor: "grab",
};
const joystickKnobStyle: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "radial-gradient(circle at 35% 30%, #ff9dc0, #ff4d8d)",
  boxShadow: "0 3px 8px rgba(0,0,0,0.5)",
  transition: "transform .05s linear",
};
const statusTextStyle: React.CSSProperties = { flex: 1, textAlign: "center", fontSize: "12px", color: "#c9c0e8", fontWeight: 600, minHeight: "16px" };
const grabBtnStyle: React.CSSProperties = {
  width: "78px",
  height: "78px",
  borderRadius: "50%",
  border: "none",
  background: "radial-gradient(circle at 35% 30%, #7dffb0, #3ddc84)",
  boxShadow: "0 4px 0 #1f9e5a, 0 8px 16px rgba(0,0,0,0.4)",
  fontWeight: 800,
  fontSize: "14px",
  color: "#0c2a18",
  cursor: "pointer",
};

const progressRowStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "6px", marginTop: "16px", maxWidth: "420px" };
const pipStyle: React.CSSProperties = { width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0, transition: "background .3s ease" };
const progressLabelStyle: React.CSSProperties = { fontSize: "11px", color: "#c9c0e8", marginLeft: "6px" };

const claimPanelStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "420px",
  marginTop: "14px",
  padding: "14px 16px",
  borderRadius: "12px",
  background: "rgba(126,227,224,0.08)",
  border: "1px solid rgba(126,227,224,0.3)",
};
const claimInputStyle: React.CSSProperties = {
  flex: 1,
  background: "rgba(0,0,0,0.4)",
  border: "1px solid rgba(126,227,224,0.22)",
  borderRadius: "6px",
  padding: "9px 11px",
  fontSize: "13px",
  color: "#fff",
  outline: "none",
  fontFamily: "inherit",
};
const claimBtnStyle: React.CSSProperties = {
  background: "#7ee3e0",
  color: "#0c2a2a",
  border: "none",
  borderRadius: "6px",
  padding: "0 18px",
  fontWeight: 800,
  fontSize: "12px",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  cursor: "pointer",
};

const footnoteStyle: React.CSSProperties = { maxWidth: "420px", textAlign: "center", fontSize: "12px", color: "#c9c0e8", marginTop: "16px", lineHeight: 1.5 };
const toastStyle: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  bottom: "24px",
  background: "#f4efe6",
  color: "#160a2b",
  fontWeight: 700,
  fontSize: "14px",
  padding: "12px 20px",
  borderRadius: "12px",
  transition: "opacity .25s ease, transform .25s ease",
  pointerEvents: "none",
  zIndex: 50,
  textAlign: "center",
  maxWidth: "80vw",
};
