import { gold } from "@/lib/bunii-theme";

export function Divider() {
  return (
    <div
      style={{
        height: "1px",
        background: `linear-gradient(90deg,transparent,${gold}33,transparent)`,
        margin: "0",
      }}
    />
  );
}
