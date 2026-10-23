import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMahasiswaClasses, fetchDosenClasses, ClassItem } from '../services/api';
import { BookOpen, Calendar, MapPin, Users, ArrowRight, Clock, Award, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  role: 'mahasiswa' | 'dosen';
}

export const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const request = role === 'mahasiswa' ? fetchMahasiswaClasses(1) : fetchDosenClasses(1);
    request
      .then((res) => setClasses(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [role]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-yellow-300 px-3 py-1 rounded-full">
            Semester Aktif: 2026/2027 Ganjil
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Selamat Datang di Ruang Belajar, {role === 'mahasiswa' ? 'Muhammad Fadhil' : 'Bapak Junaidy, M.Kom.'}
          </h1>
          <p className="text-emerald-100 text-sm leading-relaxed">
            {role === 'mahasiswa'
              ? 'Kelola kegiatan perkuliahan, unduh modul materi dosen, kumpulkan tugas tepat waktu, dan pantau rekap presensi kamu.'
              : 'Kelola kelas perkuliahan yang diampu, unggah materi pembelajaran, berikan penugasan, dan nilai submission mahasiswa.'}
          </p>
        </div>
      </div>

      {/* Class List Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Daftar Kelas Perkuliahan</h2>
            <p className="text-xs text-slate-500">
              {role === 'mahasiswa' ? 'Mata kuliah yang kamu ambil semester ini' : 'Mata kuliah yang kamu ampu semester ini'}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
            {classes.length} Kelas Terdaftar
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Memuat data kelas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => {
              const classData = role === 'mahasiswa' ? cls : cls;
              return (
                <div
                  key={classData.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-emerald-500/40 transition-all flex flex-col justify-between group overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {classData.code} • {classData.group}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{classData.sks} SKS</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-2 mb-2">
                      {classData.courseName}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {classData.description || 'Tidak ada deskripsi'}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{classData.schedule || 'Jadwal belum ditentukan'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{classData.room || 'Ruang Daring'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      <span>Progres: </span>
                      <span className="font-bold text-slate-800">{classData.done}</span>/{classData.meetings} Sesi
                    </div>
                    <Link
                      to={`/class/${classData.id}`}
                      className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <span>Masuk Kelas</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
