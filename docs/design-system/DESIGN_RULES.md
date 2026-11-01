# Aturan Sistem Desain (DESIGN_RULES): LMS UNUSU

Dokumen ini merangkum arah visual, aturan tata letak, kualitas interaksi, dan standar anti-slop untuk antarmuka `lms-unusu` berdasarkan implementasi kode aktual dan standar kualitas produk.

---

## 1. Karakter Produk & Mode UX

- **Identitas Produk**: Ruang Belajar Digital Universitas Nahdlatul Ulama Sumatera Utara (`LMS UNUSU`), ruang kerja akademik harian bagi mahasiswa dan dosen.
- **Mode UX Utama (`impeccable`)**: **Operate** (dengan sub-mode **Read** pada daftar materi dan petunjuk tugas). Keberhasilan pengguna diukur dari seberapa cepat mereka menemukan jadwal kelas, mengunduh materi pertemuan, mengumpulkan tugas sebelum tenggat, dan memeriksa nilai tanpa hambatan visual.
- **Kalibrasi Liveliness Dials (`anti-slop`)**:
  - **ENERGY: 1 (Calm & Focused)**: Permukaan kerja bersih berlatar `slate-50` dengan kartu `white` dan aksen hijau institusional UNUSU yang terukur.
  - **RHYTHM: 2 (Structured with Clear Focal Hierarchy)**: Ritme grid dan daftar konsisten antar halaman kerja, dengan satu titik fokus utama per layar (misal banner konteks semester aktif di Dashboard atau header identitas mata kuliah di Detail Kelas).
  - **MOTION: 1 (Functional Micro-feedback)**: Transisi warna/border halus (`transition`, `transition-all`) pada hover/focus serta indikator putar (`animate-spin`) hanya saat memuat sesi/data; menghormati `prefers-reduced-motion`.

---

## 2. Prinsip Arsitektur Visual

1. **Satu Kanvas, Permukaan Berjenjang Jelas**:
   - Latar belakang aplikasi (`body` & `AppShell`) menggunakan `bg-slate-50` (`#F8FAFC`) dengan teks utama `text-slate-900` (`#0F172A`).
   - Kontainer konten (kartu kelas, header kelas, daftar materi/tugas, kartu bagian form) menggunakan `bg-white` (`#FFFFFF`) dengan batas tegas `border border-slate-200` (atau `border-slate-200/90`).
   - Bayangan (`shadow`) hanya dipakai tipis untuk penanda elevasi kartu aktif/hover atau tinggi pada elemen mengambang nyata seperti modal dialog (`shadow-2xl`). Dilarang memberikan bayangan tebal atau efek melayang pada seluruh elemen statis sekaligus.
2. **Lebar Kontainer & Grid Konsisten**:
   - Seluruh halaman di dalam `AppShell` menggunakan batas lebar maksimum `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` dengan padding vertikal halaman `py-8`.
   - Jarak vertikal antar blok utama halaman menggunakan `space-y-6` atau `space-y-8`.
   - Grid daftar kartu kelas menggunakan pola responsif `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.
3. **Aksen Tunggal Bermakna**:
   - Hijau zamrud/UNUSU (`emerald-700` / `lms-green`) dikhususkan untuk aksi primer (`Masuk Kelas`, `Tambah Materi / Tugas`, `Kumpulkan Jawaban`, `Simpan`), tab aktif, dan penanda identitas institusi.
   - Kuning/emas (`yellow-300` / `lms-gold` / `amber`) hanya dipakai sebagai aksen sekunder terbatas (ikon buku pada mark logo, badge konteks semester di atas latar hijau gelap, atau status tugas yang belum dikumpulkan). Dilarang menyebar warna aksen ke seluruh border dan latar halaman.

---

## 3. Aturan Tata Letak Formulir (Wajib, Part 10.8)

Setiap formulir di halaman penuh maupun di dalam panel/modal wajib mematuhi **Form Section Layout Rule**:

1. **Pembungkusan Card per Kelompok Logis**:
   - Setiap kelompok field yang memiliki satu tujuan logis (contoh: *Informasi Bahan Ajar*, *Lampiran & Tenggat Waktu*, *Pengumpulan Jawaban Tugas*, *Penilaian Dosen*) wajib berada di dalam kontainer Card (`bg-white rounded-2xl border border-slate-200 p-6`).
   - Setiap Card bagian wajib diawali dengan heading bagian yang terlihat jelas (`h2` atau `h3` berukuran `text-base font-bold text-slate-900`, opsional disertai deskripsi singkat `text-xs text-slate-500`).
2. **Larangan Field Tanpa Card**:
   - Dilarang merender `<label>` dan kontrol input langsung di atas latar `bg-slate-50`.
   - Dilarang menggabungkan seluruh field berbeda konteks ke dalam satu Card raksasa tanpa pemisahan kelompok ber-heading.
   - *Catatan Audit Kode Eksisting*: Form pengumpulan tugas inline dan form modal tambah resource di `src/client/pages/ClassDetail.tsx` saat ini belum sepenuhnya memakai komponen `FormSectionCard` terstandar. Setiap pekerjaan UI baru atau refaktor pada form wajib menerapkan pembungkusan Card ber-heading ini.
3. **Label & Pesan Bantuan**:
   - Setiap input, select, dan textarea wajib memiliki `<label>` eksplisit yang terhubung (`htmlFor` + `id`) di atas field, bukan hanya mengandalkan `placeholder`.
   - Batasan format (misal tipe berkas `.pdf`/`.zip`, rentang pertemuan `1-16`, atau batas ukuran file) ditampilkan tetap di dekat field dan dihubungkan dengan `aria-describedby`.
4. **Baris Aksi Formulir**:
   - Tombol `Batal` (sekunder) dan tombol `Simpan`/`Kirim` (primer) diletakkan di luar bagian bawah kelompok Card atau pada footer kontainer yang dipisahkan dengan `border-t border-slate-200 pt-4`, rata kanan pada desktop dan mudah dijangkau ibu jari pada mobile.

---

## 4. Ketahanan State UI (Loading, Empty, Error)

Setiap tampilan yang bergantung pada data API wajib merancang ketiga kondisi non-ideal berikut secara utuh (bukan sekadar layar kosong atau `console.error`):

1. **Loading State**:
   - Tampilkan indikator pemuatan yang jelas di dalam struktur kontainer halaman (teks status spesifik seperti `"Memuat daftar kelas..."` disertai spinner `Loader2` atau kerangka kartu yang proporsional) sehingga layout tidak melompat tajam (CLS).
2. **Empty State**:
   - Gunakan kartu `bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center` dengan pesan spesifik konteks (contoh: `"Belum ada modul materi yang diunggah dosen untuk kelas ini."`).
   - Jika peran pengguna memiliki hak membuat data (misal `dosen` pada tab materi kosong), sediakan tombol aksi langsung (`Tambah Materi`) di dalam empty state tersebut.
3. **Error State**:
   - Jika pemanggilan API gagal, tampilkan pesan kegagalan yang jujur dan mudah dipahami dalam Bahasa Indonesia beserta tombol `Coba Lagi` yang memanggil ulang fungsi pemuat data. Dilarang menelan error hanya di `console.error` sehingga pengguna mengira data kosong.

---

## 5. Responsivitas, Aksesibilitas & Interaksi

1. **Mobile-First & Tap Target**:
   - Seluruh halaman harus bebas dari horizontal overflow dari lebar layar `360px` hingga desktop lebar (`1440px+`).
   - Setiap tombol, tautan navigasi, tab, dan kontrol input wajib memiliki tinggi/area klik minimal **44px** (`min-h-[44px]` atau kombinasi padding yang setara, misal `py-2.5 px-4` dengan ukuran teks memadai). *Catatan Audit*: Beberapa tombol kecil eksisting menggunakan `py-1.5` atau `p-2` (~32px); saat komponen disentuh atau diekstrak ke komponen bersama, tingkatkan ke minimal 44px.
2. **Navigasi Keyboard & Fokus**:
   - Urutan `Tab` harus mengikuti urutan baca visual dari kiri-ke-kanan, atas-ke-bawah.
   - Semua kontrol interaktif menggunakan elemen HTML semantik asli (`<button type="button">` untuk aksi, `<Link>` / `<a href>` untuk navigasi). Dilarang memasang `onClick` pada `<div>` atau `<span>`.
   - Setiap kontrol wajib menampilkan ring fokus yang jelas saat diakses lewat keyboard (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2`).
   - Modal/dialog wajib memiliki `role="dialog"`, `aria-modal="true"`, judul terhubung `aria-labelledby`, serta dapat ditutup dengan tombol `Escape`.
3. **Kontras Warna (WCAG AA)**:
   - Teks isi dan metadata sekunder di atas permukaan putih/abu terang harus memakai minimal `text-slate-600` (`#475569`, rasio > 7:1 terhadap putih dan > 6.5:1 terhadap `slate-50`) atau `text-slate-500` (`#64748B`, rasio ~4.6:1 terhadap putih).
   - Hindari penggunaan `text-slate-400` (`#94A3B8`, rasio ~2.5:1) untuk teks informasi penting, status, atau pesan loading/empty; batasi `slate-400` hanya untuk ikon dekoratif non-teks atau elemen `disabled`.

---

## 6. Larangan Anti-Slop & Standar Copywriting UI

1. **Elemen Visual Terlarang**:
   - Gradien biru-ungu/neon generik, efek glow berlapis, atau blob latar dekoratif. (Gradien hanya diizinkan jika memiliki alasan hierarki/identitas merek tertulis, seperti permukaan hijau tua `emerald-800` ke `teal-800` pada banner konteks semester Dashboard).
   - Tumpukan `backdrop-blur` (glassmorphism) pada navbar, kartu, dan modal sekaligus.
   - Ikon dekoratif generik tanpa kaitan makna akademik (*Sparkle*, *Magic*, *Rocket*, *Robot*). Gunakan ikon `lucide-react` hanya yang merepresentasikan objek nyata (`BookOpen`, `Calendar`, `MapPin`, `Upload`, `FileText`, `LogOut`, `ArrowLeft`).
   - Angka statistik karangan, persentase kehadiran palsu, atau placeholder nama pengguna hardcoded apabila data sesi `user` dari `AuthContext` sudah tersedia.
2. **Standar Teks Antarmuka (Human Copywriting)**:
   - Dilarang memakai karakter em-dash (`—`) di seluruh copy UI, judul, footer, maupun pesan bantuan.
   - Gunakan label tombol berorientasi tindakan spesifik: `Masuk via ONE UNUSU`, `Masuk Kelas`, `Unduh Materi`, `Kumpulkan Jawaban`, `Simpan Materi`, `Kembali ke Daftar Kelas`. Dilarang memakai label kabur seperti `Mulai Sekarang`, `Pelajari Lebih Lanjut`, atau `Klik di Sini`.
   - Tulis pesan dengan nada profesional-akademik yang hangat, ringkas, dan langsung pada pokok informasi.

---

## 7. Daftar Periksa Sebelum Menyelesaikan Tugas UI (Definition of Done)

Sebelum menutup pekerjaan antarmuka apa pun, pastikan:
- [ ] Dokumen `DESIGN_RULES.md`, `COLORS.md`, `TYPOGRAPHY.md`, `COMPONENTS.md`, dan `PAGE_TEMPLATES.md` telah diperiksa.
- [ ] Halaman menggunakan template dan komponen bersama yang sesuai tanpa menduplikasi layout.
- [ ] Seluruh grup field form dibungkus dalam Card ber-heading sesuai aturan Part 10.8.
- [ ] State `loading`, `empty`, dan `error` ketiganya ditangani dan diuji.
- [ ] Kontras warna memenuhi WCAG AA, tap target minimal 44px, tidak ada horizontal overflow di mobile, dan fokus keyboard + `Escape` berfungsi.
- [ ] Tidak ada tombol/link mati, tidak ada em-dash (`—`), dan tidak ada data fiktif yang disamarkan sebagai data nyata.
- [ ] `npx tsc --noEmit` dan `npm run build` dijalankan dengan hasil nyata yang dilaporkan jujur, serta `CHANGELOG.md` diperbarui.
