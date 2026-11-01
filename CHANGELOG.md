# Changelog: LMS UNUSU

Seluruh perubahan penting pada kode, sistem desain, dan dokumentasi proyek `lms-unusu` dicatat dalam dokumen ini menggunakan format tanggal ISO (`YYYY-MM-DD`).

## [2026-10-31]

### Added
- Mengekstrak dan mengimplementasikan 7 komponen bersama di `src/client/components/`: `Button.tsx`, `StatusBadge.tsx`, `PageHeader.tsx`, `FormSectionCard.tsx`, `FormField.tsx`, `StateViews.tsx` (`LoadingState`, `EmptyState`, `ErrorState`), dan `ModalDialog.tsx` (mendukung `role="dialog"`, `aria-modal="true"`, serta penutupan dengan tombol `Escape`).
- Mengimplementasikan 5 template halaman standar di `src/client/components/templates/`: `AuthCardTemplate.tsx`, `DashboardPageTemplate.tsx`, `ListPageTemplate.tsx`, `DetailPageTemplate.tsx`, dan `FormPageTemplate.tsx`.
- Menambahkan tab dan tabel **Rekapitulasi Kehadiran Mahasiswa (`Presensi`)** pada halaman `ClassDetail.tsx` yang terhubung ke endpoint `GET /api/classes/:id/attendance`.
- Menambahkan dokumentasi aturan modul rute dan kontrak API di `docs/routes/RULES.md`.

### Changed
- Memigrasikan seluruh halaman (`Login.tsx`, `SsoCallback.tsx`, `Dashboard.tsx`, `ClassDetail.tsx`, `Tasks.tsx`) ke template halaman masing-masing dan komponen bersama sesuai prinsip *Build Once, Reuse Everywhere* (Part 9).
- Menyelaraskan form pengumpulan tugas mahasiswa dan form modal tambah bahan ajar dosen di `ClassDetail.tsx` agar membungkus setiap kelompok field logis di dalam `FormSectionCard` ber-heading dengan `FormField` berlabel eksplisit sesuai aturan wajib **Part 10.8**.
- Menghubungkan sapaan nama pengguna dan ID pengguna aktif di `Dashboard.tsx` dan `ClassDetail.tsx` ke sesi `useAuth()` (menggantikan nama hardcoded di banner).
- Menambahkan aturan dasar aksesibilitas di `src/client/index.css` (`cursor: pointer` untuk kontrol aktif, `cursor: not-allowed` untuk kontrol nonaktif, dan dukungan `prefers-reduced-motion: reduce`) serta menyelaraskan `fontFamily.sans` ke `Plus Jakarta Sans` di `tailwind.config.js`.
- Memperbarui `docs/design-system/COMPONENTS.md`, `docs/design-system/PAGE_TEMPLATES.md`, dan `docs/README.md` agar mencerminkan struktur berkas aktual.

### Fixed
- Memperbaiki error TypeScript `TS2339` pada `src/client/pages/SsoCallback.tsx` dengan melengkapi tipe respons `ssoLogin` (`message?: string`) di `src/client/services/api.ts`.
- Memperbaiki kontras teks (`text-slate-400` dan `text-yellow-600` dinaikkan ke `text-slate-600` dan `text-amber-800` untuk kepatuhan WCAG AA), ukuran teks mikro (`< 12px` dinaikkan ke minimal `text-xs`), tinggi area sentuh tombol/tautan (`min-h-[44px]`), penghapusan karakter em-dash (`—`) pada teks UI (`Login.tsx` dan `App.tsx`), serta penggantian dialog `alert()` pemblokir dengan banner umpan balik dan pesan validasi inline.

### Documentation
- Menginisiasi tata kelola dokumentasi proyek (`docs/README.md` dan `docs/PROJECT_RULES.md`) berdasarkan audit arsitektur aktual single-package fullstack monolith (`src/client/` dan `src/server/`), alur SSO ONE UNUSU, sub-path produksi `/lms/`, serta aturan keselamatan database dan Git.
- Menyusun dokumentasi sistem desain lengkap di `docs/design-system/` (`DESIGN_RULES.md`, `COLORS.md`, `TYPOGRAPHY.md`, `COMPONENTS.md`, dan `PAGE_TEMPLATES.md`) yang memetakan token warna (`tailwind.config.js` vs kelas `emerald`/`slate` aktif), skala tipografi `Plus Jakarta Sans`, aturan wajib Form Section Card (Part 10.8), standar aksesibilitas WCAG AA & anti-slop, serta inventaris komponen bersama dan template halaman.
