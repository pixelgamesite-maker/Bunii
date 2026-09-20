import { useEffect, useState, type ReactNode } from "react";
import { gold, panel, sans, serif } from "@/lib/bunii-theme";

export function FlipCard({
  index,
  icon,
  title,
  subtitle,
  done,
  locked,
  children,
  onFlip,
}: {
  index: number;
  icon: string;
  title: string;
  subtitle: string;
  done: boolean;
  locked: boolean;
  children?: ReactNode;
  onFlip?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    if (done) setFlipped(true);
  }, [done]);

  function handleClick() {
    if (locked || flipped) return;
    setFlipped(true);
    onFlip?.();
  }

  const bg = `linear-gradient(160deg, ${panel} 0%, #180a2c 100%)`;
  const borderCol = done ? `${gold}55` : locked ? "rgba(255,255,255,0.04)" : `${gold}33`;

  return (
    <div
      onClick={handleClick}
      style={{
        perspective: "1000px",
        cursor: locked ? "not-allowed" : flipped ? "default" : "pointer",
        animation: `cardIn 0.5s ease ${0.08 * index}s both`,
      }}
    >
      <div
        style={{
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
        }}
      >
        {/* FRONT */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            position: flipped ? "absolute" : "relative",
            inset: 0,
            background: bg,
            border: `1px solid ${borderCol}`,
            borderRadius: "12px",
            padding: "18px 14px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            minHeight: "120px",
            opacity: locked ? 0.4 : 1,
            boxShadow: locked ? "none" : `0 0 20px ${gold}11`,
          }}
        >
          <span style={{ fontSize: "1.4rem" }}>{locked ? "—" : icon}</span>
          <p
            style={{
              margin: 0,
              fontFamily: serif,
              fontSize: "0.9rem",
              fontWeight: 600,
              color: locked ? "rgba(255,255,255,0.2)" : "#fff",
              textAlign: "center",
              letterSpacing: "0.04em",
            }}
          >
            {title}
          </p>
          {!locked && (
            <p
              style={{
                margin: 0,
                fontFamily: sans,
                fontSize: "0.62rem",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Tap to open
            </p>
          )}
        </div>

        {/* BACK */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: flipped ? "relative" : "absolute",
            inset: 0,
            background: done ? `linear-gradient(160deg, #17324a 0%, ${panel} 100%)` : bg,
            border: `1px solid ${done ? `${gold}55` : `${gold}22`}`,
            borderRadius: "12px",
            padding: "14px 12px",
            minHeight: "120px",
            boxShadow: done ? `0 0 20px ${gold}18` : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div>
              <p style={{ margin: 0, fontFamily: serif, fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>{title}</p>
              <p
                style={{
                  margin: "1px 0 0",
                  fontFamily: sans,
                  fontSize: "0.6rem",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {subtitle}
              </p>
            </div>
            {done && (
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: gold,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.2 5.8L8 1" stroke="#0a0c08" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
