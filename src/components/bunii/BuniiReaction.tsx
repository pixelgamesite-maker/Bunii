import { useCallback, useEffect, useRef, useState } from "react";
import { creamInk, goldLine, plum, plumDeep, plumLift, sans, serif, surface, violetGlow } from "@/lib/bunii-theme";

/* ── tuning ─────────────────────────────────────────────────────── */

const SPRITES = ["/bun1.png", "/bun2.png", "/bun3.png", "/bun4.png", "/bun5.png"];
const LIVES = 3;

// Time a bun takes to reach the floor, and the gap between drops.
// Both tighten as the run goes on.
const FALL_START = 1250;
const FALL_FLOOR = 620;
const GAP_START = 1500;
const GAP_FLOOR = 620;
const RAMP_OVER = 22; // catches it takes to reach full speed
const DOUBLE_AT = 12; // catches before two can fall at once

type SlotState = "hung" | "falling" | "returning";

type Slot = {
  state: SlotState;
  startedAt: number;
  duration: number;
};

type Phase = "idle" | "playing" | "over";

export function BuniiReaction() {
  const stageRef = useRef<HTMLDivElement>(null);
  const bunRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [caught, setCaught] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [reaction, setReaction] = useState<number | null>(null);
  const [bestReaction, setBestReaction] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState(0);
  const [flash, setFlash] = useState<"none" | "hit" | "miss">("none");

  const g = useRef({
    phase: "idle" as Phase,
    slots: SPRITES.map<Slot>(() => ({ state: "hung", startedAt: 0, duration: FALL_START })),
    caught: 0,
    lives: LIVES,
    nextDrop: 0,
    fallHeight: 300,
    reactions: [] as number[],
  });

  /* best score from previous sessions */
  useEffect(() => {
    try {
      setBestScore(parseInt(localStorage.getItem("bunii_reaction_best") || "0", 10) || 0);
      const r = localStorage.getItem("bunii_reaction_ms");
      if (r) setBestReaction(parseInt(r, 10));
    } catch {
      // no persistence available
    }
  }, []);

  /* fall distance follows the stage size */
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
    setTimeout(() => setFlash("none"), 260);
  }, []);

  const endRun = useCallback(() => {
    const s = g.current;
    s.phase = "over";
    setPhase("over");
    try {
      const prev = parseInt(localStorage.getItem("bunii_reaction_best") || "0", 10) || 0;
      if (s.caught > prev) localStorage.setItem("bunii_reaction_best", String(s.caught));
      setBestScore(Math.max(prev, s.caught));

      if (s.reactions.length) {
        const fastest = Math.min(...s.reactions);
        const prevMs = parseInt(localStorage.getItem("bunii_reaction_ms") || "99999", 10);
        if (fastest < prevMs) {
          localStorage.setItem("bunii_reaction_ms", String(fastest));
          setBestReaction(fastest);
        }
      }
    } catch {
      // no persistence available
    }
  }, []);

  /* return a bun to the rack */
  const rehang = useCallback((i: number, delay: number) => {
    const el = bunRefs.current[i];
    setTimeout(() => {
      const s = g.current;
      if (el) {
        el.style.transition = "transform .42s cubic-bezier(.2,.8,.3,1), opacity .2s ease";
        el.style.transform = "translate(-50%, 0) scale(1)";
        el.style.opacity = "1";
      }
      s.slots[i].state = "returning";
      setTimeout(() => {
        s.slots[i].state = "hung";
      }, 420);
    }, delay);
  }, []);

  /* tap handler */
  const grab = useCallback(
    (i: number) => {
      const s = g.current;
      if (s.phase !== "playing") return;
      const slot = s.slots[i];
      if (slot.state !== "falling") return;

      const ms = Math.round(performance.now() - slot.startedAt);
      s.reactions.push(ms);
      setReaction(ms);

      s.caught += 1;
      setCaught(s.caught);
      slot.state = "returning";

      const el = bunRefs.current[i];
      if (el) {
        el.style.transition = "transform .3s cubic-bezier(.2,1.4,.4,1)";
        el.style.transform = "translate(-50%, -14px) scale(1.22)";
      }
      pulse("hit");
      rehang(i, 180);
    },
    [pulse, rehang],
  );

  /* main loop */
  useEffect(() => {
    let raf = 0;

    function frame(now: number) {
      const s = g.current;

      if (s.phase === "playing") {
        // schedule the next drop
        if (now >= s.nextDrop) {
          const ramp = Math.min(s.caught / RAMP_OVER, 1);
          const airborne = s.slots.filter((x) => x.state === "falling").length;
          const allowed = s.caught >= DOUBLE_AT ? 2 : 1;

          if (airborne < allowed) {
            const idle = s.slots.map((x, i) => (x.state === "hung" ? i : -1)).filter((i) => i >= 0);
            if (idle.length) {
              const pick = idle[Math.floor(Math.random() * idle.length)];
              s.slots[pick] = {
                state: "falling",
                startedAt: now,
                duration: FALL_START - (FALL_START - FALL_FLOOR) * ramp,
              };
              const el = bunRefs.current[pick];
              if (el) el.style.transition = "none";
            }
          }
          const gap = GAP_START - (GAP_START - GAP_FLOOR) * ramp;
          s.nextDrop = now + gap * (0.72 + Math.random() * 0.62);
        }

        // advance anything falling
        for (let i = 0; i < s.slots.length; i++) {
          const slot = s.slots[i];
          if (slot.state !== "falling") continue;

          const t = (now - slot.startedAt) / slot.duration;
          const el = bunRefs.current[i];

          if (t >= 1) {
            slot.state = "returning";
            if (el) {
              el.style.transform = `translate(-50%, ${s.fallHeight}px) scale(1.05, .82)`;
              el.style.opacity = "0.25";
            }
            s.lives -= 1;
            setLives(s.lives);
            pulse("miss");
            rehang(i, 300);
            if (s.lives <= 0) endRun();
            continue;
          }

          // ease in — slow release, then real speed
          const eased = t * t * (1.9 - 0.9 * t);
          if (el) el.style.transform = `translate(-50%, ${eased * s.fallHeight}px) scale(1)`;
        }
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [endRun, pulse, rehang]);

  function start() {
    const s = g.current;
    s.slots = SPRITES.map<Slot>(() => ({ state: "hung", startedAt: 0, duration: FALL_START }));
    s.caught = 0;
    s.lives = LIVES;
    s.reactions = [];
    s.nextDrop = performance.now() + 900;
    s.phase = "playing";

    bunRefs.current.forEach((el) => {
      if (!el) return;
      el.style.transition = "none";
      el.style.transform = "translate(-50%, 0) scale(1)";
      el.style.opacity = "1";
    });

    setCaught(0);
    setLives(LIVES);
    setReaction(null);
    setPhase("playing");
  }

  const avg = g.current.reactions.length
    ? Math.round(g.current.reactions.reduce((a, b) => a + b, 0) / g.current.reactions.length)
    : null;

  return (
    <div className="rig">
      <style>{`
        .rig{
          width:100%;max-width:880px;
          font-family:${sans};color:${creamInk};
          user-select:none;-webkit-user-select:none;touch-action:manipulation;
        }

        /* ── readout ── */
        .readout{
          display:grid;grid-template-columns:repeat(3,1fr);
          gap:10px;margin-bottom:14px;
        }
        .cell{
          background:${surface}99;
          border:1px solid ${goldLine}2e;
          border-radius:14px;
          padding:12px 16px;
          display:flex;flex-direction:column;gap:4px;
        }
        .cell small{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:${creamInk}59;}
        .cell b{font-family:${serif};font-weight:800;font-size:1.5rem;line-height:1;
          font-variant-numeric:tabular-nums;}
        .cell.ms b{color:${goldLine};}

        .hearts{display:flex;gap:7px;align-items:center;height:24px;}
        .heart{width:11px;height:11px;border-radius:50%;background:${goldLine};
          box-shadow:0 0 10px ${goldLine}99;transition:background .3s ease,box-shadow .3s ease;}
        .heart.gone{background:${creamInk}1f;box-shadow:none;}

        /* ── stage ── */
        .stage{
          position:relative;
          height:clamp(340px,54vh,470px);
          border-radius:26px;
          overflow:hidden;
          background:
            radial-gradient(75% 55% at 50% 0%, ${plumLift} 0%, transparent 70%),
            radial-gradient(60% 45% at 50% 100%, ${violetGlow}33 0%, transparent 72%),
            linear-gradient(180deg, ${plum} 0%, ${plumDeep} 100%);
          box-shadow:inset 0 0 0 1px ${goldLine}33, 0 40px 80px -38px #000;
          transition:box-shadow .2s ease;
        }
        .stage.hit{box-shadow:inset 0 0 0 1px ${goldLine}, inset 0 0 70px -18px ${goldLine}66, 0 40px 80px -38px #000;}
        .stage.miss{box-shadow:inset 0 0 0 1px #C4472A99, inset 0 0 70px -18px #C4472A55, 0 40px 80px -38px #000;}

        /* rack */
        .rack{
          position:absolute;top:34px;left:6%;right:6%;height:10px;
          border-radius:999px;
          background:linear-gradient(180deg, #F0E2C4, ${goldLine} 55%, #7A5C33);
          box-shadow:0 10px 28px -12px #000, 0 0 30px -8px ${goldLine}66;
        }
        .rack::before{
          content:"";position:absolute;inset:-14px -10px auto;height:1px;
          background:linear-gradient(90deg,transparent,${goldLine}4d,transparent);
        }
        .post{
          position:absolute;top:0;width:8px;height:34px;
          background:linear-gradient(180deg, ${goldLine}, #6B4E2C);
          border-radius:0 0 3px 3px;
        }
        .post.l{left:6%;transform:translateX(-50%);}
        .post.r{right:6%;transform:translateX(50%);}

        /* floor */
        .floor{
          position:absolute;left:0;right:0;bottom:46px;height:1px;
          background:linear-gradient(90deg,transparent,${goldLine}4d,transparent);
        }
        .floor::after{
          content:"";position:absolute;left:12%;right:12%;top:0;height:60px;
          background:radial-gradient(60% 100% at 50% 0%, ${violetGlow}2e, transparent 70%);
        }

        /* buns */
        .slot{position:absolute;top:44px;bottom:0;width:20%;}
        .bun{
          position:absolute;top:0;left:50%;
          width:clamp(46px,8.5vw,68px);height:clamp(46px,8.5vw,68px);
          transform:translate(-50%,0);
          cursor:pointer;
          filter:drop-shadow(0 10px 14px rgba(0,0,0,.55));
          will-change:transform;
        }
        .bun img{width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;}
        .bun::after{
          content:"";position:absolute;inset:-16px;border-radius:50%;
        }
        .cord{
          position:absolute;left:50%;top:-10px;width:1px;height:10px;
          background:linear-gradient(180deg,${goldLine}99,transparent);
          transform:translateX(-50%);
        }

        /* veil */
        .veil{
          position:absolute;inset:0;z-index:6;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          gap:12px;text-align:center;padding:28px;
          background:${plumDeep}e6;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
        }
        .veil h3{margin:0;font-family:${serif};font-weight:800;
          font-size:clamp(1.6rem,4.4vw,2.2rem);line-height:1.08;}
        .veil p{margin:0;font-weight:300;font-size:.92rem;color:${creamInk}a6;
          max-width:32ch;line-height:1.55;}
        .veil button{
          margin-top:8px;font-family:${sans};font-size:.78rem;font-weight:600;
          letter-spacing:.16em;text-transform:uppercase;
          color:${plumDeep};background:${goldLine};border:none;
          border-radius:999px;padding:14px 34px;cursor:pointer;
          transition:transform .2s ease,filter .2s ease;
        }
        .veil button:hover{transform:translateY(-2px);filter:brightness(1.08);}

        .footline{
          margin:12px 0 0;text-align:center;font-size:.68rem;
          letter-spacing:.16em;text-transform:uppercase;color:${creamInk}4d;
        }
      `}</style>

      <div className="readout">
        <div className="cell">
          <small>Caught</small>
          <b>{caught}</b>
        </div>
        <div className="cell ms">
          <small>Reaction</small>
          <b>{reaction !== null ? `${reaction}ms` : "—"}</b>
        </div>
        <div className="cell">
          <small>Lives</small>
          <div className="hearts">
            {Array.from({ length: LIVES }).map((_, i) => (
              <span key={i} className={`heart${i < lives ? "" : " gone"}`} />
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
            <h3>Five Buniis. One drops.</h3>
            <p>Tap the falling Bunii before it hits the floor. Three misses ends the run.</p>
            <button onClick={start}>Start</button>
          </div>
        )}

        {phase === "over" && (
          <div className="veil">
            <h3>{caught} caught</h3>
            <p>
              {avg !== null ? `${avg}ms average. ` : ""}
              {caught >= bestScore ? "New best." : `Best run: ${bestScore}`}
            </p>
            <button onClick={start}>Go again</button>
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
