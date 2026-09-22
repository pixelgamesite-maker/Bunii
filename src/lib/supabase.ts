import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? "",
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
  {
    auth: {
      // PKCE: X redirects back with ?code=…, which the client swaps for a
      // session on load. Safer than tokens in the URL hash.
      flowType: "pkce",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
