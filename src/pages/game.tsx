import { useEffect, useState } from "react";
import { Link } from "wouter";
import { FONT_LINK, gold, sans, serif } from "@/lib/bunii-theme";
import { ClawMachine } from "@/components/bunii/ClawMachine";

export default function Game() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONT_LINK;
    document.head.appendChild(l);
    setReady(true);
  }, []);

  return (
    <div style={{ background: "#050504", minHeight: "100vh", fontFamily: sans, color: "#fff" }}>
      <header
        style={{
          padding: "0 20px",
          height: "62px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/bunii1.png" style={{ width: "26px", height: "26px", borderRadius: "6px", objectFit: "cover" }} alt="" />
          <span style={{ fontFamily: serif, fontSize: "0.95rem", fontWeight: 700, color: "#fff", letterSpacing: "0.08em" }}>BUNII</span>
        </Link>
        <Link
          href="/"
          style={{
            fontFamily: sans,
            fontSize: "0.62rem",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "6px",
            padding: "7px 12px",
          }}
        >
          ← Back
        </Link>
      </header>

      <div
        style={{
          padding: "28px 16px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <p
          style={{
            fontFamily: sans,
            fontSize: "0.58rem",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: gold,
            marginBottom: "6px",
          }}
        >
          BuniiList Mini-Game
        </p>
        <h1 style={{ fontFamily: serif, fontSize: "clamp(1.6rem,6vw,2.2rem)", fontWeight: 700, color: "#fff", margin: "0 0 20px", textAlign: "center" }}>
          Grab a Bunii, lock a spot.
        </h1>
        <ClawMachine />
      </div>
    </div>
  );
}
