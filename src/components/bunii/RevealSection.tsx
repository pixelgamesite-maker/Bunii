import type { CSSProperties, ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function RevealSection({
  children,
  bg = "#050504",
  extra,
  delay = 0,
}: {
  children: ReactNode;
  bg?: string;
  extra?: CSSProperties;
  delay?: number;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <section
      ref={ref}
      style={{
        background: bg,
        padding: "80px 0",
        position: "relative",
        ...extra,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 24px" }}>{children}</div>
    </section>
  );
}
