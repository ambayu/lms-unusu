import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { ClassDetail } from './pages/ClassDetail';
import { TasksPage } from './pages/Tasks';
import { LoginPage } from './pages/Login';
import { SsoCallbackPage } from './pages/SsoCallback';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="p-12 text-center text-slate-500">Memuat sesi...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppShell() {
  const { user, logout } = useAuth();
  // Peran ditentukan oleh akun SSO, bukan lagi tombol simulasi di navbar.
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
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>Ac {new Date().getFullYear()} LMS UNUSU — Ruang Belajar Digital Universitas Nahdlatul Ulama Sumatera Utara</p>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sso/callback" element={<SsoCallbackPage />} />
          <Route path="/*" element={<ProtectedRoute><AppShell /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
