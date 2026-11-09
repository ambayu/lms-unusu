import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  Squares2X2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import TentangPlatform from '../components/TentangPlatform';

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
const ONE_UNUSU_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ONE_UNUSU_URL) || 'http://localhost:5173';
const SSO_CLIENT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SSO_CLIENT_ID) || 'cli_lms_8f3b2a1c';

interface HeroSlide {
  id: string;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  primaryCtaIcon: React.ComponentType<{ className?: string }>;
  imageSrc: string;
  imageAlt: string;
}

/**
 * HERO_SLIDES — memakai foto kampus yang sudah tersedia di
 * `public/assets/pai/slider/slider1.jpg`. Tidak ada aset baru yang dibuat.
 */
const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'ruang-kelas-digital',
    badge: 'Ruang Belajar Digital',
    titlePrefix: 'Kelas Perkuliahan dalam ',
    titleHighlight: 'Satu Ruang Terpadu',
    description:
      'Mahasiswa mengakses materi, tugas, dan pengumuman kelas tanpa berpindah aplikasi. Dosen mengelola pertemuan dan penilaian dari satu dasbor yang sama.',
    primaryCtaText: 'Masuk dengan ONE UNUSU',
    primaryCtaHref: '/login',
    primaryCtaIcon: ArrowRightOnRectangleIcon,
    imageSrc: `${BASE_URL}assets/pai/slider/slider1.jpg`,
    imageAlt: 'Gedung kampus Universitas Nahdlatul Ulama Sumatera Utara',
  },
  {
    id: 'materi-terstruktur',
    badge: 'Materi & Penugasan',
    titlePrefix: 'Materi Kuliah Tersusun ',
    titleHighlight: 'Per Pertemuan',
    description:
      'Setiap kelas memiliki daftar pertemuan, bahan bacaan, dan tenggat tugas yang jelas sehingga mahasiswa tahu persis apa yang harus disiapkan.',
    primaryCtaText: 'Lihat Ruang Belajar',
    primaryCtaHref: '/login',
    primaryCtaIcon: BookOpenIcon,
    imageSrc: `${BASE_URL}assets/pai/slider/slider1.jpg`,
    imageAlt: 'Lingkungan kampus UNUSU sebagai latar ruang belajar digital',
  },
  {
    id: 'pemantauan-progres',
    badge: 'Progres Akademik',
    titlePrefix: 'Kemajuan Belajar ',
    titleHighlight: 'Terpantau Jelas',
    description:
      'Dosen pengampu melihat keterlibatan mahasiswa per kelas, sementara mahasiswa memantau capaian tugas yang sudah dan belum dikumpulkan.',
    primaryCtaText: 'Buka Dasbor',
    primaryCtaHref: '/login',
    primaryCtaIcon: ClipboardDocumentCheckIcon,
    imageSrc: `${BASE_URL}assets/pai/slider/slider1.jpg`,
    imageAlt: 'Suasana kampus UNUSU untuk pemantauan progres akademik',
  },
];

const FITUR = [
  {
    Icon: BookOpenIcon,
    judul: 'Materi Per Pertemuan',
    teks: 'Bahan kuliah, referensi, dan dokumen ajar tersusun rapi mengikuti jadwal pertemuan.',
  },
  {
    Icon: ClipboardDocumentCheckIcon,
    judul: 'Tugas & Evaluasi',
    teks: 'Pengumpulan tugas tercatat dengan tenggat yang jelas dan umpan balik dosen.',
  },
  {
    Icon: AcademicCapIcon,
    judul: 'Dua Peran, Satu Sistem',
    teks: 'Dasbor mahasiswa dan dosen memakai kredensial SSO ONE UNUSU yang sama.',
  },
];

export function LandingPage() {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = HERO_SLIDES.length;

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      if (distance > 50) nextSlide();
      else if (distance < -50) prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  /**
   * Alur SSO v2 ONE UNUSU: minta tiket sekali pakai melalui halaman
   * `/authorize?client_id=..` di portal. Portal membangun URL callback dari
   * `urlRedirect` aplikasi, sehingga aplikasi tidak mengirim `redirect_uri`
   * sendiri dan tidak ada risiko path meleset.
   */
  const handleSsoLogin = () => {
    window.location.href = `${ONE_UNUSU_URL}/authorize?client_id=${encodeURIComponent(SSO_CLIENT_ID)}`;
  };

  const slide = HERO_SLIDES[activeSlide];
  const PrimaryIcon = slide.primaryCtaIcon;
  const counter = `${String(activeSlide + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
  const menu = [
    { href: '#layanan', label: 'Layanan' },
    { href: '#peran', label: 'Untuk Siapa' },
    { href: '#tentang', label: 'Tentang' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* NAVBAR: brand kiri · menu tengah · aksi kanan */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#CBD5E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="LMS UNUSU — Beranda">
              <div className="w-9 h-9 rounded-[10px] bg-emerald-700 flex items-center justify-center">
                <BookOpenIcon className="w-5 h-5 text-amber-300" aria-hidden="true" />
              </div>
              <div className="leading-tight">
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-[15px] tracking-tight text-slate-900">LMS</span>
                  <span className="font-extrabold text-[15px] tracking-tight text-emerald-700">UNUSU</span>
                </div>
                <p className="text-[10px] font-medium text-slate-500">Ruang Belajar Digital</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi utama">
              {menu.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-[8px] text-[13px] font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <Link
                  to="/app"
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-4 rounded-[8px] bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
                >
                  <span>Buka Dasbor</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleSsoLogin}
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-4 rounded-[8px] bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
                >
                  <span>Masuk SSO</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                aria-expanded={mobileOpen}
                className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[8px] border border-[#CBD5E1] text-slate-600"
              >
                {mobileOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[#CBD5E1] bg-white px-4 py-3 space-y-1">
            {menu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center min-h-[44px] px-3 rounded-[8px] text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* HERO SLIDER */}
        <section
          aria-label="Hero LMS UNUSU"
          className="relative isolate w-full overflow-hidden bg-slate-950 text-white select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative h-[520px] sm:h-[560px] w-full overflow-hidden">
            {HERO_SLIDES.map((item, index) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  width={1600}
                  height={900}
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent" />
              </div>
            ))}
          </div>

          {/* Konten kiri-bawah · kontrol kanan-bawah */}
          <div className="absolute inset-x-0 bottom-0 z-20 px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-amber-300 text-slate-950 w-fit">
                  <BookOpenIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{slide.badge}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] drop-shadow-md">
                  {slide.titlePrefix}
                  <span className="text-amber-300">{slide.titleHighlight}</span>
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed max-w-xl">
                  {slide.description}
                </p>
                <div className="pt-1.5 flex flex-wrap items-center gap-3">
                  <Button
                    variant="primary"
                    onClick={handleSsoLogin}
                    className="min-h-[44px] bg-amber-300 hover:bg-amber-200 text-slate-950 font-bold"
                  >
                    <PrimaryIcon className="w-4 h-4" aria-hidden="true" />
                    <span className="ml-1.5">{slide.primaryCtaText}</span>
                    <ArrowRightIcon className="w-4 h-4 ml-1.5" aria-hidden="true" />
                  </Button>
                  <a
                    href="#layanan"
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-[8px] bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold text-xs sm:text-sm transition-colors"
                  >
                    <Squares2X2Icon className="w-4 h-4 text-amber-300" aria-hidden="true" />
                    <span>Jelajahi Layanan</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 shrink-0 lg:flex-col lg:items-end lg:gap-3">
                <div className="flex items-center gap-2">
                  {HERO_SLIDES.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Slide ${idx + 1}: ${item.badge}`}
                      aria-current={idx === activeSlide}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeSlide ? 'w-8 bg-amber-300' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Slide Sebelumnya"
                    className="min-h-[44px] w-11 h-11 rounded-[8px] bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/25 transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Slide Berikutnya"
                    className="min-h-[44px] w-11 h-11 rounded-[8px] bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/25 transition-colors"
                  >
                    <ChevronRightIcon className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span className="text-xs font-semibold text-slate-200 ml-1 font-mono">{counter}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LAYANAN */}
        <section id="layanan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Belajar dan mengajar tanpa hambatan teknis
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              LMS UNUSU menyatukan materi, tugas, dan penilaian agar waktu kuliah terpakai untuk hal
              yang benar-benar penting.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {FITUR.map(({ Icon, judul, teks }) => (
              <div key={judul} className="rounded-2xl border border-[#CBD5E1] bg-white p-6">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">{judul}</h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{teks}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PERAN */}
        <section id="peran" className="bg-[#F1F5F2] border-y border-[#CBD5E1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Untuk siapa</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {[
                {
                  t: 'Mahasiswa',
                  d: 'Melihat kelas yang diikuti, membuka materi per pertemuan, dan mengumpulkan tugas sesuai tenggat.',
                },
                {
                  t: 'Dosen Pengampu',
                  d: 'Mengelola kelas, menetapkan materi, memeriksa pengumpulan tugas, dan memantau keterlibatan mahasiswa.',
                },
              ].map((item) => (
                <div key={item.t} className="rounded-2xl border border-[#CBD5E1] bg-white p-6">
                  <h3 className="text-base font-bold text-slate-900">{item.t}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TENTANG PLATFORM — teks kiri, gambar kanan (pola ONE UNUSU) */}
        <TentangPlatform
          id="tentang"
          eyebrow="Tentang Platform"
          title="Mengenal LMS UNUSU"
          portraitSrc="/assets/profil-mahasiswa-lms.png"
          fallbackSrc="/assets/pai/slider/slider1.jpg"
          imageAlt="Suasana pembelajaran daring mahasiswa Universitas Nahdlatul Ulama Sumatera Utara"
          paragraphs={[
            'LMS UNUSU adalah ruang belajar digital yang mempertemukan dosen dan mahasiswa dalam satu alur perkuliahan: bahan ajar, forum diskusi, penugasan, hingga penilaian — semuanya tercatat rapi per kelas.',
            'Mahasiswa melihat jadwal, mengumpulkan tugas, dan memantau nilai secara mandiri, sementara dosen mengelola materi serta memantau keterlibatan kelas dalam satu dasbor yang sama.',
          ]}
          bullets={[
            'Materi kuliah terpusat untuk setiap kelas dan pertemuan',
            'Pengumpulan tugas daring dengan tenggat dan penilaian',
            'Progres belajar mahasiswa terpantau dalam satu dasbor',
          ]}
        />

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="rounded-[16px] border border-emerald-900 bg-emerald-800 px-6 py-8 sm:px-10 sm:py-10 text-white flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Masuk dengan akun ONE UNUSU
              </h2>
              <p className="mt-2 text-sm text-emerald-50/90 leading-relaxed">
                Satu akun untuk seluruh layanan kampus. Peran mahasiswa atau dosen menentukan dasbor
                yang terbuka setelah masuk.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {user ? (
                <Link
                  to="/app"
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-[8px] bg-amber-300 px-5 text-sm font-bold text-slate-950 hover:bg-amber-200 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" aria-hidden="true" />
                  <span>Buka Dasbor</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleSsoLogin}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-[8px] bg-amber-300 px-5 text-sm font-bold text-slate-950 hover:bg-amber-200 transition-colors"
                >
                  <ShieldCheckIcon className="w-4 h-4" aria-hidden="true" />
                  <span>Masuk SSO</span>
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#CBD5E1] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-slate-500">
          &copy; {currentYear} LMS UNUSU &middot; Universitas Nahdlatul Ulama Sumatera Utara
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
