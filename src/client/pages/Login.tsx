import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import AnimatedFlatSsoLogo from '../components/AnimatedFlatSsoLogo';
import { SsoLoadingScreen } from '../components/SsoLoadingScreen';
import { AuthCardTemplate } from '../components/templates/AuthCardTemplate';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { getDefaultRedirectByRole } from '../App';

const ONE_UNUSU_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ONE_UNUSU_URL) || 'http://localhost:5173';
const SSO_CLIENT_ID = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SSO_CLIENT_ID) || 'lms-unusu';

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
      <div className="text-center space-y-2">
        {/* Logo ONE UNUSU — dapat diklik dan langsung memicu login SSO yang sama dengan tombol. */}
        <div className="flex justify-center">
          <AnimatedFlatSsoLogo size={160} onClick={handleSsoLogin} />
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
