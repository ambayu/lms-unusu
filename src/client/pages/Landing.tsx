import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  FileCheck2,
  Users,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';

const ONE_UNUSU_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ONE_UNUSU_URL) || 'http://localhost:5173';

export function LandingPage() {
  const { user } = useAuth();

  const handleSsoLogin = () => {
    window.location.href = `${ONE_UNUSU_URL}/login`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center min-h-16 py-2">
            <Link
              to="/"
              className="flex items-center space-x-2.5 min-h-[44px] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm shrink-0">
                <BookOpen className="w-5 h-5 text-yellow-300" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-extrabold text-lg text-slate-900">LMS</span>
                  <span className="font-extrabold text-lg text-emerald-700">UNUSU</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">Ruang Belajar Digital</p>
              </div>
            </Link>

            <div className="flex items-center space-x-3">
              <a
                href={ONE_UNUSU_URL}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center space-x-1.5 min-h-[40px] px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <span>Portal Kampus</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              {user ? (
                <Link to="/app">
                  <Button variant="primary" size="sm" className="shadow-xs">
                    <span>Masuk ke Kelas</span>
                    <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="secondary" size="sm">
                      Masuk
                    </Button>
                  </Link>
                  <Button variant="primary" size="sm" onClick={handleSsoLogin} className="shadow-xs">
                    <span>Portal SSO</span>
                    <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-linear-to-b from-emerald-50/50 via-white to-slate-50 border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold border border-emerald-200/80">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ruang Belajar Digital Terintegrasi SSO ONE UNUSU</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Pusat Pembelajaran &amp; Manajemen Perkuliahan <span className="text-emerald-700">UNUSU</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Akses materi perkuliahan interaktif, kumpulkan tugas tepat waktu, diskusikan topik akademik, dan pantau capaian evaluasi pembelajaran dalam satu ekosistem akademik modern.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {user ? (
                  <Link to="/app">
                    <Button variant="primary" size="lg" className="shadow-md">
                      <span>Buka Kelas Saya</span>
                      <ArrowRight className="w-5 h-5 ml-1.5" aria-hidden="true" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Button variant="primary" size="lg" onClick={handleSsoLogin} className="shadow-md">
                      <span>Masuk dengan SSO ONE UNUSU</span>
                      <ArrowRight className="w-5 h-5 ml-1.5" aria-hidden="true" />
                    </Button>
                    <Link to="/login">
                      <Button variant="secondary" size="lg">
                        Info Login SSO
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-600 pt-3">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  Satu Akun Terpusat
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <GraduationCap className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  Akses Dosen &amp; Mahasiswa
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Fitur Unggulan LMS UNUSU
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Dirancang untuk memudahkan aktivitas belajar-mengajar bagi seluruh sivitas akademika Universitas Nahdlatul Ulama Sumatera Utara.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Materi Perkuliahan Terstruktur</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Akses materi per pertemuan, dokumen bahan ajar, dan referensi kuliah yang diorganisasi rapi oleh dosen pengampu.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <FileCheck2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Pengumpulan Tugas &amp; Evaluasi</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Kirim lembar jawaban tugas sebelum tenggat waktu berakhir, serta dapatkan rekap umpan balik dan nilai secara transparan.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Sinkronisasi Terpadu SSO</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tidak memerlukan registrasi terpisah. Gunakan akun ONE UNUSU Anda untuk langsung mengakses kelas akademik yang terdaftar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="pb-16 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl text-center md:text-left space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Siap Memulai Perkuliahan Hari Ini?
                </h2>
                <p className="text-emerald-100 text-sm leading-relaxed">
                  Masuk melalui portal ONE UNUSU untuk mengakses kelas semester aktif Anda.
                </p>
              </div>
              <div className="shrink-0">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSsoLogin}
                  className="bg-white text-emerald-900 hover:bg-emerald-50 border-0 font-bold shadow-md"
                >
                  <span>Akses LMS Sekarang</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} LMS UNUSU: Ruang Belajar Digital Universitas Nahdlatul Ulama Sumatera Utara</p>
      </footer>
    </div>
  );
}
