import { useEffect } from "react";
import { color, font, displayType, loadFonts, X_URL, JOIN_URL } from "@/lib/theme";
import GlobalStyle from "@/components/global-style";
import Nav from "@/components/nav";
import NavLink from "@/components/nav-link";

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => { loadFonts(); }, []);

  const link: React.CSSProperties = { color: color.inkSoft, fontWeight: 500, fontSize: "0.92rem" };

  return (
    <div style={{ background: color.paper, minHeight: "100vh", fontFamily: font.body, color: color.ink }}>
      <GlobalStyle />
      <Nav />
      <main>{children}</main>

      <footer style={{ borderTop: `1px solid ${color.line}`, marginTop: "96px" }}>
        <div
          style={{
            maxWidth: "1180px", margin: "0 auto", padding: "40px 20px 48px",
            display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div>
            <p style={{ ...displayType, fontWeight: 700, fontSize: "1.4rem", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              BuniiPad
            </p>
            <p style={{ color: color.inkSoft, fontSize: "0.9rem", margin: 0 }}>
              NFT launches on Robinhood Chain. Bunii goes first.
            </p>
          </div>
          <div style={{ display: "flex", gap: "22px", flexWrap: "wrap" }}>
            <NavLink href="/mint" style={link}>Mint</NavLink>
            <a href={JOIN_URL} target="_blank" rel="noopener noreferrer" style={link}>Apply for allowlist</a>
            <a href={X_URL} target="_blank" rel="noopener noreferrer" style={link}>@bunionrh on X</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
