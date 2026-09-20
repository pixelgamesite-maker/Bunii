// Design tokens for Bunii.
//
// Direction: warm dark, wide banner cards, quiet premium. The background is a
// deep espresso rather than a neutral black, so the warm art sits on it
// without looking pasted onto a tech site. One muted gold hairline is the
// only accent.
//
// Legacy names (bg, bgDeep, panel, gold, mint, yellow, ink) are kept at the
// bottom so game.tsx keeps compiling.

export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Outfit:wght@300;400;500;600&display=swap";

// Display: optical-sized grotesque with real character in the heavy weights.
export const serif = "'Bricolage Grotesque', 'Outfit', system-ui, sans-serif";
// UI and body: clean geometric sans, light weights for small text.
export const sans = "'Outfit', system-ui, sans-serif";

/* ── Warm dark palette ──────────────────────────────────────────── */

export const nightTop = "#221814"; // lifted top of the wash
export const night = "#16100D"; // base surface
export const nightDeep = "#0C0807"; // floor of the wash
export const surface = "#241A16"; // raised panels, header pill
export const creamInk = "#F6EDE5"; // primary text
export const goldLine = "#C29A5B"; // hairline and accent
export const emberGlow = "#8A4A33"; // warm bloom in the background

/* ── Legacy names (game.tsx) ────────────────────────────────────── */

export const bg = night;
export const bgDeep = nightDeep;
export const panel = surface;
export const gold = goldLine;
export const goldLight = "#E0BC85";
export const mint = emberGlow;
export const yellow = "#D8A86A";
export const ink = creamInk;
