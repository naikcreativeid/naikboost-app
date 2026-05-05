-- NaikBoost Supabase Schema
-- Semua harga disimpan sebagai BIGINT dalam rupiah.
-- Contoh: Rp 49.000 disimpan sebagai 49000.

begin;

create extension if not exists pgcrypto;

-- =========================================================
-- Helper Functions
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- Tables
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  whatsapp text,
  balance bigint not null default 0 check (balance >= 0),
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  irvankede_service_id integer not null,
  name text not null,
  category text not null,
  platform text not null check (platform in ('instagram', 'tiktok', 'youtube', 'facebook')),
  type text not null,
  price_buy bigint not null check (price_buy >= 0),
  price_sell bigint not null check (price_sell >= 0),
  min_qty integer not null check (min_qty > 0),
  max_qty integer not null check (max_qty >= min_qty),
  refill_days integer not null default 0 check (refill_days >= 0),
  description text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service_id uuid not null references public.services (id),
  quantity integer not null check (quantity > 0),
  price bigint not null check (price >= 0),
  description text,
  is_featured boolean not null default false,
  delivery_time text,
  bonus_description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  service_id uuid not null references public.services (id),
  irvankede_order_id text,
  target text not null,
  quantity integer not null check (quantity > 0),
  price_total bigint not null check (price_total >= 0),
  status text not null default 'pending' check (status in ('pending', 'processing', 'success', 'partial', 'error', 'refunded')),
  start_count integer,
  remains integer,
  charge bigint check (charge >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guest_orders (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.packages (id),
  user_id uuid references public.profiles (id) on delete set null,
  target text not null,
  customer_name text not null,
  customer_whatsapp text not null,
  customer_email text,
  payment_proof_url text,
  status text not null default 'waiting_payment' check (status in ('waiting_payment', 'payment_review', 'processing', 'success', 'error', 'refunded')),
  irvankede_order_id text,
  total_price bigint not null check (total_price >= 0),
  admin_notes text,
  approved_by uuid references public.profiles (id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.topups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  amount bigint not null check (amount > 0),
  bank_destination text not null,
  sender_name text not null,
  transfer_date date,
  proof_image_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  approved_by uuid references public.profiles (id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  type text not null check (type in ('topup', 'order', 'refund', 'adjustment')),
  amount bigint not null check (amount <> 0),
  balance_before bigint not null check (balance_before >= 0),
  balance_after bigint not null check (balance_after >= 0),
  reference_type text not null check (reference_type in ('order', 'topup', 'manual')),
  reference_id uuid,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.refill_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id),
  user_id uuid not null references public.profiles (id),
  irvankede_refill_id text,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  guest_email text,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'answered', 'closed')),
  admin_response text,
  responded_by uuid references public.profiles (id) on delete set null,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  constraint support_tickets_owner_check check (
    user_id is not null or guest_email is not null
  )
);

create table if not exists public.app_settings (
  id integer primary key default 1,
  default_markup_percentage integer not null default 50 check (default_markup_percentage >= 0),
  bank_accounts text,
  whatsapp_gateway_settings text,
  maintenance_mode boolean not null default false,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_settings_single_row check (id = 1)
);

create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles (id),
  action text not null,
  target_type text not null,
  target_id text,
  description text not null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- Helper Functions That Depend on Tables
-- =========================================================

create or replace function public.is_admin(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = coalesce(p_user_id, auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    whatsapp,
    balance,
    role,
    created_at,
    updated_at
  )
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'whatsapp', ''),
    0,
    'customer',
    now(),
    now()
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
    whatsapp = coalesce(nullif(excluded.whatsapp, ''), public.profiles.whatsapp),
    updated_at = now();

  return new;
end;
$$;

-- =========================================================
-- Unique Indexes and Performance Indexes
-- =========================================================

create unique index if not exists idx_profiles_email
  on public.profiles (email);

create index if not exists idx_profiles_role
  on public.profiles (role);

create unique index if not exists idx_services_irvankede_service_id
  on public.services (irvankede_service_id);

create index if not exists idx_services_platform_active
  on public.services (platform, is_active);

create index if not exists idx_services_featured
  on public.services (is_featured);

create index if not exists idx_orders_user_created_at
  on public.orders (user_id, created_at desc);

create index if not exists idx_orders_status
  on public.orders (status);

create index if not exists idx_guest_orders_status_created_at
  on public.guest_orders (status, created_at desc);

create index if not exists idx_guest_orders_customer_whatsapp
  on public.guest_orders (customer_whatsapp);

create index if not exists idx_topups_user_status
  on public.topups (user_id, status);

create index if not exists idx_topups_status_created_at
  on public.topups (status, created_at desc);

create index if not exists idx_transactions_user_created_at
  on public.transactions (user_id, created_at desc);

create index if not exists idx_admin_logs_created_at
  on public.admin_logs (created_at desc);

create index if not exists idx_admin_logs_admin_id
  on public.admin_logs (admin_id, created_at desc);

-- =========================================================
-- Updated At Triggers
-- =========================================================

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row
execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

drop trigger if exists set_guest_orders_updated_at on public.guest_orders;
create trigger set_guest_orders_updated_at
before update on public.guest_orders
for each row
execute function public.set_updated_at();

drop trigger if exists set_topups_updated_at on public.topups;
create trigger set_topups_updated_at
before update on public.topups
for each row
execute function public.set_updated_at();

drop trigger if exists set_refill_requests_updated_at on public.refill_requests;
create trigger set_refill_requests_updated_at
before update on public.refill_requests
for each row
execute function public.set_updated_at();

drop trigger if exists set_app_settings_updated_at on public.app_settings;
create trigger set_app_settings_updated_at
before update on public.app_settings
for each row
execute function public.set_updated_at();

-- =========================================================
-- Auth Trigger for Profiles
-- =========================================================

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- =========================================================
-- Business Functions
-- =========================================================

create or replace function public.process_order(
  p_user_id uuid,
  p_service_id uuid,
  p_target text,
  p_quantity integer
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_service public.services%rowtype;
  v_profile public.profiles%rowtype;
  v_total bigint;
  v_order_id uuid;
  v_balance_before bigint;
  v_balance_after bigint;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if auth.uid() <> p_user_id and not public.is_admin(auth.uid()) then
    raise exception 'You are not allowed to create this order';
  end if;

  if p_target is null or btrim(p_target) = '' then
    raise exception 'Target is required';
  end if;

  if p_quantity is null or p_quantity <= 0 then
    raise exception 'Quantity must be greater than zero';
  end if;

  select *
  into v_service
  from public.services
  where id = p_service_id
    and is_active = true
  for update;

  if not found then
    raise exception 'Service not found or inactive';
  end if;

  if p_quantity < v_service.min_qty or p_quantity > v_service.max_qty then
    raise exception 'Quantity must be between % and %', v_service.min_qty, v_service.max_qty;
  end if;

  select *
  into v_profile
  from public.profiles
  where id = p_user_id
  for update;

  if not found then
    raise exception 'Profile not found';
  end if;

  v_total := v_service.price_sell * p_quantity;
  v_balance_before := v_profile.balance;

  if v_balance_before < v_total then
    raise exception 'Saldo tidak cukup';
  end if;

  v_balance_after := v_balance_before - v_total;

  update public.profiles
  set balance = v_balance_after
  where id = p_user_id;

  insert into public.orders (
    user_id,
    service_id,
    target,
    quantity,
    price_total,
    status,
    created_at,
    updated_at
  )
  values (
    p_user_id,
    p_service_id,
    p_target,
    p_quantity,
    v_total,
    'pending',
    now(),
    now()
  )
  returning id into v_order_id;

  insert into public.transactions (
    user_id,
    type,
    amount,
    balance_before,
    balance_after,
    reference_type,
    reference_id,
    description,
    created_at
  )
  values (
    p_user_id,
    'order',
    -v_total,
    v_balance_before,
    v_balance_after,
    'order',
    v_order_id,
    'Potong saldo untuk pesanan baru',
    now()
  );

  return v_order_id;
end;
$$;

create or replace function public.process_topup_approval(
  p_topup_id uuid,
  p_admin_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_topup public.topups%rowtype;
  v_profile public.profiles%rowtype;
  v_transaction_id uuid;
  v_balance_before bigint;
  v_balance_after bigint;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if auth.uid() <> p_admin_id and not public.is_admin(auth.uid()) then
    raise exception 'Only admin can approve topups';
  end if;

  if not public.is_admin(p_admin_id) then
    raise exception 'Provided approver is not an admin';
  end if;

  select *
  into v_topup
  from public.topups
  where id = p_topup_id
  for update;

  if not found then
    raise exception 'Topup not found';
  end if;

  if v_topup.status <> 'pending' then
    raise exception 'Topup has already been processed';
  end if;

  select *
  into v_profile
  from public.profiles
  where id = v_topup.user_id
  for update;

  if not found then
    raise exception 'Profile not found';
  end if;

  v_balance_before := v_profile.balance;
  v_balance_after := v_balance_before + v_topup.amount;

  update public.profiles
  set balance = v_balance_after
  where id = v_topup.user_id;

  update public.topups
  set
    status = 'approved',
    approved_by = p_admin_id,
    approved_at = now(),
    updated_at = now()
  where id = p_topup_id;

  insert into public.transactions (
    user_id,
    type,
    amount,
    balance_before,
    balance_after,
    reference_type,
    reference_id,
    description,
    created_at
  )
  values (
    v_topup.user_id,
    'topup',
    v_topup.amount,
    v_balance_before,
    v_balance_after,
    'topup',
    v_topup.id,
    'Top up saldo disetujui admin',
    now()
  )
  returning id into v_transaction_id;

  return v_transaction_id;
end;
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;

revoke all on function public.process_order(uuid, uuid, text, integer) from public;
grant execute on function public.process_order(uuid, uuid, text, integer) to authenticated;

revoke all on function public.process_topup_approval(uuid, uuid) from public;
grant execute on function public.process_topup_approval(uuid, uuid) to authenticated;

-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.packages enable row level security;
alter table public.orders enable row level security;
alter table public.guest_orders enable row level security;
alter table public.topups enable row level security;
alter table public.transactions enable row level security;
alter table public.refill_requests enable row level security;
alter table public.support_tickets enable row level security;
alter table public.app_settings enable row level security;
alter table public.admin_logs enable row level security;

-- Profiles
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()))
with check (id = auth.uid() or public.is_admin(auth.uid()));

-- Services
drop policy if exists "services_public_read" on public.services;
create policy "services_public_read"
on public.services
for select
to anon, authenticated
using (true);

drop policy if exists "services_admin_all" on public.services;
create policy "services_admin_all"
on public.services
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Packages
drop policy if exists "packages_public_read" on public.packages;
create policy "packages_public_read"
on public.packages
for select
to anon, authenticated
using (true);

drop policy if exists "packages_admin_all" on public.packages;
create policy "packages_admin_all"
on public.packages
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Orders
drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin"
on public.orders
for select
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "orders_insert_own_or_admin" on public.orders;
create policy "orders_insert_own_or_admin"
on public.orders
for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "orders_update_own_or_admin" on public.orders;
create policy "orders_update_own_or_admin"
on public.orders
for update
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

-- Guest Orders
drop policy if exists "guest_orders_public_insert" on public.guest_orders;
create policy "guest_orders_public_insert"
on public.guest_orders
for insert
to anon, authenticated
with check (true);

drop policy if exists "guest_orders_admin_select" on public.guest_orders;
create policy "guest_orders_admin_select"
on public.guest_orders
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "guest_orders_admin_update" on public.guest_orders;
create policy "guest_orders_admin_update"
on public.guest_orders
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Topups
drop policy if exists "topups_select_own_or_admin" on public.topups;
create policy "topups_select_own_or_admin"
on public.topups
for select
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "topups_insert_own_or_admin" on public.topups;
create policy "topups_insert_own_or_admin"
on public.topups
for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "topups_update_own_or_admin" on public.topups;
create policy "topups_update_own_or_admin"
on public.topups
for update
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

-- Transactions
drop policy if exists "transactions_select_own_or_admin" on public.transactions;
create policy "transactions_select_own_or_admin"
on public.transactions
for select
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "transactions_admin_all" on public.transactions;
create policy "transactions_admin_all"
on public.transactions
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- App Settings
drop policy if exists "app_settings_admin_all" on public.app_settings;
create policy "app_settings_admin_all"
on public.app_settings
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Admin Logs
drop policy if exists "admin_logs_admin_all" on public.admin_logs;
create policy "admin_logs_admin_all"
on public.admin_logs
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Refill Requests
drop policy if exists "refill_requests_select_own_or_admin" on public.refill_requests;
create policy "refill_requests_select_own_or_admin"
on public.refill_requests
for select
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "refill_requests_insert_own_or_admin" on public.refill_requests;
create policy "refill_requests_insert_own_or_admin"
on public.refill_requests
for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "refill_requests_update_own_or_admin" on public.refill_requests;
create policy "refill_requests_update_own_or_admin"
on public.refill_requests
for update
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

-- Support Tickets
drop policy if exists "support_tickets_select_own_or_admin" on public.support_tickets;
create policy "support_tickets_select_own_or_admin"
on public.support_tickets
for select
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "support_tickets_insert_authenticated_self" on public.support_tickets;
create policy "support_tickets_insert_authenticated_self"
on public.support_tickets
for insert
to authenticated
with check (
  (user_id = auth.uid() and guest_email is null)
  or public.is_admin(auth.uid())
);

drop policy if exists "support_tickets_insert_guest" on public.support_tickets;
create policy "support_tickets_insert_guest"
on public.support_tickets
for insert
to anon
with check (user_id is null and guest_email is not null);

drop policy if exists "support_tickets_update_own_or_admin" on public.support_tickets;
create policy "support_tickets_update_own_or_admin"
on public.support_tickets
for update
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

commit;
