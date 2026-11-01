import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMahasiswaTasks, ResourceItem } from '../services/api';
import { ArrowRight } from 'lucide-react';
import { ListPageTemplate } from '../components/templates/ListPageTemplate';
import { StatusBadge } from '../components/StatusBadge';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchMahasiswaTasks()
      .then((res) => setTasks(res.data.data || []))
      .catch((err) => {
        setError(
          err?.response?.data?.message ||
            'Gagal memuat daftar tugas perkuliahan. Silakan coba lagi.'
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <ListPageTemplate
      title="Agenda Tugas & Nilai"
      description="Daftar penugasan dari seluruh mata kuliah yang sedang berjalan"
      loading={loading}
      loadingMessage="Memuat daftar tugas perkuliahan..."
      error={error}
      onRetry={loadTasks}
      isEmpty={tasks.length === 0}
      emptyTitle="Belum Ada Tugas Perkuliahan"
      emptyMessage="Belum ada instruksi tugas yang diunggah dosen pada semester berjalan."
    >
      {tasks.map((t) => {
        const hasSubmission = Boolean(t.submissions && t.submissions.length > 0);
        const submission = hasSubmission ? t.submissions![0] : null;

        return (
          <article
            key={t.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge variant="emerald">Pertemuan {t.meeting}</StatusBadge>
                {hasSubmission ? (
                  <StatusBadge variant="info">Sudah Dikumpulkan</StatusBadge>
                ) : (
                  <StatusBadge variant="warning">Belum Dikumpulkan</StatusBadge>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">{t.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {t.description || 'Tidak ada petunjuk tambahan untuk tugas ini.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 shrink-0">
              {t.dueDate && (
                <div className="text-left md:text-right">
                  <span className="text-xs text-slate-600 block">Tenggat Waktu:</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 tabular-nums">
                    {new Date(t.dueDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {submission && submission.score !== undefined && submission.score !== null && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-center min-w-[88px]">
                  <span className="text-xs text-emerald-800 block font-semibold">Nilai Dosen</span>
                  <span className="text-lg font-black text-emerald-900 tabular-nums">
                    {submission.score}
                  </span>
                </div>
              )}

              <Link
                to={`/class/${t.classId}`}
                className="inline-flex items-center min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-xs font-bold text-slate-700 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 transition"
              >
                <span>Buka Kelas</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
              </Link>
            </div>
          </article>
        );
      })}
    </ListPageTemplate>
  );
};
