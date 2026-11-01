import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { ClassDetail } from './pages/ClassDetail';
import { TasksPage } from './pages/Tasks';
import { LoginPage } from './pages/Login';
import { LandingPage } from './pages/Landing';
import { SsoCallbackPage } from './pages/SsoCallback';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingState } from './components/StateViews';

/**
 * Helper untuk menentukan default redirect path berdasarkan peran pengguna setelah login
 */
export function getDefaultRedirectByRole(role?: string): string {
  switch (role) {
    case 'dosen':
      return '/';
    case 'mahasiswa':
      return '/';
    case 'admin':
      return '/';
    default:
      return '/';
  }
}

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingState message="Memuat sesi pengguna..." />
      </div>
    );
  }
  // Jangan pernah me-redirect guest ke /admin, arahkan ke login dengan return URL tersimpan
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppShell() {
  const { user, logout } = useAuth();
  // Peran ditentukan oleh akun SSO. Admin diperlakukan seperti dosen untuk akses kurikulum/kelas.
  const role: 'mahasiswa' | 'dosen' = user?.role === 'mahasiswa' ? 'mahasiswa' : 'dosen';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar role={role} user={user} onLogout={logout} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard role={role} />} />
          <Route path="/class/:id" element={<ClassDetail role={role} />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} LMS UNUSU: Ruang Belajar Digital Universitas Nahdlatul Ulama Sumatera Utara</p>
      </footer>
    </div>
  );
}

/**
 * Route handler untuk Root ('/')
 * Jika sudah login: tampilkan AppShell / Dashboard
 * Jika belum login (guest): tetap tampilkan Landing Page publik (tanpa me-redirect ke /admin atau /login secara paksa)
 */
function RootRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingState message="Memeriksa sesi..." />
      </div>
    );
  }

  if (user) {
    return <AppShell />;
  }

  // Guest melihat public landing page
  return <LandingPage />;
}

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
const BASE_PATH = BASE_URL.replace(/\/$/, '');

export function App() {
  const currentPath = window.location.pathname;
  const isBaseSubpath = BASE_PATH && currentPath.startsWith(BASE_PATH);
  const routerBasename = isBaseSubpath ? BASE_PATH : '';

  return (
    <AuthProvider>
      <Router basename={routerBasename}>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<RootRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sso/callback" element={<SsoCallbackPage />} />

          {/* Authenticated Application Routes */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />
          <Route
            path="/class/:id"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
