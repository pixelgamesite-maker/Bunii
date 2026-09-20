import { useEffect } from "react";
import { Link } from "wouter";
import {
  FONT_LINK,
  creamInk,
  emberGlow,
  goldLine,
  night,
  nightDeep,
  nightTop,
  sans,
  serif,
  surface,
} from "@/lib/bunii-theme";
import { X_URL } from "@/lib/bunii-data";

export default function Home() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONT_LINK;
    document.head.appendChild(l);
  }, []);

  return (
    <div className="page">
      <style>{`
        *{box-sizing:border-box;}
        body{margin:0;background:${night};}
        a{color:inherit;text-decoration:none;}
        ::selection{background:${goldLine};color:${nightDeep};}

        .page{
          min-height:100svh;
          display:flex;
          flex-direction:column;
          font-family:${sans};
          color:${creamInk};
          background:
            radial-gradient(90% 70% at 18% 0%, ${nightTop} 0%, transparent 62%),
            radial-gradient(70% 55% at 88% 96%, ${emberGlow}2e 0%, transparent 68%),
            linear-gradient(170deg, ${night} 0%, ${night} 45%, ${nightDeep} 100%);
        }

        /* ── header ── */
        .bar{
          position:sticky;top:0;z-index:40;
          display:flex;align-items:center;justify-content:space-between;
          gap:20px;flex-wrap:wrap;
          padding:18px clamp(18px,4vw,40px);
          backdrop-filter:blur(14px);
          -webkit-backdrop-filter:blur(14px);
          background:linear-gradient(${night}e6, ${night}66);
        }
        .brand{display:flex;align-items:center;gap:13px;}
        .brand img{
          width:44px;height:44px;border-radius:50%;object-fit:cover;
          box-shadow:0 0 0 1px ${goldLine}59, 0 8px 22px -10px #000;
        }
        .brand span{
          font-family:${serif};
          font-weight:800;
          font-size:1.6rem;
          letter-spacing:-.015em;
          color:${creamInk};
        }

        .nav{
          display:flex;align-items:center;gap:6px;
          background:${surface}cc;
          border:1px solid ${goldLine}2e;
          border-radius:999px;
          padding:5px;
          box-shadow:inset 0 1px 0 ${creamInk}0f, 0 14px 34px -22px #000;
        }
        .nav a,.nav span{
          font-size:.8rem;font-weight:500;letter-spacing:.1em;
          text-transform:uppercase;
          padding:10px 18px;border-radius:999px;
          transition:background .25s ease,color .25s ease;
        }
        .nav a{color:${creamInk}d9;}
        .nav a:hover,.nav a:focus-visible{background:${goldLine};color:${nightDeep};outline:none;}
        .nav span{color:${creamInk}42;cursor:default;}

        /* ── banners ── */
        .deck{
          flex:1;
          width:100%;
          max-width:1120px;
          margin:0 auto;
          display:flex;
          flex-direction:column;
          justify-content:center;
          gap:clamp(18px,2.6vw,26px);
          padding:clamp(28px,6vh,64px) clamp(18px,4vw,40px) clamp(40px,8vh,80px);
        }

        .banner{
          position:relative;
          display:block;
          height:clamp(190px,27vh,270px);
          border-radius:22px;
          overflow:hidden;
          background:${surface};
          box-shadow:
            inset 0 0 0 1px ${goldLine}33,
            0 34px 64px -30px #000,
            0 0 0 1px ${nightDeep};
          animation:settle .8s cubic-bezier(.2,.7,.25,1) both;
          transition:transform .55s cubic-bezier(.2,.7,.25,1), box-shadow .55s ease;
        }
        .banner:nth-child(2){animation-delay:.1s;}

        .banner img{
          position:absolute;inset:0;
          width:100%;height:100%;object-fit:cover;
          transition:transform 1s cubic-bezier(.2,.7,.25,1);
        }
        .banner::after{
          content:"";position:absolute;inset:0;
          background:linear-gradient(180deg, ${nightDeep}40 0%, ${nightDeep}b3 100%);
        }

        .banner__label{
          position:absolute;inset:0;z-index:2;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          gap:8px;padding:0 24px;text-align:center;
        }
        .banner__label h1,.banner__label h2{
          margin:0;
          font-family:${serif};
          font-weight:800;
          font-size:clamp(2.1rem,6.4vw,3.5rem);
          line-height:1;
          letter-spacing:-.02em;
          color:#fff;
          text-shadow:0 2px 30px ${nightDeep};
        }
        .banner__label p{
          margin:0;
          font-size:clamp(.8rem,1.6vw,.95rem);
          font-weight:300;
          letter-spacing:.14em;
          text-transform:uppercase;
          color:${creamInk}c4;
        }

        .banner--live:hover,.banner--live:focus-visible{
          transform:translateY(-5px);
          box-shadow:
            inset 0 0 0 1px ${goldLine}80,
            0 44px 78px -32px #000,
            0 0 0 1px ${nightDeep};
          outline:none;
        }
        .banner--live:hover img,.banner--live:focus-visible img{transform:scale(1.05);}

        .banner--soon img{filter:saturate(.55) brightness(.72);}
        .banner--soon .banner__label p{color:${goldLine};}

        a:focus-visible{outline:2px solid ${goldLine};outline-offset:4px;}

        @keyframes settle{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){
          *{animation:none!important;transition:none!important;}
        }
      `}</style>

      <header className="bar">
        <div className="brand">
          <img src="/bunii-logo.jpg" alt="" />
          <span>Bunii</span>
        </div>

        <nav className="nav">
          <Link href="/game">Game</Link>
          <span>Buniverse</span>
          <a href={X_URL} target="_blank" rel="noopener noreferrer">
            X
          </a>
        </nav>
      </header>

      <main className="deck">
        <Link href="/game" className="banner banner--live">
          <img src="/bun-button.jpg" alt="" />
          <div className="banner__label">
            <h1>THE GRAB GAME</h1>
            <p>Play now</p>
          </div>
        </Link>

        <div className="banner banner--soon" aria-label="The Buniverse, coming soon">
          <img src="/backgroung-bunii.jpg" alt="" />
          <div className="banner__label">
            <h2>THE BUNIVERSE</h2>
            <p>For the true believers</p>
          </div>
        </div>
      </main>
    </div>
  );
}
