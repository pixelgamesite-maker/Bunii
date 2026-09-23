import type { CSSProperties } from "react";

/**
 * BuniiPad design tokens — "The Warren at dusk".
 *
 * Motif: the arch (a burrow doorway). Images sit in arched frames, buttons
 * are pills, surfaces are separated by soft plum-tinted shadows and
 * hairlines rather than heavy outlines. Headlines use Fraunces with its
 * SOFT and WONK axes on, body text uses Figtree.
 *
 * Older keys (paper, ink, brand, sun, tongue, deep, mono…) are kept so the
 * admin page and team-mint panel keep working; they now carry this palette.
 */

export const color = {
  // surfaces
  paper: "#F5F1FA",      // lilac mist — page background
  paperDeep: "#ECE4F5",  // petal — recessed fills, tracks
  card: "#FFFFFF",
  line: "rgba(37, 22, 52, 0.10)",

  // ink
  ink: "#251634",        // deep plum
  inkSoft: "#66577A",
  inkFaint: "#A396B5",

  // night (mint console)
  deep: "#170E22",       // night plum
  deepRaised: "#231632",
  moon: "#FFF6E2",       // text on night

  // accents
  brand: "#F0679E",      // bunny-nose pink
  sun: "#FFD470",        // moon butter
  lilac: "#B8A4E8",
  tongue: "#D9435E",     // errors / paused
};

export const font = {
  display: "'Fraunces', 'Georgia', serif",
  body: "'Figtree', -apple-system, 'Segoe UI', sans-serif",
  // No monospace in this system — kept as an alias so older components
  // that still reference font.mono render in the body face.
  mono: "'Figtree', -apple-system, 'Segoe UI', sans-serif",
};

/** Spread onto any Fraunces headline to switch on its soft, playful cut. */
export const displayType: CSSProperties = {
  fontFamily: font.display,
  fontVariationSettings: "'SOFT' 100, 'WONK' 1",
  fontOpticalSizing: "auto",
};

export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..800,0..100,0..1&family=Figtree:wght@400;500;600;700&display=swap";

export function loadFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById("buniipad-fonts")) return;
  const link = document.createElement("link");
  link.id = "buniipad-fonts";
  link.rel = "stylesheet";
  link.href = FONT_LINK;
  document.head.appendChild(link);
}

// Hairline used wherever a divider is needed.
export const RULE = `1px solid ${color.line}`;
export const RULE_HAIR = `1px solid ${color.line}`;

export const radius = { sm: "12px", md: "20px", lg: "32px", pill: "999px" };

/**
 * Soft elevation. Signature kept from the old offset() helper so existing
 * callers still compile; the color and x/y arguments are ignored on purpose —
 * there are no hard offset shadows in this system.
 */
export function offset(_c?: string, _x = 0, _y = 0) {
  return "0 1px 2px rgba(37,22,52,0.06), 0 18px 40px -22px rgba(37,22,52,0.35)";
}

/**
 * Border radius for an arched "burrow door" frame with a true semicircular
 * top. `aspect` is width / height of the frame.
 */
export function arch(aspect: number, foot = 18) {
  const v = `${(50 * aspect).toFixed(2)}%`;
  return `50% 50% ${foot}px ${foot}px / ${v} ${v} ${foot}px ${foot}px`;
}

export const X_URL = "https://x.com/bunionrh";
export const SITE_URL = "https://buniipad.xyz";
export const JOIN_URL = "https://bunii.fun/join";

// Real Bunii character art, in public/.
export const BUNII_IMAGES = [
  "/1.jpeg", "/2.jpeg", "/3.jpeg", "/4.jpeg", "/5.jpeg", "/6.jpeg", "/7.jpeg",
  "/8.jpeg", "/9.jpeg", "/10.jpeg", "/11.jpeg", "/12.jpeg", "/13.jpeg", "/14.jpeg",
];
