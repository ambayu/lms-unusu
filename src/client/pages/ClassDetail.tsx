import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchClassDetail, ClassItem, ResourceItem, submitMahasiswaTask, createDosenResource } from '../services/api';
import { BookOpen, FileText, CheckSquare, MessageSquare, ArrowLeft, Upload, CheckCircle2, Clock, Plus } from 'lucide-react';

interface ClassDetailProps {
  role: 'mahasiswa' | 'dosen';
}

export const ClassDetail: React.FC<ClassDetailProps> = ({ role }) => {
  const { id } = useParams<{ id: string }>();
  const [kelas, setKelas] = useState<ClassItem | null>(null);
  const [activeTab, setActiveTab] = useState<'materials' | 'tasks' | 'attendance'>('materials');
  const [loading, setLoading] = useState(true);

  // Modal State Form Dosen Tambah Resource
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'materials' | 'tasks'>('materials');
  const [newMeeting, setNewMeeting] = useState(1);
  const [newDesc, setNewDesc] = useState('');
  const [newFileName, setNewFileName] = useState('');

  // State Mahasiswa Pengumpulan
  const [submittingTaskId, setSubmittingTaskId] = useState<number | null>(null);
  const [submitNote, setSubmitNote] = useState('');
  const [submitFileName, setSubmitFileName] = useState('');

  const loadData = () => {
    if (!id) return;
    setLoading(true);
    fetchClassDetail(Number(id))
      .then((res) => setKelas(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await createDosenResource({
        classId: Number(id),
        type: newType,
        title: newTitle,
        meeting: Number(newMeeting),
        description: newDesc,
        fileName: newFileName || (newType === 'materials' ? 'Slide_Materi.pdf' : 'Instruksi_Tugas.pdf'),
        dueDate: newType === 'tasks' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null
      });
      setShowAddModal(false);
      setNewTitle('');
      setNewDesc('');
      setNewFileName('');
      loadData();
    } catch (err) {
      alert('Gagal menambah resource');
    }
  };

  const handleSubmitTask = async (resourceId: number) => {
    if (!submitNote) {
      alert('Tuliskan catatan pengumpulan');
      return;
    }
    try {
      // Mock enrollmentId = 1 (Fadhil)
      await submitMahasiswaTask({
        resourceId,
        enrollmentId: 1,
        note: submitNote,
        fileName: submitFileName || 'Jawaban_Tugas_Fadhil.zip'
      });
      alert('Tugas berhasil dikumpulkan!');
      setSubmittingTaskId(null);
      setSubmitNote('');
      setSubmitFileName('');
      loadData();
    } catch (err) {
      alert('Gagal mengumpulkan tugas');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">Memuat detail kelas...</div>;
  }

  if (!kelas) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">Kelas tidak ditemukan.</div>;
  }

  const materials = kelas.resources?.filter(r => r.type === 'materials') || [];
  const tasks = kelas.resources?.filter(r => r.type === 'tasks') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button & Class Header */}
      <div>
        <Link to="/" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-emerald-700 mb-4">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Kembali ke Daftar Kelas</span>
        </Link>
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800">
                {kelas.code} • {kelas.group} • {kelas.sks} SKS
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{kelas.courseName}</h1>
              <p className="text-xs text-slate-500 mt-1">
                Semester: {kelas.semester?.name} | Ruang: {kelas.room || 'Daring'} | Jadwal: {kelas.schedule}
              </p>
            </div>
            {role === 'dosen' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow transition"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Tambah Materi / Tugas</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('materials')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === 'materials'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Materi Pembelajaran ({materials.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === 'tasks'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Penugasan & Proyek ({tasks.length})
        </button>
      </div>

      {/* TAB CONTENT: MATERIALS */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          {materials.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              Belum ada modul materi yang diunggah dosen.
            </div>
          ) : (
            materials.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400">Pertemuan {m.meeting}</span>
                    <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{m.description || 'Slide materi perkuliahan'}</p>
                    {m.fileName && (
                      <span className="inline-block mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        📎 {m.fileName}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => alert(`Mengunduh file materi: ${m.fileName}`)}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-xs font-bold text-slate-700 hover:text-emerald-800 transition"
                >
                  Unduh Materi
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: TASKS */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              Belum ada tugas perkuliahan untuk kelas ini.
            </div>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2.5 py-0.5 rounded-full border border-yellow-200">
                      Tugas Pertemuan {t.meeting}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">{t.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.description}</p>
                  </div>
                  {t.dueDate && (
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Tenggat Waktu:</span>
                      <span className="text-xs font-bold text-rose-600">
                        {new Date(t.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Submissions Section */}
                <div className="pt-4 border-t border-slate-100">
                  {role === 'mahasiswa' && (
                    <div>
                      {submittingTaskId === t.id ? (
                        <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                          <p className="text-xs font-bold text-slate-700">Form Pengumpulan Tugas</p>
                          <textarea
                            value={submitNote}
                            onChange={(e) => setSubmitNote(e.target.value)}
                            placeholder="Tuliskan catatan atau link repository GitHub / Drive..."
                            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-emerald-600"
                            rows={3}
                          />
                          <input
                            type="text"
                            value={submitFileName}
                            onChange={(e) => setSubmitFileName(e.target.value)}
                            placeholder="Nama file lampiran (contoh: TugasWeb_Fadhil.zip)"
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-emerald-600"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSubmitTask(t.id)}
                              className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
                            >
                              Kirim Tugas
                            </button>
                            <button
                              onClick={() => setSubmittingTaskId(null)}
                              className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSubmittingTaskId(t.id)}
                          className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                        >
                          <Upload className="w-3.5 h-3.5 mr-1.5" />
                          <span>Kumpulkan Jawaban</span>
                        </button>
                      )}
                    </div>
                  )}

                  {role === 'dosen' && (
                    <div className="text-xs text-slate-500">
                      Total Submission: <span className="font-bold text-slate-800">{t.submissions?.length || 0} Mahasiswa</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL FORM TAMBAH RESOURCE DOSEN */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Tambah Bahan Ajar / Tugas Baru</h3>
            <form onSubmit={handleAddResource} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Tipe</label>
                <select
                  value={newType}
                  onChange={(e: any) => setNewType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="materials">Materi Kuliah (Slide/PDF)</option>
                  <option value="tasks">Penugasan Mahasiswa</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Judul</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Misal: Modul Pertemuan 4 - State Management"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Pertemuan Ke-</label>
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={newMeeting}
                  onChange={(e) => setNewMeeting(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Deskripsi / Petunjuk</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Tuliskan petunjuk pembelajaran atau soal tugas..."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nama File Dokumen</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Contoh: Slide_Materi_04.pdf"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-xs font-bold text-white hover:bg-emerald-800"
                >
                  Simpan Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
