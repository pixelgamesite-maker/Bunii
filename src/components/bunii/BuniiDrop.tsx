import { useEffect, useRef, useState } from "react";
import { creamInk, goldLine, plumDeep, plumLift, sans, serif, surface, violetGlow } from "@/lib/bunii-theme";

/* ── tuning ─────────────────────────────────────────────────────── */

const W = 380; // logical canvas width
const H = 520; // logical canvas height
const ROUND_MS = 60_000;
const FLOOR = H - 26; // y where a bun counts as missed
const BUN_SIZE = 46;

// Which sprite is worth what. Reorder these to match your art —
// index 0 is /bun1.png, index 4 is /bun5.png.
const RARITY = [
  { points: 1, weight: 30, glow: false },
  { points: 1, weight: 30, glow: false },
  { points: 1, weight: 22, glow: false },
  { points: 3, weight: 13, glow: false },
  { points: 8, weight: 5, glow: true },
];

const SPRITES = ["/bun1.png", "/bun2.png", "/bun3.png", "/bun4.png", "/bun5.png"];

/* ── types ──────────────────────────────────────────────────────── */

type Bun = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  kind: number;
  caught: number; // 0 = falling, otherwise ms remaining on the catch pop
};

type Puff = { x: number; y: number; vx: number; vy: number; life: number; max: number; hue: string };

type Phase = "idle" | "playing" | "over";

function pickKind() {
  const total = RARITY.reduce((s, r) => s + r.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < RARITY.length; i++) {
    roll -= RARITY[i].weight;
    if (roll <= 0) return i;
  }
  return 0;
}

export function BuniiDrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [seconds, setSeconds] = useState(ROUND_MS / 1000);
  const [best, setBest] = useState(0);

  // Everything the loop mutates lives here so the rAF closure never goes stale.
  const g = useRef({
    phase: "idle" as Phase,
    buns: [] as Bun[],
    puffs: [] as Puff[],
    catcherX: W / 2,
    targetX: W / 2,
    elapsed: 0,
    spawnTimer: 0,
    score: 0,
    combo: 0,
    bestCombo: 0,
    shake: 0,
  });

  /* preload sprites */
  useEffect(() => {
    imagesRef.current = SPRITES.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    try {
      const b = localStorage.getItem("bunii_drop_best");
      if (b) setBest(parseInt(b, 10) || 0);
    } catch {
      // no persistence available
    }
  }, []);

  /* pointer + keyboard control */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let dragging = false;

    function toLogical(clientX: number) {
      const r = canvas!.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * W;
    }
    function move(clientX: number) {
      g.current.targetX = Math.max(44, Math.min(W - 44, toLogical(clientX)));
    }

    function down(e: PointerEvent) {
      dragging = true;
      canvas!.setPointerCapture(e.pointerId);
      move(e.clientX);
    }
    function drag(e: PointerEvent) {
      if (dragging) move(e.clientX);
    }
    function up() {
      dragging = false;
    }
    function key(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") g.current.targetX = Math.max(44, g.current.targetX - 34);
      if (e.key === "ArrowRight") g.current.targetX = Math.min(W - 44, g.current.targetX + 34);
    }

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", drag);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    window.addEventListener("keydown", key);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", drag);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      window.removeEventListener("keydown", key);
    };
  }, []);

  /* the loop */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    let raf = 0;
    let last = performance.now();
    let shownSecond = ROUND_MS / 1000;

    function spawn() {
      const s = g.current;
      const ramp = Math.min(s.elapsed / ROUND_MS, 1);
      s.buns.push({
        x: 38 + Math.random() * (W - 76),
        y: -BUN_SIZE,
        vx: (Math.random() - 0.5) * 0.035,
        vy: 0.1 + ramp * 0.11 + Math.random() * 0.03,
        rot: (Math.random() - 0.5) * 0.5,
        vr: (Math.random() - 0.5) * 0.0022,
        kind: pickKind(),
        caught: 0,
      });
    }

    function burst(x: number, y: number, hue: string, n: number) {
      for (let i = 0; i < n; i++) {
        g.current.puffs.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.22,
          vy: -Math.random() * 0.18,
          life: 420,
          max: 420,
          hue,
        });
      }
    }

    function step(dt: number) {
      const s = g.current;
      if (s.phase !== "playing") return;

      s.elapsed += dt;
      if (s.elapsed >= ROUND_MS) {
        s.phase = "over";
        setPhase("over");
        setScore(s.score);
        try {
          const prev = parseInt(localStorage.getItem("bunii_drop_best") || "0", 10) || 0;
          if (s.score > prev) {
            localStorage.setItem("bunii_drop_best", String(s.score));
            setBest(s.score);
          }
        } catch {
          // no persistence available
        }
        return;
      }

      const sec = Math.ceil((ROUND_MS - s.elapsed) / 1000);
      if (sec !== shownSecond) {
        shownSecond = sec;
        setSeconds(sec);
      }

      // spawn rate ramps from ~950ms down to ~430ms
      const ramp = s.elapsed / ROUND_MS;
      s.spawnTimer -= dt;
      if (s.spawnTimer <= 0) {
        spawn();
        s.spawnTimer = 950 - ramp * 520 + Math.random() * 170;
      }

      // catcher easing
      s.catcherX += (s.targetX - s.catcherX) * Math.min(1, dt * 0.018);
      if (s.shake > 0) s.shake = Math.max(0, s.shake - dt);

      const catchTop = FLOOR - 46;
      const half = 39;

      for (let i = s.buns.length - 1; i >= 0; i--) {
        const b = s.buns[i];

        if (b.caught > 0) {
          b.caught -= dt;
          if (b.caught <= 0) s.buns.splice(i, 1);
          continue;
        }

        b.y += b.vy * dt;
        b.x += b.vx * dt;
        b.rot += b.vr * dt;

        const hitBand = b.y + BUN_SIZE / 2 >= catchTop && b.y + BUN_SIZE / 2 <= catchTop + 30;
        if (hitBand && Math.abs(b.x - s.catcherX) < half) {
          const r = RARITY[b.kind];
          s.combo += 1;
          s.bestCombo = Math.max(s.bestCombo, s.combo);
          const bonus = Math.floor(s.combo / 5);
          s.score += r.points + bonus;
          b.caught = 220;
          b.y = catchTop - 6;
          burst(b.x, catchTop, r.glow ? goldLine : violetGlow, r.glow ? 14 : 7);
          setScore(s.score);
          setCombo(s.combo);
          continue;
        }

        if (b.y > FLOOR) {
          s.buns.splice(i, 1);
          s.combo = 0;
          s.shake = 180;
          burst(b.x, FLOOR, "#ffffff", 5);
          setCombo(0);
        }
      }

      for (let i = s.puffs.length - 1; i >= 0; i--) {
        const p = s.puffs[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.0007 * dt;
        p.life -= dt;
        if (p.life <= 0) s.puffs.splice(i, 1);
      }
    }

    function drawCatcher(x: number) {
      const y = FLOOR - 30;
      ctx!.save();
      ctx!.translate(x, y);

      // arm
      ctx!.strokeStyle = `${goldLine}66`;
      ctx!.lineWidth = 3;
      ctx!.beginPath();
      ctx!.moveTo(0, 26);
      ctx!.lineTo(0, 40);
      ctx!.stroke();

      // basket
      const grad = ctx!.createLinearGradient(0, -12, 0, 26);
      grad.addColorStop(0, "#F0E2C4");
      grad.addColorStop(1, goldLine);
      ctx!.fillStyle = grad;
      ctx!.strokeStyle = plumDeep;
      ctx!.lineWidth = 2.5;
      ctx!.beginPath();
      ctx!.moveTo(-38, -10);
      ctx!.lineTo(38, -10);
      ctx!.lineTo(27, 24);
      ctx!.quadraticCurveTo(0, 32, -27, 24);
      ctx!.closePath();
      ctx!.fill();
      ctx!.stroke();

      // rim highlight
      ctx!.strokeStyle = "#FFF6E4";
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      ctx!.moveTo(-36, -8);
      ctx!.lineTo(36, -8);
      ctx!.stroke();
      ctx!.restore();
    }

    function draw() {
      const s = g.current;
      ctx!.clearRect(0, 0, W, H);

      ctx!.save();
      if (s.shake > 0) {
        const m = (s.shake / 180) * 3;
        ctx!.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
      }

      // interior wash
      const bgGrad = ctx!.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, plumLift);
      bgGrad.addColorStop(1, plumDeep);
      ctx!.fillStyle = bgGrad;
      ctx!.fillRect(0, 0, W, H);

      // floor pool
      const pool = ctx!.createRadialGradient(W / 2, FLOOR + 10, 4, W / 2, FLOOR + 10, W * 0.7);
      pool.addColorStop(0, `${violetGlow}3d`);
      pool.addColorStop(1, "transparent");
      ctx!.fillStyle = pool;
      ctx!.fillRect(0, FLOOR - 70, W, 96);

      ctx!.strokeStyle = `${goldLine}33`;
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(0, FLOOR + 2);
      ctx!.lineTo(W, FLOOR + 2);
      ctx!.stroke();

      // buns
      for (const b of s.buns) {
        const r = RARITY[b.kind];
        const img = imagesRef.current[b.kind];
        const pop = b.caught > 0 ? 1 + (b.caught / 220) * 0.25 : 1;

        ctx!.save();
        ctx!.translate(b.x, b.y + BUN_SIZE / 2);
        ctx!.rotate(b.caught > 0 ? 0 : b.rot);
        ctx!.scale(pop, b.caught > 0 ? 2 - pop : 1);

        if (r.glow) {
          ctx!.shadowColor = goldLine;
          ctx!.shadowBlur = 18;
        }

        if (img && img.complete && img.naturalWidth > 0) {
          ctx!.drawImage(img, -BUN_SIZE / 2, -BUN_SIZE / 2, BUN_SIZE, BUN_SIZE);
        } else {
          ctx!.fillStyle = r.glow ? goldLine : "#C9B6E8";
          ctx!.beginPath();
          ctx!.arc(0, 0, BUN_SIZE / 2.4, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.restore();
      }

      drawCatcher(s.catcherX);

      // puffs
      for (const p of s.puffs) {
        const a = p.life / p.max;
        ctx!.globalAlpha = a;
        ctx!.fillStyle = p.hue;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 2.6 * a + 0.8, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      // glass
      const glass = ctx!.createLinearGradient(0, 0, W, H);
      glass.addColorStop(0, "rgba(255,255,255,0.07)");
      glass.addColorStop(0.42, "rgba(255,255,255,0)");
      glass.addColorStop(0.52, "rgba(255,255,255,0.045)");
      glass.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.fillStyle = glass;
      ctx!.fillRect(0, 0, W, H);

      ctx!.restore();
    }

    function frame(now: number) {
      const dt = Math.min(now - last, 48);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  function start() {
    const s = g.current;
    s.buns = [];
    s.puffs = [];
    s.elapsed = 0;
    s.spawnTimer = 300;
    s.score = 0;
    s.combo = 0;
    s.bestCombo = 0;
    s.catcherX = W / 2;
    s.targetX = W / 2;
    s.shake = 0;
    s.phase = "playing";
    setScore(0);
    setCombo(0);
    setSeconds(ROUND_MS / 1000);
    setPhase("playing");
  }

  return (
    <div className="cab">
      <style>{`
        .cab{
          width:100%;max-width:420px;
          border-radius:26px;
          background:linear-gradient(180deg, ${surface} 0%, ${plumDeep} 100%);
          box-shadow:inset 0 0 0 1px ${goldLine}40, 0 40px 80px -36px #000;
          padding:14px;
          user-select:none;
          -webkit-user-select:none;
          touch-action:none;
        }
        .marquee{
          display:flex;align-items:center;justify-content:center;gap:10px;
          height:52px;margin-bottom:12px;
          border-radius:16px;
          background:linear-gradient(180deg, ${plumLift}, ${plumDeep});
          box-shadow:inset 0 0 0 1px ${goldLine}4d, inset 0 -8px 22px -12px ${violetGlow};
        }
        .marquee b{
          font-family:${serif};font-weight:800;font-size:1.25rem;
          letter-spacing:.14em;color:${creamInk};
        }
        .bulb{width:7px;height:7px;border-radius:50%;background:${goldLine};
          box-shadow:0 0 10px ${goldLine};animation:blink 1.6s ease-in-out infinite;}
        .bulb:nth-child(3){animation-delay:.8s;}

        .hud{
          display:flex;align-items:center;justify-content:space-between;
          padding:0 6px 10px;font-family:${sans};
        }
        .hud div{display:flex;flex-direction:column;gap:2px;}
        .hud small{font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:${creamInk}59;}
        .hud b{font-family:${serif};font-weight:800;font-size:1.15rem;color:${creamInk};line-height:1;}
        .hud .combo b{color:${goldLine};}

        .glassbox{position:relative;border-radius:16px;overflow:hidden;
          box-shadow:inset 0 0 0 1px ${goldLine}33, inset 0 0 40px -10px #000;}
        .glassbox canvas{display:block;width:100%;height:auto;}

        .veil{
          position:absolute;inset:0;display:flex;flex-direction:column;
          align-items:center;justify-content:center;gap:12px;text-align:center;
          background:${plumDeep}e0;backdrop-filter:blur(6px);padding:24px;
        }
        .veil h3{margin:0;font-family:${serif};font-weight:800;
          font-size:1.7rem;color:${creamInk};line-height:1.1;}
        .veil p{margin:0;font-family:${sans};font-weight:300;font-size:.88rem;
          color:${creamInk}a6;max-width:26ch;line-height:1.5;}
        .veil button{
          margin-top:6px;font-family:${sans};font-size:.78rem;font-weight:600;
          letter-spacing:.16em;text-transform:uppercase;
          color:${plumDeep};background:${goldLine};border:none;
          border-radius:999px;padding:13px 30px;cursor:pointer;
          transition:transform .2s ease, filter .2s ease;
        }
        .veil button:hover{transform:translateY(-2px);filter:brightness(1.08);}

        .deck{padding:12px 6px 2px;text-align:center;font-family:${sans};
          font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:${creamInk}4d;}

        @keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
        @media (prefers-reduced-motion:reduce){.bulb{animation:none;}}
      `}</style>

      <div className="marquee">
        <span className="bulb" />
        <b>BUNII</b>
        <span className="bulb" />
      </div>

      <div className="hud">
        <div>
          <small>Score</small>
          <b>{score}</b>
        </div>
        <div className="combo">
          <small>Combo</small>
          <b>{combo > 0 ? `${combo}x` : "—"}</b>
        </div>
        <div style={{ alignItems: "flex-end" }}>
          <small>Time</small>
          <b>{seconds}</b>
        </div>
      </div>

      <div className="glassbox">
        <canvas ref={canvasRef} style={{ aspectRatio: `${W} / ${H}` }} />

        {phase === "idle" && (
          <div className="veil">
            <h3>Catch the Buniis</h3>
            <p>Slide the basket. Don't let them hit the floor — a miss resets your combo.</p>
            <button onClick={start}>Start</button>
          </div>
        )}

        {phase === "over" && (
          <div className="veil">
            <h3>{score} caught</h3>
            <p>{score > best ? "New best." : `Best so far: ${best}`}</p>
            <button onClick={start}>Play again</button>
          </div>
        )}
      </div>

      <p className="deck">{phase === "playing" ? "Drag to move" : `Best ${best}`}</p>
    </div>
  );
}
