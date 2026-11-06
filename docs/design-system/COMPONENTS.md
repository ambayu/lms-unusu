# Registri Komponen Bersama (COMPONENTS): LMS UNUSU

Dokumen ini memetakan komponen UI bersama di `src/client/`, membedakan secara jujur antara **komponen yang sudah tersedia saat ini** dan **pola UI berulang di halaman eksisting yang wajib diekstrak menjadi komponen bersama** saat fitur terkait dikerjakan (*Build Once, Reuse Everywhere*).

---

## 1. Status Inventaris Komponen Aktual

Seluruh komponen bersama inti dan template halaman telah tersedia di `src/client/components/` dan `src/client/components/templates/`, serta telah diintegrasikan ke seluruh halaman rute (`Login.tsx`, `SsoCallback.tsx`, `Dashboard.tsx`, `ClassDetail.tsx`, `Tasks.tsx`).

Aturan wajib bagi setiap pengembangan berikutnya:
1. **Gunakan yang sudah ada** tanpa menduplikasi.
2. **Verifikasi Tipe**: Jika sebuah tugas mengubah kontrak prop komponen bersama di `src/client/components/`, jalankan `npx tsc --noEmit` dan `npm run build` serta perbarui dokumen ini.

---

## 2. Komponen Bersama yang Sudah Tersedia

### 2.1 `Navbar` (`src/client/components/Navbar.tsx`)
- **Tanggung Jawab**: Bilah navigasi atas (`sticky top-0 z-50`) untuk seluruh rute terproteksi di dalam `AppShell`. Menampilkan identitas brand `LMS UNUSU`, badge peran aktif dari sesi SSO (`mahasiswa` / `dosen`), tautan navigasi utama (`Kelas Saya`, `Tugas & Nilai`), tautan eksternal kembali ke `Portal Kampus` (ONE UNUSU), avatar inisial pengguna beserta nama & NIM/NIDN, serta tombol `Keluar`.
- **Props Utama**:
  - `role: 'mahasiswa' | 'dosen'`: Menentukan label badge peran aktif.
  - `user?: SessionUser | null`: Objek pengguna dari `AuthContext` untuk menampilkan nama, NIM/NIDN, dan kalkulasi 2 huruf inisial avatar.
  - `onLogout?: () => void`: Handler penghapusan sesi lokal dari `AuthContext`.
- **Aturan Reuse & Larangan**:
  - Hanya dirender satu kali oleh `AppShell` di `src/client/App.tsx`. Halaman individual dilarang merender `<header>` atau navbar sendiri.
  - Setiap tautan baru yang ditambahkan ke `Navbar` wajib mengarah ke rute yang benar-benar ada dan berfungsi (Aturan R-24). Dilarang menaruh menu dummy.
  - Dilarang menambahkan tombol switch peran manual di `Navbar`; peran murni berasal dari sesi SSO.

### 2.2 `AppShell` & `ProtectedRoute` (`src/client/App.tsx`)
- **Tanggung Jawab**:
  - `ProtectedRoute`: Memeriksa `loading` dan keberadaan `user` dari `useAuth()`; mengalihkan pengguna yang belum login ke `/login`.
  - `AppShell`: Menyediakan struktur landmark dokumen (`<header>` melalui `Navbar`, `<main className="flex-1">`, dan `<footer>` hak cipta institusi) di atas latar `bg-slate-50`.
- **Aturan Reuse**:
  - Seluruh halaman aplikasi yang memerlukan sesi login wajib dirender sebagai `<Route>` di dalam `AppShell`.
  - Hanya halaman autentikasi publik (`/login` dan `/sso/callback`) yang berada di luar `AppShell`.

---

## 3. Daftar Komponen Bersama di `src/client/components/`

Komponen berikut telah diekstrak ke berkas tersendiri di `src/client/components/` dan digunakan di seluruh halaman:

| Nama Komponen & Berkas | Lokasi Pemakaian | Tanggung Jawab & Kontrak Props Utama |
|---|---|---|
| **`PageHeader`** (`PageHeader.tsx`) | `ListPageTemplate.tsx`, `FormPageTemplate.tsx` | Menampilkan tautan kembali/breadcrumb opsional (`backTo`, `backLabel`), judul halaman `<h1>` (`title`), deskripsi singkat (`description`), badge metadata opsional, dan slot aksi utama di sisi kanan (`actions`). |
| **`StatusBadge`** (`StatusBadge.tsx`) | `Navbar.tsx`, `Dashboard.tsx`, `ClassDetail.tsx`, `Tasks.tsx`, `DashboardPageTemplate.tsx`, `DetailPageTemplate.tsx` | Merender pill/badge semantik konsisten dengan varian ketat (`'neutral' \| 'emerald' \| 'info' \| 'warning' \| 'danger'`) yang seluruhnya terverifikasi lulus kontras WCAG AA. *Wajib cek seluruh pemanggil dengan `npx tsc --noEmit` saat mengubah union `variant`.* |
| **`FormSectionCard`** (`FormSectionCard.tsx`) | `ClassDetail.tsx` (form pengumpulan tugas & modal tambah bahan ajar), `FormPageTemplate.tsx` | Kontainer Card bagian form (`bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4`) dengan `title` (`<h3>` wajib), `description` opsional, dan `children` berisi grup `FormField` (Part 10.8). |
| **`FormField`** (`FormField.tsx`) | `ClassDetail.tsx` | Pembungkus satu field form yang menyatukan `<label htmlFor={id}>` terstandar, penanda `required`, slot kontrol input (`input` / `select` / `textarea`), teks petunjuk batasan (`hint` via `aria-describedby`), dan pesan validasi (`error` via `role="alert"`). |
| **`Button`** (`Button.tsx`) | `Login.tsx`, `ClassDetail.tsx`, `StateViews.tsx`, `FormPageTemplate.tsx` | Kontrol tombol semantik (`variant: 'primary' \| 'secondary' \| 'danger' \| 'ghost'`, `loading?: boolean`) dengan tinggi minimal **44px** (`min-h-[44px]`), `cursor-pointer`, `disabled:cursor-not-allowed`, dan ring `focus-visible:ring-2 focus-visible:ring-emerald-600`. |
| **`LoadingState` / `EmptyState` / `ErrorState`** (`StateViews.tsx`) | `App.tsx`, `DashboardPageTemplate.tsx`, `ListPageTemplate.tsx`, `DetailPageTemplate.tsx`, `ClassDetail.tsx` | Komponen standar tiga kondisi data (R-27): `LoadingState` (`message`), `EmptyState` (`title`, `description`, `action` opsional), dan `ErrorState` (`message`, `onRetry` untuk memuat ulang data) dengan kontras teks minimal `text-slate-600`. |
| **`ModalDialog`** (`ModalDialog.tsx`) | `ClassDetail.tsx` | Dialog overlay aksesibel (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, penutupan via tombol `Escape` dan tombol tutup eksplisit `min-w-[44px] min-h-[44px]`, penguncian scroll latar) berlatar `bg-slate-50` untuk menampung `FormSectionCard`. |

---

## 4. Elemen yang Dilarang Diduplikasi

1. **Header / Navigasi Atas & Footer Aplikasi**: Sudah ditangani `Navbar` dan `AppShell`.
2. **Label & Input Form per Rute**: Dilarang membuat komponen label atau gaya input berbeda-beda di setiap halaman; gunakan satu standar `FormSectionCard` + `FormField`.
3. **Badge Status dengan Kelas Warna Mentah Acak**: Setelah `StatusBadge` diekstrak, seluruh status tugas (`Sudah Dikumpulkan`, `Belum Dikumpulkan`), kode kelas, dan status kehadiran (`Hadir`, `Izin`, `Sakit`, `Alpa`) wajib memakai `StatusBadge`.
4. **Instance Pemanggil HTTP**: Dilarang membuat `axios.create` atau `fetch('/api/...')` baru di dalam komponen halaman; tambahkan fungsi endpoint ber-tipe di `src/client/services/api.ts`.

---

## 4. Komponen Laporan & Grafik

### `LaporanCharts` (`src/client/components/LaporanCharts.tsx`)
- **Tanggung Jawab**: Kumpulan komponen grafik ringkas untuk dashboard panel, dibangun **murni dengan SVG dan CSS** — tanpa library chart eksternal, sehingga ukuran bundle tetap ringan dan tidak menambah dependensi baru.
- **Alasan tidak memakai library**: grafik dashboard bersifat ringkasan (bukan analitik interaktif), dan palette harus mengikuti warna aplikasi masing-masing.
- **Komponen yang tersedia**:
  | Komponen | Kegunaan |
  | --- | --- |
  | `ReportCard` | Kartu pembungkus laporan (judul + subjudul + aksi opsional) |
  | `MetricTile` | Kartu metrik angka besar dengan ikon & aksen warna |
  | `DonutChart` | Proporsi antar kategori (mis. status surat, kondisi fasilitas) |
  | `BarChart` | Perbandingan kategori dengan bar horizontal |
  | `ColumnChart` | Tren per periode dengan kolom vertikal |
  | `TrendChart` | Tren waktu dengan area lembut (SVG path) |
  | `StackedBar` | Komposisi satu batang bertingkat |
  | `GaugeRing` | Capaian persentase tunggal berbentuk cincin |
  | `ActivityFeed` | Daftar kejadian terbaru bersusun waktu |
- **Aksesibilitas**: Setiap grafik memakai `role="img"` + `aria-label` yang merangkum datanya; nilai juga tetap ditampilkan sebagai teks sehingga tidak bergantung pada warna saja.
- **Aturan Pemakaian**: Dashboard setiap aplikasi **wajib** menampilkan laporan/grafik ringkas untuk tiap menu, dan **dilarang** menyertakan panel aksi cepat (tombol pintas tambah/input) di dashboard. Navigasi tetap melalui sidebar.

---

## 5. Komponen Landing Page

### `TentangPlatform` (`src/client/components/TentangPlatform.tsx`)
- **Tanggung Jawab**: Seksi **Tentang Platform** pada halaman landing dengan pola baku ONE UNUSU: **teks di kiri, gambar di kanan**.
- **Komposisi kiri**: eyebrow kecil, judul seksi, dua paragraf penjelas, dan tiga poin centang.
- **Komposisi kanan**: gambar potret dengan latar gradien aksen membulat.
- **Props**:
  - `id?`: anchor & `aria-labelledby` id (default `tentang`)
  - `eyebrow?`: label kecil di atas judul
  - `title`: judul seksi
  - `paragraphs?`: array paragraf
  - `bullets?`: array poin centang
  - `portraitSrc?`: path gambar potret utama
  - `fallbackSrc?`: path gambar cadangan
  - `imageAlt?`: alt text gambar
  - `accentBg? / accentBorder? / bulletBg? / eyebrowClass?`: penyesuaian warna aksen
- **Pola Aset Bertahap**: Komponen mencoba `portraitSrc` lebih dulu; bila aset potret belum tersedia (`img.onError`), komponen otomatis memakai `fallbackSrc` sehingga halaman tidak pernah menampilkan gambar rusak. Begitu file potret ditambahkan ke `public/assets/`, tampilan langsung berganti **tanpa mengubah kode**.
- **Aturan Aset**: Dilarang memakai gambar yang memuat branding institusi lain. Foto suasana kampus resmi UNUSU (`slider1.jpg`) adalah fallback yang sah.
