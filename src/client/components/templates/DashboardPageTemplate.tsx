import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';
import { StatusBadge } from '../StatusBadge';
import { UserAuthorityCard } from '../UserAuthorityCard';
import { LoadingState, EmptyState, ErrorState } from '../StateViews';
import { useAuth } from '../../context/AuthContext';

export interface DashboardPageTemplateProps {
  semesterName: string;
  userName: string;
  roleDescription: string;
  summarySlot?: React.ReactNode;
  sectionTitle: string;
  sectionSubtitle: string;
  countLabel?: string;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  children: React.ReactNode;
}

/**
 * DashboardPageTemplate (Part 9.2) — struktur panel baku ekosistem ONE UNUSU:
 * sidebar navigasi (menu mengikuti modul aplikasi ini), topbar, welcome banner,
 * dan UserAuthorityCard di atas konten.
 */
export const DashboardPageTemplate: React.FC<DashboardPageTemplateProps> = ({
  semesterName,
  userName,
  roleDescription,
  summarySlot,
  sectionTitle,
  sectionSubtitle,
  countLabel,
  loading,
  error,
  onRetry,
  isEmpty,
  emptyTitle = 'Belum Ada Kelas Terdaftar',
  emptyMessage = 'Belum ada jadwal kelas perkuliahan pada semester aktif ini.',
  children,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = (user?.nama || userName || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const roleLabel =
    user?.role === 'admin'
      ? 'Administrator LMS'
      : user?.role === 'dosen'
        ? 'Dosen Pengampu'
        : 'Mahasiswa';

  const jam = new Date().getHours();
  const sapaan =
    jam < 11 ? 'Selamat pagi' : jam < 15 ? 'Selamat siang' : jam < 18 ? 'Selamat sore' : 'Selamat malam';
  const namaDepan = (userName || 'Pengguna').split(' ')[0];

  const menuItems = [
    { to: '/', label: 'Kelas Saya', Icon: BookOpenIcon, end: true },
    { to: '/tasks', label: 'Tugas & Nilai', Icon: ClipboardDocumentCheckIcon },
  ];

  /**
   * isActive — hanya SATU menu yang boleh aktif.
   *
   * Bug sebelumnya: menu "Kelas Saya" bertarget '/', sehingga
   * `location.pathname === '/'` selalu benar dan menu itu ikut menyala di
   * halaman lain. Selain itu halaman detail kelas ('/class/:id') tidak
   * menyalakan menu mana pun. Sekarang: menu ber-`end` harus cocok persis,
   * menu lain cocok sebagai prefix segmen, dan '/class/:id' dianggap bagian
   * dari "Kelas Saya".
   */
  const isActive = (to: string, end?: boolean) => {
    const current = location.pathname;

    if (end) return current === to;

    // Detail kelas adalah turunan dari daftar kelas.
    if (to === '/' && (current === '/' || current.startsWith('/class/'))) return true;

    if (current === to) return true;
    if (!current.startsWith(`${to}/`)) return false;

    return !menuItems.some(
      (m) => m.to !== to && m.to.length > to.length && (current === m.to || current.startsWith(`${m.to}/`))
    );
  };

  const renderMenu = (onNavigate?: () => void) =>
    menuItems.map(({ to, label, Icon, end }) => {
      const active = isActive(to, end);
      return (
        <Link
          key={to}
          to={to}
          onClick={() => onNavigate?.()}
          aria-current={active ? 'page' : undefined}
          className={`w-full min-h-[44px] inline-flex items-center gap-3 px-3 rounded-[8px] text-[13px] font-semibold transition-colors ${
            active
              ? 'bg-emerald-50 text-emerald-800'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{label}</span>
        </Link>
      );
    });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-[#CBD5E1] bg-white sticky top-0 h-screen">
        <div className="h-[88px] px-5 flex items-center gap-3 border-b border-[#CBD5E1]">
          <div className="w-10 h-10 rounded-[10px] bg-emerald-700 flex items-center justify-center shrink-0">
            <BookOpenIcon className="w-5 h-5 text-amber-300" aria-hidden="true" />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="font-extrabold text-sm text-slate-900 truncate">
              LMS <span className="text-emerald-700">UNUSU</span>
            </p>
            <p className="text-[10px] text-slate-500 truncate">Ruang Belajar Digital</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Navigasi panel LMS">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Menu</p>
          {renderMenu()}
        </nav>

        <div className="px-3 py-4 border-t border-[#CBD5E1] space-y-1">
          <a
            href={
              (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ONE_UNUSU_URL) ||
              'http://localhost:5173'
            }
            className="w-full min-h-[44px] inline-flex items-center gap-3 px-3 rounded-[8px] text-[13px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <HomeIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Portal ONE UNUSU</span>
          </a>
          <button
            type="button"
            onClick={logout}
            className="w-full min-h-[44px] inline-flex items-center gap-3 px-3 rounded-[8px] text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85%] bg-white h-full flex flex-col">
            <div className="h-[88px] px-5 flex items-center justify-between border-b border-[#CBD5E1]">
              <p className="font-extrabold text-sm text-slate-900">
                LMS <span className="text-emerald-700">UNUSU</span>
              </p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Tutup menu"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[8px] border border-[#CBD5E1] text-slate-600"
              >
                <XMarkIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Navigasi panel LMS (seluler)">
              {renderMenu(() => setDrawerOpen(false))}
            </nav>
            <div className="px-3 py-4 border-t border-[#CBD5E1]">
              <button
                type="button"
                onClick={logout}
                className="w-full min-h-[44px] inline-flex items-center gap-3 px-3 rounded-[8px] text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Keluar</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Kolom kanan */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-white border-b border-[#CBD5E1]">
          <div className="h-[88px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Buka menu"
                className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[8px] border border-[#CBD5E1] text-slate-600"
              >
                <Bars3Icon className="w-5 h-5" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span>Panel</span>
                  <span aria-hidden="true">›</span>
                  <span className="truncate">{sectionTitle}</span>
                </p>
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 truncate">
                  Dasbor LMS UNUSU
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 min-h-[44px] border-x border-[#CBD5E1] bg-transparent hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none"
                  aria-label="Profil pengguna"
                >
                  <div
                    aria-hidden="true"
                    className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-emerald-600"
                  >
                    {initials}
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <span className="block text-xs font-bold text-slate-800 truncate max-w-[140px]">
                      {user?.nama || userName}
                    </span>
                    <span className="block text-[10px] text-emerald-700 font-semibold truncate max-w-[140px]">
                      {roleLabel}
                    </span>
                  </div>
                  <ChevronDownIcon className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileDropdownOpen && (
                  <div
                    role="menu"
                    aria-label="Menu akun panel LMS"
                    className="absolute right-0 mt-2 w-60 rounded-[14px] bg-white shadow-md border border-[#CBD5E1] py-1.5 z-50 text-xs"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{user?.nama || userName}</p>
                      <p className="text-[11px] text-slate-500 font-normal truncate">{user?.email || user?.nim || user?.nidn || user?.username}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[10px] font-bold border border-emerald-200 uppercase">
                        {roleLabel}
                      </span>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors font-medium min-h-[40px]"
                      >
                        <GlobeAltIcon className="w-4 h-4 text-emerald-700" />
                        <span>Halaman Depan</span>
                      </Link>
                      <Link
                        to="/"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors font-medium min-h-[40px]"
                      >
                        <IdentificationIcon className="w-4 h-4 text-emerald-700" />
                        <span>Biodata Saya</span>
                      </Link>
                    </div>
                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-700 hover:bg-rose-50 transition-colors text-left font-semibold cursor-pointer min-h-[40px]"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 text-rose-700" />
                        <span>Keluar dari Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Welcome banner */}
          <div className="rounded-[16px] border border-emerald-900 bg-emerald-800 text-white p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-[6px] bg-white/10 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                Semester Aktif: {semesterName}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {sapaan}, {namaDepan}
              </h2>
              <p className="text-sm text-emerald-50/90 leading-relaxed">{roleDescription}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/tasks"
                className="min-h-[44px] inline-flex items-center gap-2 px-4 rounded-[8px] bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors"
              >
                <ClipboardDocumentCheckIcon className="w-4 h-4" aria-hidden="true" />
                <span>Tugas &amp; Nilai</span>
              </Link>
            </div>
          </div>

          {/* Kartu otoritas sesi */}
          <UserAuthorityCard user={user} roleLabel={roleLabel} />

          {summarySlot && <div>{summarySlot}</div>}

          {/* Daftar Kelas Perkuliahan */}
          <section className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{sectionTitle}</h2>
                <p className="text-xs sm:text-sm text-slate-600">{sectionSubtitle}</p>
              </div>
              {countLabel && <StatusBadge variant="neutral">{countLabel}</StatusBadge>}
            </div>

            {loading ? (
              <LoadingState message="Memuat daftar kelas perkuliahan..." />
            ) : error ? (
              <ErrorState message={error} onRetry={onRetry} />
            ) : isEmpty ? (
              <EmptyState title={emptyTitle} description={emptyMessage} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};
