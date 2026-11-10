import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import AnimatedFlatSsoLogo from '../components/AnimatedFlatSsoLogo';
import { SsoLoadingScreen } from '../components/SsoLoadingScreen';
import { AuthCardTemplate } from '../components/templates/AuthCardTemplate';
import { useAuth } from '../context/AuthContext';
import { getDefaultRedirectByRole } from '../App';

const ONE_UNUSU_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ONE_UNUSU_URL) || 'http://localhost:5173';
const SSO_CLIENT_ID = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SSO_CLIENT_ID) || '50e3ed28134b379d';

export function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // True sejak tombol masuk ditekan hingga browser benar-benar berpindah ke
  // Portal ONE UNUSU. Dipakai untuk menampilkan layar tunggu penuh.
  const [redirecting, setRedirecting] = useState(false);

  // Jika sudah terautentikasi, alihkan ke fallback redirect sesuai role atau previous route
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || getDefaultRedirectByRole(user.role);
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  /**
   * Alur SSO v2 ONE UNUSU: minta tiket sekali pakai melalui halaman
   * `/authorize?client_id=..` di portal. Portal membangun URL callback dari
   * `urlRedirect` aplikasi, sehingga aplikasi tidak mengirim `redirect_uri`
   * sendiri dan tidak ada risiko path meleset.
   */
  const handleSsoLogin = () => {
    if (redirecting) return;
    // Hanya menyalakan layar tunggu. Perpindahan ke Portal ONE UNUSU baru
    // dijalankan oleh `onReady` setelah jeda animasi terlewati, sehingga logo
    // SSO sempat terlihat utuh alih-alih berkedip sepersekian detik.
    setRedirecting(true);
  };

  const goToPortal = () => {
    window.location.href = `${ONE_UNUSU_URL}/login?next=${encodeURIComponent(`/authorize?client_id=${encodeURIComponent(SSO_CLIENT_ID)}`)}`;
  };

  // Layar tunggu satu halaman penuh selama browser berpindah ke Portal ONE
  // UNUSU, supaya pengguna tidak menekan tombol masuk berulang kali.
  if (redirecting) {
    return (
      <SsoLoadingScreen
        title="Menghubungkan ke ONE UNUSU"
        description="Mengalihkan Anda ke Portal Single Sign-On kampus. Jangan tutup halaman ini."
        delayMs={1400}
        onReady={goToPortal}
      />
    );
  }

  return (
    <AuthCardTemplate>
      <div className="space-y-2 text-left">
        <p className="inline-block border-l-2 border-[#166534] pl-3 text-xs font-semibold uppercase tracking-wider text-[#166534]">
          Learning Management System
        </p>
        <h1 className="text-3xl font-bold text-slate-950 tracking-normal">
          Masuk ke <span className="text-[#166534]">LMS UNUSU</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
          Akses kelas perkuliahan, modul materi, pengumpulan tugas, dan evaluasi akademik melalui gerbang SSO terpadu.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-3 pt-2">
        <AnimatedFlatSsoLogo size={200} onClick={handleSsoLogin} />
        <div className="text-center">
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">ONE <span className="text-[#166534]">UNUSU</span></span>
        </div>
      </div>

      {/* Tombol Masuk — Gaya Terpadu SSO */}
      <button
        type="button"
        onClick={handleSsoLogin}
        className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-full bg-[#166534] hover:bg-[#14532D] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-98 cursor-pointer group"
        aria-label="Masuk dengan ONE UNUSU"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5 text-white shrink-0" />
        <span className="font-bold">Masuk dengan ONE UNUSU</span>
        <ChevronRightIcon className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform shrink-0" />
      </button>

      {/* Divider 'atau' */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative bg-white px-3 text-xs text-slate-400">
          atau
        </div>
      </div>

      {/* Footer terpusat */}
      <div className="text-xs text-slate-500 text-center font-normal pt-1">
        &copy; {new Date().getFullYear()} LMS UNUSU &bull; Universitas Nahdlatul Ulama Sumatera Utara
      </div>
    </AuthCardTemplate>
  );
}
