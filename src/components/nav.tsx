import { useLocation } from "wouter";
import { color, font, displayType, radius } from "@/lib/theme";
import SignInButton from "@/components/sign-in-button";
import NavLink from "@/components/nav-link";

type NavItem = { label: string; href: string };

/** Only the pages that exist in this build. */
export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Mint", href: "/mint" },
];

export default function Nav() {
  const [location] = useLocation();

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 60,
        background: color.paper,
        borderBottom: `1px solid ${color.line}`,
      }}
    >
      <div
        style={{
          maxWidth: "1180px", margin: "0 auto", height: "68px", padding: "0 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
        }}
      >
        <NavLink href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }} aria-label="BuniiPad home">
          <img
            src="/bunii-logo.jpg"
            alt=""
            style={{
              width: "34px", height: "40px", objectFit: "cover",
              borderRadius: "17px 17px 8px 8px", background: color.paperDeep,
            }}
          />
          <span style={{ ...displayType, fontWeight: 700, fontSize: "1.3rem", letterSpacing: "-0.02em" }}>
            BuniiPad
          </span>
        </NavLink>

        <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {NAV.map((item) => {
            const active = location === item.href;
            return (
              <NavLink
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                style={{
                  fontFamily: font.body, fontWeight: 600, fontSize: "0.92rem",
                  padding: "9px 14px", borderRadius: radius.pill,
                  background: active ? color.paperDeep : "transparent",
                  color: active ? color.ink : color.inkSoft,
                }}
              >
                {item.label}
              </NavLink>
            );
          })}
          <span style={{ width: "6px" }} />
          <SignInButton />
        </nav>
      </div>
    </header>
  );
}
