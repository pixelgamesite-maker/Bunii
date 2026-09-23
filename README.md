# BuniiPad — Bunii mint site

Adapted from CrocPad's frontend for the Bunii collection (10,000 supply,
6,000 free allowlist, ~3,900 public at 0.0007 ETH, 100 team) — the first
official launch on BuniiPad, per the launch article.

Trimmed to the three pages this launch actually needs: Home, Mint, Admin.
The rest of BuniiPad's eventual platform (creator dashboards, Discover,
Following, etc.) is future work described in the article, not part of
this build.

## Before this goes live

- **Real Bunii art.** `BUNII_IMAGES` in `src/lib/theme.ts` and the
  favicon/logo files in `public/` are all placeholders.
- **Price mismatch.** The homepage shows 0.0007 ETH (per the article).
  The deployed contract's `publicPrice` is still 0.00055 ETH. Call
  `setPrices()` before launch or the mint page will charge the old price.
- **Allowlist API isn't deployed yet.** `ALLOWLIST_API_URL` in
  `src/lib/buniiPadContract.ts` is a placeholder — the allowlist phase's
  eligibility check and the admin CSV upload will both fail until it's
  live.
- **`TEAM_WALLETS` is empty.** Fill in the real Bunii team wallet(s)
  before using the admin page's team-mint presets.
- **WalletConnect project ID** in `src/lib/wagmiConfig.ts` is still a
  placeholder.
- **`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`** need to be set as
  real environment variables at build time.
