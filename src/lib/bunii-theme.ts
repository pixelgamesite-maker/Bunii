// Design tokens for Bunii.
//
// Direction: dark purple, wide banner cards, quiet premium. The page sits on a
// deep violet; the header is a lifted, lighter violet so it reads as a bar
// without needing a border. One muted gold hairline is the only accent.
//
// Legacy names (bg, bgDeep, panel, gold, mint, yellow, ink) are kept at the
// bottom so game.tsx keeps compiling.

export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Outfit:wght@300;400;500;600&display=swap";

// Display: optical-sized grotesque with real character in the heavy weights.
export const serif = "'Bricolage Grotesque', 'Outfit', system-ui, sans-serif";
// UI and body: clean geometric sans, light weights for small text.
export const sans = "'Outfit', system-ui, sans-serif";

/* ── Dark purple palette ────────────────────────────────────────── */

export const plum = "#1B1030"; // base surface
export const plumDeep = "#100821"; // floor of the wash
export const plumLift = "#2C1B4A"; // header bar, raised areas
export const surface = "#35235A"; // pill and panel faces
export const creamInk = "#F3EDF8"; // primary text
export const goldLine = "#C29A5B"; // hairline and accent
export const violetGlow = "#7A4BC4"; // bloom in the background

/* ── Legacy names (game.tsx) ────────────────────────────────────── */

export const bg = plum;
export const bgDeep = plumDeep;
export const panel = surface;
export const gold = goldLine;
export const goldLight = "#E0BC85";
export const mint = violetGlow;
export const yellow = "#D8A86A";
export const ink = creamInk;
