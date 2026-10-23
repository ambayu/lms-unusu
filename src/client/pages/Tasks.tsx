import React, { useEffect, useState } from 'react';
import { fetchMahasiswaTasks, ResourceItem } from '../services/api';
import { CheckSquare, Calendar, Award, Clock } from 'lucide-react';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMahasiswaTasks()
      .then((res) => setTasks(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Agenda Tugas & Nilai</h1>
        <p className="text-xs text-slate-500">Daftar penugasan dari seluruh mata kuliah yang sedang berjalan</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Memuat daftar tugas...</div>
      ) : (
        <div className="space-y-4">
          {tasks.map((t) => {
            const hasSubmission = (t.submissions && t.submissions.length > 0);
            const submission = hasSubmission ? t.submissions![0] : null;

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                      Pertemuan {t.meeting}
                    </span>
                    {hasSubmission ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        Sudah Dikumpulkan
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                        Belum Dikumpulkan
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{t.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">{t.description}</p>
                </div>

                <div className="flex items-center space-x-6">
                  {t.dueDate && (
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-slate-400 block">Tenggat Waktu:</span>
                      <span className="text-xs font-bold text-slate-700">
                        {new Date(t.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}

                  {submission && submission.score && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                      <span className="text-[10px] text-emerald-600 block font-semibold">Nilai Dosen</span>
                      <span className="text-lg font-black text-emerald-800">{submission.score}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
