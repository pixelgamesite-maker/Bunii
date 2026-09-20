import { useEffect, useState } from "react";
import { Link } from "wouter";
import { FONT_LINK, gold, goldLight, sans, serif } from "@/lib/bunii-theme";
import { CLASSES, CLASS_BUNIIS, FAQS, ROADMAP, SYSTEMS, TRAITS, X_URL } from "@/lib/bunii-data";
import { Label } from "@/components/bunii/Label";
import { Divider } from "@/components/bunii/Divider";
import { RevealSection } from "@/components/bunii/RevealSection";
import { Particles } from "@/components/bunii/Particles";
import { BuniiGallery } from "@/components/bunii/BuniiGallery";
import { FaqItem } from "@/components/bunii/FaqItem";
import { WhitelistModal } from "@/components/bunii/WhitelistModal";

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
    <div style={{ background: "#050504", minHeight: "100vh", fontFamily: sans, color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes stamp { 0%{transform:scale(0) rotate(-15deg);opacity:0} 70%{transform:scale(1.12) rotate(3deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes menuSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseGlow { 0%{box-shadow:0 0 0 0 ${gold}44, 0 10px 36px ${gold}36} 50%{box-shadow:0 0 20px 4px ${gold}33, 0 10px 36px ${gold}36} 100%{box-shadow:0 0 0 0 ${gold}44, 0 10px 36px ${gold}36} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes cardIn { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        *{box-sizing:border-box;}
        ::placeholder{color:rgba(255,255,255,0.2);}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${gold}33;border-radius:4px;}
        html{scroll-behavior:smooth;}
        a{color:inherit;text-decoration:none;}
      `}</style>

      {/* ══════════ HEADER ══════════ */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "0 28px",
          height: "62px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(5,5,4,0.82)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <a href="#home" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <img src="/bunii-logo.jpg" style={{ width: "30px", height: "30px", borderRadius: "6px", objectFit: "cover" }} alt="" />
          <span style={{ fontFamily: serif, fontSize: "1.05rem", fontWeight: 700, color: "#fff", letterSpacing: "0.1em" }}>BUNII</span>
        </a>

        <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {([
            ["BuniiList", "#buniilist"],
            ["Mint", "#mint"],
          ] as [string, string][]).map(([l, h]) => (
            <a
              key={l}
              href={h}
              style={{
                fontFamily: sans,
                fontSize: "0.64rem",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.48)",
                padding: "8px 14px",
                borderRadius: "6px",
                transition: "all 0.2s",
              }}
            >
              {l}
            </a>
          ))}
          <Link
            href="/game"
            style={{
              fontFamily: sans,
              fontSize: "0.64rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: gold,
              padding: "8px 14px",
              borderRadius: "6px",
              border: `1px solid ${gold}44`,
            }}
          >
            Play
          </Link>
          <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.1)", margin: "0 8px" }} />
          <a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow on X"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              borderRadius: "6px",
              color: "rgba(255,255,255,0.48)",
              border: "1px solid rgba(255,255,255,0.1)",
              flexShrink: 0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </a>
        </nav>
      </header>

      {/* ══════════ HERO ══════════ */}
      <div id="home" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "110px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Particles />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <div style={{ position: "absolute", top: "38%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle,${gold}07 0%,transparent 68%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "65%", left: "25%", width: "280px", height: "280px", borderRadius: "50%", background: `radial-gradient(circle,#3a6a8822 0%,transparent 70%)`, pointerEvents: "none" }} />

          <div style={{ animation: ready ? "fadeUp 0.7s ease 0.05s both" : "none", opacity: ready ? undefined : 0, marginBottom: "22px" }}>
            <span style={{ fontFamily: sans, fontSize: "0.6rem", letterSpacing: "0.26em", textTransform: "uppercase", color: gold, border: `1px solid ${gold}44`, borderRadius: "999px", padding: "5px 16px", display: "inline-block" }}>
              FREE MINT — FIRST 1,000
            </span>
          </div>

          <h1 style={{ fontFamily: serif, fontSize: "clamp(4rem,18vw,8rem)", fontWeight: 700, color: "#fff", margin: "0 0 4px", letterSpacing: "0.04em", lineHeight: 0.9, animation: ready ? "fadeUp 0.7s ease 0.12s both" : "none", opacity: ready ? undefined : 0 }}>
            BUNII
          </h1>
          <div style={{ width: "60px", height: "1px", background: `linear-gradient(90deg,transparent,${gold},transparent)`, margin: "20px auto" }} />

          <p style={{ fontFamily: serif, fontSize: "clamp(1rem,3vw,1.2rem)", fontStyle: "italic", color: "rgba(255,255,255,0.5)", margin: "0 0 40px", maxWidth: "420px", lineHeight: 1.6, animation: ready ? "fadeUp 0.7s ease 0.2s both" : "none", opacity: ready ? undefined : 0 }}>
            Cute little troublemakers, hopping onto Robinhood.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "300px", animation: ready ? "fadeUp 0.7s ease 0.28s both" : "none", opacity: ready ? undefined : 0 }}>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                fontFamily: sans,
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#050504",
                background: gold,
                border: "none",
                borderRadius: "8px",
                padding: "17px 36px",
                cursor: "pointer",
                boxShadow: `0 10px 36px ${gold}36`,
                animation: "pulseGlow 2.5s ease-in-out infinite",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span style={{ position: "relative", zIndex: 2 }}>JOIN BUNIILIST</span>
              <span style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)`, backgroundSize: "200% 100%", animation: "shimmer 3s ease-in-out infinite", zIndex: 1 }} />
            </button>
            <Link
              href="/game"
              style={{
                fontFamily: sans,
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.52)",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                padding: "17px 36px",
                display: "block",
                textAlign: "center",
              }}
            >
              PLAY THE GRAB GAME
            </Link>
          </div>

          <div style={{ marginTop: "52px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", border: `1px solid ${gold}1e`, borderRadius: "10px", overflow: "hidden", background: "rgba(255,255,255,0.015)", backdropFilter: "blur(8px)", animation: ready ? "fadeUp 0.7s ease 0.36s both" : "none", opacity: ready ? undefined : 0 }}>
            {[["1,000", "Free Mint Spots"], ["Free", "Mint Price"], ["Robinhood", "Chain"], ["BuniiList", "Access"]].map(([val, lbl], i) => (
              <div key={i} style={{ padding: "18px 16px", borderLeft: i > 0 ? `1px solid ${gold}16` : "none", textAlign: "center" }}>
                <p style={{ margin: 0, fontFamily: serif, fontSize: "1.05rem", fontWeight: 700, color: "#fff", letterSpacing: "0.02em" }}>{val}</p>
                <p style={{ margin: "3px 0 0", fontFamily: sans, fontSize: "0.52rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", fontWeight: 500 }}>{lbl}</p>
              </div>
            ))}
          </div>

          <div style={{ position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0.35 }}>
            <span style={{ fontFamily: sans, fontSize: "0.48rem", letterSpacing: "0.3em", textTransform: "uppercase", color: gold }}>Scroll</span>
            <div style={{ width: "1px", height: "28px", background: `linear-gradient(180deg,${gold},transparent)` }} />
          </div>
        </div>
      </div>

      <Divider />

      <RevealSection>
        <Label text="The Collection" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(2rem,7vw,3.2rem)", fontWeight: 700, color: "#fff", margin: "0 0 16px", letterSpacing: "0.02em" }}>Meet The Buniis</h2>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1rem", color: "rgba(255,255,255,0.45)", margin: "0 0 40px", lineHeight: 1.7 }}>
          Cute. Bold. A little bit of trouble.
          <br />
          Bunii is a character collection built around simple art, clean and noticeable traits.
        </p>
        <BuniiGallery />
      </RevealSection>

      <Divider />

      <RevealSection bg="#07070600">
        <Label text="The Details" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(2rem,7vw,3.2rem)", fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>Built Different</h2>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1rem", color: "rgba(255,255,255,0.45)", margin: "0 0 32px", lineHeight: 1.7 }}>
          Every Bunii is made from a mix of outfits, hair, moods, colors, accessories, and rare details.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {TRAITS.map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", border: `1px solid ${gold}18`, borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: gold, flexShrink: 0 }} />
              <span style={{ fontFamily: sans, fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>{t}</span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", margin: "24px 0 0", lineHeight: 1.6 }}>
          Some traits are simple. Some are rare. Some make a Bunii stand out immediately.
          <br />
          The goal is clean identity, not overcomplication.
        </p>
      </RevealSection>

      <Divider />

      <RevealSection>
        <Label text="The Types" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(2rem,7vw,3.2rem)", fontWeight: 700, color: "#fff", margin: "0 0 32px" }}>Every Bunii Has A Class</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {CLASSES.map((c, i) => (
            <div key={c.name} style={{ padding: "20px 0", borderBottom: `1px solid ${gold}18`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontFamily: serif, fontSize: "1.1rem", fontWeight: 600, color: "#fff" }}>{c.name}</p>
                <p style={{ margin: "4px 0 0", fontFamily: serif, fontStyle: "italic", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{c.desc}</p>
              </div>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "12px", overflow: "hidden", border: `1px solid ${gold}22`, background: "#0a0a08" }}>
                  <img src={CLASS_BUNIIS[i]} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ position: "absolute", inset: 0, borderRadius: "12px", boxShadow: `inset 0 0 20px ${gold}15`, pointerEvents: "none" }} />
              </div>
              <span style={{ fontFamily: sans, fontSize: "0.58rem", letterSpacing: "0.18em", color: `${gold}66`, flexShrink: 0, paddingTop: "4px" }}>{String(i + 1).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      </RevealSection>

      <Divider />

      <section id="buniilist" style={{ background: `linear-gradient(180deg,#050504 0%,#0e0c07 50%,#050504 100%)`, padding: "100px 0" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <Label text="Access" />
          <h2 style={{ fontFamily: serif, fontSize: "clamp(2rem,7vw,3.2rem)", fontWeight: 700, color: "#fff", margin: "0 0 20px" }}>Join The BuniiList</h2>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1rem", color: "rgba(255,255,255,0.45)", margin: "0 0 16px", lineHeight: 1.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
            The BuniiList is the only mint access phase.
            <br />
            Apply through the site, complete missions or grab a spot in the game, submit your wallet, and wait for selection.
            <br />
            The first 1,000 wallets mint for free.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              marginTop: "24px",
              fontFamily: sans,
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#050504",
              background: gold,
              border: "none",
              borderRadius: "6px",
              padding: "16px 40px",
              cursor: "pointer",
              boxShadow: `0 8px 32px ${gold}33`,
              animation: "pulseGlow 2.5s ease-in-out infinite",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <span style={{ position: "relative", zIndex: 2 }}>CLAIM YOUR SPOT</span>
            <span style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)`, backgroundSize: "200% 100%", animation: "shimmer 3s ease-in-out infinite", zIndex: 1 }} />
          </button>
        </div>
      </section>

      <Divider />

      <RevealSection>
        <div id="mint" />
        <Label text="The Mint" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(2rem,7vw,3.2rem)", fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>One Phase. One Mint.</h2>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1rem", color: "rgba(255,255,255,0.45)", margin: "0 0 32px", lineHeight: 1.7 }}>
          The BuniiList is the mint.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", border: `1px solid ${gold}22`, borderRadius: "10px", overflow: "hidden", marginBottom: "28px" }}>
          {[["1,000", "Free Spots"], ["Free", "Price"], ["Robinhood", "Chain"], ["BuniiList", "Access"]].map(([v, l], i) => (
            <div key={i} style={{ padding: "20px 18px", background: "rgba(255,255,255,0.02)", borderBottom: i < 2 ? `1px solid ${gold}18` : "none", borderRight: i % 2 === 0 ? `1px solid ${gold}18` : "none" }}>
              <p style={{ margin: 0, fontFamily: serif, fontSize: "1.3rem", fontWeight: 600, color: "#fff" }}>{v}</p>
              <p style={{ margin: "3px 0 0", fontFamily: sans, fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{l}</p>
            </div>
          ))}
        </div>
        <Link
          href="/game"
          style={{
            width: "100%",
            fontFamily: sans,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#050504",
            background: gold,
            border: `1px solid ${gold}`,
            borderRadius: "6px",
            padding: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            textDecoration: "none",
            boxShadow: `0 8px 32px ${gold}33`,
          }}
        >
          <span>Play For A Spot</span>
        </Link>
        <p style={{ fontFamily: sans, fontSize: "0.7rem", color: `${gold}66`, textAlign: "center", margin: "12px 0 0", letterSpacing: "0.1em" }}>
          Mint details are confirmed once BuniiList review closes.
        </p>
      </RevealSection>

      <Divider />

      <RevealSection>
        <Label text="Reserve" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(2rem,7vw,3.2rem)", fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>The Bunii Reserve</h2>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.8 }}>
          A small allocation kept for collabs, rewards, partnerships, future activations, and community support.
          <br />
          This is not a public mint phase.
        </p>
      </RevealSection>

      <Divider />

      <RevealSection bg="#07070600">
        <Label text="Token" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(2.5rem,10vw,5rem)", fontWeight: 700, color: "#fff", margin: "0 0 16px", letterSpacing: "0.04em" }}>$BUNI</h2>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.8 }}>
          $BUNI is the energy behind the Bunii world.
          <br />
          It is planned to power future holder systems, games, upgrades, raffles, burns, events, and community rewards.
          <br />
          Full token details will be shared after mint.
        </p>
      </RevealSection>

      <Divider />

      <RevealSection>
        <Label text="Systems" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(2rem,7vw,3.2rem)", fontWeight: 700, color: "#fff", margin: "0 0 32px" }}>The Systems</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {SYSTEMS.map((s, i) => (
            <div key={s.name} style={{ padding: "22px 0", borderBottom: `1px solid ${gold}18`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
              <div>
                <p style={{ margin: 0, fontFamily: serif, fontSize: "1.1rem", fontWeight: 600, color: "#fff" }}>{s.name}</p>
                <p style={{ margin: "4px 0 0", fontFamily: serif, fontStyle: "italic", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
              <span style={{ fontFamily: sans, fontSize: "0.56rem", letterSpacing: "0.18em", color: `${gold}55`, flexShrink: 0, paddingTop: "4px" }}>{String(i + 1).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      </RevealSection>

      <Divider />

      <RevealSection bg="#07070600">
        <Label text="The Plan" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(2rem,7vw,3.2rem)", fontWeight: 700, color: "#fff", margin: "0 0 36px" }}>What Comes After Mint</h2>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "16px", top: 0, bottom: 0, width: "1px", background: `linear-gradient(180deg,${gold}44,${gold}11)` }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {ROADMAP.map((r, i) => (
              <div key={r.phase} style={{ display: "flex", gap: "24px", paddingBottom: i < ROADMAP.length - 1 ? "28px" : "0", paddingLeft: "40px", position: "relative" }}>
                <div style={{ position: "absolute", left: "10px", top: "4px", width: "13px", height: "13px", borderRadius: "50%", border: `1px solid ${gold}`, background: "#050504", flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontFamily: sans, fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: gold, marginBottom: "4px" }}>{r.phase}</p>
                  <p style={{ margin: 0, fontFamily: serif, fontSize: "1rem", fontWeight: 600, color: "#fff" }}>{r.title}</p>
                  <p style={{ margin: "4px 0 0", fontFamily: serif, fontStyle: "italic", fontSize: "0.88rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.55 }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <Divider />

      <RevealSection>
        <Label text="FAQ" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(2rem,7vw,3.2rem)", fontWeight: 700, color: "#fff", margin: "0 0 32px" }}>Questions</h2>
        <div>
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </RevealSection>

      <Divider />

      <footer style={{ padding: "60px 24px 40px", textAlign: "center" }}>
        <img src="/bunii-logo.jpg" style={{ width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover", marginBottom: "16px" }} alt="" />
        <h3 style={{ fontFamily: serif, fontSize: "1.4rem", fontWeight: 700, color: "#fff", margin: "0 0 6px", letterSpacing: "0.08em" }}>BUNII</h3>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.88rem", color: "rgba(255,255,255,0.3)", margin: "0 0 24px", lineHeight: 1.7 }}>
          Cute. Bold. A little bit of trouble.
          <br />
          Free mint for the first 1,000. Powered by $BUNI.
        </p>
        <div style={{ display: "flex", gap: "24px", justifyContent: "center", marginBottom: "36px" }}>
          {[["X", X_URL], ["Play", "/game"], ["BuniiList", "#buniilist"], ["Mint", "#mint"]].map(([l, h]) => (
            <a key={l} href={h} style={{ fontFamily: sans, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: `${gold}88` }}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ width: "40px", height: "1px", background: `linear-gradient(90deg,transparent,${gold}44,transparent)`, margin: "0 auto 18px" }} />
        <p style={{ fontFamily: sans, fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: `${gold}44` }}>THE BUNIVERSE OPENS SOON</p>
      </footer>

      <WhitelistModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
