import { useEffect, useState } from "react";
import { Link } from "wouter";
import { FONT_LINK, cream, ember, espresso, honey, honeyDeep, inkDark, sans, serif } from "@/lib/bunii-theme";
import { FAQS, HOW_IT_WORKS, X_URL } from "@/lib/bunii-data";

const STATS: [string, string][] = [
  ["Free", "Mint price"],
  ["1,000", "Spots"],
  ["Robinhood", "Chain"],
];

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: `2px solid ${inkDark}`,
        borderRadius: "10px",
        background: cream,
        marginBottom: "10px",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "16px 18px",
          textAlign: "left",
          fontFamily: sans,
          fontSize: "1rem",
          fontWeight: 700,
          color: inkDark,
        }}
      >
        {q}
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: open ? ember : honey,
            color: open ? cream : inkDark,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            lineHeight: 1,
            fontWeight: 900,
          }}
        >
          {open ? "–" : "+"}
        </span>
      </button>
      {open && (
        <p
          style={{
            margin: 0,
            padding: "0 18px 18px",
            fontFamily: sans,
            fontSize: "0.95rem",
            lineHeight: 1.6,
            color: `${inkDark}c4`,
            maxWidth: "62ch",
          }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONT_LINK;
    document.head.appendChild(l);
  }, []);

  return (
    <div style={{ background: honey, minHeight: "100vh", fontFamily: sans, color: inkDark, overflowX: "hidden" }}>
      <style>{`
        *{box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        a{color:inherit;text-decoration:none;}
        body{margin:0;}
        ::selection{background:${inkDark};color:${cream};}

        .wrap{max-width:1040px;margin:0 auto;padding:0 20px;}

        .tile{
          display:block;
          border:3px solid ${inkDark};
          border-radius:16px;
          overflow:hidden;
          background:${cream};
          box-shadow:8px 8px 0 ${inkDark};
          transition:transform .18s ease, box-shadow .18s ease;
        }
        .tile--live:hover,.tile--live:focus-visible{
          transform:translate(3px,3px);
          box-shadow:5px 5px 0 ${inkDark};
          outline:none;
        }
        .tile--live:active{transform:translate(8px,8px);box-shadow:0 0 0 ${inkDark};}
        .tile--soon{opacity:.92;cursor:default;}

        .tile img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;border-bottom:3px solid ${inkDark};}

        a:focus-visible,button:focus-visible{outline:3px solid ${ember};outline-offset:3px;border-radius:4px;}

        .reveal{animation:rise .55s cubic-bezier(.2,.7,.3,1) both;}
        @keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){
          *{animation:none!important;transition:none!important;}
          html{scroll-behavior:auto;}
        }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: honey,
          borderBottom: `3px solid ${inkDark}`,
        }}
      >
        <div className="wrap" style={{ height: "68px", display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/bunii-logo.jpg"
            alt=""
            style={{ width: "36px", height: "36px", borderRadius: "10px", objectFit: "cover", border: `2px solid ${inkDark}` }}
          />
          <span style={{ fontFamily: serif, fontSize: "1.5rem", color: inkDark, letterSpacing: "0.01em" }}>Bunii</span>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="wrap" style={{ padding: "64px 20px 8px" }}>
        <div className="reveal" style={{ maxWidth: "620px" }}>
          <h1
            style={{
              fontFamily: serif,
              fontSize: "clamp(3.2rem, 12vw, 6.4rem)",
              lineHeight: 0.92,
              margin: 0,
              color: inkDark,
              letterSpacing: "-0.015em",
            }}
          >
            One thousand
            <br />
            little troublemakers.
          </h1>
          <p
            style={{
              fontFamily: sans,
              fontSize: "clamp(1.05rem, 2.6vw, 1.2rem)",
              fontWeight: 600,
              lineHeight: 1.55,
              color: `${inkDark}cc`,
              margin: "20px 0 0",
              maxWidth: "46ch",
            }}
          >
            Hand-drawn bunnies hopping onto Robinhood. The first thousand mint free — no allowlist, no forms, just
            show up.
          </p>
        </div>
      </section>

      {/* ── TILES ──────────────────────────────────────────── */}
      <section className="wrap" style={{ padding: "36px 20px 64px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "28px",
          }}
        >
          <Link href="/game" className="tile tile--live">
            <img src="/bun-button.jpg" alt="" />
            <div style={{ padding: "18px 20px 20px" }}>
              <h2 style={{ fontFamily: serif, fontSize: "1.55rem", margin: "0 0 6px", color: inkDark, lineHeight: 1.1 }}>
                The Grab Game
              </h2>
              <p style={{ fontFamily: sans, fontSize: "0.95rem", fontWeight: 600, color: `${inkDark}b0`, margin: 0, lineHeight: 1.5 }}>
                Work the claw, pull a Bunii out of the machine. Playable now.
              </p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: "16px",
                  fontFamily: sans,
                  fontSize: "0.85rem",
                  fontWeight: 900,
                  color: cream,
                  background: ember,
                  border: `2px solid ${inkDark}`,
                  borderRadius: "8px",
                  padding: "10px 18px",
                }}
              >
                Play now
              </span>
            </div>
          </Link>

          <div className="tile tile--soon" aria-label="The Buniverse, coming soon">
            <div style={{ position: "relative" }}>
              <img src="/backgroung-bunii.jpg" alt="" />
              <span
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  fontFamily: sans,
                  fontSize: "0.78rem",
                  fontWeight: 900,
                  color: inkDark,
                  background: honey,
                  border: `2px solid ${inkDark}`,
                  borderRadius: "999px",
                  padding: "6px 14px",
                }}
              >
                Coming soon
              </span>
            </div>
            <div style={{ padding: "18px 20px 20px" }}>
              <h2 style={{ fontFamily: serif, fontSize: "1.55rem", margin: "0 0 6px", color: inkDark, lineHeight: 1.1 }}>
                The Buniverse
              </h2>
              <p style={{ fontFamily: sans, fontSize: "0.95rem", fontWeight: 600, color: `${inkDark}b0`, margin: 0, lineHeight: 1.5 }}>
                Where the thousand of them end up. Opening after mint.
              </p>
              <a
                href={X_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "16px",
                  fontFamily: sans,
                  fontSize: "0.85rem",
                  fontWeight: 900,
                  color: inkDark,
                  background: "transparent",
                  border: `2px solid ${inkDark}`,
                  borderRadius: "8px",
                  padding: "10px 18px",
                }}
              >
                Get told first
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section style={{ background: espresso, borderTop: `3px solid ${inkDark}`, borderBottom: `3px solid ${inkDark}` }}>
        <div
          className="wrap"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "24px",
            padding: "26px 20px",
          }}
        >
          {STATS.map(([v, l]) => (
            <div key={l} style={{ flex: "1 1 160px" }}>
              <p style={{ fontFamily: serif, fontSize: "1.8rem", color: honey, margin: 0, lineHeight: 1 }}>{v}</p>
              <p style={{ fontFamily: sans, fontSize: "0.9rem", fontWeight: 600, color: `${cream}99`, margin: "6px 0 0" }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section className="wrap" style={{ padding: "72px 20px" }}>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(1.9rem,5vw,2.6rem)", margin: "0 0 32px", color: inkDark, maxWidth: "16ch", lineHeight: 1.05 }}>
          Three hops to a free mint
        </h2>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "20px" }}>
          {HOW_IT_WORKS.map((s, i) => (
            <li
              key={s.title}
              style={{
                background: cream,
                border: `2px solid ${inkDark}`,
                borderRadius: "14px",
                padding: "22px 20px 24px",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: i === 0 ? ember : honeyDeep,
                  color: i === 0 ? cream : inkDark,
                  border: `2px solid ${inkDark}`,
                  fontFamily: serif,
                  fontSize: "1rem",
                  marginBottom: "14px",
                }}
              >
                {i + 1}
              </span>
              <p style={{ fontFamily: serif, fontSize: "1.2rem", color: inkDark, margin: "0 0 8px", lineHeight: 1.15 }}>{s.title}</p>
              <p style={{ fontFamily: sans, fontSize: "0.95rem", fontWeight: 600, color: `${inkDark}b0`, margin: 0, lineHeight: 1.55 }}>{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section id="faq" className="wrap" style={{ padding: "0 20px 80px", maxWidth: "760px" }}>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(1.9rem,5vw,2.6rem)", margin: "0 0 28px", color: inkDark }}>Questions</h2>
        {FAQS.map((f) => (
          <Faq key={f.q} q={f.q} a={f.a} />
        ))}
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{ background: espresso, borderTop: `3px solid ${inkDark}`, padding: "48px 20px 40px" }}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="/bunii-logo.jpg"
              alt=""
              style={{ width: "38px", height: "38px", borderRadius: "10px", objectFit: "cover", border: `2px solid ${honey}` }}
            />
            <span style={{ fontFamily: serif, fontSize: "1.35rem", color: cream }}>Bunii</span>
          </div>

          <nav style={{ display: "flex", gap: "22px", flexWrap: "wrap" }}>
            {([["X", X_URL], ["Play", "/game"], ["FAQ", "#faq"]] as [string, string][]).map(([l, h]) => (
              <a key={l} href={h} style={{ fontFamily: sans, fontSize: "0.92rem", fontWeight: 700, color: cream }}>
                {l}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
