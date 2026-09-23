import { color, font } from "@/lib/theme";

/**
 * Global styles, injected once by Layout. Resets, a couple of shared
 * interaction classes, and keyframes. Page-specific styling stays with
 * its page.
 */
export default function GlobalStyle() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; }
      html { -webkit-text-size-adjust: 100%; }
      body {
        margin: 0; background: ${color.paper}; color: ${color.ink};
        font-family: ${font.body};
        -webkit-font-smoothing: antialiased;
        font-feature-settings: "tnum" 1;
      }
      a { color: inherit; text-decoration: none; }
      button { font: inherit; }
      img { max-width: 100%; }
      ::selection { background: ${color.brand}; color: #fff; }

      :focus-visible {
        outline: 2px solid ${color.brand};
        outline-offset: 3px;
        border-radius: 8px;
      }

      /* Gentle lift on anything pressable. */
      .press {
        transition: transform 0.18s cubic-bezier(0.2,0,0,1),
                    box-shadow 0.18s cubic-bezier(0.2,0,0,1),
                    background-color 0.18s;
      }
      .press:hover { transform: translateY(-2px); }
      .press:active { transform: translateY(0); }

      /* The one orchestrated moment: burrow doors rising on load. */
      @keyframes rise {
        from { opacity: 0; transform: translateY(28px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .rise { animation: rise 0.9s cubic-bezier(0.2,0.7,0.1,1) both; }

      @keyframes feedIn {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%      { opacity: 0.45; transform: scale(0.8); }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}
