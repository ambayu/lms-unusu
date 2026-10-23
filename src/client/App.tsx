import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { ClassDetail } from './pages/ClassDetail';
import { TasksPage } from './pages/Tasks';

export function App() {
  const [role, setRole] = useState<'mahasiswa' | 'dosen'>('mahasiswa');

  const toggleRole = () => {
    setRole(prev => (prev === 'mahasiswa' ? 'dosen' : 'mahasiswa'));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Navbar role={role} onToggleRole={toggleRole} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard role={role} />} />
            <Route path="/class/:id" element={<ClassDetail role={role} />} />
            <Route path="/tasks" element={<TasksPage />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LMS UNUSU • Ruang Belajar Digital Universitas Nahdlatul Ulama Sumatera Utara</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
