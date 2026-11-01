# Tipografi (TYPOGRAPHY): LMS UNUSU

Dokumen ini mendefinisikan keluarga huruf, skala ukuran, ketebalan, dan aturan keterbacaan pada `lms-unusu` berdasarkan konfigurasi aktual di `index.html` dan komponen React di `src/client/`.

---

## 1. Keluarga Huruf (Font Family)

- **Font Tunggal Antarmuka**: **`Plus Jakarta Sans`** (dimuat dari Google Fonts pada `index.html` dengan bobot `300, 400, 500, 600, 700, 800`, `display=swap`).
- **Alasan Pemilihan**: Dirancang dengan x-height tinggi dan bentuk geometris-humanis yang jernih untuk pembacaan antarmuka Bahasa Indonesia padat informasi (kode mata kuliah, jadwal, tabel nilai, dan deskripsi tugas) baik di layar laptop maupun ponsel.
- **Implementasi Global**: Dipasang pada elemen `<body>` di `index.html` melalui `font-['Plus_Jakarta_Sans',sans-serif] antialiased`.
- **Catatan Konfigurasi Tailwind**: Saat ini `AppShell` di `src/client/App.tsx` memiliki kelas `font-sans` yang secara default di Tailwind mengacu pada system sans-serif stack kecuali `theme.extend.fontFamily.sans` diset ke `['Plus Jakarta Sans', ...]` di `tailwind.config.js`. Saat memperbarui konfigurasi styling di tugas UI berikutnya, selaraskan `fontFamily.sans` di `tailwind.config.js` agar `font-sans` selalu mewarisi `Plus Jakarta Sans`.
- **Aturan Monospace**: Huruf monospace dilarang dipakai untuk judul, badge, atau label dekoratif. Gunakan monospace (`font-mono`) hanya di dalam elemen `<code>` atau `<pre>` jika konten materi/tugas menampilkan potongan kode pemrograman nyata.

---

## 2. Skala Tipografi & Hierarki Peran

Tabel berikut mendokumentasikan skala tipografi yang dipakai pada layar aplikasi (mode *Operate* & *Read*):

| Peran Elemen | Tag HTML | Kelas Tailwind Standar | Ukuran / Line-Height | Aturan Pemakaian |
|---|---|---|---|---|
| **Judul Halaman / Mata Kuliah** | `h1` | `text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight` | `24px` (mobile) -> `30px` (desktop) | Tepat satu `h1` per halaman (judul mata kuliah di `ClassDetail`, sambutan di `Dashboard`, judul halaman di `Tasks` & `Login`). |
| **Judul Bagian Halaman** | `h2` | `text-xl font-bold text-slate-900` | `20px` / `28px` | Pembuka seksi utama halaman (contoh: `"Daftar Kelas Perkuliahan"`). |
| **Judul Kartu / Heading Card Form** | `h3` | `text-base sm:text-lg font-bold text-slate-900` | `16px` - `18px` / `24px` - `28px` | Nama mata kuliah pada kartu kelas, judul tugas, judul modal, dan **section heading wajib pada setiap Card bagian form**. |
| **Navigasi & Tab Aktif** | `a` / `button` | `text-xs sm:text-sm font-semibold` (Nav) / `text-sm font-bold` (Tab) | `12px` - `14px` / `20px` | Tautan menu di `Navbar` dan tombol tab di `ClassDetail`. |
| **Teks Isi & Petunjuk** | `p` | `text-sm text-slate-600 leading-relaxed` | `14px` / `22.75px` | Pesan status halaman, petunjuk tugas, dan deskripsi informasi utama. |
| **Label Field & Input Form** | `label`, `input`, `select`, `textarea` | Label: `text-xs sm:text-sm font-semibold text-slate-700`<br>Input: `text-sm text-slate-900` *(min `16px` / `text-base` di mobile bila perlu mencegah auto-zoom iOS)* | `12px` - `14px` | Label berada tepat di atas field dengan `mb-1.5`. Hindari input berukuran terlalu kecil (`text-xs`) pada form baru agar nyaman dibaca saat mengetik jawaban panjang. |
| **Label Tombol Aksi** | `button` / `a` | `text-xs sm:text-sm font-bold` | `12px` - `14px` | Teks tombol aksi primer dan sekunder. Gunakan sentence case / Title Case singkat tanpa huruf kapital semua (`UPPERCASE`). |
| **Metadata & Badge Konteks** | `span`, `p` | `text-xs font-medium` atau `text-xs font-bold` | `12px` / `16px` | Kode mata kuliah (`SI-301 • Reguler A`), jumlah SKS, jadwal, ruangan, tanggal tenggat, dan badge status pengumpulan. |

---

## 3. Aturan Keterbacaan & Batasan Ukuran Mikro

1. **Batas Minimum Ukuran Teks**:
   - Ukuran `12px` (`text-xs`) adalah batas bawah untuk metadata penting (jadwal, SKS, tenggat waktu, badge status).
   - Di kode eksisting masih terdapat pemakaian `text-[10px]` dan `text-[11px]` (pada tagline `"Ruang Belajar Digital"` serta NIM/NIDN di `Navbar.tsx`, dan label `"Nilai Dosen"` di `Tasks.tsx`). Dilarang menambahkan teks baru di bawah `12px` (`text-xs`); untuk komponen baru atau yang direfaktor, utamakan minimal `text-xs` (`12px`) agar tetap terbaca jelas oleh semua pengguna.
2. **Hierarki Heading Tanpa Lompatan**:
   - Setiap layar wajib memiliki satu `<h1>` yang menjelaskan halaman saat ini.
   - Jangan melompati level heading secara sembarangan (misal dari `<h1>` langsung ke `<h4>` tanpa `<h2>`/`<h3>`).
3. **Panjang Baris (Measure) & Pemotongan Teks**:
   - Untuk deskripsi tugas atau petunjuk pembelajaran panjang, batasi lebar baca dengan `max-w-2xl` atau `max-w-prose` (`60-75` karakter per baris) dan `leading-relaxed`.
   - Pemotongan baris (`line-clamp-2`) hanya boleh dipakai pada kartu ringkasan di `Dashboard` yang memiliki halaman detail penuh (`ClassDetail`). Di halaman detail (`ClassDetail`), deskripsi materi dan instruksi soal tugas dilarang dipotong dengan `line-clamp` agar mahasiswa tidak kehilangan informasi pengerjaan tugas.
4. **Larangan Tipografi AI-Slop**:
   - Dilarang memakai eyebrow label `UPPERCASE` kecil dengan `tracking-widest` di atas setiap judul seksi. *(Pengecualian tunggal yang ada di kode saat ini hanyalah teks kode peran SSO `uppercase` di dalam badge `Navbar` dan pill semester aktif di banner `Dashboard`; jangan memperluas pola ini ke judul kartu atau seksi halaman).*
   - Dilarang memberi warna aksen, miring (*italic*), atau garis bawah pada satu kata di tengah kalimat judul.
   - Untuk deretan angka yang dibandingkan vertikal (nilai tugas, skor `0-100`, rekap pertemuan `4/16`), gunakan `tabular-nums` agar digit sejajar rapi.
