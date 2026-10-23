import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User, Calendar, CheckSquare, Layers, LogOut, ExternalLink } from 'lucide-react';

interface NavbarProps {
  role: 'mahasiswa' | 'dosen';
  onToggleRole: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ role, onToggleRole }) => {
  const location = useLocation();

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

            {/* Portal Role Switcher Badge (Mock) */}
            <button
              onClick={onToggleRole}
              className="ml-4 hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100 transition"
              title="Klik untuk beralih mode simulasi"
            >
              <span>Peran:</span>
              <span className="uppercase font-extrabold text-emerald-700">{role}</span>
              <span className="text-[10px] text-emerald-600 underline ml-1">Ganti</span>
            </button>
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
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-emerald-700 hover:bg-slate-50 transition"
            >
              <span>Portal Kampus</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* User Profile Pill */}
            <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                {role === 'mahasiswa' ? 'MF' : 'JD'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800">
                  {role === 'mahasiswa' ? 'M. Fadhil' : 'Junaidy, M.Kom.'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {role === 'mahasiswa' ? '230101001' : 'NIDN. 0123068901'}
                </p>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
