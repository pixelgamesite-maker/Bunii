import { useEffect, useState } from "react";
import { color, arch, BUNII_IMAGES } from "@/lib/theme";

/**
 * Arched "burrow door" that cycles through the Bunii art with a soft
 * crossfade. Used as the centrepiece of the mint console.
 */
export default function BuniiFrame({
  width = 380,
  aspect = 0.8,
  interval = 2800,
  tone = "dark",
  showDots = true,
}: {
  width?: number;
  aspect?: number;
  interval?: number;
  tone?: "dark" | "light";
  showDots?: boolean;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % BUNII_IMAGES.length), interval);
    return () => clearInterval(id);
  }, [interval]);

  const ring = tone === "dark" ? "rgba(255,246,226,0.14)" : color.line;

  return (
    <div style={{ width, maxWidth: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
      <div
        style={{
          position: "relative", width: "100%", aspectRatio: String(aspect),
          borderRadius: arch(aspect, 22), overflow: "hidden",
          background: tone === "dark" ? color.deepRaised : color.paperDeep,
          boxShadow: `0 0 0 8px ${ring}`,
        }}
      >
        {BUNII_IMAGES.map((src, n) => (
          <img
            key={src}
            src={src}
            alt={n === i ? "Bunii artwork preview" : ""}
            aria-hidden={n !== i}
            loading={n < 2 ? "eager" : "lazy"}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
              opacity: n === i ? 1 : 0, transition: "opacity 0.7s ease",
            }}
          />
        ))}
      </div>

      {showDots && (
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center" }} aria-hidden>
          {BUNII_IMAGES.map((_, n) => (
            <span
              key={n}
              style={{
                width: n === i ? "18px" : "6px", height: "6px", borderRadius: "99px",
                background: n === i
                  ? (tone === "dark" ? color.sun : color.ink)
                  : (tone === "dark" ? "rgba(255,246,226,0.25)" : color.inkFaint),
                transition: "width 0.3s, background 0.3s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
