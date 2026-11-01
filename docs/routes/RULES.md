# Aturan Modul Rute (RULES): LMS UNUSU

Dokumen ini mencatat pemetaan rute halaman di `src/client/pages/` dan endpoint API di `src/server/index.ts`, template halaman serta komponen bersama yang digunakan oleh setiap rute sesuai prinsip **Build Once, Reuse Everywhere** (Part 9 & Part 10.8), dan aturan validasi spesifik per modul.

---

## 1. Tujuan dan Ruang Lingkup

Modul rute di `lms-unusu` dibagi menjadi dua lapisan yang saling terhubung:
1. **Rute Antarmuka Klien (`src/client/pages/`)**: Mengatur tampilan dan interaksi untuk 5 rute utama (`/login`, `/sso/callback`, `/`, `/class/:id`, `/tasks`) di bawah `BrowserRouter` (`basename: '/lms'` saat produksi).
2. **Rute Layanan Backend (`src/server/index.ts`)**: Menyediakan endpoint REST API terproteksi JWT di bawah prefix `/api/*` untuk verifikasi SSO, portal mahasiswa, portal dosen, dan rekapitulasi presensi.

Dokumen ini tidak menggantikan aturan global di `docs/PROJECT_RULES.md` atau `docs/design-system/*`, melainkan merinci penerapan spesifik pada tiap rute.

---

## 2. Pemetaan Rute Klien, Template Halaman & Komponen Bersama

Setiap halaman di `src/client/pages/` wajib menggunakan template halaman dari `src/client/components/templates/` dan komponen bersama dari `src/client/components/`:

| Rute | Berkas Halaman | Template Halaman Wajib | Komponen Bersama yang Digunakan | Pengecualian yang Disetujui |
|---|---|---|---|---|
| `/login` | `src/client/pages/Login.tsx` | `AuthCardTemplate` | `Button` | Berada di luar `AppShell` karena merupakan gerbang publik SSO sebelum sesi terbentuk. |
| `/sso/callback` | `src/client/pages/SsoCallback.tsx` | `AuthCardTemplate` | - (state verifikasi & error di dalam `AuthCardTemplate`) | Berada di luar `AppShell`; melakukan pertukaran token sekali pakai ke `POST /api/auth/sso`. |
| `/` | `src/client/pages/Dashboard.tsx` | `DashboardPageTemplate` | `StatusBadge`, `LoadingState`, `EmptyState`, `ErrorState` (melalui `DashboardPageTemplate`) | Menggunakan layout khusus Dashboard (banner konteks semester aktif + grid kartu kelas), dilarang memakai `ListPageTemplate`. |
| `/class/:id` | `src/client/pages/ClassDetail.tsx` | `DetailPageTemplate` | `Button`, `StatusBadge`, `FormSectionCard`, `FormField`, `ModalDialog`, `LoadingState`, `EmptyState`, `ErrorState` | Form pengumpulan tugas mahasiswa dan form tambah bahan ajar dosen disajikan inline/modal di dalam halaman detail, namun tetap wajib dibungkus `FormSectionCard` (Part 10.8). |
| `/tasks` | `src/client/pages/Tasks.tsx` | `ListPageTemplate` | `PageHeader`, `StatusBadge`, `LoadingState`, `EmptyState`, `ErrorState` (melalui `ListPageTemplate`) | Tidak ada pengecualian. |

---

## 3. Aturan Implementasi & UX per Modul Rute

### 3.1 Modul Autentikasi SSO (`/login` & `/sso/callback`)
- **Kontrak Alur**: `/login` mengarahkan browser ke `${VITE_ONE_UNUSU_URL}/login`. Setelah pengguna memilih aplikasi LMS di portal ONE UNUSU, browser diarahkan ke `/sso/callback?client_id=...&token=...` yang memanggil `ssoLogin(clientId, token)` (`POST /api/auth/sso`).
- **Aturan State**: `SsoCallbackPage` wajib menangani state verifikasi berjalan (`Memverifikasi Sesi SSO`) dan state gagal (`Login SSO Gagal`) dengan tautan kembali ke `/login`.
- **Aset**: Gambar logo institusi wajib menggunakan `import.meta.env.BASE_URL + 'assets/pai/logo-unusu.jpg'` dengan atribut `width`, `height`, `alt`, dan `fetchPriority="high"` (Aturan R-39 & R-40).

### 3.2 Modul Dashboard Beranda (`/`)
- **Template**: Wajib menggunakan `DashboardPageTemplate`.
- **Identitas Pengguna Nyata**: Sapaan nama pengguna di banner diambil dari sesi aktif `useAuth().user?.nama` dan semester aktif dari data kelas API (dengan fallback aman bila daftar kelas kosong). Dilarang menulis nama pengguna hardcoded di JSX.
- **Ketahanan State**: Wajib meneruskan `loading`, `error`, `onRetry={loadClasses}`, dan `isEmpty={classes.length === 0}` ke `DashboardPageTemplate` (Aturan R-27).

### 3.3 Modul Detail Kelas Perkuliahan (`/class/:id`)
- **Template**: Wajib menggunakan `DetailPageTemplate` dengan tiga tab fungsional yang utuh:
  1. `materials` (`Materi Pembelajaran`): Menampilkan daftar modul per pertemuan dan aksi `Unduh Materi` dengan umpan balik status yang jelas di UI.
  2. `tasks` (`Penugasan & Proyek`): Menampilkan instruksi tugas, tenggat waktu, jumlah pengumpulan bagi `dosen`, serta form pengumpulan jawaban bagi `mahasiswa`.
  3. `attendance` (`Presensi`): Memuat data dari `GET /api/classes/:id/attendance` dan menampilkan tabel rekapitulasi kehadiran mahasiswa beserta `StatusBadge` (`Hadir`, `Izin`, `Sakit`, `Alpa`).
- **Kepatuhan Form Section Card (Part 10.8)**:
  - Form pengumpulan tugas mahasiswa wajib membungkus field `Catatan Jawaban / Tautan Repositori` dan `Nama Berkas Lampiran` di dalam `FormSectionCard` ber-heading `"Detail Pengumpulan Jawaban"`.
  - Modal tambah bahan ajar/tugas dosen (`ModalDialog`) wajib memisahkan field ke dalam dua `FormSectionCard` ber-heading: `"Informasi Pertemuan"` (Kategori, Pertemuan Ke-, Judul) dan `"Petunjuk & Lampiran Dokumen"` (Deskripsi, Nama Berkas), dengan tombol `Batal` dan `Simpan Bahan Ajar` berada di luar kartu pada footer form.
- **Aksesibilitas Dialog**: Modal wajib ditutup saat pengguna menekan tombol `Escape` atau tombol tutup (`aria-label="Tutup dialog"`).

### 3.4 Modul Agenda Tugas & Nilai (`/tasks`)
- **Template**: Wajib menggunakan `ListPageTemplate`.
- **Komponen Status**: Badge pertemuan dan status pengumpulan (`Sudah Dikumpulkan` / `Belum Dikumpulkan`) wajib memakai `StatusBadge`. Setiap item tugas menyediakan tautan navigasi nyata (`Buka Kelas` -> `/class/:classId`).

---

## 4. Kontrak API & Validasi Backend (`src/server/index.ts`)

| Endpoint | Metode | Proteksi | Tanggung Jawab & Kontrak Respons |
|---|---|---|---|
| `/api/health` | `GET` | Publik | Pemeriksaan status hidup server (`{ status: "ok", app: "LMS UNUSU API", time }`). |
| `/api/auth/sso` | `POST` | Publik (validasi `client_id` & `SSO_CLIENT_KEY`) | Memverifikasi token sekali pakai ke `${SSO_BASE_URL}/api/v2/website/verify-token`, memetakan peran SSO (`SUPERADMIN`/`DOSEN`/`MAHASISWA`), dan menerbitkan JWT lokal 7 hari (`{ success: true, token, user }`). |
| `/api/mahasiswa/classes` | `GET` | Bearer JWT | Mengambil daftar kelas yang diikuti mahasiswa beserta relasi `semester`, `lecturers`, `resources`, dan `grades`. |
| `/api/classes/:id` | `GET` | Bearer JWT | Mengambil detail satu kelas beserta `semester`, `lecturers`, `resources` (urut `meeting asc`), dan `enrollments`. Mengembalikan `404` jika kelas tidak ditemukan. |
| `/api/mahasiswa/tasks` | `GET` | Bearer JWT | Mengambil daftar resource bertipe `tasks` lintas kelas (urut `dueDate asc`) beserta `class` dan `submissions`. |
| `/api/mahasiswa/submit` | `POST` | Bearer JWT | Melakukan `upsert` pada `Submission` berdasarkan kunci komposit `resourceId_enrollmentId`. |
| `/api/dosen/classes` | `GET` | Bearer JWT | Mengambil daftar kelas yang diampu dosen beserta `semester` dan `_count` (`enrollments`, `resources`). |
| `/api/dosen/resources` | `POST` | Bearer JWT | Menambahkan `Resource` baru (`materials` atau `tasks`) pada kelas tertentu. |
| `/api/dosen/submissions/:id/grade` | `PUT` | Bearer JWT | Memperbarui `score` dan `feedback` pada pengumpulan tugas mahasiswa. |
| `/api/classes/:id/attendance` | `GET` | Bearer JWT | Mengambil daftar `Enrollment` pada kelas beserta profil `student` dan riwayat `attendances` (urut `meeting asc`). |

---

## 5. Daftar Larangan (Do-Not-Change Without ADR)

1. Jangan mengubah kontrak sub-path produksi `/lms/` pada `vite.config.ts`, `src/client/App.tsx`, dan `src/server/index.ts`.
2. Jangan menghapus pemeriksaan wajib `JWT_SECRET` saat startup di `src/server/index.ts` atau mengizinkan rute data `/api/*` diakses tanpa middleware `authenticate`.
3. Jangan merender field form di luar `FormSectionCard` pada halaman atau modal mana pun.

---

## 6. Dokumentasi Terkait

- [Ikhtisar Proyek (`docs/README.md`)](../README.md)
- [Aturan Global Proyek (`docs/PROJECT_RULES.md`)](../PROJECT_RULES.md)
- [Aturan Sistem Desain (`docs/design-system/DESIGN_RULES.md`)](../design-system/DESIGN_RULES.md)
- [Registri Komponen Bersama (`docs/design-system/COMPONENTS.md`)](../design-system/COMPONENTS.md)
- [Registri Template Halaman (`docs/design-system/PAGE_TEMPLATES.md`)](../design-system/PAGE_TEMPLATES.md)
