import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMahasiswaClasses, fetchDosenClasses, ClassItem } from '../services/api';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DashboardPageTemplate } from '../components/templates/DashboardPageTemplate';
import { StatusBadge } from '../components/StatusBadge';

interface DashboardProps {
  role: 'mahasiswa' | 'dosen';
}

export const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClasses = useCallback(() => {
    setLoading(true);
    setError(null);
    const activeUserId = user?.id || 1;
    const request =
      role === 'mahasiswa'
        ? fetchMahasiswaClasses(activeUserId)
        : fetchDosenClasses(activeUserId);

    request
      .then((res) => setClasses(res.data.data || []))
      .catch((err) => {
        setError(
          err?.response?.data?.message ||
            'Gagal memuat daftar kelas perkuliahan. Periksa koneksi ke server LMS.'
        );
      })
      .finally(() => setLoading(false));
  }, [role, user?.id]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const activeSemesterName = classes[0]?.semester?.name || '2026/2027 Ganjil';
  const displayName =
    user?.nama || (role === 'mahasiswa' ? 'Mahasiswa UNUSU' : 'Dosen Pengampu');
  const roleDescription =
    role === 'mahasiswa'
      ? 'Kelola kegiatan perkuliahan, unduh modul materi dosen, kumpulkan tugas tepat waktu, dan pantau rekap presensi Anda.'
      : 'Kelola kelas perkuliahan yang diampu, unggah materi pembelajaran, berikan penugasan, dan nilai pengumpulan tugas mahasiswa.';

  return (
    <DashboardPageTemplate
      semesterName={activeSemesterName}
      userName={displayName}
      roleDescription={roleDescription}
      sectionTitle="Daftar Kelas Perkuliahan"
      sectionSubtitle={
        role === 'mahasiswa'
          ? 'Mata kuliah yang Anda ambil pada semester berjalan'
          : 'Mata kuliah yang Anda ampu pada semester berjalan'
      }
      countLabel={`${classes.length} Kelas Terdaftar`}
      loading={loading}
      error={error}
      onRetry={loadClasses}
      isEmpty={classes.length === 0}
      emptyTitle="Belum Ada Kelas Perkuliahan"
      emptyMessage={
        role === 'mahasiswa'
          ? 'Anda belum terdaftar pada kelas perkuliahan di semester aktif ini.'
          : 'Belum ada kelas perkuliahan yang ditugaskan kepada Anda pada semester ini.'
      }
    >
      {classes.map((classData) => (
        <article
          key={classData.id}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-600/40 transition-all flex flex-col justify-between group overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <StatusBadge variant="emerald">
                {classData.code} • {classData.group}
              </StatusBadge>
              <span className="text-xs text-slate-600 font-semibold tabular-nums">
                {classData.sks} SKS
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-2 mb-2">
              {classData.courseName}
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
              {classData.description || 'Tidak ada deskripsi mata kuliah.'}
            </p>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                <span>{classData.schedule || 'Jadwal belum ditentukan'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                <span>{classData.room || 'Ruang Daring'}</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="text-xs text-slate-600 tabular-nums">
              <span>Progres: </span>
              <span className="font-bold text-slate-800">{classData.done}</span>/
              {classData.meetings} Sesi
            </div>
            <Link
              to={`/class/${classData.id}`}
              className="inline-flex items-center min-h-[44px] px-3 rounded-xl text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 transition"
            >
              <span>Masuk Kelas</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
            </Link>
          </div>
        </article>
      ))}
    </DashboardPageTemplate>
  );
};
