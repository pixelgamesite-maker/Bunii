import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  FONT_LINK,
  creamInk,
  goldLine,
  plum,
  plumDeep,
  plumLift,
  sans,
  serif,
  surface,
  violetGlow,
} from "@/lib/bunii-theme";
import { X_PROFILE_URL, isGateCleared } from "@/lib/bunii-gate";
import { ArcadeGate } from "@/components/bunii/ArcadeGate";

export default function Home() {
  const [gateOpen, setGateOpen] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONT_LINK;
    document.head.appendChild(l);
    setCleared(isGateCleared());
  }, []);

  const gameLabel = (
    <div className="banner__label">
      <h1>THE GRAB GAME</h1>
      <p>{cleared ? "Play now" : "Enter the arcade"}</p>
    </div>
  );

  return (
    <div className="page">
      <style>{`
        *{box-sizing:border-box;}
        body{margin:0;background:${plum};}
        a{color:inherit;text-decoration:none;}
        ::selection{background:${goldLine};color:${plumDeep};}

        .page{
          min-height:100svh;display:flex;flex-direction:column;
          font-family:${sans};color:${creamInk};
          background:
            radial-gradient(85% 65% at 16% 2%, ${plumLift} 0%, transparent 64%),
            radial-gradient(70% 55% at 90% 98%, ${violetGlow}33 0%, transparent 68%),
            linear-gradient(172deg, ${plum} 0%, ${plum} 48%, ${plumDeep} 100%);
        }

        /* ── header ── */
        .bar{
          position:sticky;top:0;z-index:40;
          display:flex;align-items:center;justify-content:space-between;gap:20px;
          padding:16px clamp(18px,4vw,40px);
          background:${plumLift}f2;
          backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
          box-shadow:inset 0 -1px 0 ${goldLine}26, 0 18px 40px -34px #000;
        }
        .brand{display:flex;align-items:center;gap:13px;}
        .brand img{width:44px;height:44px;border-radius:50%;object-fit:cover;
          box-shadow:0 0 0 1px ${goldLine}59, 0 8px 22px -10px #000;}
        .brand span{font-family:${serif};font-weight:800;font-size:1.6rem;
          letter-spacing:-.015em;color:${creamInk};}

        .x-link{
          display:flex;align-items:center;justify-content:center;
          width:42px;height:42px;border-radius:999px;
          color:${creamInk}d9;background:${surface}b3;
          border:1px solid ${goldLine}2e;box-shadow:inset 0 1px 0 ${creamInk}0f;
          transition:background .25s ease,color .25s ease,border-color .25s ease;
        }
        .x-link:hover,.x-link:focus-visible{
          background:${goldLine};border-color:${goldLine};color:${plumDeep};outline:none;
        }

        /* ── banners ── */
        .deck{
          flex:1;width:100%;max-width:1120px;margin:0 auto;
          display:flex;flex-direction:column;justify-content:center;
          gap:clamp(18px,2.6vw,26px);
          padding:clamp(28px,6vh,64px) clamp(18px,4vw,40px) clamp(40px,8vh,80px);
        }

        .banner{
          position:relative;display:block;width:100%;
          height:clamp(190px,27vh,270px);
          border-radius:22px;overflow:hidden;
          background:${surface};border:none;padding:0;
          font:inherit;color:inherit;text-align:inherit;
          box-shadow:
            inset 0 0 0 1px ${goldLine}33,
            0 34px 64px -30px #000,
            0 0 0 1px ${plumDeep};
          animation:settle .8s cubic-bezier(.2,.7,.25,1) both;
          transition:transform .55s cubic-bezier(.2,.7,.25,1), box-shadow .55s ease;
        }
        .banner:nth-child(2){animation-delay:.1s;}
        .banner img{
          position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
          transition:transform 1s cubic-bezier(.2,.7,.25,1);
        }
        .banner::after{
          content:"";position:absolute;inset:0;
          background:linear-gradient(180deg, ${plumDeep}40 0%, ${plumDeep}b8 100%);
        }

        .banner__label{
          position:absolute;inset:0;z-index:2;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          gap:8px;padding:0 24px;text-align:center;
        }
        .banner__label h1,.banner__label h2{
          margin:0;font-family:${serif};font-weight:800;
          font-size:clamp(2.1rem,6.4vw,3.5rem);line-height:1;
          letter-spacing:-.02em;color:#fff;text-shadow:0 2px 30px ${plumDeep};
        }
        .banner__label p{
          margin:0;font-size:clamp(.8rem,1.6vw,.95rem);font-weight:300;
          letter-spacing:.14em;text-transform:uppercase;color:${creamInk}c4;
        }

        .banner--live{cursor:pointer;}
        .banner--live:hover,.banner--live:focus-visible{
          transform:translateY(-5px);
          box-shadow:
            inset 0 0 0 1px ${goldLine}80,
            0 44px 78px -32px #000,
            0 0 0 1px ${plumDeep};
          outline:none;
        }
        .banner--live:hover img,.banner--live:focus-visible img{transform:scale(1.05);}

        .banner--soon img{filter:saturate(.55) brightness(.72);}
        .banner--soon .banner__label p{color:${goldLine};}

        @keyframes settle{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}
      `}</style>

      <header className="bar">
        <div className="brand">
          <img src="/bunii-logo.jpg" alt="" />
          <span>Bunii</span>
        </div>

        <a href={X_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="x-link" aria-label="Bunii on X">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
          </svg>
        </a>
      </header>

      <main className="deck">
        {cleared ? (
          <Link href="/game" className="banner banner--live">
            <img src="/bun-button.jpg" alt="" />
            {gameLabel}
          </Link>
        ) : (
          <button type="button" className="banner banner--live" onClick={() => setGateOpen(true)}>
            <img src="/bun-button.jpg" alt="" />
            {gameLabel}
          </button>
        )}

        <div className="banner banner--soon" aria-label="The Buniverse, coming soon">
          <img src="/backgroung-bunii.jpg" alt="" />
          <div className="banner__label">
            <h2>THE BUNIVERSE</h2>
            <p>For the true believers</p>
          </div>
        </div>
      </main>

      <ArcadeGate open={gateOpen} onClose={() => setGateOpen(false)} />
    </div>
  );
}
