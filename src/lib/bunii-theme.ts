// Design tokens for Bunii.
//
// Direction: warm pink, wide banner cards, quiet premium. The art carries the
// colour, so the page stays soft — a rose wash, deep warm ink, one muted gold
// hairline. No hard outlines.
//
// Legacy names (bg, bgDeep, panel, gold, mint, yellow, ink) are kept at the
// bottom so game.tsx keeps compiling.

export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Outfit:wght@300;400;500;600&display=swap";

// Display: optical-sized grotesque with real character in the heavy weights.
// Used for the wordmark and the card titles.
export const serif = "'Bricolage Grotesque', 'Outfit', system-ui, sans-serif";
// UI and body: clean geometric sans, light weights for small text.
export const sans = "'Outfit', system-ui, sans-serif";

/* ── Warm pink palette ──────────────────────────────────────────── */

export const roseLight = "#FCE2D8"; // top of the wash
export const roseMid = "#F4BDB3"; // middle
export const roseDeep = "#E39790"; // base of the wash
export const blush = "#FFF7F3"; // card body, header pill
export const inkRose = "#381D1B"; // text, deep warm brown
export const goldLine = "#B08453"; // hairline accent

/* ── Legacy names (game.tsx) ────────────────────────────────────── */

export const bg = roseMid;
export const bgDeep = inkRose;
export const panel = blush;
export const gold = goldLine;
export const goldLight = "#CFA377";
export const mint = roseDeep;
export const yellow = "#D8A86A";
export const ink = inkRose;
