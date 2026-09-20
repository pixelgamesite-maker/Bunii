import { gold, sans } from "@/lib/bunii-theme";

export function Label({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
      <div style={{ height: "1px", flex: 1, background: `linear-gradient(90deg,transparent,${gold}44)` }} />
      <span
        style={{
          fontFamily: sans,
          fontSize: "0.6rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: gold,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
      <div style={{ height: "1px", flex: 1, background: `linear-gradient(90deg,${gold}44,transparent)` }} />
    </div>
  );
}
