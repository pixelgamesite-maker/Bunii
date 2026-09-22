import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? "",
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
  {
    auth: {
      // PKCE: X sends the player back to /auth/callback?code=…, and that page
      // swaps the code for a session.
      flowType: "pkce",
      persistSession: true,
      autoRefreshToken: true,
      // Off on purpose. pages/Auth/callback.tsx does the exchange itself —
      // leaving this on as well means two exchanges race for one code, and
      // the loser fails with "invalid grant".
      detectSessionInUrl: false,
    },
  },
);
