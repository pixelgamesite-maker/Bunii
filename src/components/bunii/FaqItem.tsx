import { useState } from "react";
import { gold, sans, serif } from "@/lib/bunii-theme";

export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${gold}22` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "16px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontFamily: serif,
            fontSize: "1rem",
            fontWeight: 600,
            color: open ? "#fff" : "rgba(255,255,255,0.75)",
            textAlign: "left",
            letterSpacing: "0.01em",
          }}
        >
          {q}
        </span>
        <span
          style={{
            color: gold,
            fontSize: "1.1rem",
            flexShrink: 0,
            transition: "transform 0.25s",
            transform: open ? "rotate(45deg)" : "rotate(0)",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <p style={{ fontFamily: sans, fontSize: "0.88rem", color: "rgba(255,255,255,0.45)", padding: "0 0 16px", margin: 0, lineHeight: 1.65 }}>
          {a}
        </p>
      )}
    </div>
  );
}
