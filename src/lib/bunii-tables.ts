-- Run this in the Supabase SQL editor (or via the CLI) for your project.

-- ─────────────────────────────────────────────────────────────
-- 1. Claw-machine wallet claims (src/components/bunii/ClawMachine.tsx)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.bunii (
  id uuid primary key default gen_random_uuid(),
  wallet text not null,
  grabs integer not null default 0,
  created_at timestamptz not null default now(),
  constraint bunii_wallet_unique unique (wallet)
);

-- Optional but recommended: enforce the "must look like an EVM address"
-- rule at the database level too, not just client-side.
alter table public.bunii
  add constraint bunii_wallet_format check (wallet ~* '^0x[0-9a-fA-F]{40}$');

alter table public.bunii enable row level security;

-- Anyone (anon key) can insert a claim — this is a public whitelist form.
create policy "bunii_insert_public"
  on public.bunii
  for insert
  to anon
  with check (true);

-- No public select/update/delete policies are created, so rows can only
-- be read from the Supabase dashboard or with the service-role key —
-- the anon key used in the browser can write but not read back other
-- people's wallets.

-- ─────────────────────────────────────────────────────────────
-- 2. BuniiList mission-based whitelist applications
--    (src/components/bunii/WhitelistModal.tsx)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.bunii_whitelist (
  id uuid primary key default gen_random_uuid(),
  wallet text not null,
  twitter text not null,
  quote_url text not null,
  created_at timestamptz not null default now(),
  constraint bunii_whitelist_wallet_unique unique (wallet)
);

alter table public.bunii_whitelist
  add constraint bunii_whitelist_wallet_format check (wallet ~* '^0x[0-9a-fA-F]{40}$');

alter table public.bunii_whitelist enable row level security;

create policy "bunii_whitelist_insert_public"
  on public.bunii_whitelist
  for insert
  to anon
  with check (true);
