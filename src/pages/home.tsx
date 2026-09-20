import { useEffect, useState } from "react";
import { Link } from "wouter";
import { FONT_LINK, bg, bgDeep, gold, goldLight, ink, mint, sans, serif, yellow } from "@/lib/bunii-theme";
import { BUNII_IMAGES, FAQS, HOW_IT_WORKS, X_URL } from "@/lib/bunii-data";
import { Kicker } from "@/components/bunii/Kicker";
import { Particles } from "@/components/bunii/Particles";
import { BuniiGallery } from "@/components/bunii/BuniiGallery";
import { FaqItem } from "@/components/bunii/FaqItem";
import { WhitelistModal } from "@/components/bunii/WhitelistModal";

const chipColors = [gold, mint, yellow];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONT_LINK;
    document.head.appendChild(l);
    setTimeout(() => setReady(true), 80);
  }, []);

  return (
    <div style={{ background: bg, minHeight: "100vh", fontFamily: sans, color: ink, overflowX: "hidden" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes stamp { 0%{transform:scale(0) rotate(-15deg);opacity:0} 70%{transform:scale(1.12) rotate(3deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes cardIn { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes wiggle { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        *{box-sizing:border-box;}
        ::placeholder{color:rgba(255,255,255,0.25);}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${gold}55;border-radius:4px;}
        html{scroll-behavior:smooth;}
        a{color:inherit;text-decoration:none;}
        .gummy-btn{transition:transform .15s ease, box-shadow .15s ease;}
        .gummy-btn:active{transform:translateY(3px);}
      `}</style>

      {/* ══════════ HEADER ══════════ */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "0 20px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: `${bgDeep}cc`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <a href="#home" style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <img src="/bunii-logo.jpg" style={{ width: "30px", height: "30px", borderRadius: "10px", objectFit: "cover" }} alt="" />
          <span style={{ fontFamily: serif, fontSize: "1.15rem", fontWeight: 800, color: "#fff", letterSpacing: "0.01em" }}>Bunii</span>
        </a>

        <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <a href="#faq" style={{ fontFamily: sans, fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", padding: "8px 12px" }}>
            FAQ
          </a>
          <Link
            href="/game"
            style={{
              fontFamily: sans,
              fontSize: "0.72rem",
              fontWeight: 800,
              color: bgDeep,
              background: mint,
              padding: "9px 16px",
              borderRadius: "999px",
            }}
          >
            🎮 Play
          </Link>
          <a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow on X"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "999px",
              color: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.12)",
              marginLeft: "4px",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </a>
        </nav>
      </header>

      {/* ══════════ HERO ══════════ */}
      <div id="home" style={{ minHeight: "92vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "110px 20px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Particles />
        <div style={{ position: "absolute", top: "8%", left: "8%", width: "180px", height: "180px", borderRadius: "50%", background: `radial-gradient(circle, ${gold}30 0%, transparent 70%)`, filter: "blur(10px)", animation: "floaty 6s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "10%", width: "220px", height: "220px", borderRadius: "50%", background: `radial-gradient(circle, ${mint}26 0%, transparent 70%)`, filter: "blur(10px)", animation: "floaty 7s ease-in-out infinite 1s" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <div style={{ animation: ready ? "fadeUp 0.6s ease 0.05s both" : "none", opacity: ready ? undefined : 0 }}>
            <Kicker text="🐰 Free Mint · First 1,000" />
          </div>

          <h1
            style={{
              fontFamily: serif,
              fontSize: "clamp(3.6rem,17vw,7rem)",
              fontWeight: 800,
              color: "#fff",
              margin: "6px 0 2px",
              letterSpacing: "-0.01em",
              lineHeight: 0.95,
              animation: ready ? "fadeUp 0.6s ease 0.12s both" : "none",
              opacity: ready ? undefined : 0,
            }}
          >
            Bunii
          </h1>

          <p
            style={{
              fontFamily: sans,
              fontSize: "clamp(1rem,3vw,1.15rem)",
              fontWeight: 600,
              color: "rgba(255,255,255,0.65)",
              margin: "10px 0 34px",
              maxWidth: "380px",
              lineHeight: 1.6,
              animation: ready ? "fadeUp 0.6s ease 0.2s both" : "none",
              opacity: ready ? undefined : 0,
            }}
          >
            Cute little troublemakers, hopping onto Robinhood. 🐾
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
              width: "100%",
              maxWidth: "420px",
              animation: ready ? "fadeUp 0.6s ease 0.28s both" : "none",
              opacity: ready ? undefined : 0,
            }}
          >
            <button
              onClick={() => setModalOpen(true)}
              className="gummy-btn"
              style={{
                flex: "1 1 180px",
                fontFamily: sans,
                fontSize: "0.85rem",
                fontWeight: 800,
                color: bgDeep,
                background: gold,
                border: "none",
                borderRadius: "16px",
                padding: "16px 20px",
                cursor: "pointer",
                boxShadow: `0 5px 0 ${goldLight}, 0 5px 0 #c23f7e`,
              }}
            >
              Join The BuniiList
            </button>
            <Link
              href="/game"
              className="gummy-btn"
              style={{
                flex: "1 1 180px",
                fontFamily: sans,
                fontSize: "0.85rem",
                fontWeight: 800,
                color: "#fff",
                background: "rgba(255,255,255,0.06)",
                border: `2px solid ${mint}55`,
                borderRadius: "16px",
                padding: "14px 20px",
                display: "block",
              }}
            >
              🎮 Play The Grab Game
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "38px",
              flexWrap: "wrap",
              justifyContent: "center",
              animation: ready ? "fadeUp 0.6s ease 0.36s both" : "none",
              opacity: ready ? undefined : 0,
            }}
          >
            {[["Free", "Mint Price"], ["1,000", "Spots"], ["Robinhood", "Chain"]].map(([v, l], i) => (
              <div
                key={l}
                style={{
                  background: `${chipColors[i]}18`,
                  border: `1.5px solid ${chipColors[i]}40`,
                  borderRadius: "14px",
                  padding: "10px 18px",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: 0, fontFamily: serif, fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{v}</p>
                <p style={{ margin: "2px 0 0", fontFamily: sans, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ GALLERY ══════════ */}
      <section style={{ background: bgDeep, padding: "70px 20px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <Kicker text="The Collection" />
          <h2 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,6vw,2.6rem)", fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Meet The Buniis</h2>
          <p style={{ fontFamily: sans, fontSize: "0.95rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", margin: "0 0 32px" }}>
            Cute. Bold. A little bit of trouble.
          </p>
          <BuniiGallery />
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section style={{ background: bg, padding: "70px 20px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <Kicker text="How It Works" />
          <h2 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,6vw,2.6rem)", fontWeight: 800, color: "#fff", margin: "0 0 32px" }}>Three Hops To A Free Mint</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "14px" }}>
            {HOW_IT_WORKS.map((s, i) => (
              <div
                key={s.title}
                style={{
                  background: `${chipColors[i]}14`,
                  border: `1.5px solid ${chipColors[i]}35`,
                  borderRadius: "20px",
                  padding: "26px 18px",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>{s.emoji}</div>
                <p style={{ margin: "0 0 6px", fontFamily: serif, fontSize: "1.05rem", fontWeight: 700, color: "#fff" }}>{s.title}</p>
                <p style={{ margin: 0, fontFamily: sans, fontSize: "0.85rem", fontWeight: 500, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ BUNIILIST CTA ══════════ */}
      <section style={{ padding: "20px 20px 70px" }}>
        <div
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            background: `linear-gradient(135deg, ${gold}30, ${mint}20)`,
            border: `1.5px solid ${gold}40`,
            borderRadius: "28px",
            padding: "48px 28px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontFamily: serif, fontSize: "clamp(1.6rem,5.5vw,2.2rem)", fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Ready to hop in?</h2>
          <p style={{ fontFamily: sans, fontSize: "0.9rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: "0 0 24px", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
            The BuniiList is the only way to mint. First 1,000 wallets go free.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setModalOpen(true)}
              className="gummy-btn"
              style={{
                fontFamily: sans,
                fontSize: "0.82rem",
                fontWeight: 800,
                color: bgDeep,
                background: gold,
                border: "none",
                borderRadius: "14px",
                padding: "14px 26px",
                cursor: "pointer",
                boxShadow: `0 4px 0 #c23f7e`,
              }}
            >
              Claim Your Spot
            </button>
            <Link
              href="/game"
              className="gummy-btn"
              style={{
                fontFamily: sans,
                fontSize: "0.82rem",
                fontWeight: 800,
                color: "#fff",
                background: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,255,255,0.2)",
                borderRadius: "14px",
                padding: "13px 26px",
              }}
            >
              Play Instead
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section id="faq" style={{ background: bgDeep, padding: "70px 20px 80px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <Kicker text="FAQ" />
            <h2 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,6vw,2.6rem)", fontWeight: 800, color: "#fff", margin: "0 0 28px" }}>Questions</h2>
          </div>
          <div>
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ padding: "50px 24px 36px", textAlign: "center" }}>
        <img src="/bunii-logo.jpg" style={{ width: "40px", height: "40px", borderRadius: "12px", objectFit: "cover", marginBottom: "12px" }} alt="" />
        <h3 style={{ fontFamily: serif, fontSize: "1.2rem", fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>Bunii</h3>
        <p style={{ fontFamily: sans, fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", margin: "0 0 22px" }}>
          Free mint for the first 1,000. 🐰
        </p>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
          {[["X", X_URL], ["Play", "/game"], ["FAQ", "#faq"]].map(([l, h]) => (
            <a key={l} href={h} style={{ fontFamily: sans, fontSize: "0.72rem", fontWeight: 700, color: `${gold}aa` }}>
              {l}
            </a>
          ))}
        </div>
        <p style={{ fontFamily: sans, fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
          THE BUNIVERSE OPENS SOON
        </p>
      </footer>

      <WhitelistModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
