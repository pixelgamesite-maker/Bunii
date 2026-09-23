import { ConnectButton } from "@rainbow-me/rainbowkit";
import { color, font, radius } from "@/lib/theme";

export default function SignInButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openAccountModal, openChainModal, mounted }) => {
        const connected = mounted && account && chain;

        const base: React.CSSProperties = {
          fontFamily: font.body, fontWeight: 600, fontSize: "0.88rem",
          padding: "0 18px", height: "42px", borderRadius: radius.pill,
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap",
          background: color.ink, color: color.moon,
        };

        if (!mounted) return <div style={{ ...base, visibility: "hidden" }} aria-hidden />;

        if (!connected) {
          return (
            <button className="press" onClick={openConnectModal} style={base}>
              Connect wallet
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button className="press" onClick={openChainModal} style={{ ...base, background: color.tongue, color: "#fff" }}>
              Switch network
            </button>
          );
        }

        return (
          <button
            className="press"
            onClick={openAccountModal}
            style={{ ...base, background: color.card, color: color.ink, boxShadow: `inset 0 0 0 1px ${color.line}` }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3FBF7F" }} />
            {account.displayName}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
