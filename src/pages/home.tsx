import { color, displayType, radius, arch, offset, BUNII_IMAGES, X_URL } from "@/lib/theme";
import NavLink from "@/components/nav-link";

/* Burrow doors along the hill in the hero. Aspect = width / height, so a
   smaller number is a taller door. Outer doors hide on narrow screens. */
const DOORS = [
  { src: BUNII_IMAGES[0], aspect: 0.86, outer: true },
  { src: BUNII_IMAGES[1], aspect: 0.72, outer: false },
  { src: BUNII_IMAGES[2], aspect: 0.6, outer: false },
  { src: BUNII_IMAGES[3], aspect: 0.72, outer: false },
  { src: BUNII_IMAGES[4], aspect: 0.86, outer: true },
];

const FACTS: { value: string; label: string }[] = [
  { value: "10,000", label: "Bunii in the collection" },
  { value: "Free", label: "for allowlisted wallets, up to 3 each" },
  { value: "0.0007 ETH", label: "each in the public mint, no wallet limit" },
  { value: "Robinhood", label: "Chain, minting on BuniiPad" },
];

const STEPS = [
  {
    title: "Team reserve",
    count: "100",
    body: "Held back for the team and collaborators. Minted by the team, never sold.",
    tint: color.ink,
  },
  {
    title: "Allowlist",
    count: "6,000",
    body: "Free to mint, up to 3 per wallet. Connect on the mint page to see if you have a spot.",
    tint: color.brand,
  },
  {
    title: "Public",
    count: "3,900+",
    body: "Everything that's left, at 0.0007 ETH each. Unclaimed allowlist spots roll in here.",
    tint: color.sun,
  },
];

const section: React.CSSProperties = { maxWidth: "1180px", margin: "0 auto", padding: "0 20px" };

const h2: React.CSSProperties = {
  ...displayType, fontWeight: 650, fontSize: "clamp(2rem, 5vw, 3rem)",
  letterSpacing: "-0.03em", lineHeight: 1.02, margin: "0 0 14px",
};

export default function Home() {
  return (
    <>
      <style>{`
        .door-row { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px, 2vw, 22px); }
        .door { flex: 0 1 190px; min-width: 0; }
        @media (max-width: 720px) { .door.outer { display: none; } }
        .pill-primary:hover { background: ${color.deepRaised} !important; }
        .pill-ghost:hover { background: ${color.card} !important; }
      `}</style>

      {/* ── hero ── */}
      <section style={{ ...section, paddingTop: "64px", textAlign: "center" }}>
        <span
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "7px 14px 7px 8px", borderRadius: radius.pill,
            background: color.card, boxShadow: `inset 0 0 0 1px ${color.line}`,
            fontSize: "0.88rem", fontWeight: 600, color: color.inkSoft,
          }}
        >
          <span style={{ padding: "3px 9px", borderRadius: radius.pill, background: color.brand, color: "#fff", fontSize: "0.78rem" }}>
            New
          </span>
          The first launch on BuniiPad
        </span>

        <h1
          style={{
            ...displayType, fontWeight: 700,
            fontSize: "clamp(3rem, 10vw, 6.4rem)", lineHeight: 0.92, letterSpacing: "-0.045em",
            margin: "26px auto 22px", maxWidth: "11ch",
          }}
        >
          Welcome to The Warren
        </h1>

        <p style={{ fontSize: "1.14rem", lineHeight: 1.6, color: color.inkSoft, margin: "0 auto 34px", maxWidth: "52ch" }}>
          Bunii is 10,000 cute little troublemakers hopping through Robinhood Chain,
          each with its own look, mood and personality. It's also the first
          collection to launch on BuniiPad.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <NavLink
            href="/mint"
            className="press pill-primary"
            style={{
              fontWeight: 600, fontSize: "1rem", padding: "16px 30px", borderRadius: radius.pill,
              background: color.ink, color: color.moon, boxShadow: offset(),
            }}
          >
            Mint a Bunii
          </NavLink>
          <NavLink
            href="/checker"
            className="press pill-ghost"
            style={{
              fontWeight: 600, fontSize: "1rem", padding: "16px 30px", borderRadius: radius.pill,
              background: "transparent", color: color.ink, boxShadow: `inset 0 0 0 1.5px ${color.ink}`,
            }}
          >
            Check eligibility
          </NavLink>
        </div>

        {/* burrow doors on the hill */}
        <div style={{ position: "relative", marginTop: "64px" }}>
          <div className="door-row" style={{ position: "relative", zIndex: 1, padding: "0 4px" }}>
            {DOORS.map((d, n) => (
              <div
                key={d.src}
                className={`door rise${d.outer ? " outer" : ""}`}
                style={{ animationDelay: `${0.08 * Math.abs(n - 2) + 0.1}s` }}
              >
                <div
                  style={{
                    aspectRatio: String(d.aspect), borderRadius: arch(d.aspect, 14), overflow: "hidden",
                    background: color.paperDeep, boxShadow: `0 0 0 6px ${color.card}, ${offset()}`,
                  }}
                >
                  <img src={d.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              </div>
            ))}
          </div>
          {/* the hill */}
          <div
            aria-hidden
            style={{
              position: "absolute", left: "-10%", right: "-10%", bottom: "-40px", height: "120px",
              background: color.paperDeep, borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            }}
          />
        </div>
      </section>

      {/* ── facts ── */}
      <section style={{ background: color.paperDeep, paddingBottom: "72px", paddingTop: "40px" }}>
        <div style={section}>
          <div
            style={{
              background: color.card, borderRadius: radius.lg, boxShadow: offset(),
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            }}
          >
            {FACTS.map((f, n) => (
              <div
                key={f.value}
                style={{
                  padding: "28px 26px",
                  borderLeft: n === 0 ? "none" : `1px solid ${color.line}`,
                }}
              >
                <p style={{ ...displayType, fontWeight: 650, fontSize: "1.9rem", letterSpacing: "-0.03em", margin: "0 0 6px" }}>
                  {f.value}
                </p>
                <p style={{ color: color.inkSoft, fontSize: "0.94rem", lineHeight: 1.45, margin: 0 }}>{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── how the mint runs ── */}
      <section style={{ ...section, paddingTop: "96px" }}>
        <div style={{ maxWidth: "640px", marginBottom: "36px" }}>
          <h2 style={h2}>How the mint runs</h2>
          <p style={{ color: color.inkSoft, fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
            Three parts, one pool. Whatever the allowlist doesn't claim moves straight
            into the public mint, so nothing sits unsold.
          </p>
        </div>

        {/* proportional supply bar: 100 / 6,000 / 3,900 */}
        <div
          role="img"
          aria-label="Supply split: 100 team, 6,000 allowlist, 3,900 public"
          style={{ display: "flex", gap: "4px", height: "14px", marginBottom: "30px" }}
        >
          <span style={{ flex: "0 0 max(1%, 10px)", background: color.ink, borderRadius: radius.pill }} />
          <span style={{ flex: 60, background: color.brand, borderRadius: radius.pill }} />
          <span style={{ flex: 39, background: color.sun, borderRadius: radius.pill }} />
        </div>

        <ol
          style={{
            listStyle: "none", margin: 0, padding: 0,
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px",
          }}
        >
          {STEPS.map((s, n) => (
            <li key={s.title} style={{ background: color.card, borderRadius: radius.md, padding: "26px 24px", boxShadow: `inset 0 0 0 1px ${color.line}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                <span
                  style={{
                    width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                    display: "grid", placeItems: "center", fontWeight: 700, fontSize: "0.95rem",
                    background: s.tint, color: s.tint === color.sun ? color.ink : "#fff",
                  }}
                >
                  {n + 1}
                </span>
                <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>{s.title}</span>
                <span style={{ ...displayType, marginLeft: "auto", fontWeight: 650, fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
                  {s.count}
                </span>
              </div>
              <p style={{ color: color.inkSoft, fontSize: "0.97rem", lineHeight: 1.55, margin: 0 }}>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── gallery ── */}
      <section style={{ ...section, paddingTop: "104px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", marginBottom: "32px" }}>
          <div style={{ maxWidth: "560px" }}>
            <h2 style={h2}>Meet a few residents</h2>
            <p style={{ color: color.inkSoft, fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
              Different looks, different moods, same chaotic home.
            </p>
          </div>
          <NavLink href="/mint" style={{ fontWeight: 600, color: color.ink, textDecoration: "underline", textUnderlineOffset: "4px" }}>
            Go to the mint
          </NavLink>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))", gap: "18px" }}>
          {BUNII_IMAGES.map((src) => (
            <div
              key={src}
              style={{ aspectRatio: "0.8", borderRadius: arch(0.8, 12), overflow: "hidden", background: color.paperDeep }}
            >
              <img src={src} alt="A Bunii" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── BuniiPad band ── */}
      <section style={{ ...section, paddingTop: "104px" }}>
        <div
          style={{
            position: "relative", overflow: "hidden", borderRadius: "36px",
            background: color.deep, color: color.moon, padding: "clamp(40px, 7vw, 76px) clamp(24px, 6vw, 64px)",
          }}
        >
          {/* the moon */}
          <span
            aria-hidden
            style={{
              position: "absolute", width: "260px", height: "260px", borderRadius: "50%",
              background: color.sun, top: "-110px", right: "-70px", opacity: 0.95,
            }}
          />
          <div style={{ position: "relative", maxWidth: "600px" }}>
            <p style={{ color: color.lilac, fontWeight: 600, margin: "0 0 14px" }}>Built on BuniiPad</p>
            <h2 style={{ ...h2, color: color.moon, fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
              Bunii goes first. More creators follow.
            </h2>
            <p style={{ color: "rgba(255,246,226,0.72)", fontSize: "1.05rem", lineHeight: 1.65, margin: "0 0 30px" }}>
              BuniiPad is a no-code NFT launch platform for Robinhood Chain. Before
              asking anyone else to trust it with their collection, we're launching
              our own through it. After Bunii, creators are brought on gradually.
            </p>
            <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
              <NavLink
                href="/mint"
                className="press"
                style={{
                  fontWeight: 700, padding: "15px 28px", borderRadius: radius.pill,
                  background: color.sun, color: color.ink,
                }}
              >
                Mint a Bunii
              </NavLink>
              <a href={X_URL} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: color.moon, textDecoration: "underline", textUnderlineOffset: "4px" }}>
                Follow @bunionrh
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
