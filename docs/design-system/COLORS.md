# Sistem Warna (COLORS): LMS UNUSU

Dokumen ini mencatat token warna dan aturan penggunaannya berdasarkan `tailwind.config.js` serta pemakaian aktual di `src/client/`.

---

## 1. Token Kustom Institusi (`tailwind.config.js`)

Token khusus merek UNUSU telah didefinisikan pada namespace `lms` di `tailwind.config.js`:

| Token Tailwind | Nilai HEX | Peran Desain |
|---|---|---|
| `lms-green` (`DEFAULT`) | `#0A5C36` | Hijau institusional utama UNUSU |
| `lms-green-dark` | `#064226` | Varian tekan/hover gelap pada latar atau tombol hijau institusi |
| `lms-green-light` | `#117A4A` | Varian aksen hijau lebih terang |
| `lms-green-50` | `#F0FDF4` | Latar permukaan tint hijau lembut |
| `lms-green-100` | `#DCFCE7` | Border atau latar badge hijau muda |
| `lms-gold` | `#D4AF37` | Aksen emas institusional UNUSU (sekunder/sorotan terbatas) |

> **Catatan Konsistensi Kode Aktual**: Meskipun token `lms-green` dan `lms-gold` sudah terdaftar di `tailwind.config.js`, seluruh komponen halaman eksisting (`Navbar.tsx`, `Login.tsx`, `SsoCallback.tsx`, `Dashboard.tsx`, `ClassDetail.tsx`, `Tasks.tsx`) saat ini menggunakan skala bawaan Tailwind **`emerald`** dan **`yellow`/`amber`**. Tabel di Bagian 2 memetakan palet aktif yang benar-benar dirender saat ini beserta aturan penyelarasan ke depan.

---

## 2. Palet Fungsional Aktif di Kode (`src/client/`)

### 2.1 Permukaan & Netral (`slate`)

| Kelas Tailwind | Nilai HEX | Penggunaan Aktual & Aturan |
|---|---|---|
| `bg-slate-50` | `#F8FAFC` | Kanvas utama aplikasi (`body`, `AppShell`, footer kartu kelas, kotak sub-area) |
| `bg-white` | `#FFFFFF` | Permukaan utama kartu, `Navbar`, modal, kartu login, dan kontainer bagian form |
| `bg-slate-950` | `#020617` | Latar penuh khusus halaman autentikasi mandiri (`LoginPage`, `SsoCallbackPage`) untuk memusatkan fokus pada kartu SSO |
| `bg-slate-100` | `#F1F5F9` | Tombol aksi sekunder (`Unduh Materi`, `Batal`) dan badge penghitung netral (`Kelas Terdaftar`) |
| `border-slate-200` | `#E2E8F0` | Garis batas utama kartu, `Navbar`, footer, tab bar, dan border input form |
| `border-slate-100` | `#F1F5F9` | Pemisah internal halus di dalam satu kartu (antara isi kartu dan baris metadata/aksi bawah) |
| `text-slate-900` | `#0F172A` | Teks judul utama (`h1`, `h2`, `h3`) dan nama platform |
| `text-slate-800` | `#1E293B` | Nama pengguna aktif, angka progres utama, dan teks penekanan di dalam kartu |
| `text-slate-700` | `#334155` | Label tombol sekunder dan tanggal tenggat standar |
| `text-slate-600` | `#475569` | Teks isi sekunder, jadwal/ruangan, label field form, dan tautan navigasi non-aktif |
| `text-slate-500` | `#64748B` | Subjudul halaman, deskripsi kartu, keterangan NIM/NIDN, dan teks footer |

### 2.2 Warna Aksi Primer & Identitas (`emerald`)

| Kelas Tailwind | Nilai HEX | Penggunaan Aktual & Aturan |
|---|---|---|
| `bg-emerald-700` | `#047857` | Tombol aksi primer (`Masuk via ONE UNUSU`, `Tambah Materi / Tugas`, `Kumpulkan Jawaban`, `Simpan`), ikon kotak brand di `Navbar`, dan garis aktif tab (`border-emerald-700`) |
| `hover:bg-emerald-800` | `#065F46` | State hover/active untuk seluruh tombol aksi primer `bg-emerald-700` |
| `text-emerald-700` | `#047857` | Tautan aksi primer teks (`Masuk Kelas`), menu navigasi aktif, dan kata `UNUSU` pada wordmark |
| `text-emerald-800` | `#065F46` | Teks di atas permukaan `bg-emerald-50` atau `bg-emerald-100` (badge kode kelas, badge peran, nilai dosen, kotak info SSO) agar kontras memenuhi WCAG AA |
| `bg-emerald-50` | `#ECFDF5` | Latar menu navigasi aktif, latar ikon materi, badge kode mata kuliah, dan kotak informasi SSO |
| `bg-emerald-100` | `#D1FAE5` | Avatar inisial pengguna di `Navbar` dan border halus (`border-emerald-100`) pada permukaan `emerald-50` |
| `selection:bg-emerald-600` | `#059669` | Sorotan seleksi teks global pada `body` (dengan `selection:text-white`) |

### 2.3 Warna Semantik & Status

| Makna Status | Latar | Teks / Ikon | Border | Konteks Pemakaian di LMS |
|---|---|---|---|---|
| **Terkumpul / Info** | `bg-blue-50` (`#EFF6FF`) | `text-blue-700` (`#1D4ED8`) | `border-blue-200` | Status tugas `"Sudah Dikumpulkan"` pada `Tasks.tsx` |
| **Menunggu / Perhatian** | `bg-amber-50` (`#FFFBEB`) / `bg-yellow-50` | `text-amber-700` (`#B45309`) / `text-yellow-700` | `border-amber-200` / `border-yellow-200` | Status `"Belum Dikumpulkan"` dan label `"Tugas Pertemuan N"` |
| **Bahaya / Tenggat / Error** | `bg-rose-50` (`#FFF1F2`) | `text-rose-600` (`#E11D48`) / `text-rose-700` | `border-rose-200` | Pesan gagal verifikasi SSO, tanggal tenggat mendesak, hover tombol `Keluar` (`hover:text-rose-600 hover:bg-rose-50`) |
| **Aksen Kontras Gelap** | `bg-white/20` (di atas `emerald-800`) | `text-yellow-300` (`#FDE047`) | - | Ikon `BookOpen` di dalam kotak `bg-emerald-700` dan pill semester aktif di atas banner hijau tua |

---

## 3. Aturan Kontras & Kepatuhan WCAG AA

1. **Rasio Kontras Wajib**:
   - Teks ukuran reguler (`< 18px` bold atau `< 24px` reguler) wajib memiliki rasio kontras minimal **4.5:1** terhadap latar belakangnya.
   - Teks ukuran besar (`>= 18px` bold atau `>= 24px` reguler) dan ikon fungsional wajib memiliki rasio kontras minimal **3:1**.
2. **Kombinasi yang Disetujui**:
   - `text-white` di atas `bg-emerald-700` (`#047857`) -> rasio **5.48:1** (Lulus WCAG AA untuk teks tombol ukuran berapa pun). *Jangan gunakan `bg-emerald-500` atau `bg-emerald-600` dengan teks putih kecil karena rasionya di bawah 4.5:1.*
   - `text-emerald-800` (`#065F46`) di atas `bg-emerald-50` (`#ECFDF5`) -> rasio **7.35:1** (Lulus AAA).
   - `text-slate-600` (`#475569`) di atas `bg-white` -> rasio **7.58:1** (Lulus AAA).
   - `text-slate-500` (`#64748B`) di atas `bg-white` -> rasio **4.76:1** (Lulus AA).
3. **Koreksi Kontras yang Wajib Diperhatikan Saat Menyentuh Komponen**:
   - `text-slate-400` (`#94A3B8`) di atas `bg-white` hanya menghasilkan rasio **2.56:1** (Gagal WCAG AA). Di kode eksisting, `text-slate-400` masih dipakai pada teks `"Memuat data kelas..."`, empty state, label `"Tenggat Waktu:"`, dan label `"Pertemuan N"`. Saat memodifikasi atau mengekstrak komponen tersebut, naikkan minimal ke **`text-slate-500`** (di atas `bg-white`) atau **`text-slate-600`** (di atas `bg-slate-50`, karena `slate-500` di atas `slate-50` turun tipis ke ~4.53:1).
   - Pada badge kuning (`ClassDetail.tsx` baris 210: `text-yellow-600` di atas `bg-yellow-50`), rasio `yellow-600` (`#CA8A04`) adalah ~2.9:1. Gunakan **`text-amber-800` (`#92400E`) di atas `bg-amber-50`** (rasio > 7:1) untuk setiap badge peringatan/tugas baru atau yang direfaktor.

---

## 4. Aturan Penggunaan Gradien & Batas Palet

1. **Batas Warna Aktif (R-29)**: Setiap tampilan dibatasi pada netral `slate` + 1 warna inti (`emerald`) + maksimal 1 warna aksen/status kontekstual sesuai kebutuhan data.
2. **Aturan Gradien (R-01)**:
   - Gradien **dilarang** digunakan pada tombol, teks, kartu biasa, atau latar belakang halaman secara penuh.
   - Satu-satunya penggunaan gradien di kode aktual adalah banner sambutan semester aktif pada `Dashboard.tsx` (`bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800`), dengan alasan fungsional tertulis: membedakan blok konteks semester aktif dari grid kartu kelas `bg-white` di bawahnya sekaligus menjaga kontras > 5.5:1 untuk teks `text-white`. Penggunaan ini tidak boleh diduplikasi ke halaman tabel, form, atau detail kelas.
3. **Tema (Light Mode)**: Aplikasi saat ini hanya menyajikan **Light Mode** (`bg-slate-50` / `bg-white`), kecuali latar fokus `bg-slate-950` pada kartu pintu masuk SSO (`/login` dan `/sso/callback`). Dilarang menambahkan potongan kelas `dark:` setengah jadi tanpa implementasi tema gelap yang utuh dan teruji di seluruh komponen.
