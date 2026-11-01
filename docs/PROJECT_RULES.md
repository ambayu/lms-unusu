# Aturan Global Proyek (PROJECT_RULES): LMS UNUSU

Dokumen ini menetapkan aturan tata kelola teknis, struktur antarmuka, dan batas keselamatan kerja untuk seluruh pengembangan di repositori `lms-unusu`.

---

## 1. Hierarki Aturan

Jika ditemukan perbedaan pedoman antar dokumen, urutan prioritas dari tertinggi ke terendah adalah:
1. Instruksi sesi agen / `AGENTS.md` (bila tersedia di root)
2. `docs/PROJECT_RULES.md` (dokumen ini)
3. `docs/design-system/*` (`DESIGN_RULES.md`, `COLORS.md`, `TYPOGRAPHY.md`, `COMPONENTS.md`, `PAGE_TEMPLATES.md`)
4. `RULES.md` tingkat modul/rute (saat dibuat untuk fitur spesifik)
5. Konvensi lokal pada berkas kode terkait

Jika terjadi konflik aturan antar-level, hentikan asumsi sepihak, sebutkan kedua aturan yang berkonflik secara spesifik, dan minta klarifikasi user sebelum mengubah kode.

---

## 2. Tata Kelola Dokumentasi (Read Before You Touch, Write After You Change)

1. **Baca Sebelum Mengubah**: Sebelum menyentuh kode, periksa struktur berkas aktual di `src/client/` dan `src/server/`, baca `docs/PROJECT_RULES.md`, dokumen relevan di `docs/design-system/*`, serta `CHANGELOG.md`. Jangan mengandalkan path usang di `README.md` root (`client/` atau `server/` terpisah) tanpa memeriksa pohon direktori aktual.
2. **Perbarui Setelah Mengubah**: Setiap perubahan kode wajib diikuti pembaruan pada `CHANGELOG.md` dengan format tanggal ISO (`YYYY-MM-DD`) dan deskripsi faktual atas apa yang benar-benar diubah. Jika perubahan membentuk pola komponen, template, atau aturan modul baru, perbarui dokumen di `docs/design-system/*` atau `RULES.md` modul terkait.
3. **Verifikasi Jujur**: Jangan pernah mengklaim build, typecheck, atau pengujian berhasil tanpa menjalankannya secara nyata. Catat hasil pemeriksaan aktual; jika suatu pemeriksaan terhalang environment, laporkan apa adanya.

---

## 3. Tata Kelola Template Halaman & Komponen Bersama (Build Once, Reuse Everywhere)

> Every page must use the correct page template and shared components. Dashboard must use its own dashboard template. Duplicating UI structure that already exists in a shared template is forbidden.

1. **Kewajiban Reuse**: Setiap halaman wajib menggunakan template halaman yang sesuai peruntukannya (lihat `docs/design-system/PAGE_TEMPLATES.md`) dan komponen bersama yang terdaftar di `docs/design-system/COMPONENTS.md`.
2. **Pemisahan Dashboard**: Halaman `Dashboard` memiliki tata letak dan template tersendiri. Dashboard dilarang memakai layout halaman tabel CRUD biasa, dan halaman non-dashboard dilarang menyalin banner atau struktur khusus dashboard.
3. **Halaman sebagai Konfigurasi**: Komponen halaman di `src/client/pages/` hanya bertanggung jawab atas pengambilan data, konfigurasi kolom/item, event handler, dan aturan hak akses peran (`mahasiswa` vs `dosen`). Kerangka visual utama harus bersumber dari template dan komponen bersama.
4. **Migrasi Inkremental**: Kode eksisting saat bootstrap masih memiliki beberapa struktur UI inline di masing-masing halaman (`Dashboard.tsx`, `ClassDetail.tsx`, `Tasks.tsx`). Saat mengerjakan fitur atau perbaikan pada halaman tersebut, ekstrak dan migrasikan elemen berulang ke komponen/template bersama secara bertahap tanpa merusak kontrak API atau perilaku bisnis yang sudah berjalan.

---

## 4. Aturan Tata Letak Bagian Formulir (Form Section Layout Rule, Part 10.8)

1. **Wajib Bungkus dalam Card Ber-Heading**: Setiap kelompok field form yang logis wajib dibungkus di dalam kontainer Card yang memiliki heading bagian (section heading) yang jelas di bagian atas.
2. **Larangan Input Telanjang**: Dilarang merender `<label>`, `<input>`, `<select>`, atau `<textarea>` langsung di atas latar belakang halaman (`bg-slate-50`) maupun menumpuk seluruh field dari kelompok logis berbeda ke dalam satu form panjang tanpa pemisahan Card ber-heading.
3. **Kontras Permukaan**: Latar luar halaman atau kontainer induk (`bg-slate-50`) harus tampak berbeda secara visual dari permukaan Card form (`bg-white` dengan border `border-slate-200`), sehingga batas area input terbaca tegas.
4. **Posisi Tombol Aksi**: Tombol aksi form (`Simpan`, `Kirim`, `Batal`) ditempatkan di luar dan di bawah rangkaian Card bagian, atau di dalam action bar/footer tersendiri yang terpisah jelas dari grup field.

---

## 5. Konvensi Arsitektur & Kode Aktual

### 5.1 Struktur Monolith & Build
- Repositori adalah **single-package ESM monolith** (`"type": "module"` di `package.json`).
- Kode frontend berada di `src/client/` (dikompilasi oleh Vite ke `dist/client`, dicek dengan `tsconfig.json`).
- Kode backend berada di `src/server/index.ts` (dikompilasi oleh `tsc -p tsconfig.server.json` ke `dist/server`).
- **Wajib Typecheck Klien**: Bundler produksi `vite build` mentranspilasi kode tanpa pemeriksaan tipe penuh TypeScript. Setiap perubahan prop komponen bersama atau tipe API di `src/client/` wajib diverifikasi dengan `npx tsc --noEmit` selain `npm run build`.

### 5.2 Routing & Sub-Path Deployment (`/lms/`)
- Di produksi, aplikasi dipasang di bawah sub-path `/lms/` (`PROD_BASE = '/lms/'` pada `vite.config.ts` dan `app.use("/lms", express.static(...))` di `src/server/index.ts`).
- `BrowserRouter` di `src/client/App.tsx` menghitung `basename` secara dinamis dari `import.meta.env.BASE_URL`.
- Semua rujukan aset statis di `public/` dan pengalihan `window.location` wajib menghormati `import.meta.env.BASE_URL` (contoh: `import.meta.env.BASE_URL + 'assets/pai/logo-unusu.jpg'`), bukan hardcoded `/assets/...` yang akan rusak saat dipasang di `/lms/`.

### 5.3 Autentikasi SSO & Hak Akses Peran
- Autentikasi sepenuhnya melalui **SSO ONE UNUSU** (`/login` -> portal eksternal -> `/sso/callback` -> `POST /api/auth/sso`). Dilarang menambahkan form login username/password lokal tanpa keputusan arsitektur (ADR) yang disetujui user.
- Peran pengguna ditentukan dari payload JWT sesi SSO (`user.role`: `'mahasiswa'`, `'dosen'`, atau `'admin'`), disimpan pada `localStorage` dengan kunci `lms_unusu_token` dan `lms_unusu_user`. Dilarang mengembalikan tombol switch peran simulasi di UI produksi.
- Pesan penolakan otorisasi kepada pengguna akhir harus lugas dan aman tanpa membocorkan kode role internal, stack trace, atau rahasia konfigurasi server.
- *Catatan Teknis Eksisting*: Beberapa pemanggilan API awal di frontend (`fetchMahasiswaClasses(1)`, `fetchDosenClasses(1)`, `enrollmentId: 1` pada `ClassDetail.tsx`) masih meneruskan ID sampel statis `1`. Saat menyentuh fitur terkait data pengguna, selaraskan dengan identitas sesi aktif dari `useAuth()` serta validasi `req.user` di backend.

### 5.4 Komunikasi API & Penanganan State UI
- Seluruh pemanggilan HTTP dari klien wajib melewati instance Axios terpusat di `src/client/services/api.ts` agar header `Authorization: Bearer <token>` dan penanganan `401 Unauthorized` bekerja konsisten.
- Setiap halaman dan bagian interaktif yang memuat data asinkron wajib menangani tiga state secara eksplisit: **loading**, **empty**, dan **error** (dilarang hanya mencetak `console.error` atau `alert()` mentah tanpa umpan balik state yang jelas di UI).

---

## 6. Kualitas Visual, Aksesibilitas & Copywriting

1. **Standar Aksesibilitas**:
   - Dokumen menggunakan `lang="id"`.
   - Kontras teks wajib memenuhi minimal **WCAG AA** (4.5:1 untuk teks normal, 3:1 untuk teks besar >= 18px bold / 24px reguler).
   - Ukuran area sentuh/klik (tap target) kontrol interaktif minimal **44x44px** pada layar sentuh/mobile, tanpa horizontal overflow di seluruh breakpoint.
   - Seluruh elemen interaktif wajib dapat dioperasikan menggunakan keyboard (`Tab`, `Shift+Tab`, `Enter`/`Space`, serta `Escape` untuk menutup modal/dialog) dengan indikator fokus (`focus-visible`) yang terlihat jelas.
2. **Anti-Slop & Fungsionalitas Nyata**:
   - Dilarang menyertakan tombol atau tautan mati yang tidak memiliki aksi nyata.
   - Dilarang menampilkan angka statistik fiktif, testimoni karangan, atau dekorasi tanpa fungsi (gradient blob acak, tumpukan glassmorphism, icon-grid generik).
3. **Copywriting Bahasa Indonesia**:
   - Gunakan Bahasa Indonesia yang lugas, konkret, aktif, dan sesuai konteks akademik kampus (istilah baku: *Mata Kuliah*, *Pertemuan*, *SKS*, *Materi Pembelajaran*, *Pengumpulan Tugas*, *Tenggat Waktu*, *Presensi*).
   - Dilarang menggunakan karakter em-dash (`—`) sebagai pemisah kalimat pada teks antarmuka baru; gunakan titik dua (`:`), koma (`,`), tanda kurung `()`, atau titik (`.`).
   - Hindari terjemahan kaku maupun kata-kata klise AI (*seamless*, *robust*, *delve*, *leverage*, *game-changer*, atau konstruksi *"Bukan sekadar X, melainkan Y"*).

---

## 7. Guardrails Keselamatan Database, Rahasia & Git

1. **Perlindungan Rahasia**: Dilarang membaca, mencetak ke output, atau meng-commit berkas `.env`, kunci `JWT_SECRET`, `SSO_CLIENT_KEY`, maupun kredensial database. Gunakan `.env.example` hanya sebagai referensi nama variabel.
2. **Keselamatan Database**: Dilarang menjalankan perintah mutasi atau migrasi database destruktif (`prisma migrate reset`, `prisma db push --force-reset`, `DROP`, `TRUNCATE`, penghapusan data tabel, atau eksekusi migrasi produksi) tanpa persetujuan eksplisit user melalui protokol `[APPROVAL_REQUIRED: ...]`.
3. **Keselamatan Git & Deploy**: Dilarang menjalankan `git commit` otomatis tanpa diminta, `git push`, `git reset --hard`, `git checkout -- .`, penulisan ulang riwayat commit, atau deploy ke server produksi tanpa persetujuan eksplisit user melalui protokol `[APPROVAL_REQUIRED: ...]`.
