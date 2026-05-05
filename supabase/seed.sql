-- NaikBoost development seed data
-- Aman dijalankan berulang untuk environment development/testing.
--
-- Akun test:
-- Admin
--   email    : admin@naikboost.app
--   password : Admin1234
--
-- Customer
--   email    : customer@test.com
--   password : Customer1234

begin;

create extension if not exists pgcrypto;

-- =========================================================
-- Auth users for development
-- =========================================================

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
select
  '00000000-0000-0000-0000-000000000000'::uuid,
  '11111111-1111-4111-8111-111111111111'::uuid,
  'authenticated',
  'authenticated',
  'admin@naikboost.app',
  crypt('Admin1234', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Admin NaikBoost","whatsapp":"+6281111111111"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
where not exists (
  select 1 from auth.users where email = 'admin@naikboost.app'
);

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
select
  '00000000-0000-0000-0000-000000000000'::uuid,
  '22222222-2222-4222-8222-222222222222'::uuid,
  'authenticated',
  'authenticated',
  'customer@test.com',
  crypt('Customer1234', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Customer Test","whatsapp":"+6282222222222"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
where not exists (
  select 1 from auth.users where email = 'customer@test.com'
);

-- =========================================================
-- Profiles
-- =========================================================

insert into public.profiles (id, email, full_name, whatsapp, balance, role, created_at, updated_at)
select
  id,
  email,
  'Admin NaikBoost',
  '+6281111111111',
  0,
  'admin',
  now(),
  now()
from auth.users
where email = 'admin@naikboost.app'
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  whatsapp = excluded.whatsapp,
  balance = excluded.balance,
  role = excluded.role,
  updated_at = now();

insert into public.profiles (id, email, full_name, whatsapp, balance, role, created_at, updated_at)
select
  id,
  email,
  'Customer Test',
  '+6282222222222',
  100000,
  'customer',
  now(),
  now()
from auth.users
where email = 'customer@test.com'
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  whatsapp = excluded.whatsapp,
  balance = excluded.balance,
  role = excluded.role,
  updated_at = now();

-- =========================================================
-- App settings
-- =========================================================

insert into public.app_settings (
  id,
  default_markup_percentage,
  bank_accounts,
  whatsapp_gateway_settings,
  maintenance_mode,
  created_at,
  updated_at
)
values (
  1,
  50,
  '[{"bank":"BCA","account_number":"1234567890","account_name":"NaikBoost Indonesia"},{"bank":"BRI","account_number":"0987654321","account_name":"NaikBoost Indonesia"},{"bank":"Mandiri","account_number":"1122334455","account_name":"NaikBoost Indonesia"}]',
  '{"provider":"fonnte","enabled":false}',
  false,
  now(),
  now()
)
on conflict (id) do update
set
  default_markup_percentage = excluded.default_markup_percentage,
  bank_accounts = excluded.bank_accounts,
  whatsapp_gateway_settings = excluded.whatsapp_gateway_settings,
  maintenance_mode = excluded.maintenance_mode,
  updated_at = now();

-- =========================================================
-- Services dummy data
-- =========================================================

insert into public.services (
  id,
  irvankede_service_id,
  name,
  category,
  platform,
  type,
  price_buy,
  price_sell,
  min_qty,
  max_qty,
  refill_days,
  description,
  is_active,
  is_featured,
  created_at,
  updated_at
)
values
  ('30000000-0000-4000-8000-000000000001', 900001, 'Instagram Followers Indonesia HQ', 'Instagram Followers', 'instagram', 'Default', 28, 49, 100, 50000, 30, 'Followers Instagram untuk testing development.', true, true, now(), now()),
  ('30000000-0000-4000-8000-000000000002', 900002, 'Instagram Likes Fast', 'Instagram Likes', 'instagram', 'Default', 15, 25, 100, 100000, 0, 'Likes Instagram proses cepat.', true, true, now(), now()),
  ('30000000-0000-4000-8000-000000000003', 900003, 'Instagram Views Reels', 'Instagram Views', 'instagram', 'Default', 6, 10, 500, 500000, 0, 'Views Reels Instagram untuk testing.', true, false, now(), now()),
  ('30000000-0000-4000-8000-000000000004', 900004, 'Instagram Saves Booster', 'Instagram Saves', 'instagram', 'Default', 18, 30, 50, 10000, 0, 'Tambah saves Instagram.', true, false, now(), now()),
  ('30000000-0000-4000-8000-000000000005', 900005, 'TikTok Views Indonesia', 'TikTok Views', 'tiktok', 'Default', 5, 9, 1000, 1000000, 0, 'Views TikTok aman untuk testing.', true, true, now(), now()),
  ('30000000-0000-4000-8000-000000000006', 900006, 'TikTok Likes Fast', 'TikTok Likes', 'tiktok', 'Default', 12, 20, 100, 50000, 0, 'Likes TikTok cepat masuk.', true, false, now(), now()),
  ('30000000-0000-4000-8000-000000000007', 900007, 'TikTok Followers Mix', 'TikTok Followers', 'tiktok', 'Default', 30, 48, 100, 25000, 15, 'Followers TikTok campuran.', true, false, now(), now()),
  ('30000000-0000-4000-8000-000000000008', 900008, 'TikTok Shares Booster', 'TikTok Shares', 'tiktok', 'Default', 14, 22, 50, 10000, 0, 'Tambah share TikTok.', true, false, now(), now()),
  ('30000000-0000-4000-8000-000000000009', 900009, 'YouTube Subscribers Global', 'YouTube Subscribers', 'youtube', 'Default', 65, 99, 50, 10000, 30, 'Subscribers YouTube dummy.', true, true, now(), now()),
  ('30000000-0000-4000-8000-000000000010', 900010, 'YouTube Views Campaign', 'YouTube Views', 'youtube', 'Default', 8, 12, 1000, 1000000, 0, 'Views YouTube untuk testing.', true, false, now(), now()),
  ('30000000-0000-4000-8000-000000000011', 900011, 'YouTube Likes Fast', 'YouTube Likes', 'youtube', 'Default', 16, 25, 100, 50000, 0, 'Likes YouTube cepat.', true, false, now(), now()),
  ('30000000-0000-4000-8000-000000000012', 900012, 'Facebook Page Likes', 'Facebook Likes', 'facebook', 'Default', 22, 35, 100, 25000, 0, 'Page likes Facebook.', true, false, now(), now())
on conflict (irvankede_service_id) do update
set
  name = excluded.name,
  category = excluded.category,
  platform = excluded.platform,
  type = excluded.type,
  price_buy = excluded.price_buy,
  price_sell = excluded.price_sell,
  min_qty = excluded.min_qty,
  max_qty = excluded.max_qty,
  refill_days = excluded.refill_days,
  description = excluded.description,
  is_active = excluded.is_active,
  is_featured = excluded.is_featured,
  updated_at = now();

-- =========================================================
-- Packages for landing page
-- =========================================================

insert into public.packages (
  id,
  name,
  service_id,
  quantity,
  price,
  description,
  is_featured,
  delivery_time,
  bonus_description,
  sort_order,
  is_active,
  created_at
)
values
  ('40000000-0000-4000-8000-000000000001', 'Starter', '30000000-0000-4000-8000-000000000001', 1000, 49000, 'Cocok buat mulai naikin akun tanpa ribet.', false, '6-12 jam', null, 1, true, now()),
  ('40000000-0000-4000-8000-000000000002', 'Popular', '30000000-0000-4000-8000-000000000001', 5000, 199000, 'Paket paling pas untuk campaign yang lebih serius.', true, '6-24 jam', 'Bonus 500 likes', 2, true, now()),
  ('40000000-0000-4000-8000-000000000003', 'Premium', '30000000-0000-4000-8000-000000000001', 10000, 349000, 'Untuk brand atau creator yang mau dorongan lebih besar.', false, '12-24 jam', 'Prioritas proses', 3, true, now())
on conflict (id) do update
set
  name = excluded.name,
  service_id = excluded.service_id,
  quantity = excluded.quantity,
  price = excluded.price,
  description = excluded.description,
  is_featured = excluded.is_featured,
  delivery_time = excluded.delivery_time,
  bonus_description = excluded.bonus_description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- =========================================================
-- Dummy orders
-- =========================================================

insert into public.orders (
  id,
  user_id,
  service_id,
  irvankede_order_id,
  target,
  quantity,
  price_total,
  status,
  start_count,
  remains,
  charge,
  notes,
  created_at,
  updated_at
)
values
  ('50000000-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', '30000000-0000-4000-8000-000000000001', null, 'https://instagram.com/brandnaik', 1000, 49000, 'pending', null, null, null, 'Menunggu dikirim ke provider.', now() - interval '2 days', now() - interval '2 days'),
  ('50000000-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', '30000000-0000-4000-8000-000000000005', 'IK-TEST-1002', 'https://tiktok.com/@brandnaik', 10000, 90000, 'processing', 1200, 3500, 55, 'Sedang diproses provider.', now() - interval '1 day 4 hours', now() - interval '20 minutes'),
  ('50000000-0000-4000-8000-000000000003', '22222222-2222-4222-8222-222222222222', '30000000-0000-4000-8000-000000000009', 'IK-TEST-1003', 'https://youtube.com/@brandnaik', 500, 49500, 'success', 220, 0, 33, 'Selesai normal.', now() - interval '5 days', now() - interval '4 days'),
  ('50000000-0000-4000-8000-000000000004', '22222222-2222-4222-8222-222222222222', '30000000-0000-4000-8000-000000000002', 'IK-TEST-1004', 'https://instagram.com/brandnaik', 2000, 50000, 'error', 890, 2000, 0, 'Gagal dari provider, perlu cek ulang.', now() - interval '4 days', now() - interval '4 days'),
  ('50000000-0000-4000-8000-000000000005', '22222222-2222-4222-8222-222222222222', '30000000-0000-4000-8000-000000000010', 'IK-TEST-1005', 'https://youtube.com/watch?v=abc123', 20000, 240000, 'partial', 5000, 1800, 170, 'Sebagian terkirim.', now() - interval '3 days', now() - interval '2 days'),
  ('50000000-0000-4000-8000-000000000006', '22222222-2222-4222-8222-222222222222', '30000000-0000-4000-8000-000000000006', 'IK-TEST-1006', 'https://tiktok.com/@brandnaik', 2500, 50000, 'success', 300, 0, 27, 'Order selesai.', now() - interval '8 days', now() - interval '7 days'),
  ('50000000-0000-4000-8000-000000000007', '22222222-2222-4222-8222-222222222222', '30000000-0000-4000-8000-000000000012', 'IK-TEST-1007', 'https://facebook.com/brandnaik', 1500, 52500, 'processing', 100, 900, 32, 'Masih berjalan.', now() - interval '10 hours', now() - interval '15 minutes')
on conflict (id) do update
set
  service_id = excluded.service_id,
  irvankede_order_id = excluded.irvankede_order_id,
  target = excluded.target,
  quantity = excluded.quantity,
  price_total = excluded.price_total,
  status = excluded.status,
  start_count = excluded.start_count,
  remains = excluded.remains,
  charge = excluded.charge,
  notes = excluded.notes,
  updated_at = excluded.updated_at;

-- =========================================================
-- Dummy topups
-- =========================================================

insert into public.topups (
  id,
  user_id,
  amount,
  bank_destination,
  sender_name,
  transfer_date,
  proof_image_url,
  status,
  admin_notes,
  approved_by,
  approved_at,
  created_at,
  updated_at
)
values
  ('60000000-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 50000, 'BCA', 'Customer Test', current_date - 3, 'seed/payment-proof-1.jpg', 'approved', 'Top up dummy disetujui.', '11111111-1111-4111-8111-111111111111', now() - interval '3 days', now() - interval '3 days', now() - interval '3 days'),
  ('60000000-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', 100000, 'Mandiri', 'Customer Test', current_date - 1, 'seed/payment-proof-2.jpg', 'pending', null, null, null, now() - interval '1 day', now() - interval '1 day'),
  ('60000000-0000-4000-8000-000000000003', '22222222-2222-4222-8222-222222222222', 75000, 'BRI', 'Customer Test', current_date - 5, 'seed/payment-proof-3.jpg', 'rejected', 'Bukti transfer kurang jelas.', '11111111-1111-4111-8111-111111111111', now() - interval '5 days', now() - interval '5 days', now() - interval '5 days')
on conflict (id) do update
set
  amount = excluded.amount,
  bank_destination = excluded.bank_destination,
  sender_name = excluded.sender_name,
  transfer_date = excluded.transfer_date,
  proof_image_url = excluded.proof_image_url,
  status = excluded.status,
  admin_notes = excluded.admin_notes,
  approved_by = excluded.approved_by,
  approved_at = excluded.approved_at,
  updated_at = excluded.updated_at;

-- =========================================================
-- Dummy transactions
-- =========================================================

insert into public.transactions (
  id,
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
values
  ('70000000-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 'topup', 50000, 50000, 100000, 'topup', '60000000-0000-4000-8000-000000000001', 'Top up dummy approved.', now() - interval '3 days'),
  ('70000000-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', 'order', -49000, 100000, 51000, 'order', '50000000-0000-4000-8000-000000000001', 'Potong saldo untuk order pending.', now() - interval '2 days'),
  ('70000000-0000-4000-8000-000000000003', '22222222-2222-4222-8222-222222222222', 'refund', 50000, 1000, 51000, 'order', '50000000-0000-4000-8000-000000000004', 'Refund dummy karena provider error.', now() - interval '4 days'),
  ('70000000-0000-4000-8000-000000000004', '22222222-2222-4222-8222-222222222222', 'adjustment', 49000, 51000, 100000, 'manual', null, 'Adjustment dummy supaya saldo akhir pas untuk testing.', now() - interval '1 day')
on conflict (id) do update
set
  type = excluded.type,
  amount = excluded.amount,
  balance_before = excluded.balance_before,
  balance_after = excluded.balance_after,
  reference_type = excluded.reference_type,
  reference_id = excluded.reference_id,
  description = excluded.description,
  created_at = excluded.created_at;

commit;
