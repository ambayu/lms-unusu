# CHANGELOG — LMS UNUSU

## [2026-11-09] — Dukungan Multi-Role SSO & Penyelarasan Callback Lingkungan

### Changed
- **Endpoint SSO (`POST /api/auth/sso`)**: Mendukung payload array `roles` dan single `role` dari SSO Gateway ONE UNUSU untuk penentuan role lokal (`admin`, `dosen`, `mahasiswa`) dan menginjeksi peran multi-role ke dalam JWT sesi.
- **Penyelarasan Callback per Lingkungan**: Mendukung URL callback mode lokal (`http://localhost:5174/sso/callback`) dan mode VPS (`/lms/sso/callback`).
