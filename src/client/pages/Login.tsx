import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthCardTemplate } from '../components/templates/AuthCardTemplate';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { getDefaultRedirectByRole } from '../App';

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
const ONE_UNUSU_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ONE_UNUSU_URL) || 'http://localhost:5173';

export function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Jika sudah terautentikasi, alihkan ke fallback redirect sesuai role atau previous route
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || getDefaultRedirectByRole(user.role);
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSsoLogin = () => {
    // Autentikasi dipusatkan di ONE UNUSU. Setelah login, pilih aplikasi
    // "LMS UNUSU" dari portal untuk masuk ke sini.
    window.location.href = `${ONE_UNUSU_URL}/login`;
  };

  return (
    <AuthCardTemplate>
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 mx-auto flex items-center justify-center">
          <img
            src={BASE_URL + 'assets/pai/logo-unusu.jpg'}
            alt="Logo Universitas Nahdlatul Ulama Sumatera Utara"
            width={56}
            height={56}
            fetchPriority="high"
            className="w-14 h-14 object-contain"
          />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">LMS UNUSU</h1>
        <p className="text-xs text-slate-600 font-medium">
          Ruang Belajar Digital: Materi, Tugas & Penilaian
        </p>
      </div>

      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-800 text-xs flex items-start gap-2">
        <KeyRound className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          Aplikasi ini memakai <strong>SSO ONE UNUSU</strong>. Satu akun untuk seluruh layanan
          kampus, tanpa kata sandi terpisah di halaman ini.
        </span>
      </div>

      <Button variant="primary" onClick={handleSsoLogin} className="w-full py-3 shadow-md">
        <span>Masuk via ONE UNUSU</span>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-emerald-800 font-medium">
        <ShieldCheck className="w-4 h-4" aria-hidden="true" />
        <span>Autentikasi terpusat ONE UNUSU</span>
      </div>
    </AuthCardTemplate>
  );
}
