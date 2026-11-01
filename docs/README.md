# Dokumentasi Proyek LMS UNUSU

## Tujuan

`lms-unusu` adalah aplikasi Learning Management System (Ruang Belajar Digital) untuk Universitas Nahdlatul Ulama Sumatera Utara (UNUSU). Proyek ini berjalan sebagai single-package fullstack monolith berbasis Vite + React 18 di sisi klien dan Express + Prisma ORM (MySQL) di sisi server, dengan autentikasi terpusat melalui SSO ONE UNUSU.

## Fungsi Utama

1. **Autentikasi SSO Satu Pintu**: Pertukaran one-time token dari portal ONE UNUSU ke endpoint `/api/auth/sso` untuk menerbitkan sesi JWT lokal berdurasi 7 hari tanpa form kata sandi terpisah.
2. **Portal Mahasiswa**: Pemantauan daftar kelas aktif semester berjalan, pengunduhan materi per pertemuan, pengumpulan jawaban tugas, serta pemantauan nilai tugas dari dosen.
3. **Portal Dosen**: Pengelolaan daftar kelas yang diampu, penambahan materi kuliah atau instruksi tugas per pertemuan, pemantauan jumlah pengumpulan tugas, dan penilaian jawaban mahasiswa.
4. **Rekapitulasi Akademik**: Penyimpanan dan penyajian data pertemuan kelas (16 sesi), presensi kehadiran (`Hadir`, `Izin`, `Sakit`, `Alpa`), serta komponen nilai pada entitas `Enrollment`.

## Struktur Direktori Aktual

> **Catatan Audit Struktur**: `README.md` di root repositori masih mencantumkan path lama (`client/` dan `server/` terpisah). Struktur aktual di repositori saat ini adalah **single-package fullstack monolith** di bawah `src/client/` dan `src/server/` dengan satu `package.json` di root.

```text
lms-unusu/
├── docs/
│   ├── README.md                     # Ikhtisar proyek, arsitektur aktual, dan panduan menjalankan
│   ├── PROJECT_RULES.md              # Aturan tata kelola global, konvensi kode, dan keselamatan
│   ├── routes/
│   │   └── RULES.md                  # Aturan modul rute, pemetaan template, dan kontrak API
│   └── design-system/
│       ├── DESIGN_RULES.md           # Prinsip desain, aksesibilitas, anti-slop, dan tata letak form
│       ├── COLORS.md                 # Palet warna aktual, token Tailwind, dan aturan kontras
│       ├── TYPOGRAPHY.md             # Skala tipografi Plus Jakarta Sans dan hierarki teks
│       ├── COMPONENTS.md             # Registri komponen bersama
│       └── PAGE_TEMPLATES.md         # Registri template halaman dan pemetaan rute
├── prisma/
│   ├── schema.prisma                 # Skema database MySQL (7 tabel utama + 1 tabel pivot)
│   ├── seed.ts                       # Data awal semester, dosen, mahasiswa, kelas, materi, tugas
│   └── migrations/                   # Riwayat migrasi Prisma
├── public/
│   └── assets/pai/logo-unusu.jpg     # Aset statis logo institusi UNUSU
├── src/
│   ├── client/                       # Aplikasi SPA React 18 (Vite)
│   │   ├── components/
│   │   │   ├── templates/            # AuthCardTemplate, DashboardPageTemplate, ListPageTemplate, DetailPageTemplate, FormPageTemplate
│   │   │   ├── Button.tsx            # Tombol semantik standar (min-h-[44px], loading state)
│   │   │   ├── FormField.tsx         # Pembungkus label, input, hint, dan error validasi
│   │   │   ├── FormSectionCard.tsx   # Kontainer Card ber-heading untuk kelompok field form (Part 10.8)
│   │   │   ├── ModalDialog.tsx       # Dialog modal aksesibel (role="dialog", Escape)
│   │   │   ├── Navbar.tsx            # Navigasi atas sticky, indikator peran SSO, profil pengguna
│   │   │   ├── PageHeader.tsx        # Header halaman standar (back link, h1, deskripsi, aksi)
│   │   │   ├── StateViews.tsx        # LoadingState, EmptyState, dan ErrorState (onRetry)
│   │   │   └── StatusBadge.tsx       # Badge status semantik patuh WCAG AA
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # State sesi pengguna dan sinkronisasi localStorage
│   │   ├── pages/
│   │   │   ├── Login.tsx             # Gerbang pengalihan login ke SSO ONE UNUSU
│   │   │   ├── SsoCallback.tsx       # Penukaran token SSO sekali pakai ke sesi JWT lokal
│   │   │   ├── Dashboard.tsx         # Halaman beranda kelas aktif (mahasiswa & dosen)
│   │   │   ├── ClassDetail.tsx       # Detail kelas, tab materi & tugas, form pengumpulan, modal tambah resource
│   │   │   └── Tasks.tsx             # Daftar agenda tugas lintas mata kuliah dan nilai
│   │   ├── services/
│   │   │   └── api.ts                # Instance Axios, interceptor Bearer JWT & 401, fungsi pemanggil API
│   │   ├── App.tsx                   # Konfigurasi React Router (basename `/lms`), ProtectedRoute, AppShell
│   │   ├── main.tsx                  # Titik masuk DOM React
│   │   └── index.css                 # Direktif Tailwind CSS dan scroll-behavior smooth
│   └── server/
│       └── index.ts                  # Server Express monolith, verifikasi SSO, middleware JWT, endpoint REST API, static SPA fallback
├── CHANGELOG.md                      # Catatan perubahan proyek berformat tanggal ISO
├── index.html                        # Dokumen HTML utama (`lang="id"`, pemuatan font Plus Jakarta Sans)
├── package.json                      # Skrip npm dan dependensi tunggal (client + server)
├── tailwind.config.js                # Konfigurasi Tailwind CSS dan token `lms.green` / `lms.gold`
├── tsconfig.json                     # Konfigurasi TypeScript untuk `src/client/**/*`
├── tsconfig.server.json              # Konfigurasi TypeScript untuk `src/server/**/*`
└── vite.config.ts                    # Konfigurasi bundler Vite (port 5174, proxy `/api` ke 5001, base produksi `/lms/`)
```

## Alur Data

1. **Autentikasi**: Pengguna mengakses `/login` -> diarahkan ke `${VITE_ONE_UNUSU_URL}/login` -> ONE UNUSU mengembalikan browser ke `/sso/callback?client_id=...&token=...` -> `SsoCallbackPage` memanggil `POST /api/auth/sso` -> backend Express memverifikasi token secara server-to-server ke `${SSO_BASE_URL}/api/v2/website/verify-token` -> backend memetakan peran (`SUPERADMIN` -> `admin`, `DOSEN` -> `dosen`, `MAHASISWA` -> `mahasiswa`) dan menerbitkan JWT lokal (7 hari) -> klien menyimpan token di `localStorage` (`lms_unusu_token` dan `lms_unusu_user`).
2. **Permintaan Data Terproteksi**: Setiap panggilan melalui `src/client/services/api.ts` menyisipkan header `Authorization: Bearer <token>`. Semua rute `/api/*` (setelah `/api/health` dan `/api/auth/sso`) melewati middleware `authenticate` di `src/server/index.ts`. Jika server merespons `401`, interceptor Axios menghapus sesi lokal dan mengarahkan pengguna kembali ke halaman `/login`.
3. **Penyajian Produksi**: `npm run build` mengompilasi frontend ke `dist/client` (dengan `base: '/lms/'`) dan backend ke `dist/server/index.js`. Saat dijalankan dengan `npm start`, Express menyajikan aset statis di `/` serta `/lms`, dan meneruskan rute non-API ke `dist/client/index.html`.

## Cara Menjalankan dan Memverifikasi

1. **Instalasi Dependensi** (cukup satu kali di root, tanpa `--prefix`):
   ```bash
   npm install
   ```
2. **Persiapan Environment & Prisma**:
   Pastikan variabel environment pada `.env` telah terisi (`DATABASE_URL`, `JWT_SECRET`, `SSO_BASE_URL`, `SSO_CLIENT_ID`, `SSO_CLIENT_KEY`, serta opsional `VITE_API_URL` dan `VITE_ONE_UNUSU_URL`).
   ```bash
   npm run prisma:generate
   ```
   *(Catatan: migrasi database dan seed membutuhkan koneksi MySQL aktif serta persetujuan eksplisit sesuai aturan keselamatan di `docs/PROJECT_RULES.md`.)*
3. **Menjalankan Mode Pengembangan**:
   - Backend API (port `5001`): `npm run dev`
   - Frontend Vite (port `5174`, proxy `/api` -> `http://localhost:5001`): `npm run dev:client`
4. **Verifikasi Build & Typecheck**:
   ```bash
   npx tsc --noEmit
   npm run build
   ```

## Lihat Juga

- [Aturan Global Proyek](./PROJECT_RULES.md)
- [Aturan Sistem Desain](./design-system/DESIGN_RULES.md)
- [Palet Warna](./design-system/COLORS.md)
- [Tipografi](./design-system/TYPOGRAPHY.md)
- [Registri Komponen Bersama](./design-system/COMPONENTS.md)
- [Registri Template Halaman](./design-system/PAGE_TEMPLATES.md)
- [Catatan Perubahan (CHANGELOG)](../CHANGELOG.md)
