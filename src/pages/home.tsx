import { useEffect } from "react";
import { Link } from "wouter";
import { FONT_LINK, blush, goldLine, inkRose, roseDeep, roseLight, roseMid, sans, serif } from "@/lib/bunii-theme";

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
        body{margin:0;}
        a{color:inherit;text-decoration:none;}
        ::selection{background:${inkRose};color:${blush};}

        .page{
          min-height:100svh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:clamp(36px,7vh,72px);
          padding:clamp(32px,6vh,72px) 24px;
          font-family:${sans};
          color:${inkRose};
          background:
            radial-gradient(120% 90% at 18% 8%, ${roseLight} 0%, transparent 58%),
            radial-gradient(110% 80% at 88% 96%, ${roseDeep} 0%, transparent 62%),
            linear-gradient(168deg, ${roseLight} 0%, ${roseMid} 52%, ${roseDeep} 100%);
        }

        .mark{
          display:flex;
          align-items:center;
          gap:12px;
          animation:settle .8s cubic-bezier(.2,.7,.25,1) both;
        }
        .mark img{
          width:34px;height:34px;border-radius:50%;object-fit:cover;
          box-shadow:0 0 0 1px ${goldLine}55;
        }
        .mark span{
          font-family:${serif};
          font-size:1.5rem;
          letter-spacing:.06em;
        }

        .deck{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(272px,1fr));
          gap:clamp(20px,3vw,32px);
          width:100%;
          max-width:860px;
        }

        .card{
          position:relative;
          display:flex;
          flex-direction:column;
          border-radius:4px;
          overflow:hidden;
          background:${blush};
          box-shadow:0 1px 0 ${goldLine}40, 0 24px 60px -24px rgba(59,31,28,.45);
          animation:settle .9s cubic-bezier(.2,.7,.25,1) both;
          transition:transform .5s cubic-bezier(.2,.7,.25,1), box-shadow .5s ease;
        }
        .card:nth-child(1){animation-delay:.08s;}
        .card:nth-child(2){animation-delay:.16s;}

        .card__frame{overflow:hidden;background:${roseMid};}
        .card__frame img{
          display:block;width:100%;height:100%;
          aspect-ratio:5/4;object-fit:cover;
          transition:transform .9s cubic-bezier(.2,.7,.25,1);
        }

        .card--live:hover,.card--live:focus-visible{
          transform:translateY(-6px);
          box-shadow:0 1px 0 ${goldLine}80, 0 36px 70px -26px rgba(59,31,28,.55);
          outline:none;
        }
        .card--live:hover .card__frame img,
        .card--live:focus-visible .card__frame img{transform:scale(1.04);}

        .card--soon .card__frame img{filter:saturate(.72) brightness(.97);}

        .card__body{
          padding:22px 24px 26px;
          border-top:1px solid ${goldLine}33;
        }
        .card__title{
          font-family:${serif};
          font-size:1.65rem;
          line-height:1.1;
          margin:0 0 6px;
          letter-spacing:.01em;
        }
        .card__sub{
          margin:0;
          font-size:.92rem;
          font-weight:300;
          line-height:1.55;
          color:${inkRose}a6;
        }
        .card__meta{
          display:block;
          margin-top:18px;
          font-size:.7rem;
          font-weight:500;
          letter-spacing:.22em;
          color:${goldLine};
        }
        .card--soon .card__meta{color:${inkRose}59;}

        a.card:focus-visible{outline:1px solid ${inkRose};outline-offset:6px;}

        @keyframes settle{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){
          *{animation:none!important;transition:none!important;}
        }
      `}</style>

      <div className="mark">
        <img src="/bunii-logo.jpg" alt="" />
        <span>Bunii</span>
      </div>

      <div className="deck">
        <Link href="/game" className="card card--live">
          <div className="card__frame">
            <img src="/bun-button.jpg" alt="" />
          </div>
          <div className="card__body">
            <h1 className="card__title">The Grab Game</h1>
            <p className="card__sub">Work the claw. See what you pull out.</p>
            <span className="card__meta">ENTER</span>
          </div>
        </Link>

        <div className="card card--soon">
          <div className="card__frame">
            <img src="/backgroung-bunii.jpg" alt="" />
          </div>
          <div className="card__body">
            <h2 className="card__title">The Buniverse</h2>
            <p className="card__sub">For the true believers.</p>
            <span className="card__meta">COMING SOON</span>
          </div>
        </div>
      </div>
    </div>
  );
}
