import { useEffect } from "react";
import { Link } from "wouter";
import { FONT_LINK, creamInk, goldLine, plum, plumDeep, plumLift, sans, serif, violetGlow } from "@/lib/bunii-theme";
import { BuniiReaction } from "@/components/bunii/BuniiReaction";

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
            radial-gradient(85% 55% at 50% 0%, ${plumLift} 0%, transparent 64%),
            radial-gradient(65% 45% at 50% 100%, ${violetGlow}26 0%, transparent 72%),
            linear-gradient(172deg, ${plum} 0%, ${plumDeep} 100%);
        }
        .gbar{
          display:flex;align-items:center;justify-content:space-between;
          padding:16px clamp(18px,4vw,40px);
          background:${plumLift}f2;
          backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
          box-shadow:inset 0 -1px 0 ${goldLine}26;
        }
        .gbrand{display:flex;align-items:center;gap:12px;}
        .gbrand img{width:38px;height:38px;border-radius:50%;object-fit:cover;
          box-shadow:0 0 0 1px ${goldLine}59;}
        .gbrand span{font-family:${serif};font-weight:800;font-size:1.35rem;letter-spacing:-.015em;}
        .gback{
          font-size:.72rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;
          color:${creamInk}b3;border:1px solid ${goldLine}33;border-radius:999px;
          padding:10px 20px;transition:background .25s ease,color .25s ease;
        }
        .gback:hover,.gback:focus-visible{background:${goldLine};color:${plumDeep};outline:none;}

        .stagewrap{
          flex:1;display:flex;flex-direction:column;align-items:center;
          gap:16px;padding:clamp(24px,5vh,48px) clamp(16px,4vw,32px) clamp(36px,7vh,68px);
        }
        .stagewrap h1{
          margin:0;text-align:center;font-family:${serif};font-weight:800;
          font-size:clamp(1.8rem,5.4vw,2.6rem);line-height:1.05;letter-spacing:-.02em;
        }
        .stagewrap .lede{
          margin:0 0 6px;text-align:center;font-weight:300;font-size:.95rem;
          color:${creamInk}a6;max-width:38ch;line-height:1.55;
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

      <main className="stagewrap">
        <h1>How fast are you?</h1>
        <p className="lede">One of the five lets go without warning. Catch it before it lands.</p>
        <BuniiReaction />
      </main>
    </div>
  );
}
