import { gold, sans } from "@/lib/bunii-theme";

export function Kicker({ text }: { text: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: sans,
        fontSize: "0.72rem",
        fontWeight: 800,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: gold,
        background: `${gold}1e`,
        border: `1.5px solid ${gold}55`,
        borderRadius: "999px",
        padding: "6px 16px",
        marginBottom: "10px",
      }}
    >
      {text}
    </span>
  );
}
