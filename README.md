# LMS UNUSU - Ruang Belajar Digital

Aplikasi Learning Management System (E-Learning) terintegrasi untuk Universitas Nahdlatul Ulama Sumatera Utara, dimigrasikan dari modul LMS `sin-unusu` ke arsitektur fullstack modern **Vite React + Node.js Express + Prisma ORM**.

---

## 🚀 Fitur Utama

### 1. Portal Mahasiswa
* Dashboard kelas aktif semester berjalan.
* Modul materi kuliah per pertemuan (download slide / PDF).
* Form pengumpulan tugas (submission), catatan pengumpulan, dan tenggat waktu.
* Pemantauan rekap nilai tugas, uts, dan kehadiran presensi.

### 2. Portal Dosen
* Manajemen kelas mata kuliah yang diampu.
* Pembuatan dan unggah materi kuliah (slide / buku referensi).
* Pembuatan tugas dan penentuan tenggat waktu (due date).
* Penilaian (scoring & feedback) terhadap jawaban mahasiswa.
* Rekap presensi kehadiran mahasiswa (16 pertemuan).

---

## 🛠️ Tech Stack
* **Frontend (`client/`)**: Vite React 18, TypeScript, Tailwind CSS, Lucide Icons, React Router v6.
* **Backend (`server/`)**: Node.js Express, TypeScript, Prisma ORM.
* **Database**: MySQL (`lms_unusu_db`).

---

## ⚡ Cara Menjalankan

1. **Instal Dependensi**:
   ```bash
   npm install
   npm install --prefix server
   npm install --prefix client
   ```

2. **Konfigurasi Database & Seeder**:
   Copy `.env.example` ke `.env` di folder `server/`, lalu jalankan:
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate dev --name init_lms
   npm run prisma:seed
   ```

3. **Jalankan Aplikasi**:
   ```bash
   npm run dev
   ```
   * Frontend LMS: `http://localhost:5174`
   * Backend REST API: `http://localhost:5001/api`
