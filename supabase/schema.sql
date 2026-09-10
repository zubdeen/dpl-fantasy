create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  team_name text,
  display_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);
create table if not exists public.clubs (id uuid primary key default uuid_generate_v4(), name text not null unique, short_name text not null, created_at timestamptz not null default now());
create table if not exists public.players (id uuid primary key default uuid_generate_v4(), name text not null, initials text not null, tier text not null check (tier in ('M1','M2','STAR','CORE','DEV')), club_id uuid references public.clubs(id), price integer not null, form integer not null default 0, active boolean not null default true, created_at timestamptz not null default now());
create table if not exists public.gameweeks (id uuid primary key default uuid_generate_v4(), name text not null, lock_at timestamptz not null, status text not null default 'upcoming' check (status in ('upcoming','live','complete')));
create table if not exists public.fixtures (id uuid primary key default uuid_generate_v4(), gameweek_id uuid references public.gameweeks(id), home_club_id uuid references public.clubs(id), away_club_id uuid references public.clubs(id), starts_at timestamptz not null, home_score integer, away_score integer, status text not null default 'scheduled');
create table if not exists public.squads (id uuid primary key default uuid_generate_v4(), user_id uuid not null references auth.users(id) on delete cascade, team_name text not null, budget integer not null default 3400, captain_id uuid references public.players(id), diamond_active boolean not null default false, wildcard_used boolean not null default false, safety_net_used boolean not null default false, diamond_boost_used boolean not null default false, updated_at timestamptz not null default now(), unique(user_id));
create table if not exists public.squad_players (squad_id uuid references public.squads(id) on delete cascade, player_id uuid references public.players(id), on_court boolean not null default false, primary key (squad_id, player_id));

alter table public.profiles enable row level security; alter table public.squads enable row level security; alter table public.squad_players enable row level security;
create policy "profiles own record" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "squads own record" on public.squads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "squad players own record" on public.squad_players for all using (exists (select 1 from public.squads where squads.id = squad_id and squads.user_id = auth.uid()));
create policy "public active players" on public.players for select using (active = true);
create policy "public clubs" on public.clubs for select using (true);
create policy "public fixtures" on public.fixtures for select using (true);
create policy "public gameweeks" on public.gameweeks for select using (true);
