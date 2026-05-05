-- NaikBoost Storage Setup
-- Bucket private untuk bukti transfer customer
-- Bucket public untuk icon layanan
--
-- Referensi resmi:
-- https://supabase.com/docs/guides/storage/buckets/fundamentals
-- https://supabase.com/docs/guides/storage/security/access-control
-- https://supabase.com/docs/guides/storage/schema/helper-functions

begin;

-- =========================================================
-- Buckets
-- =========================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs',
  'payment-proofs',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'service-icons',
  'service-icons',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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

-- =========================================================
-- Clean Existing Policies
-- =========================================================

drop policy if exists "payment_proofs_insert_own_folder" on storage.objects;
drop policy if exists "payment_proofs_select_owner_or_admin" on storage.objects;
drop policy if exists "payment_proofs_delete_owner_or_admin" on storage.objects;
drop policy if exists "service_icons_admin_manage" on storage.objects;
drop policy if exists "guest_payment_proofs_admin_select" on storage.objects;
drop policy if exists "guest_payment_proofs_admin_delete" on storage.objects;

-- =========================================================
-- payment-proofs Policies
-- Path wajib: {user_id}/{topup_id}/{filename}
-- Customer hanya bisa upload dan lihat file miliknya sendiri
-- Admin bisa lihat dan hapus semua file proof
-- =========================================================

create policy "payment_proofs_insert_own_folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'payment-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "payment_proofs_select_owner_or_admin"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin(auth.uid())
  )
);

create policy "payment_proofs_delete_owner_or_admin"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin(auth.uid())
  )
);

-- =========================================================
-- service-icons Policies
-- Bucket public untuk dibaca semua orang
-- Upload/update/delete hanya admin
-- =========================================================

create policy "service_icons_admin_manage"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'service-icons'
  and public.is_admin(auth.uid())
)
with check (
  bucket_id = 'service-icons'
  and public.is_admin(auth.uid())
);

-- =========================================================
-- guest-payment-proofs Policies
-- Upload dilakukan via server action dengan service role
-- Jadi bucket ini cukup dibuka untuk admin baca/hapus
-- =========================================================

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
