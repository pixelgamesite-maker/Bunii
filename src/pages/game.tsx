import { useEffect } from "react";
import { Link } from "wouter";
import { FONT_LINK, creamInk, goldLine, plum, plumDeep, plumLift, sans, serif, violetGlow } from "@/lib/bunii-theme";
import { BuniiDrop } from "@/components/bunii/BuniiDrop";

export default function Game() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONT_LINK;
    document.head.appendChild(l);
  }, []);

  return (
    <div className="gpage">
      <style>{`
        *{box-sizing:border-box;}
        body{margin:0;background:${plum};}
        a{color:inherit;text-decoration:none;}
        .gpage{
          min-height:100svh;display:flex;flex-direction:column;
          font-family:${sans};color:${creamInk};
          background:
            radial-gradient(85% 60% at 50% 0%, ${plumLift} 0%, transparent 62%),
            radial-gradient(70% 50% at 50% 100%, ${violetGlow}2e 0%, transparent 70%),
            linear-gradient(172deg, ${plum} 0%, ${plumDeep} 100%);
        }
        .gbar{
          display:flex;align-items:center;justify-content:space-between;
          padding:16px clamp(18px,4vw,36px);
          background:${plumLift}f2;
          backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
          box-shadow:inset 0 -1px 0 ${goldLine}26;
        }
        .gbrand{display:flex;align-items:center;gap:12px;}
        .gbrand img{width:38px;height:38px;border-radius:50%;object-fit:cover;
          box-shadow:0 0 0 1px ${goldLine}59;}
        .gbrand span{font-family:${serif};font-weight:800;font-size:1.35rem;
          letter-spacing:-.015em;}
        .gback{
          font-size:.72rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;
          color:${creamInk}b3;border:1px solid ${goldLine}33;border-radius:999px;
          padding:10px 20px;transition:background .25s ease,color .25s ease;
        }
        .gback:hover,.gback:focus-visible{background:${goldLine};color:${plumDeep};outline:none;}

        .stage{
          flex:1;display:flex;flex-direction:column;align-items:center;
          gap:18px;padding:clamp(22px,5vh,44px) 18px clamp(34px,7vh,64px);
        }
        .stage h1{
          margin:0;text-align:center;font-family:${serif};font-weight:800;
          font-size:clamp(1.7rem,5.6vw,2.5rem);line-height:1.05;letter-spacing:-.02em;
        }
        .stage p{
          margin:0;text-align:center;font-weight:300;font-size:.92rem;
          color:${creamInk}a6;max-width:34ch;line-height:1.55;
        }
      `}</style>

      <header className="gbar">
        <Link href="/" className="gbrand">
          <img src="/bunii-logo.jpg" alt="" />
          <span>Bunii</span>
        </Link>
        <Link href="/" className="gback">
          Back
        </Link>
      </header>

      <main className="stage">
        <h1>Catch a Bunii.</h1>
        <p>Sixty seconds. The gold ones are worth holding out for.</p>
        <BuniiDrop />
      </main>
    </div>
  );
}
