// Design tokens for Bunii.
//
// The art is flat, cel-shaded, heavy black outline — sticker / trading-card
// territory. So the palette is warm and saturated rather than pastel, and
// every surface is drawn with an ink outline instead of a soft shadow.
//
// Two groups below:
//   1. Site tokens  — the warm honey/cream ground used by the marketing page.
//   2. Legacy tokens — the old dark names (bg, bgDeep, panel, gold, mint,
//      yellow, ink) kept so game.tsx keeps compiling. They've been re-tuned
//      from plum to warm espresso so the arcade cabinet matches the site.

export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Nunito+Sans:wght@400;600;700;900&display=swap";

// Display: single heavy weight, used only for the wordmark and section heads.
export const serif = "'Alfa Slab One', Georgia, serif";
// Body: rounded and friendly, matches the cartoon linework at small sizes.
export const sans = "'Nunito Sans', system-ui, sans-serif";

/* ── Site palette ───────────────────────────────────────────────── */

export const honey = "#E0A63C"; // page ground
export const honeyDeep = "#C88C28"; // ground shading, pressed states
export const cream = "#F7EAD2"; // panel and card faces
export const inkDark = "#1A1206"; // outlines, body text, hard shadows
export const ember = "#C4472A"; // accent — from the red in the zombie bun
export const espresso = "#2B1A0C"; // dark bands (footer, ticker)

/* ── Legacy names (game.tsx) ────────────────────────────────────── */

export const bg = espresso;
export const bgDeep = inkDark;
export const panel = "#3A250F";
export const gold = honey;
export const goldLight = "#F2C46A";
export const mint = ember;
export const yellow = "#F2C46A";
export const ink = cream;
