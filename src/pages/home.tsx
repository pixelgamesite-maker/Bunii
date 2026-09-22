import { Link } from "wouter";
import { creamInk, goldLine, plumDeep, serif, surface } from "@/lib/bunii-theme";
import { SiteShell } from "@/components/bunii/SiteShell";
import { POINTS_PER_CATCH } from "@/lib/bunii-api";

export default function Home() {
  return (
    <SiteShell>
      <style>{`
        .deck{
          flex:1;width:100%;max-width:1120px;margin:0 auto;
          display:flex;flex-direction:column;justify-content:center;
          gap:clamp(18px,2.6vw,26px);
          padding:clamp(28px,6vh,64px) clamp(18px,4vw,40px) clamp(40px,8vh,80px);
        }

        .banner{
          position:relative;display:block;width:100%;
          height:clamp(190px,27vh,270px);
          border-radius:22px;overflow:hidden;background:${surface};
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
        .banner:hover,.banner:focus-visible{
          transform:translateY(-5px);
          box-shadow:
            inset 0 0 0 1px ${goldLine}80,
            0 44px 78px -32px #000,
            0 0 0 1px ${plumDeep};
          outline:none;
        }
        .banner:hover img,.banner:focus-visible img{transform:scale(1.05);}

        .banner__label{
          position:absolute;inset:0;z-index:2;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          gap:8px;padding:0 24px;text-align:center;
        }
        .banner__label h2{
          margin:0;font-family:${serif};font-weight:800;
          font-size:clamp(2.1rem,6.4vw,3.5rem);line-height:1;
          letter-spacing:-.02em;color:#fff;text-shadow:0 2px 30px ${plumDeep};
        }
        .banner__label p{
          margin:0;font-size:clamp(.8rem,1.6vw,.95rem);font-weight:300;
          letter-spacing:.14em;text-transform:uppercase;color:${creamInk}c4;
        }

        @keyframes settle{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
      `}</style>

      <main className="deck">
        <Link href="/game" className="banner">
          <img src="/bun-button.jpg" alt="" />
          <div className="banner__label">
            <h2>THE GRAB GAME</h2>
            <p>{POINTS_PER_CATCH} points a catch</p>
          </div>
        </Link>

        <Link href="/social" className="banner">
          <img src="/backgroung-bunii.jpg" alt="" />
          <div className="banner__label">
            <h2>SOCIAL</h2>
            <p>Earn points on X</p>
          </div>
        </Link>
      </main>
    </SiteShell>
  );
}
