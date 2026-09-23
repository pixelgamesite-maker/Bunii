import { color, font, RULE, offset, X_URL, JOIN_URL } from "@/lib/theme";
import BuniiFrame from "@/components/bunii-frame";
import NavLink from "@/components/nav-link";

const TICKER = [
  "10,000 BUNII",
  "FREE ALLOWLIST MINT",
  "ROBINHOOD CHAIN",
  "FIRST BUNIIPAD LAUNCH",
  "PUBLIC MINT 0.0007 ETH",
  "WELCOME TO THE WARREN",
];

/* The three things worth knowing about this launch. Kept to three —
   BuniiPad's full platform (dashboards, Discover, Following) is bigger
   than what Bunii's own mint site needs to say. */
const PILLARS = [
  {
    title: "Free allowlist, paid public",
    body: "6,000 spots free to allowlisted wallets. Whatever isn't claimed rolls straight into the public pool at mint price — nothing sits unsold.",
    accent: color.brand,
  },
  {
    title: "The first BuniiPad launch",
    body: "Before BuniiPad opens to other creators, we're putting our own collection through it. Bunii is the proof it works.",
    accent: color.sun,
  },
  {
    title: "The Warren grows from here",
    body: "Bunii holders get first access as BuniiPad's creator tools, Discover, and community features come online.",
    accent: color.tongue,
  },
];

const SPECS: [string, string][] = [
  ["Supply", "10,000"],
  ["Allowlist", "Free"],
  ["Public", "0.0007 ETH"],
  ["Chain", "Robinhood"],
];

const SUPPLY_ROWS = [
  { label: "Team", count: "100", accent: color.inkSoft, note: "Reserved. Minted by the team, never sold." },
  { label: "Allowlist", count: "6,000", accent: color.brand, note: "Free to mint, 3 per wallet." },
  { label: "Public", count: "3,900+", accent: color.sun, note: "0.0007 ETH, no wallet limit." },
];

export default function Home() {
  return (
    <>
      {/* ── hero ── */}
      <section style={{ borderBottom: RULE }}>
        <div
          style={{
            maxWidth: "1100px", margin: "0 auto", padding: "60px 22px 70px",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "48px", alignItems: "center",
          }}
        >
          <div>
            <p style={{ fontFamily: font.mono, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 18px" }}>
              First BuniiPad launch · Robinhood Chain
            </p>

            <h1
              style={{
                fontFamily: font.display, fontWeight: 800,
                fontSize: "clamp(3rem, 11vw, 5.4rem)", lineHeight: 0.88,
                letterSpacing: "-0.045em", margin: "0 0 24px",
              }}
            >
              Cute little<br />
              <span style={{ background: color.brand, color: color.paper, padding: "0 0.12em" }}>troublemakers</span><br />
              hopping in.
            </h1>

            <p style={{ fontSize: "1.1rem", lineHeight: 1.55, color: color.inkSoft, margin: "0 0 32px", maxWidth: "44ch" }}>
              Bunii is a character-driven collection of 10,000, and the first
              official mint on BuniiPad — a no-code NFT launch platform
              built for Robinhood Chain. Before we ask anyone else to trust
              BuniiPad with their collection, we're putting our own through it first.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <NavLink href="/mint" className="press"
                  style={{
                    fontFamily: font.display, fontWeight: 800, fontSize: "1rem",
                    padding: "16px 30px", border: RULE,
                    background: color.ink, color: color.paper,
                    boxShadow: offset(color.brand, 6, 6),
                  }}>
                  Mint Bunii
                </NavLink>
              <a href={JOIN_URL} target="_blank" rel="noopener noreferrer" className="press"
                  style={{
                    fontFamily: font.display, fontWeight: 700, fontSize: "1rem",
                    padding: "16px 30px", border: RULE, background: color.paper,
                    boxShadow: offset(color.ink, 6, 6), textDecoration: "none", color: color.ink,
                  }}>
                  Apply for a free spot
                </a>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <BuniiFrame size={360} caption="14 of 10,000 · art rotates" />
          </div>
        </div>
      </section>

      {/* ── ticker ── */}
      <div style={{ borderBottom: RULE, background: color.ink, overflow: "hidden", padding: "12px 0" }}>
        <div className="ticker-track">
          {[0, 1].map((rep) => (
            <div key={rep} style={{ display: "flex" }} aria-hidden={rep === 1}>
              {TICKER.map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: font.mono, fontSize: "0.74rem", letterSpacing: "0.16em",
                    color: color.paper, padding: "0 26px", whiteSpace: "nowrap",
                  }}
                >
                  {t}
                  <span style={{ color: color.brand, marginLeft: "26px" }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── spec strip ── */}
      <section style={{ borderBottom: RULE }}>
        <div
          style={{
            maxWidth: "1100px", margin: "0 auto",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          {SPECS.map(([label, value], i) => (
            <div
              key={label}
              style={{
                padding: "26px 22px",
                borderRight: i === SPECS.length - 1 ? "none" : RULE,
              }}
            >
              <p style={{ fontFamily: font.mono, fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 8px" }}>
                {label}
              </p>
              <p style={{ fontFamily: font.display, fontWeight: 800, fontSize: "1.7rem", margin: 0, letterSpacing: "-0.03em" }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── pillars ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "72px 22px" }}>
        <h2 style={{ fontFamily: font.display, fontWeight: 800, fontSize: "clamp(2rem, 6vw, 3rem)", letterSpacing: "-0.035em", margin: "0 0 44px", maxWidth: "18ch", lineHeight: 1 }}>
          What this launch is
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "26px" }}>
          {PILLARS.map((p) => (
            <article
              key={p.title}
              style={{ border: RULE, background: color.paper, boxShadow: offset(p.accent), padding: "26px 22px" }}
            >
              <div style={{ width: "30px", height: "10px", background: p.accent, marginBottom: "18px" }} />
              <h3 style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.25rem", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
                {p.title}
              </h3>
              <p style={{ fontSize: "0.94rem", lineHeight: 1.55, color: color.inkSoft, margin: 0 }}>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── how it works ── */}
      <section style={{ borderTop: RULE, background: color.paperDeep }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "68px 22px" }}>
          <h2 style={{ fontFamily: font.display, fontWeight: 800, fontSize: "clamp(2rem, 6vw, 3rem)", letterSpacing: "-0.035em", margin: "0 0 12px", lineHeight: 1 }}>
            How the mint runs
          </h2>
          <p style={{ color: color.inkSoft, fontSize: "1rem", margin: "0 0 40px", maxWidth: "52ch" }}>
            Two phases, one shared pool of supply. Whatever the allowlist doesn't take rolls
            straight into public.
          </p>

          <div style={{ border: RULE, background: color.paper }}>
            {SUPPLY_ROWS.map((r, i) => (
              <div
                key={r.label}
                style={{
                  display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "baseline",
                  justifyContent: "space-between", padding: "20px 22px",
                  borderBottom: i === SUPPLY_ROWS.length - 1 ? "none" : RULE,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "180px" }}>
                  <span style={{ width: "12px", height: "12px", background: r.accent, flexShrink: 0 }} />
                  <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.16rem", letterSpacing: "-0.02em" }}>
                    {r.label}
                  </span>
                </div>
                <span style={{ fontFamily: font.display, fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em" }}>
                  {r.count}
                </span>
                <span style={{ fontSize: "0.9rem", color: color.inkSoft, flex: "1 1 260px", textAlign: "right" }}>
                  {r.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── after Bunii ── */}
      <section style={{ borderTop: RULE, borderBottom: RULE, background: color.paperDeep }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "56px 22px" }}>
          <p style={{ fontFamily: font.mono, fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 18px" }}>
            After Bunii
          </p>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.6, color: color.inkSoft, maxWidth: "60ch", margin: "0 0 28px" }}>
            Bunii is the first mint — it won't be the last. Once this launch is
            live, BuniiPad starts bringing in other creators, gradually, building
            around what actually gets used rather than shipping everything at once.
          </p>
          <a href={X_URL} target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-block", fontFamily: font.mono, fontSize: "0.8rem",
                letterSpacing: "0.06em", color: color.ink, textDecoration: "underline",
              }}>
            Follow @bunionrh for updates
          </a>
        </div>
      </section>
    </>
  );
}
