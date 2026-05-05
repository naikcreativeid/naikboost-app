# NaikBoost

NaikBoost adalah platform jasa boost engagement sosial media untuk bisnis dan creator. Produk ini punya dua jalur utama:

- Jalur A: customer beli paket langsung dari landing page tanpa daftar
- Jalur B: customer daftar, isi saldo, lalu order dari dashboard

Project ini dibangun untuk operasional yang simpel di MVP: pembayaran manual transfer, approval admin, fulfillment lewat API IrvanKede, dan notifikasi WhatsApp lewat Fonnte.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Database, Storage
- Vercel Analytics
- IrvanKede API
- Fonnte WhatsApp Gateway
- Sonner untuk toast
- Zod + React Hook Form

## Fitur Inti

- Landing page SaaS-style dengan paket retail
- Auth customer + role admin
- Dashboard customer
- Dashboard admin untuk approval topup, guest order, support, dan service settings
- Guest checkout dengan silent registration
- Top up manual dengan upload bukti transfer
- Sinkronisasi order ke IrvanKede
- Notifikasi WhatsApp untuk event penting
- Cron Vercel untuk auto sync status order

## Setup Local Development

1. Install dependency:

```bash
npm install
```

2. Buat file `.env.local` dan isi variabel environment yang dibutuhkan.

3. Jalankan development server:

```bash
npm run dev
```

4. Buka `http://localhost:3000`

## Environment Variables

Wajib diisi untuk local dan production:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

IRVANKEDE_API_URL=https://irvankedesmm.co.id/api
IRVANKEDE_API_ID=
IRVANKEDE_API_KEY=

FONNTE_TOKEN=
ADMIN_WHATSAPP_NUMBER=

NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=
```

Catatan:

- `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di server-side
- `IRVANKEDE_API_KEY` hanya dipakai di server-side
- `FONNTE_TOKEN` hanya dipakai di server-side

## Database Setup

Apply file berikut di Supabase SQL Editor:

1. `supabase/schema.sql`
2. `supabase/storage.sql`
3. `supabase/guest-order-updates.sql`

## Database Schema Overview

Tabel utama:

- `profiles`: profil user + role + saldo
- `services`: daftar layanan provider
- `packages`: paket retail untuk landing page
- `orders`: pesanan customer login
- `guest_orders`: pesanan customer tanpa daftar
- `topups`: konfirmasi top up manual
- `transactions`: mutasi saldo
- `refill_requests`: request refill garansi
- `support_tickets`: tiket bantuan
- `app_settings`: pengaturan sistem
- `admin_logs`: audit trail admin

## Cron Jobs

Cron Vercel ada di `vercel.json`:

- `/api/cron/sync-orders` setiap 5 menit

Pastikan env `CRON_SECRET` diisi. Endpoint cron akan memvalidasi:

- `Authorization: Bearer <CRON_SECRET>`

## Analytics

Project ini memakai:

- Vercel Analytics untuk page analytics
- event tracking dasar untuk `signup`, `login`, `order_created`, `topup_submitted`

Catatan:

- custom event Vercel Analytics bisa punya batasan tergantung plan Vercel

## Deploy ke Vercel

1. Import repo ke Vercel
2. Set semua environment variables production
3. Deploy
4. Jalankan SQL di Supabase
5. Verifikasi cron di dashboard Vercel
6. Jalankan checklist di `TESTING.md`

## Security Checklist

Yang sudah diterapkan:

- Validasi input server action dengan Zod
- Auth middleware untuk `/dashboard` dan `/admin`
- Admin-only access untuk action sensitif
- Storage bucket private untuk bukti transfer
- CSP headers, `X-Frame-Options`, `Referrer-Policy`, dan `nosniff`
- Secret key sensitif dipakai server-side saja

Yang masih direkomendasikan sebelum scale:

- Rate limiting pakai Upstash atau Vercel rate limiting
- Error monitoring harian di Vercel dashboard
- Backup database manual atau aktifkan auto backup Supabase Pro

## Common Troubleshooting

### Landing page error di production

Periksa:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Admin atau dashboard redirect aneh

Periksa:

- middleware aktif
- row `profiles` user benar-benar ada
- role admin sudah di-set ke `admin`

### Upload bukti transfer gagal

Periksa:

- bucket storage sudah dibuat
- policy storage sudah di-apply
- ukuran file maksimal 2MB

### Order tidak masuk ke provider

Periksa:

- `IRVANKEDE_API_ID`
- `IRVANKEDE_API_KEY`
- service mapping `irvankede_service_id`

### WhatsApp tidak terkirim

Periksa:

- `FONNTE_TOKEN`
- device WhatsApp di Fonnte masih aktif
- nomor tujuan sudah dalam format yang benar

## Launch Notes

Sebelum launch:

- test semua flow end-to-end
- siapkan rollback plan
- backup database
- monitor error log dan cron job di hari pertama

Checklist manual lengkap ada di [TESTING.md](./TESTING.md).
