import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, ExternalLink } from 'lucide-react';
import type { SessionUser } from '../services/api';

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
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm">
                <BookOpen className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-extrabold text-lg text-slate-900">LMS</span>
                  <span className="font-extrabold text-lg text-emerald-700">UNUSU</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Ruang Belajar Digital</p>
              </div>
            </Link>

            {/* Badge peran dari sesi SSO (tidak bisa diganti manual) */}
            <span className="ml-4 hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <span>Peran:</span>
              <span className="uppercase font-extrabold text-emerald-700">{role}</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-3">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                location.pathname === '/' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kelas Saya
            </Link>
            <Link
              to="/tasks"
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                location.pathname === '/tasks' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tugas & Nilai
            </Link>

            {/* Link back to ONE UNUSU */}
            <a
              href={import.meta.env.VITE_ONE_UNUSU_URL || 'http://localhost:5173'}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-emerald-700 hover:bg-slate-50 transition"
            >
              <span>Portal Kampus</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* User Profile Pill */}
            <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800">{user?.nama || 'Pengguna'}</p>
                <p className="text-[10px] text-slate-500">{user?.nim || user?.nidn || user?.username}</p>
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Keluar"
                  className="ml-1 p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
