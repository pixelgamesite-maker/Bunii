import { color, displayType } from "@/lib/theme";
import SignInButton from "@/components/sign-in-button";
import NavLink from "@/components/nav-link";

export default function Nav() {
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

        <SignInButton />
      </div>
    </header>
  );
}
