/**
 * BuniiPad design tokens.
 *
 * Direction: screenprint / risograph, carried over from the platform's
 * original system — thick black outlines, flat saturated color fields,
 * hard offset shadows like a print slightly out of register. No
 * gradients, no glows, no soft blur anywhere in this system.
 *
 * Palette retuned for Bunii: warm burrow/soil neutrals instead of the
 * swamp-green undertone, with a carrot-orange brand accent (color.brand)
 * in place of the collection-specific green. `sun`, `tongue`, and `deep`
 * keep their names as internal tokens but now carry warren-appropriate
 * hues — a warm gold, a rabbit-blush pink, and a deep clover green for
 * dark inversions — rather than the crocodile-specific colors they held
 * before. Placeholder direction only: swap these for real Bunii brand
 * colors/art the moment they exist.
 */

export const color = {
  paper: "#F2ECE1",      // sand/cream, warm brown undertone
  paperDeep: "#E7DCC9",  // recessed panels, table stripes
  ink: "#211710",        // near-black, warm burrow-soil undertone
  inkSoft: "#5C4B3A",    // secondary text
  inkFaint: "#A0907C",   // captions, disabled

  brand: "#E8712B",      // carrot orange — the primary Bunii accent
  sun: "#F5C242",        // warm gold, secondary accent
  tongue: "#F0857C",     // rabbit-blush pink, tertiary accent
  deep: "#2B3A1F",       // deep clover green, for dark inversions
};

export const font = {
  display: "'Bricolage Grotesque', 'Arial Black', sans-serif",
  body: "'Public Sans', -apple-system, sans-serif",
  mono: "'DM Mono', 'Courier New', monospace",
};

export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Public+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap";

export function loadFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById("buniipad-fonts")) return;
  const link = document.createElement("link");
  link.id = "buniipad-fonts";
  link.rel = "stylesheet";
  link.href = FONT_LINK;
  document.head.appendChild(link);
}

// Structural constants for the print system.
export const RULE = `2px solid ${color.ink}`;
export const RULE_HAIR = `1px solid ${color.ink}`;

/** Hard offset shadow — the signature misregistration effect. */
export function offset(c: string, x = 6, y = 6) {
  return `${x}px ${y}px 0 ${c}`;
}

export const X_URL = "https://x.com/bunionrh";
export const SITE_URL = "https://buniipad.xyz";
export const JOIN_URL = "https://bunii.fun/join";

// Placeholder preview art — swap for real Bunii character art once it exists.
export const BUNII_IMAGES = [
  "/bunii-1.jpg", "/bunii-2.jpg", "/bunii-3.jpg", "/bunii-4.jpg",
  "/bunii-5.jpg", "/bunii-6.jpg", "/bunii-7.jpg", "/bunii-8.jpg",
];
