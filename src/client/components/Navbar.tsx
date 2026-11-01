import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, ExternalLink } from 'lucide-react';
import type { SessionUser } from '../services/api';
import { StatusBadge } from './StatusBadge';

interface NavbarProps {
  role: 'mahasiswa' | 'dosen';
  user?: SessionUser | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ role, user, onLogout }) => {
  const location = useLocation();

  const initials = (user?.nama || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

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

            {/* User Profile Pill */}
            <div className="flex items-center space-x-2 pl-2 sm:pl-3 border-l border-slate-200">
              <div
                aria-hidden="true"
                className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0"
              >
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800">{user?.nama || 'Pengguna'}</p>
                <p className="text-xs text-slate-600">{user?.nim || user?.nidn || user?.username}</p>
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Keluar dari sesi LMS"
                  aria-label="Keluar dari sesi LMS"
                  className="ml-1 inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
