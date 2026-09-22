import { useEffect, useRef, useState, type ReactNode } from "react";
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
import { useAuth } from "@/lib/auth";
import { X_PROFILE_URL } from "@/lib/bunii-api";

let fontsLoaded = false;
function loadFonts() {
  if (fontsLoaded) return;
  fontsLoaded = true;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = FONT_LINK;
  document.head.appendChild(l);
}

const X_GLYPH =
  "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z";

export function XGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={X_GLYPH} />
    </svg>
  );
}

function AccountPill() {
  const { session, loading, status, signIn, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function away(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("pointerdown", away);
    return () => window.removeEventListener("pointerdown", away);
  }, [open]);

  if (loading) return <span className="acct acct--ghost" aria-hidden />;

  if (!session) {
    return (
      <button type="button" className="acct acct--in" onClick={() => signIn()}>
        <XGlyph size={12} />
        Sign in
      </button>
    );
  }

  const meta = session.user.user_metadata ?? {};
  const handle = status?.handle ?? meta.user_name ?? "you";
  const avatar: string | null = status?.avatar ?? meta.avatar_url ?? null;

  return (
    <div className="acctwrap" ref={ref}>
      <button type="button" className="acct" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {avatar ? <img src={avatar} alt="" /> : <span className="acct__dot" />}
        <b>{status ? status.total.toLocaleString() : "—"}</b>
        <small>pts</small>
      </button>

      {open && (
        <div className="menu" role="menu">
          <p className="menu__handle">@{handle}</p>
          <Link href="/social" className="menu__item" onClick={() => setOpen(false)}>
            Social tasks
          </Link>
          <Link href="/game" className="menu__item" onClick={() => setOpen(false)}>
            Play
          </Link>
          <button
            type="button"
            className="menu__item"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  useEffect(loadFonts, []);

  return (
    <div className="shell">
      <style>{`
        *{box-sizing:border-box;}
        body{margin:0;background:${plum};}
        a{color:inherit;text-decoration:none;}
        ::selection{background:${goldLine};color:${plumDeep};}

        .shell{
          min-height:100svh;display:flex;flex-direction:column;
          font-family:${sans};color:${creamInk};
          background:
            radial-gradient(85% 60% at 16% 2%, ${plumLift} 0%, transparent 64%),
            radial-gradient(70% 55% at 90% 98%, ${violetGlow}33 0%, transparent 68%),
            linear-gradient(172deg, ${plum} 0%, ${plum} 48%, ${plumDeep} 100%);
        }

        /* ── header ── */
        .bar{
          position:sticky;top:0;z-index:40;
          display:flex;align-items:center;justify-content:space-between;gap:14px;
          padding:14px clamp(16px,4vw,40px);
          background:${plumLift}f2;
          backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
          box-shadow:inset 0 -1px 0 ${goldLine}26, 0 18px 40px -34px #000;
        }
        .brand{display:flex;align-items:center;gap:12px;min-width:0;}
        .brand img{width:42px;height:42px;border-radius:50%;object-fit:cover;flex-shrink:0;
          box-shadow:0 0 0 1px ${goldLine}59, 0 8px 22px -10px #000;}
        .brand span{font-family:${serif};font-weight:800;font-size:1.55rem;letter-spacing:-.015em;}
        .bar__right{display:flex;align-items:center;gap:8px;}

        .x-link{
          display:flex;align-items:center;justify-content:center;
          width:40px;height:40px;border-radius:999px;flex-shrink:0;
          color:${creamInk}d9;background:${surface}b3;
          border:1px solid ${goldLine}2e;
          transition:background .25s ease,color .25s ease,border-color .25s ease;
        }
        .x-link:hover{background:${goldLine};border-color:${goldLine};color:${plumDeep};}

        .acctwrap{position:relative;}
        .acct{
          display:flex;align-items:center;gap:8px;height:40px;
          padding:0 14px 0 5px;border-radius:999px;cursor:pointer;
          font-family:${sans};color:${creamInk};
          background:${surface}b3;border:1px solid ${goldLine}33;
          transition:border-color .25s ease,background .25s ease;
        }
        .acct:hover{border-color:${goldLine}80;}
        .acct img,.acct__dot{width:30px;height:30px;border-radius:50%;object-fit:cover;background:${goldLine}40;}
        .acct b{font-family:${serif};font-weight:800;font-size:.98rem;
          font-variant-numeric:tabular-nums;color:${goldLine};}
        .acct small{font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:${creamInk}73;}
        .acct--in{
          padding:0 18px;gap:9px;font-size:.72rem;font-weight:600;
          letter-spacing:.14em;text-transform:uppercase;
          color:${plumDeep};background:${goldLine};border-color:${goldLine};
        }
        .acct--in:hover{filter:brightness(1.08);}
        .acct--ghost{width:96px;cursor:default;opacity:.5;}

        .menu{
          position:absolute;right:0;top:calc(100% + 8px);min-width:190px;
          padding:8px;border-radius:16px;
          background:${plum};box-shadow:inset 0 0 0 1px ${goldLine}40, 0 24px 50px -20px #000;
          display:flex;flex-direction:column;
          animation:menuIn .18s ease both;
        }
        .menu__handle{margin:0;padding:8px 12px 10px;font-size:.8rem;color:${creamInk}8c;
          border-bottom:1px solid ${goldLine}1f;margin-bottom:4px;}
        .menu__item{
          display:block;width:100%;text-align:left;padding:10px 12px;border-radius:10px;
          background:none;border:none;cursor:pointer;
          font-family:${sans};font-size:.88rem;color:${creamInk};
        }
        .menu__item:hover{background:${surface};}

        /* ── shared controls ── */
        .btn{
          display:inline-flex;align-items:center;justify-content:center;gap:8px;
          font-family:${sans};font-size:.74rem;font-weight:600;
          letter-spacing:.16em;text-transform:uppercase;
          color:${plumDeep};background:${goldLine};
          border:none;border-radius:999px;padding:14px 26px;cursor:pointer;
          transition:transform .2s ease,filter .2s ease,opacity .2s ease,background .2s ease;
        }
        .btn:hover:not(:disabled){transform:translateY(-2px);filter:brightness(1.08);}
        .btn:disabled{opacity:.4;cursor:not-allowed;}
        .btn--ghost{color:${creamInk};background:transparent;box-shadow:inset 0 0 0 1px ${goldLine}59;}
        .btn--ghost:hover:not(:disabled){background:${surface};filter:none;}
        .btn--block{width:100%;}
        .btn--sm{padding:10px 18px;font-size:.68rem;}

        .field{
          width:100%;min-width:0;background:${plumDeep}cc;color:${creamInk};
          border:1px solid ${goldLine}40;border-radius:999px;
          padding:13px 18px;font-family:${sans};font-size:.88rem;outline:none;
          transition:border-color .2s ease;
        }
        .field:focus{border-color:${goldLine};}
        .field::placeholder{color:${creamInk}40;}

        .err{margin:0;font-size:.82rem;line-height:1.45;color:#E88A6A;}
        .eyebrow{margin:0;font-size:.62rem;letter-spacing:.26em;text-transform:uppercase;color:${goldLine};}

        a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid ${goldLine};outline-offset:3px;}

        @keyframes menuIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
        @media (max-width:440px){
          .brand span{font-size:1.25rem;}
          .brand img{width:36px;height:36px;}
          .acct--in{padding:0 14px;}
        }
        @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}
      `}</style>

      <header className="bar">
        <Link href="/" className="brand">
          <img src="/bunii-logo.jpg" alt="" />
          <span>Bunii</span>
        </Link>

        <div className="bar__right">
          <AccountPill />
          <a href={X_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="x-link" aria-label="Bunii on X">
            <XGlyph />
          </a>
        </div>
      </header>

      {children}
    </div>
  );
}
