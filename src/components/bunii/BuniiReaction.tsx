import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { creamInk, goldLine, plum, plumDeep, plumLift, serif, surface, violetGlow } from "@/lib/bunii-theme";
import { useAuth } from "@/lib/auth";
import { POINTS_PER_CATCH, finishRun, startRun, type RunResult } from "@/lib/bunii-api";

/* ── tuning ─────────────────────────────────────────────────────── */

const SPRITES = ["/bun1.png", "/bun2.png", "/bun3.png", "/bun4.png", "/bun5.png"];
const LIVES = 3;

// Everything ramps from its START value to its END value over RAMP_OVER catches.
const RAMP_OVER = 30;

// Time to hit the floor. Keep FALL_END above ~400ms — below that it stops
// being hard and starts being impossible.
const FALL_START = 820;
const FALL_END = 430;

// Random gap between drops: [min, max].
const GAP_START: [number, number] = [900, 1700];
const GAP_END: [number, number] = [420, 950];

// Chance a drop pulls a second bun with it, and how far behind it follows.
const DOUBLE_START = 0.15;
const DOUBLE_END = 0.45;
const DOUBLE_OFFSET: [number, number] = [110, 380];

/* ── types ──────────────────────────────────────────────────────── */

type SlotState = "hung" | "falling" | "returning";
type Phase = "idle" | "starting" | "playing" | "banking" | "over";
type Slot = { state: SlotState; startedAt: number; duration: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const freshSlots = () => SPRITES.map<Slot>(() => ({ state: "hung", startedAt: 0, duration: FALL_START }));

export function BuniiReaction() {
  const { refresh } = useAuth();

  const stageRef = useRef<HTMLDivElement>(null);
  const bunRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [caught, setCaught] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [reaction, setReaction] = useState<number | null>(null);
  const [flash, setFlash] = useState<"none" | "hit" | "miss">("none");
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState("");

  const g = useRef({
    phase: "idle" as Phase,
    runId: "",
    slots: freshSlots(),
    caught: 0,
    lives: LIVES,
    nextDrop: 0,
    queued: null as { index: number; at: number } | null,
    fallHeight: 300,
    reactions: [] as number[],
    timers: [] as number[],
  });

  /* timers are tracked so a new run can't be hit by the last run's rehangs */
  const later = useCallback((fn: () => void, ms: number) => {
    g.current.timers.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const s = g.current;
    return () => s.timers.forEach(clearTimeout);
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

  const pulse = useCallback(
    (kind: "hit" | "miss") => {
      setFlash(kind);
      later(() => setFlash("none"), 260);
    },
    [later],
  );

  const rehang = useCallback(
    (i: number, delay: number) => {
      later(() => {
        const el = bunRefs.current[i];
        if (el) {
          el.style.transition = "transform .42s cubic-bezier(.2,.8,.3,1), opacity .2s ease";
          el.style.transform = "translate(-50%, 0) scale(1)";
          el.style.opacity = "1";
        }
        later(() => {
          const slot = g.current.slots[i];
          if (slot.state === "returning") slot.state = "hung";
        }, 420);
      }, delay);
    },
    [later],
  );

  /* bank the run on the server — it clamps catches to what the clock allows */
  const bank = useCallback(async () => {
    const s = g.current;
    const res = await finishRun(s.runId, s.caught);
    if (res.ok) {
      setResult(res.data);
      refresh();
    } else {
      setError(res.message);
    }
    s.phase = "over";
    setPhase("over");
  }, [refresh]);

  const bankRef = useRef(bank);
  bankRef.current = bank;

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

    function launch(index: number, now: number) {
      const s = g.current;
      const ramp = Math.min(s.caught / RAMP_OVER, 1);
      s.slots[index] = { state: "falling", startedAt: now, duration: lerp(FALL_START, FALL_END, ramp) };
      const el = bunRefs.current[index];
      if (el) el.style.transition = "none";
    }

    function frame(now: number) {
      const s = g.current;

      if (s.phase === "playing") {
        const ramp = Math.min(s.caught / RAMP_OVER, 1);

        // the second bun of a double drop
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
            if (rest.length && Math.random() < lerp(DOUBLE_START, DOUBLE_END, ramp)) {
              s.queued = {
                index: rest[Math.floor(Math.random() * rest.length)],
                at: now + rand(DOUBLE_OFFSET[0], DOUBLE_OFFSET[1]),
              };
            }
          }

          s.nextDrop =
            now + rand(lerp(GAP_START[0], GAP_END[0], ramp), lerp(GAP_START[1], GAP_END[1], ramp));
        }

        for (let i = 0; i < s.slots.length; i++) {
          if (s.phase !== "playing") break;

          const slot = s.slots[i];
          if (slot.state !== "falling") continue;

          const t = (now - slot.startedAt) / slot.duration;
          const el = bunRefs.current[i];

          if (t >= 1) {
            slot.state = "returning";
            if (el) {
              el.style.transform = `translate(-50%, ${s.fallHeight}px) scale(1.12, .78)`;
              el.style.opacity = "0.25";
            }
            s.lives -= 1;
            setLives(s.lives);
            pulse("miss");
            rehang(i, 320);

            if (s.lives <= 0) {
              s.phase = "banking";
              setPhase("banking");
              bankRef.current();
              break;
            }
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
  }, [pulse, rehang]);

  async function start() {
    const s = g.current;
    if (s.phase === "starting" || s.phase === "banking" || s.phase === "playing") return;

    setError("");
    setResult(null);
    s.phase = "starting";
    setPhase("starting");

    const res = await startRun();
    if (!res.ok) {
      setError(res.message);
      s.phase = "idle";
      setPhase("idle");
      return;
    }

    s.timers.forEach(clearTimeout);
    s.timers = [];
    s.runId = res.data;
    s.slots = freshSlots();
    s.caught = 0;
    s.lives = LIVES;
    s.queued = null;
    s.reactions = [];
    s.nextDrop = performance.now() + 900;

    bunRefs.current.forEach((el) => {
      if (!el) return;
      el.style.transition = "none";
      el.style.transform = "translate(-50%, 0) scale(1)";
      el.style.opacity = "1";
    });

    setCaught(0);
    setLives(LIVES);
    setReaction(null);
    setFlash("none");

    s.phase = "playing";
    setPhase("playing");
  }

  const list = g.current.reactions;
  const avg = list.length ? Math.round(list.reduce((a, b) => a + b, 0) / list.length) : null;
  const canClaim = !!result && result.total >= result.threshold;

  return (
    <div className="rig">
      <style>{`
        .rig{width:100%;max-width:880px;user-select:none;-webkit-user-select:none;touch-action:manipulation;}

        .readout{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;}
        .cell{
          background:${surface}99;border:1px solid ${goldLine}2e;border-radius:14px;
          padding:12px 16px;display:flex;flex-direction:column;gap:5px;
        }
        .cell small{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:${creamInk}59;}
        .cell b{font-family:${serif};font-weight:800;font-size:1.5rem;line-height:1;font-variant-numeric:tabular-nums;}
        .cell.gold b{color:${goldLine};}

        .hearts{display:flex;gap:7px;align-items:center;height:24px;}
        .heart{width:12px;height:12px;border-radius:50%;background:${goldLine};
          box-shadow:0 0 12px ${goldLine}aa;transition:background .3s ease,box-shadow .3s ease;}
        .heart.gone{background:${creamInk}1f;box-shadow:none;}

        .stage{
          position:relative;height:clamp(340px,54vh,470px);border-radius:26px;overflow:hidden;
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
        .veil h3{margin:0;font-family:${serif};font-weight:800;font-size:clamp(1.6rem,4.4vw,2.2rem);line-height:1.08;}
        .veil p{margin:0;font-weight:300;font-size:.92rem;color:${creamInk}a6;max-width:34ch;line-height:1.55;}
        .veil .banked{font-family:${serif};font-weight:800;font-size:1.25rem;color:${goldLine};}
        .veil__actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px;}

        .meter{width:100%;max-width:300px;height:4px;border-radius:999px;background:${creamInk}1a;overflow:hidden;}
        .meter span{display:block;height:100%;background:${goldLine};box-shadow:0 0 12px ${goldLine};
          transition:width .6s cubic-bezier(.2,.7,.25,1);}

        .footline{margin:12px 0 0;text-align:center;font-size:.68rem;
          letter-spacing:.16em;text-transform:uppercase;color:${creamInk}4d;}
      `}</style>

      <div className="readout">
        <div className="cell gold">
          <small>Points</small>
          <b>{(caught * POINTS_PER_CATCH).toLocaleString()}</b>
        </div>
        <div className="cell">
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

        {(phase === "idle" || phase === "starting") && (
          <div className="veil">
            <h3>Catch the Buniis.</h3>
            <p>
              Every catch is worth {POINTS_PER_CATCH} points. They let go at random, sometimes two at once. Three misses
              ends the run.
            </p>
            {error && <p className="err">{error}</p>}
            <div className="veil__actions">
              <button type="button" className="btn" onClick={start} disabled={phase === "starting"}>
                {phase === "starting" ? "Starting…" : "Start"}
              </button>
            </div>
          </div>
        )}

        {phase === "banking" && (
          <div className="veil">
            <h3>{caught} caught</h3>
            <p>Banking your points…</p>
          </div>
        )}

        {phase === "over" && (
          <div className="veil">
            <h3>{caught} caught</h3>

            {result ? (
              <>
                <p className="banked">+{result.points.toLocaleString()} points</p>
                <div className="meter" aria-hidden>
                  <span style={{ width: `${Math.min(100, (result.total / result.threshold) * 100)}%` }} />
                </div>
                <p>
                  {canClaim
                    ? `${result.total.toLocaleString()} points — enough to claim your spot.`
                    : `${result.total.toLocaleString()} of ${result.threshold.toLocaleString()} toward your spot.`}
                  {avg !== null ? ` ${avg}ms average.` : ""}
                </p>
              </>
            ) : (
              error && <p className="err">This run couldn't be banked: {error}</p>
            )}

            <div className="veil__actions">
              <button type="button" className="btn" onClick={start}>
                Play again
              </button>
              <Link href="/social" className="btn btn--ghost">
                {canClaim ? "Claim your spot" : "Earn more on Social"}
              </Link>
            </div>
          </div>
        )}
      </div>

      <p className="footline">
        {phase === "playing" ? "Tap to catch" : `${POINTS_PER_CATCH} points a catch · 3 lives`}
      </p>
    </div>
  );
}
