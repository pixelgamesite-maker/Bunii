// Design tokens for Bunii.
//
// Direction: warm pink, quiet, premium. The page is one screen holding two
// cards, so the palette does the work — a soft rose wash, deep warm ink,
// and a single muted gold hairline. No hard outlines, no bright accents.
//
// Legacy names (bg, bgDeep, panel, gold, mint, yellow, ink) are kept at the
// bottom so game.tsx keeps compiling.

export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Jost:wght@300;400;500;600&display=swap";

// Display: high-contrast, elegant, used only for the wordmark and card titles.
export const serif = "'Instrument Serif', Georgia, serif";
// Body: geometric, light, quiet at small sizes.
export const sans = "'Jost', system-ui, sans-serif";

/* ── Warm pink palette ──────────────────────────────────────────── */

export const roseLight = "#FBDED4"; // top of the wash
export const roseMid = "#F3BCB2"; // middle
export const roseDeep = "#E3968F"; // base of the wash
export const blush = "#FFF6F1"; // card surface
export const inkRose = "#3B1F1C"; // text, deep warm brown
export const goldLine = "#B08453"; // single hairline accent

/* ── Legacy names (game.tsx) ────────────────────────────────────── */

export const bg = roseMid;
export const bgDeep = inkRose;
export const panel = blush;
export const gold = goldLine;
export const goldLight = "#CFA377";
export const mint = roseDeep;
export const yellow = "#D8A86A";
export const ink = inkRose;
