-- ============================================================
-- StayPuncak Database Schema
-- Based on: 06 - DATABASE.md v1.0.0
-- Target: Official StayPuncak Supabase Project
-- Created: 2026-06-28
-- ============================================================
-- Copy and execute this in Supabase SQL Editor
-- Order: types → tables → indexes → RLS → storage
-- ============================================================

-- ============================================================
-- 1. ENUMS & TYPES
-- ============================================================

create type villa_status as enum ('active', 'inactive', 'draft');
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type owner_status as enum ('active', 'inactive');
create type admin_role as enum ('superadmin', 'admin');

-- ============================================================
-- 2. TABLES
-- ============================================================

-- 2a. Owners
create table owners (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  email       text unique,
  address     text,
  status      owner_status not null default 'active',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2b. Villas
create table villas (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references owners(id) on delete restrict,
  name        text not null,
  slug        text not null unique,
  description text,
  price       numeric(12,0) not null,
  capacity    integer not null,
  location    text,
  google_maps text,
  status      villa_status not null default 'draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2c. Media (Villa Images)
create table media (
  id          uuid primary key default gen_random_uuid(),
  villa_id    uuid not null references villas(id) on delete cascade,
  image_url   text not null,
  is_cover    boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- 2d. Customers
create table customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  email       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2e. Bookings
create table bookings (
  id          uuid primary key default gen_random_uuid(),
  villa_id    uuid not null references villas(id) on delete restrict,
  customer_id uuid not null references customers(id) on delete restrict,
  check_in    date not null,
  check_out   date not null,
  notes       text,
  status      booking_status not null default 'pending',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint  check_out_after_check_in check (check_out > check_in)
);

-- 2f. Admins
create table admins (
  id          uuid primary key default gen_random_uuid(),
  auth_uid    uuid unique references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null unique,
  role        admin_role not null default 'admin',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- 3. INDEXES
-- ============================================================

-- Villas
create index idx_villas_slug on villas (slug);
create index idx_villas_status on villas (status);
create index idx_villas_owner on villas (owner_id);
create index idx_villas_location on villas (location);

-- Media
create index idx_media_villa on media (villa_id);
create index idx_media_sort on media (villa_id, sort_order);
create index idx_media_cover on media (villa_id, is_cover) where is_cover = true;

-- Bookings
create index idx_bookings_villa on bookings (villa_id);
create index idx_bookings_customer on bookings (customer_id);
create index idx_bookings_status on bookings (status);
create index idx_bookings_dates on bookings (check_in, check_out);

-- Customers
create index idx_customers_email on customers (email);
create index idx_customers_phone on customers (phone);

-- Admins
create index idx_admins_email on admins (email);
create index idx_admins_auth on admins (auth_uid);

-- ============================================================
-- 4. UPDATED_AT TRIGGER
-- ============================================================

create or replace function trigger_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_owners
  before update on owners for each row execute function trigger_set_updated_at();

create trigger set_updated_at_villas
  before update on villas for each row execute function trigger_set_updated_at();

create trigger set_updated_at_customers
  before update on customers for each row execute function trigger_set_updated_at();

create trigger set_updated_at_bookings
  before update on bookings for each row execute function trigger_set_updated_at();

create trigger set_updated_at_admins
  before update on admins for each row execute function trigger_set_updated_at();

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table owners enable row level security;
alter table villas enable row level security;
alter table media   enable row level security;
alter table customers enable row level security;
alter table bookings enable row level security;
alter table admins  enable row level security;

-- MVP: Only admin has access
-- Public: can SELECT active villas and their media

-- Owners
create policy "Admin can all owners"
  on owners for all
  using (exists (select 1 from admins where auth_uid = auth.uid()));

-- Villas
create policy "Public can view active villas"
  on villas for select
  using (status = 'active');

create policy "Admin can all villas"
  on villas for all
  using (exists (select 1 from admins where auth_uid = auth.uid()));

-- Media
create policy "Public can view media of active villas"
  on media for select
  using (exists (
    select 1 from villas
    where villas.id = media.villa_id
    and villas.status = 'active'
  ));

create policy "Admin can all media"
  on media for all
  using (exists (select 1 from admins where auth_uid = auth.uid()));

-- Customers (admin only — GDPR-sensitive)
create policy "Admin can all customers"
  on customers for all
  using (exists (select 1 from admins where auth_uid = auth.uid()));

-- Bookings (admin only)
create policy "Admin can all bookings"
  on bookings for all
  using (exists (select 1 from admins where auth_uid = auth.uid()));

-- Admins (admin only — self-read allowed)
create policy "Admin can read own record"
  on admins for select
  using (auth_uid = auth.uid());

create policy "Admin can all admins"
  on admins for all
  using (exists (select 1 from admins where auth_uid = auth.uid()));

-- ============================================================
-- 6. STORAGE BUCKETS
-- ============================================================

-- Run this in Supabase Dashboard > Storage > Create Bucket
-- Name: villa-images
-- Public: true
-- OR execute:

-- insert into storage.buckets (id, name, public)
-- values ('villa-images', 'villa-images', true);

-- Storage RLS
-- create policy "Public can view villa images"
--   on storage.objects for select
--   using (bucket_id = 'villa-images');

-- create policy "Admin can upload villa images"
--   on storage.objects for insert
--   with check (
--     bucket_id = 'villa-images'
--     and exists (select 1 from admins where auth_uid = auth.uid())
--   );

-- create policy "Admin can update villa images"
--   on storage.objects for update
--   using (
--     bucket_id = 'villa-images'
--     and exists (select 1 from admins where auth_uid = auth.uid())
--   );

-- create policy "Admin can delete villa images"
--   on storage.objects for delete
--   using (
--     bucket_id = 'villa-images'
--     and exists (select 1 from admins where auth_uid = auth.uid())
--   );

-- ============================================================
-- 7. SEED: CREATE INITIAL ADMIN
-- ============================================================

-- First, create a user in Supabase Auth (Dashboard > Authentication > Users > Add User)
-- Then insert the admin record:

-- insert into admins (auth_uid, name, email, role)
-- values ('<USER_UUID>', 'Admin StayPuncak', 'admin@staypuncak.com', 'superadmin');

-- ============================================================
-- END OF SCHEMA
-- ============================================================
