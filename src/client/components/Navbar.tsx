import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, ExternalLink } from 'lucide-react';
import {
  ChevronDownIcon,
  GlobeAltIcon,
  IdentificationIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import type { SessionUser } from '../services/api';
import { StatusBadge } from './StatusBadge';

interface NavbarProps {
  role: 'mahasiswa' | 'dosen';
  user?: SessionUser | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ role, user, onLogout }) => {
  const location = useLocation();
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

  const initials = (user?.nama || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const homePath = role === 'dosen' ? '/dosen/dashboard' : '/mahasiswa/dashboard';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between min-h-16 py-2 items-center gap-2">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
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

            {/* Badge peran dari sesi SSO (tidak bisa diganti manual) */}
            <StatusBadge variant="emerald" className="ml-4 hidden lg:inline-flex rounded-full">
              <span>Peran:</span>
              <span className="uppercase font-extrabold text-emerald-800">{role}</span>
            </StatusBadge>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Navigasi utama" className="flex items-center space-x-1 sm:space-x-2">
            <Link
              to="/"
              className={`inline-flex items-center min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                location.pathname === '/'
                  ? 'text-emerald-800 bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Kelas Saya
            </Link>
            <Link
              to="/tasks"
              className={`inline-flex items-center min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                location.pathname === '/tasks'
                  ? 'text-emerald-800 bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Tugas & Nilai
            </Link>

            {/* Link back to ONE UNUSU */}
            <a
              href={import.meta.env.VITE_ONE_UNUSU_URL || 'http://localhost:5173'}
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center space-x-1.5 min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <span>Portal Kampus</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>

            {/* User Profile Dropdown */}
            <div className="relative pl-2 sm:pl-3" ref={dropdownRef}>
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
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[140px]">{user?.nama || 'Pengguna'}</p>
                  <p className="text-[10px] text-emerald-700 font-semibold">{user?.nim || user?.nidn || user?.username || '-'}</p>
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
                    <p className="font-bold text-slate-900 truncate">{user?.nama || 'Pengguna LMS'}</p>
                    <p className="text-[11px] text-slate-500 font-normal truncate">{user?.email || user?.nim || user?.nidn || user?.username}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[10px] font-bold border border-emerald-200 uppercase">
                      {role}
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
                      to={homePath}
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
                        onLogout?.();
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
          </nav>
        </div>
      </div>
    </header>
  );
};
