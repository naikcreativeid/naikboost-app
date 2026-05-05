-- NaikBoost incremental update for guest checkout flow
-- Safe to run on existing project after main schema.sql has been applied.

begin;

-- =========================================================
-- guest_orders.user_id for silent registration mapping
-- =========================================================

alter table public.guest_orders
add column if not exists user_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'guest_orders_user_id_fkey'
      and conrelid = 'public.guest_orders'::regclass
  ) then
    alter table public.guest_orders
    add constraint guest_orders_user_id_fkey
    foreign key (user_id)
    references public.profiles (id)
    on delete set null;
  end if;
end $$;

create index if not exists idx_guest_orders_user_id
  on public.guest_orders (user_id);

-- =========================================================
-- guest-payment-proofs bucket for guest checkout
-- Upload is done by server action using service role.
-- Read/delete is limited to admin users.
-- =========================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'guest-payment-proofs',
  'guest-payment-proofs',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "guest_payment_proofs_admin_select" on storage.objects;
drop policy if exists "guest_payment_proofs_admin_delete" on storage.objects;

create policy "guest_payment_proofs_admin_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'guest-payment-proofs'
  and public.is_admin(auth.uid())
);

create policy "guest_payment_proofs_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'guest-payment-proofs'
  and public.is_admin(auth.uid())
);

commit;
