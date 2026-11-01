# Registri Template Halaman (PAGE_TEMPLATES): LMS UNUSU

Dokumen ini mendefinisikan arsitektur template halaman pada `lms-unusu`, aturan pemilihan template berdasarkan jenis halaman, pemetaan terhadap rute aktual di `src/client/App.tsx`, serta tata cara penambahan atau migrasi template sesuai prinsip **Build Once, Reuse Everywhere** (Part 9 & Part 10.8).

---

## 1. Status Implementasi Template Saat Ini

Berdasarkan kode aktual di `src/client/`:
- Aplikasi memiliki **1 layout shell bersama** (`AppShell` di `src/client/App.tsx`), **5 template halaman standar** di `src/client/components/templates/` (`AuthCardTemplate.tsx`, `DashboardPageTemplate.tsx`, `ListPageTemplate.tsx`, `DetailPageTemplate.tsx`, `FormPageTemplate.tsx`), dan **5 halaman rute** (`Login.tsx`, `SsoCallback.tsx`, `Dashboard.tsx`, `ClassDetail.tsx`, `Tasks.tsx`) yang seluruhnya telah menggunakan template masing-masing.
- **Mandat Pengembangan**: Setiap kali membuat halaman baru atau memodifikasi tata letak halaman eksisting, pengembang/agen wajib menggunakan template halaman yang sesuai dari daftar di Bagian 2 (`src/client/components/templates/`), bukan menyalin ulang markup layout dari halaman lain.

---

## 2. Katalog Template Halaman & Aturan Pemilihan

| Jenis Halaman | Nama Template Standar | Kapan Digunakan | Rute Aktual / Target di `lms-unusu` |
|---|---|---|---|
| **1. Halaman Autentikasi SSO** | `AuthCardTemplate` (pola aktual di `Login.tsx` & `SsoCallback.tsx`) | Halaman publik di luar `AppShell` untuk proses masuk SSO, verifikasi callback token, atau halaman penolakan akses sesi. | `/login`, `/sso/callback` |
| **2. Halaman Beranda / Dashboard** | `DashboardPageTemplate` | **Khusus** halaman utama beranda setelah login (`/`). Menampilkan konteks semester aktif, ringkasan akademik pengguna, dan kartu akses cepat kelas. | `/` (`Dashboard.tsx`) |
| **3. Halaman Daftar / Tabel Data** | `ListPageTemplate` | Halaman daftar entitas lintas kelas atau manajemen data (daftar tugas, rekap nilai, rekap presensi, manajemen kelas/master data). | `/tasks` (`Tasks.tsx`), serta halaman daftar/tabel baru |
| **4. Halaman Detail Entitas** | `DetailPageTemplate` | Halaman yang menampilkan satu rekaman utama beserta sub-data terorganisasi dalam tab/seksi (detail satu kelas perkuliahan dengan materi, tugas, dan presensi). | `/class/:id` (`ClassDetail.tsx`) |
| **5. Halaman Formulir (Tambah / Ubah)** | `FormPageTemplate` | Halaman khusus penambahan atau pengubahan data (buat materi/tugas halaman penuh, form pengumpulan tugas lengkap, form penilaian/presensi). | Rute form baru (misal `/class/:id/resources/new`, `/class/:id/tasks/:taskId/submit`) |

---

## 3. Spesifikasi Tiap Template

### 3.1 `DashboardPageTemplate` (Aturan Khusus Dashboard, Part 9.2)
- **Pemisahan Ketat**: Dashboard memiliki tata letak sendiri dan **dilarang** memakai `ListPageTemplate` (layout CRUD/tabel) maupun mewariskan banner sambutannya ke halaman lain.
- **Struktur Visual**:
  1. Kontainer kerja `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8` di dalam `AppShell`.
  2. **Header Konteks Akademik**: Menampilkan badge semester aktif (dari data nyata, bukan teks fiktif), sapaan nama pengguna aktual dari `useAuth()` (`user.nama`), serta ringkasan peran (`mahasiswa` atau `dosen`).
  3. **Slot Ringkasan / Metrik Nyata** (opsional bila didukung data API): Kartu ringkasan jumlah kelas aktif atau tugas menunggu pengumpulan yang dihitung dari respons API nyata (Aturan R-17: dilarang menampilkan angka hardcoded tanpa sumber).
  4. **Grid Kelas Aktif**: Header seksi (`Daftar Kelas Perkuliahan` + penghitung `N Kelas Terdaftar`) diikuti penanganan penuh `LoadingState`, `ErrorState`, `EmptyState`, atau grid kartu kelas `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.
- **Konfigurasi Props Standar**:
  `semesterName`, `userName`, `roleDescription`, `summarySlot?`, `sectionTitle`, `sectionSubtitle`, `countLabel?`, `loading`, `error?`, `onRetry?`, `isEmpty`, `emptyMessage?`, `children`.

### 3.2 `ListPageTemplate` (Halaman Daftar & Tabel, Part 9.3.A)
- **Tujuan**: Menyeragamkan seluruh halaman daftar item atau tabel data akademik (seperti `/tasks`, daftar pengumpulan mahasiswa, atau tabel rekap presensi).
- **Elemen yang Didukung**:
  1. `PageHeader`: `title` (`<h1>`), `breadcrumb` / tautan kembali opsional, `description`, dan `primaryAction` opsional (disesuaikan hak akses `role`).
  2. `TableToolbar` (opsional sesuai kebutuhan halaman): `SearchInput`, filter kategori/status (misal *Semua / Belum Dikumpulkan / Sudah Dinilai*), pemilih jumlah baris (`pageSize`), dan aksi unduh/ekspor nyata bila endpoint tersedia.
  3. **Area Konten Daftar / Tabel**: Merender `DataTable` atau daftar kartu item terstruktur, lengkap dengan penanganan `LoadingState`, `EmptyState`, dan `ErrorState` (`onRetry`).
  4. `Pagination` (bila daftar dipaginasi).
- **Contoh Penggunaan Konseptual**:
  ```tsx
  <ListPageTemplate
    title="Agenda Tugas & Nilai"
    description="Daftar penugasan dari seluruh mata kuliah semester berjalan"
    searchable
    searchPlaceholder="Cari judul tugas atau mata kuliah..."
    loading={loading}
    error={error}
    onRetry={loadTasks}
    isEmpty={tasks.length === 0}
    emptyMessage="Belum ada tugas perkuliahan pada semester ini."
  >
    {/* Baris DataTable atau daftar kartu tugas */}
  </ListPageTemplate>
  ```
- **Batasan**: Dilarang menaruh tombol ekspor/unduh atau filter yang tidak terhubung ke logika nyata (Aturan R-26).

### 3.3 `DetailPageTemplate` (Halaman Detail Rekaman, Part 9.3.C)
- **Tujuan**: Menampilkan informasi lengkap satu entitas utama (contoh: satu `Class` pada `/class/:id`) beserta sub-koleksinya.
- **Elemen yang Didukung**:
  1. **Navigasi Kembali**: Tautan kembali ke halaman induk (`Kembali ke Daftar Kelas` -> `/`).
  2. **Kartu Informasi Primer**: Kartu `bg-white rounded-3xl p-6 sm:p-8 border border-slate-200` yang memuat `StatusBadge` identitas (`kode • grup • SKS`), judul `<h1>` (`courseName`), metadata (`semester`, `ruang`, `jadwal`, dosen pengampu), dan slot `actions` berbasis peran (contoh: tombol `Tambah Materi / Tugas` khusus `dosen`).
  3. **Navigasi Sub-Seksi (Tabs)**: Baris tab aksesibel (`Materi Pembelajaran`, `Penugasan & Proyek`, `Presensi`) dengan indikator aktif `border-b-2 border-emerald-700 text-emerald-800` dan tinggi klik minimal 44px.
  4. **Panel Isi Seksi**: Menampilkan konten tab aktif beserta `LoadingState`, `EmptyState`, dan `ErrorState` mandiri.

### 3.4 `FormPageTemplate` (Halaman Tambah & Ubah Data, Part 9.3.B & Part 10.8)
- **Tujuan**: Menangani seluruh halaman tambah (`create`) dan ubah (`edit`) data melalui konfigurasi mode dan data awal yang sama, tanpa menduplikasi pohon komponen antara tambah dan edit.
- **Aturan Wajib Card Bagian (Part 10.8)**:
  - `FormPageTemplate` **wajib** merender isi form sebagai susunan satu atau lebih **`FormSectionCard`** di atas kanvas `bg-slate-50`.
  - Setiap `FormSectionCard` membungkus satu kelompok field logis dan menampilkan heading bagian (`<h2>`/`<h3>`) di bagian atas kartu.
  - Dilarang menempatkan `<label>` dan `<input>` langsung sebagai anak telanjang dari `FormPageTemplate` di luar `FormSectionCard`.
- **Struktur Visual**:
  1. Navigasi kembali / breadcrumb ke halaman asal.
  2. Heading halaman `<h1>` (ditentukan dari `mode === 'create' ? 'Tambah ...' : 'Ubah ...'`) dan deskripsi singkat.
  3. Banner `ErrorState` tingkat form bila penyimpanan gagal.
  4. Rangkaian `<FormSectionCard title="..." description="...">` berisi komponen `<FormField>`.
  5. **Action Bar Formulir** di bawah seluruh kartu (atau dalam kartu bar aksi terpisah): tombol sekunder `Batal` dan tombol primer `Simpan` (dengan state `submitting` / `disabled`).
- **Contoh Penggunaan Konseptual**:
  ```tsx
  <FormPageTemplate
    backTo={`/class/${classId}`}
    backLabel="Kembali ke Detail Kelas"
    title={mode === 'create' ? 'Tambah Bahan Ajar' : 'Ubah Bahan Ajar'}
    description="Lengkapi informasi pertemuan dan dokumen lampiran untuk mahasiswa."
    onSubmit={handleSubmit}
    onCancel={() => navigate(`/class/${classId}`)}
    submitLabel={mode === 'create' ? 'Simpan Bahan Ajar' : 'Simpan Perubahan'}
    submitting={saving}
    error={submitError}
  >
    <FormSectionCard
      title="Informasi Pertemuan"
      description="Tentukan jenis bahan ajar, urutan pertemuan, dan judul materi."
    >
      {/* FormField: Tipe, Pertemuan Ke-, Judul */}
    </FormSectionCard>

    <FormSectionCard
      title="Petunjuk & Lampiran Dokumen"
      description="Berikan instruksi pengerjaan atau tautan berkas pendukung."
    >
      {/* FormField: Deskripsi, Berkas Dokumen, Tenggat Waktu */}
    </FormSectionCard>
  </FormPageTemplate>
  ```

### 3.5 `AuthCardTemplate` (Halaman Gerbang SSO)
- **Tujuan**: Tata letak terpusat berlatar `min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12` dengan satu kartu fokus `w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl` untuk halaman `/login` dan `/sso/callback`.
- **Batasan**: Hanya dipakai untuk alur sesi SSO sebelum masuk `AppShell`. Dilarang dipakai untuk halaman fitur LMS.

---

## 4. Pemetaan Rute Aktual (Terverifikasi)

| Rute | Komponen Halaman | Template Standar | Status Implementasi Aktual |
|---|---|---|---|
| `/login` | `src/client/pages/Login.tsx` | `AuthCardTemplate` | Menggunakan `AuthCardTemplate` dan `Button` dengan atribut dimensi eksplisit pada logo institusi. |
| `/sso/callback` | `src/client/pages/SsoCallback.tsx` | `AuthCardTemplate` | Menggunakan `AuthCardTemplate` dan menangani state loading (`Memverifikasi Sesi SSO`) serta state error (`Login SSO Gagal`). |
| `/` | `src/client/pages/Dashboard.tsx` | `DashboardPageTemplate` | Menggunakan `DashboardPageTemplate`, menampilkan nama pengguna dari `useAuth()`, serta menangani `LoadingState`, `EmptyState`, dan `ErrorState` (`onRetry`). |
| `/class/:id` | `src/client/pages/ClassDetail.tsx` | `DetailPageTemplate` | Menggunakan `DetailPageTemplate` dengan 3 tab aktif (`Materi Pembelajaran`, `Penugasan & Proyek`, `Presensi`), `FormSectionCard` + `FormField` sesuai Part 10.8, serta `ModalDialog` (`Escape`). |
| `/tasks` | `src/client/pages/Tasks.tsx` | `ListPageTemplate` | Menggunakan `ListPageTemplate`, `StatusBadge`, `LoadingState`, `EmptyState`, `ErrorState` (`onRetry`), dan tautan navigasi `Buka Kelas`. |

---

## 5. Prosedur Menambah Template Baru

Jika di masa depan muncul kebutuhan jenis halaman yang benar-benar tidak cocok dengan kelima template di atas:
1. Periksa terlebih dahulu apakah template yang ada (`ListPageTemplate`, `DetailPageTemplate`, atau `FormPageTemplate`) dapat diperluas dengan slot/props opsional tanpa merusak halaman lain.
2. Jangan membuat template baru hanya karena nama rutenya berbeda. Jika kebutuhannya hanya muncul satu kali di seluruh aplikasi, gunakan komposisi komponen bersama di atas template terdekat.
3. Jika pola tersebut terbukti dipakai ulang oleh minimal dua rute berbeda, buat komponen templatenya di `src/client/components/templates/`, uji dengan `npx tsc --noEmit` dan `npm run build`, lalu daftarkan tujuan, props, contoh pemakaian, dan batasannya di dokumen `PAGE_TEMPLATES.md` ini serta catat di `CHANGELOG.md`.
