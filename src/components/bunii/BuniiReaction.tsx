import { useCallback, useEffect, useRef, useState } from "react";
import { creamInk, goldLine, plum, plumDeep, plumLift, sans, serif, surface, violetGlow } from "@/lib/bunii-theme";
import { supabase } from "@/lib/supabase";
import { isValidEvm } from "@/lib/validators";

/* ── tuning ─────────────────────────────────────────────────────── */

const SPRITES = ["/bun1.png", "/bun2.png", "/bun3.png", "/bun4.png", "/bun5.png"];

// Fall time tightens across the five drops. Lower = harder.
const FALL_FIRST = 1000;
const FALL_LAST = 520;

// Gap between drops. Deliberately wide so the wait is unnerving.
const GAP_MIN = 650;
const GAP_MAX = 2100;

// Chance a drop brings a second bun with it, once two are still hanging.
const DOUBLE_CHANCE = 0.38;
const DOUBLE_OFFSET_MIN = 110;
const DOUBLE_OFFSET_MAX = 380;

type SlotState = "hung" | "falling" | "caught" | "lost";
type Phase = "idle" | "playing" | "won" | "failed";

type Slot = { state: SlotState; startedAt: number; duration: number };

export function BuniiReaction() {
  const stageRef = useRef<HTMLDivElement>(null);
  const bunRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [collected, setCollected] = useState<boolean[]>(() => SPRITES.map(() => false));
  const [reaction, setReaction] = useState<number | null>(null);
  const [bestReaction, setBestReaction] = useState<number | null>(null);
  const [flash, setFlash] = useState<"none" | "hit" | "miss">("none");

  // wallet claim
  const [wallet, setWallet] = useState("");
  const [sending, setSending] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimErr, setClaimErr] = useState("");

  const g = useRef({
    phase: "idle" as Phase,
    slots: SPRITES.map<Slot>(() => ({ state: "hung", startedAt: 0, duration: FALL_FIRST })),
    dropped: 0,
    caught: 0,
    nextDrop: 0,
    queued: null as { index: number; at: number } | null,
    fallHeight: 300,
    reactions: [] as number[],
  });

  useEffect(() => {
    try {
      const r = localStorage.getItem("bunii_reaction_ms");
      if (r) setBestReaction(parseInt(r, 10));
      if (localStorage.getItem("bunii_gtd_submitted") === "true") setClaimed(true);
    } catch {
      // no persistence available
    }
  }, []);

  useEffect(() => {
    function measure() {
      const el = stageRef.current;
      if (el) g.current.fallHeight = el.clientHeight - 150;
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const pulse = useCallback((kind: "hit" | "miss") => {
    setFlash(kind);
    setTimeout(() => setFlash("none"), 280);
  }, []);

  const saveReaction = useCallback(() => {
    const list = g.current.reactions;
    if (!list.length) return;
    try {
      const fastest = Math.min(...list);
      const prev = parseInt(localStorage.getItem("bunii_reaction_ms") || "99999", 10);
      if (fastest < prev) {
        localStorage.setItem("bunii_reaction_ms", String(fastest));
        setBestReaction(fastest);
      }
    } catch {
      // no persistence available
    }
  }, []);

  /* tap to catch */
  const grab = useCallback(
    (i: number) => {
      const s = g.current;
      if (s.phase !== "playing") return;
      const slot = s.slots[i];
      if (slot.state !== "falling") return;

      const ms = Math.round(performance.now() - slot.startedAt);
      s.reactions.push(ms);
      setReaction(ms);

      slot.state = "caught";
      s.caught += 1;

      const el = bunRefs.current[i];
      if (el) {
        el.style.transition = "transform .38s cubic-bezier(.2,1.3,.4,1), opacity .38s ease";
        el.style.transform = "translate(-50%, -34px) scale(.2)";
        el.style.opacity = "0";
      }

      setCollected((c) => {
        const next = [...c];
        next[i] = true;
        return next;
      });
      pulse("hit");

      if (s.caught === SPRITES.length) {
        s.phase = "won";
        setPhase("won");
        saveReaction();
      }
    },
    [pulse, saveReaction],
  );

  /* main loop */
  useEffect(() => {
    let raf = 0;

    function launch(index: number, now: number) {
      const s = g.current;
      const step = s.dropped / (SPRITES.length - 1);
      s.slots[index] = {
        state: "falling",
        startedAt: now,
        duration: FALL_FIRST - (FALL_FIRST - FALL_LAST) * step,
      };
      s.dropped += 1;
      const el = bunRefs.current[index];
      if (el) el.style.transition = "none";
    }

    function frame(now: number) {
      const s = g.current;

      if (s.phase === "playing") {
        // a queued second bun from a double drop
        if (s.queued && now >= s.queued.at) {
          if (s.slots[s.queued.index].state === "hung") launch(s.queued.index, now);
          s.queued = null;
        }

        if (!s.queued && now >= s.nextDrop) {
          const hung = s.slots.map((x, i) => (x.state === "hung" ? i : -1)).filter((i) => i >= 0);

          if (hung.length) {
            const first = hung[Math.floor(Math.random() * hung.length)];
            launch(first, now);

            const rest = hung.filter((i) => i !== first);
            if (rest.length && Math.random() < DOUBLE_CHANCE) {
              s.queued = {
                index: rest[Math.floor(Math.random() * rest.length)],
                at: now + DOUBLE_OFFSET_MIN + Math.random() * (DOUBLE_OFFSET_MAX - DOUBLE_OFFSET_MIN),
              };
            }
            s.nextDrop = now + GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN);
          }
        }

        for (let i = 0; i < s.slots.length; i++) {
          const slot = s.slots[i];
          if (slot.state !== "falling") continue;

          const t = (now - slot.startedAt) / slot.duration;
          const el = bunRefs.current[i];

          if (t >= 1) {
            slot.state = "lost";
            if (el) {
              el.style.transform = `translate(-50%, ${s.fallHeight}px) scale(1.12, .78)`;
              el.style.opacity = "0.22";
            }
            s.phase = "failed";
            setPhase("failed");
            pulse("miss");
            saveReaction();
            continue;
          }

          const eased = t * t * (1.9 - 0.9 * t);
          if (el) el.style.transform = `translate(-50%, ${eased * s.fallHeight}px) scale(1)`;
        }
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [pulse, saveReaction]);

  function start() {
    const s = g.current;
    s.slots = SPRITES.map<Slot>(() => ({ state: "hung", startedAt: 0, duration: FALL_FIRST }));
    s.dropped = 0;
    s.caught = 0;
    s.queued = null;
    s.reactions = [];
    s.nextDrop = performance.now() + 1100;
    s.phase = "playing";

    bunRefs.current.forEach((el) => {
      if (!el) return;
      el.style.transition = "none";
      el.style.transform = "translate(-50%, 0) scale(1)";
      el.style.opacity = "1";
    });

    setCollected(SPRITES.map(() => false));
    setReaction(null);
    setClaimErr("");
    setPhase("playing");
  }

  async function submitWallet() {
    if (claimed) return;
    if (!isValidEvm(wallet)) {
      setClaimErr("That doesn't look like a valid EVM address (0x + 40 characters).");
      return;
    }
    setClaimErr("");
    setSending(true);

    const list = g.current.reactions;
    const { error } = await supabase.from("bunii_gtd").insert([
      {
        wallet: wallet.trim(),
        fastest_ms: Math.min(...list),
        average_ms: Math.round(list.reduce((a, b) => a + b, 0) / list.length),
      },
    ]);

    setSending(false);

    if (error) {
      if ((error as { code?: string }).code === "23505") {
        setClaimErr("This wallet already has a spot.");
      } else {
        setClaimErr("Something went wrong. Try again.");
      }
      return;
    }

    setClaimed(true);
    try {
      localStorage.setItem("bunii_gtd_submitted", "true");
    } catch {
      // no persistence available
    }
  }

  const got = collected.filter(Boolean).length;
  const list = g.current.reactions;
  const avg = list.length ? Math.round(list.reduce((a, b) => a + b, 0) / list.length) : null;

  return (
    <div className="rig">
      <style>{`
        .rig{
          width:100%;max-width:880px;
          font-family:${sans};color:${creamInk};
          user-select:none;-webkit-user-select:none;touch-action:manipulation;
        }

        .readout{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;}
        .cell{
          background:${surface}99;border:1px solid ${goldLine}2e;border-radius:14px;
          padding:12px 16px;display:flex;flex-direction:column;gap:5px;
        }
        .cell small{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:${creamInk}59;}
        .cell b{font-family:${serif};font-weight:800;font-size:1.5rem;line-height:1;
          font-variant-numeric:tabular-nums;}
        .cell.ms b{color:${goldLine};}

        .pips{display:flex;gap:7px;align-items:center;height:24px;}
        .pip{width:12px;height:12px;border-radius:50%;
          background:${creamInk}1f;transition:background .3s ease,box-shadow .3s ease;}
        .pip.on{background:${goldLine};box-shadow:0 0 12px ${goldLine}aa;}

        .stage{
          position:relative;height:clamp(340px,54vh,470px);
          border-radius:26px;overflow:hidden;
          background:
            radial-gradient(75% 55% at 50% 0%, ${plumLift} 0%, transparent 70%),
            radial-gradient(60% 45% at 50% 100%, ${violetGlow}33 0%, transparent 72%),
            linear-gradient(180deg, ${plum} 0%, ${plumDeep} 100%);
          box-shadow:inset 0 0 0 1px ${goldLine}33, 0 40px 80px -38px #000;
          transition:box-shadow .2s ease;
        }
        .stage.hit{box-shadow:inset 0 0 0 1px ${goldLine}, inset 0 0 70px -18px ${goldLine}66, 0 40px 80px -38px #000;}
        .stage.miss{box-shadow:inset 0 0 0 1px #C4472A, inset 0 0 70px -16px #C4472A66, 0 40px 80px -38px #000;}

        .rack{
          position:absolute;top:34px;left:6%;right:6%;height:10px;border-radius:999px;
          background:linear-gradient(180deg, #F0E2C4, ${goldLine} 55%, #7A5C33);
          box-shadow:0 10px 28px -12px #000, 0 0 30px -8px ${goldLine}66;
        }
        .rack::before{
          content:"";position:absolute;inset:-14px -10px auto;height:1px;
          background:linear-gradient(90deg,transparent,${goldLine}4d,transparent);
        }
        .post{position:absolute;top:0;width:8px;height:34px;border-radius:0 0 3px 3px;
          background:linear-gradient(180deg, ${goldLine}, #6B4E2C);}
        .post.l{left:6%;transform:translateX(-50%);}
        .post.r{right:6%;transform:translateX(50%);}

        .floor{position:absolute;left:0;right:0;bottom:46px;height:1px;
          background:linear-gradient(90deg,transparent,${goldLine}4d,transparent);}
        .floor::after{content:"";position:absolute;left:12%;right:12%;top:0;height:60px;
          background:radial-gradient(60% 100% at 50% 0%, ${violetGlow}2e, transparent 70%);}

        .slot{position:absolute;top:44px;bottom:0;width:20%;}
        .bun{
          position:absolute;top:0;left:50%;
          width:clamp(46px,8.5vw,68px);height:clamp(46px,8.5vw,68px);
          transform:translate(-50%,0);cursor:pointer;
          filter:drop-shadow(0 10px 14px rgba(0,0,0,.55));will-change:transform;
        }
        .bun img{width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;}
        .bun::after{content:"";position:absolute;inset:-16px;border-radius:50%;}
        .cord{position:absolute;left:50%;top:-10px;width:1px;height:10px;transform:translateX(-50%);
          background:linear-gradient(180deg,${goldLine}99,transparent);}

        .veil{
          position:absolute;inset:0;z-index:6;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          gap:12px;text-align:center;padding:28px;
          background:${plumDeep}e8;backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);
        }
        .veil h3{margin:0;font-family:${serif};font-weight:800;
          font-size:clamp(1.6rem,4.4vw,2.2rem);line-height:1.08;}
        .veil p{margin:0;font-weight:300;font-size:.92rem;color:${creamInk}a6;
          max-width:34ch;line-height:1.55;}
        .veil button{
          margin-top:8px;font-family:${sans};font-size:.78rem;font-weight:600;
          letter-spacing:.16em;text-transform:uppercase;
          color:${plumDeep};background:${goldLine};border:none;border-radius:999px;
          padding:14px 34px;cursor:pointer;transition:transform .2s ease,filter .2s ease;
        }
        .veil button:hover{transform:translateY(-2px);filter:brightness(1.08);}
        .veil button:disabled{opacity:.5;cursor:default;transform:none;}

        .gtd{font-size:.62rem;letter-spacing:.26em;text-transform:uppercase;color:${goldLine};margin:0;}

        .claim{display:flex;gap:8px;width:100%;max-width:400px;margin-top:6px;}
        .claim input{
          flex:1;min-width:0;background:${plum}cc;color:${creamInk};
          border:1px solid ${goldLine}40;border-radius:999px;
          padding:13px 18px;font-family:${sans};font-size:.86rem;outline:none;
          transition:border-color .2s ease;
        }
        .claim input:focus{border-color:${goldLine};}
        .claim button{margin-top:0;padding:13px 24px;}
        .err{color:#E88A6A;font-size:.8rem;margin:0;}
        .fine{font-size:.72rem;color:${creamInk}59;margin:0;max-width:34ch;line-height:1.5;}

        .footline{margin:12px 0 0;text-align:center;font-size:.68rem;
          letter-spacing:.16em;text-transform:uppercase;color:${creamInk}4d;}
      `}</style>

      <div className="readout">
        <div className="cell">
          <small>Caught</small>
          <b>
            {got}/{SPRITES.length}
          </b>
        </div>
        <div className="cell ms">
          <small>Reaction</small>
          <b>{reaction !== null ? `${reaction}ms` : "—"}</b>
        </div>
        <div className="cell">
          <small>Rack</small>
          <div className="pips">
            {collected.map((on, i) => (
              <span key={i} className={`pip${on ? " on" : ""}`} />
            ))}
          </div>
        </div>
      </div>

      <div ref={stageRef} className={`stage${flash === "none" ? "" : ` ${flash}`}`}>
        <span className="post l" />
        <span className="post r" />
        <div className="rack" />
        <div className="floor" />

        {SPRITES.map((src, i) => (
          <div key={src} className="slot" style={{ left: `${i * 20}%` }}>
            <div
              ref={(el) => {
                bunRefs.current[i] = el;
              }}
              className="bun"
              onPointerDown={() => grab(i)}
            >
              <span className="cord" />
              <img src={src} alt="" draggable={false} />
            </div>
          </div>
        ))}

        {phase === "idle" && (
          <div className="veil">
            <h3>Catch all five.</h3>
            <p>They let go at random, sometimes two at once. Drop one and the run is over.</p>
            <button onClick={start}>Start</button>
          </div>
        )}

        {phase === "failed" && (
          <div className="veil">
            <h3>One got away.</h3>
            <p>
              {got} of {SPRITES.length} caught{avg !== null ? ` · ${avg}ms average` : ""}. All five or nothing.
            </p>
            <button onClick={start}>Try again</button>
          </div>
        )}

        {phase === "won" && (
          <div className="veil">
            <p className="gtd">Guaranteed Spot</p>
            <h3>All five.</h3>

            {claimed ? (
              <p>Your wallet is locked in. Nothing else to do.</p>
            ) : (
              <>
                <p>
                  {avg !== null ? `${avg}ms average. ` : ""}Drop an EVM address to hold your spot.
                </p>
                <div className="claim">
                  <input
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="0x..."
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitWallet();
                    }}
                  />
                  <button onClick={submitWallet} disabled={sending}>
                    {sending ? "..." : "Claim"}
                  </button>
                </div>
                {claimErr && <p className="err">{claimErr}</p>}
                <p className="fine">Public address only. Never share a seed phrase or private key.</p>
              </>
            )}
          </div>
        )}
      </div>

      <p className="footline">
        {phase === "playing"
          ? "Tap to catch"
          : bestReaction !== null
            ? `Fastest ever ${bestReaction}ms`
            : "Tap to catch"}
      </p>
    </div>
  );
}
