# Bunii structure

## File structure
```
src/
  lib/
    bunii-theme.ts      // fonts + colors, shared
    bunii-data.ts        // copy/content constants (classes, traits, FAQ, roadmap...)
    supabase.ts           // Supabase client
  hooks/
    useScrollReveal.ts
  components/bunii/
    Label.tsx
    Divider.tsx
    RevealSection.tsx
    Particles.tsx
    FlipCard.tsx
    BuniiGallery.tsx
    FaqItem.tsx
    WhitelistModal.tsx    // the whole BuniiList application flow, self-contained
    ClawMachine.tsx        // the whitelist game
  pages/
    home.tsx               // assembles everything above
    game.tsx                // hosts <ClawMachine />, own route
  App.tsx                   // now has "/" and "/game" routes
```

## Drop your images in
Put `bunii1.png` … `bunii5.png` in the `public/` folder at project root
(same place `mini-logo.jpg` used to live). They're referenced as
`/bunii1.png` etc. throughout — the character gallery, the class rows,
and the claw machine prizes all pull from this same 5-image set.

## Things I picked without asking — sanity check these
- **Token ticker**: used `$BUNI` as a placeholder (was `$MINO`). Rename in
  `bunii-data.ts` / `home.tsx` if the real one's different.
- **Chain**: labeled "Robinhood" in the stat rows since the X bio says
  "hopping through @RobinhoodApp" — confirm this is actually the mint chain.
- **Mint mechanics**: changed from the template's "10,000 supply / 0.001 ETH"
  to "free / first 1,000 wallets" per what's been discussed. Supply beyond
  the first 1,000 free spots isn't specified anywhere yet — add if there's
  a larger total collection size.
- **Pinned tweet URL**: `PINNED_TWEET_URL` in `bunii-data.ts` just points at
  the profile, not an actual tweet — swap in the real pinned-tweet link once
  it exists, since the whitelist missions open it.
- **Supabase table**: submissions now insert into a `bunii_whitelist` table
  (was `minions`). Create that table (columns: `wallet`, `twitter`,
  `quote_url`) or rename it back to match whatever exists.
- **Claw machine wallet-connect**: still not wired up — grabbing a prize
  shows a "connect wallet to lock it in" toast but doesn't actually open
  RainbowKit yet. Say the word and I'll wire that in.
