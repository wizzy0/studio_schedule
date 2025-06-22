# Studio Schedule Website

Website jadwal studio menggunakan Next.js dan Supabase untuk manajemen jadwal booking studio.

## Fitur

- ✅ Login/Register user dengan Supabase Auth
- ✅ Login admin terpisah
- ✅ Dashboard user dan admin
- ✅ Manajemen jadwal studio (akan dikembangkan)
- ✅ UI modern dan responsive

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Buka SQL Editor
4. Jalankan script SQL berikut:

```sql
-- Copy dan paste isi dari file supabase-setup.sql
```

### 3. Konfigurasi Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wlbaiwoaolergpptysac.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsYmFpd29hb2xlcmdwcHR5c2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MjY2MDksImV4cCI6MjA2NjEwMjYwOX0.V5GDKxRZp5zSB10CmnB0qLNXksW32z5XU14pAYZaQX4
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Struktur Database

### Tabel `profiles`
- `id` - UUID (foreign key ke auth.users)
- `email` - TEXT (unique)
- `name` - TEXT
- `role` - TEXT ('user' atau 'admin')
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### Tabel `schedules`
- `id` - UUID (primary key)
- `user_id` - UUID (foreign key ke profiles)
- `date` - DATE
- `time_slot` - TEXT
- `status` - TEXT ('available', 'booked', 'cancelled')
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

## Testing Login

1. Buka `http://localhost:3000/login`
2. Klik "Sign up" untuk membuat akun baru
3. Masukkan email, password, dan nama
4. Cek email untuk konfirmasi (jika diperlukan)
5. Login dengan akun yang sudah dibuat
6. Akan diarahkan ke dashboard

## Admin Login

1. Buka `http://localhost:3000/admin/login`
2. Login dengan akun yang memiliki role 'admin'
3. Akan diarahkan ke admin dashboard

## Troubleshooting

### Error "Table 'profiles' does not exist"
- Pastikan script SQL di `supabase-setup.sql` sudah dijalankan di Supabase SQL Editor

### Error "Invalid login credentials"
- Pastikan email dan password benar
- Cek apakah email sudah dikonfirmasi (untuk sign up baru)

### Error "Network error"
- Pastikan URL dan API key Supabase sudah benar
- Cek koneksi internet

## Next Steps

- [ ] Implementasi dashboard admin
- [ ] CRUD jadwal studio
- [ ] Booking system
- [ ] Notifikasi email
- [ ] Calendar view
- [ ] Payment integration
