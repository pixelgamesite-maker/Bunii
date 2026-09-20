import { useEffect, useRef, useState } from "react";
import { gold } from "@/lib/bunii-theme";
import { BUNII_IMAGES } from "@/lib/bunii-data";

export function BuniiGallery() {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timer.current = setTimeout(next, 3200);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur]);

  function next() {
    fade((cur + 1) % BUNII_IMAGES.length);
  }
  function fade(i: number) {
    if (i === cur) return;
    clearTimeout(timer.current);
    setFading(true);
    setTimeout(() => {
      setCur(i);
      setFading(false);
    }, 280);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "340px",
          aspectRatio: "1/1",
          borderRadius: "16px",
          overflow: "hidden",
          border: `1px solid ${gold}22`,
          background: "#0a0a08",
        }}
      >
        <img
          src={BUNII_IMAGES[cur]}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: fading ? 0 : 1, transition: "opacity 0.28s ease" }}
        />
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        {BUNII_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => fade(i)}
            style={{
              width: i === cur ? "20px" : "5px",
              height: "5px",
              borderRadius: "3px",
              background: i === cur ? gold : "rgba(255,255,255,0.15)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
