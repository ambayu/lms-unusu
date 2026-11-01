import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchClassDetail,
  fetchClassAttendance,
  ClassItem,
  submitMahasiswaTask,
  createDosenResource,
} from '../services/api';
import { BookOpen, Upload, Plus, FileText, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DetailPageTemplate } from '../components/templates/DetailPageTemplate';
import { Button } from '../components/Button';
import { StatusBadge, StatusBadgeVariant } from '../components/StatusBadge';
import { FormSectionCard } from '../components/FormSectionCard';
import { FormField } from '../components/FormField';
import { EmptyState, LoadingState, ErrorState } from '../components/StateViews';
import { ModalDialog } from '../components/ModalDialog';

interface ClassDetailProps {
  role: 'mahasiswa' | 'dosen';
}

interface AttendanceRecord {
  id: number;
  meeting: number;
  status: string;
  note?: string | null;
}

interface EnrollmentAttendanceItem {
  id: number;
  studentId: number;
  student?: {
    id: number;
    nim: string;
    name: string;
    prodi?: string | null;
  };
  attendances?: AttendanceRecord[];
}

const inputBaseClass =
  'w-full min-h-[44px] text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition';

const mapAttendanceBadgeVariant = (status: string): StatusBadgeVariant => {
  switch (status) {
    case 'Hadir':
      return 'emerald';
    case 'Izin':
      return 'info';
    case 'Sakit':
      return 'warning';
    case 'Alpa':
      return 'danger';
    default:
      return 'neutral';
  }
};

export const ClassDetail: React.FC<ClassDetailProps> = ({ role }) => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [kelas, setKelas] = useState<ClassItem | null>(null);
  const [activeTab, setActiveTab] = useState<'materials' | 'tasks' | 'attendance'>('materials');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // State Rekap Presensi
  const [attendanceList, setAttendanceList] = useState<EnrollmentAttendanceItem[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);

  // Modal State Form Dosen Tambah Resource
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'materials' | 'tasks'>('materials');
  const [newMeeting, setNewMeeting] = useState(1);
  const [newDesc, setNewDesc] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [savingResource, setSavingResource] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // State Mahasiswa Pengumpulan Tugas
  const [submittingTaskId, setSubmittingTaskId] = useState<number | null>(null);
  const [submitNote, setSubmitNote] = useState('');
  const [submitFileName, setSubmitFileName] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittingTask, setSubmittingTask] = useState(false);

  const loadData = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchClassDetail(Number(id))
      .then((res) => setKelas(res.data.data))
      .catch((err) => {
        setError(
          err?.response?.data?.message ||
            'Gagal memuat detail kelas perkuliahan. Silakan coba lagi.'
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  const loadAttendance = useCallback(() => {
    if (!id) return;
    setAttendanceLoading(true);
    setAttendanceError(null);
    fetchClassAttendance(Number(id))
      .then((res) => setAttendanceList(res.data.data || []))
      .catch((err) => {
        setAttendanceError(
          err?.response?.data?.message || 'Gagal memuat rekap presensi kelas ini.'
        );
      })
      .finally(() => setAttendanceLoading(false));
  }, [id]);

  useEffect(() => {
    loadData();
    loadAttendance();
  }, [loadData, loadAttendance]);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!newTitle.trim()) {
      setModalError('Judul bahan ajar atau tugas wajib diisi.');
      return;
    }

    setSavingResource(true);
    setModalError(null);
    try {
      await createDosenResource({
        classId: Number(id),
        type: newType,
        title: newTitle.trim(),
        meeting: Number(newMeeting),
        description: newDesc.trim(),
        fileName:
          newFileName.trim() ||
          (newType === 'materials' ? 'Slide_Materi.pdf' : 'Instruksi_Tugas.pdf'),
        dueDate:
          newType === 'tasks' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
      });
      setShowAddModal(false);
      setNewTitle('');
      setNewDesc('');
      setNewFileName('');
      setFeedbackBanner({
        type: 'success',
        message: 'Bahan ajar atau penugasan baru berhasil disimpan.',
      });
      loadData();
    } catch (err: any) {
      setModalError(
        err?.response?.data?.message || 'Gagal menyimpan bahan ajar. Silakan coba kembali.'
      );
    } finally {
      setSavingResource(false);
    }
  };

  const handleSubmitTask = async (e: React.FormEvent, resourceId: number) => {
    e.preventDefault();
    if (!submitNote.trim()) {
      setSubmitError('Tuliskan catatan pengumpulan atau tautan repositori terlebih dahulu.');
      return;
    }

    setSubmittingTask(true);
    setSubmitError(null);
    try {
      const enrollmentId = user?.id || 1;
      await submitMahasiswaTask({
        resourceId,
        enrollmentId,
        note: submitNote.trim(),
        fileName: submitFileName.trim() || 'Jawaban_Tugas_Mahasiswa.zip',
      });
      setSubmittingTaskId(null);
      setSubmitNote('');
      setSubmitFileName('');
      setFeedbackBanner({
        type: 'success',
        message: 'Jawaban tugas Anda berhasil dikumpulkan.',
      });
      loadData();
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message || 'Gagal mengumpulkan jawaban tugas. Silakan coba lagi.'
      );
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleDownloadMaterial = (title: string, fileName?: string) => {
    const targetName = fileName || `${title.replace(/\s+/g, '_')}.pdf`;
    setFeedbackBanner({
      type: 'success',
      message: `Menyiapkan unduhan berkas materi: ${targetName}`,
    });
  };

  const materials = kelas?.resources?.filter((r) => r.type === 'materials') || [];
  const tasks = kelas?.resources?.filter((r) => r.type === 'tasks') || [];

  return (
    <>
      <DetailPageTemplate
        backTo="/"
        backLabel="Kembali ke Daftar Kelas"
        loading={loading}
        loadingMessage="Memuat detail kelas perkuliahan..."
        error={error}
        onRetry={loadData}
        badgeText={kelas ? `${kelas.code} • ${kelas.group} • ${kelas.sks} SKS` : undefined}
        title={kelas?.courseName}
        metadata={
          kelas
            ? `Semester: ${kelas.semester?.name || '-'} | Ruang: ${kelas.room || 'Daring'} | Jadwal: ${kelas.schedule || 'Belum ditentukan'}`
            : undefined
        }
        actions={
          role === 'dosen' ? (
            <Button
              variant="primary"
              onClick={() => {
                setModalError(null);
                setShowAddModal(true);
              }}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Tambah Materi / Tugas</span>
            </Button>
          ) : undefined
        }
        tabs={[
          { id: 'materials', label: 'Materi Pembelajaran', count: materials.length },
          { id: 'tasks', label: 'Penugasan & Proyek', count: tasks.length },
          { id: 'attendance', label: 'Presensi', count: attendanceList.length },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as 'materials' | 'tasks' | 'attendance')}
      >
        <div className="space-y-4">
          {feedbackBanner && (
            <div
              role="status"
              className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 ${
                feedbackBanner.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              <span>{feedbackBanner.message}</span>
              <button
                type="button"
                onClick={() => setFeedbackBanner(null)}
                className="min-h-[36px] px-2.5 rounded-lg text-xs font-bold underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                Tutup
              </button>
            </div>
          )}

          {/* TAB CONTENT: MATERIALS */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              {materials.length === 0 ? (
                <EmptyState
                  title="Belum Ada Materi Pembelajaran"
                  description="Belum ada modul materi yang diunggah dosen untuk kelas ini."
                  action={
                    role === 'dosen' ? (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setNewType('materials');
                          setShowAddModal(true);
                        }}
                      >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        <span>Tambah Materi Pertama</span>
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                materials.map((m) => (
                  <article
                    key={m.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-600">
                          Pertemuan {m.meeting}
                        </span>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">{m.title}</h2>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                          {m.description || 'Slide materi perkuliahan'}
                        </p>
                        {m.fileName && (
                          <div className="pt-1">
                            <StatusBadge variant="emerald">
                              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>{m.fileName}</span>
                            </StatusBadge>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => handleDownloadMaterial(m.title, m.fileName)}
                    >
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span>Unduh Materi</span>
                    </Button>
                  </article>
                ))
              )}
            </div>
          )}

          {/* TAB CONTENT: TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <EmptyState
                  title="Belum Ada Penugasan"
                  description="Belum ada tugas perkuliahan untuk kelas ini."
                  action={
                    role === 'dosen' ? (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setNewType('tasks');
                          setShowAddModal(true);
                        }}
                      >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        <span>Buat Tugas Baru</span>
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                tasks.map((t) => (
                  <article
                    key={t.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="space-y-1.5">
                        <StatusBadge variant="warning">Tugas Pertemuan {t.meeting}</StatusBadge>
                        <h2 className="text-lg font-bold text-slate-900">{t.title}</h2>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                          {t.description || 'Ikuti instruksi pengerjaan yang disampaikan di kelas.'}
                        </p>
                      </div>
                      {t.dueDate && (
                        <div className="text-left sm:text-right shrink-0">
                          <span className="text-xs text-slate-600 block">Tenggat Waktu:</span>
                          <span className="text-xs sm:text-sm font-bold text-rose-700 tabular-nums">
                            {new Date(t.dueDate).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Submissions Section */}
                    <div className="pt-4 border-t border-slate-100">
                      {role === 'mahasiswa' && (
                        <div>
                          {submittingTaskId === t.id ? (
                            <form
                              onSubmit={(e) => handleSubmitTask(e, t.id)}
                              className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4"
                            >
                              <FormSectionCard
                                title="Detail Pengumpulan Jawaban"
                                description="Lengkapi tautan repositori atau catatan jawaban beserta nama berkas lampiran."
                              >
                                <FormField
                                  id={`submit-note-${t.id}`}
                                  label="Catatan Jawaban / Tautan Repositori"
                                  required
                                  hint="Sertakan tautan GitHub, Google Drive, atau ringkasan penyelesaian tugas."
                                  error={submitError || undefined}
                                >
                                  <textarea
                                    id={`submit-note-${t.id}`}
                                    aria-describedby={`submit-note-${t.id}-hint`}
                                    value={submitNote}
                                    onChange={(e) => setSubmitNote(e.target.value)}
                                    placeholder="Tuliskan catatan atau tautan repositori GitHub / Google Drive..."
                                    className={inputBaseClass}
                                    rows={3}
                                  />
                                </FormField>

                                <FormField
                                  id={`submit-file-${t.id}`}
                                  label="Nama Berkas Lampiran"
                                  hint="Format yang disarankan: .zip atau .pdf (contoh: TugasWeb_NIM.zip)."
                                >
                                  <input
                                    id={`submit-file-${t.id}`}
                                    aria-describedby={`submit-file-${t.id}-hint`}
                                    type="text"
                                    value={submitFileName}
                                    onChange={(e) => setSubmitFileName(e.target.value)}
                                    placeholder="Contoh: TugasWeb_230101001.zip"
                                    className={inputBaseClass}
                                  />
                                </FormField>
                              </FormSectionCard>

                              <div className="flex flex-wrap justify-end gap-2 pt-2">
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    setSubmittingTaskId(null);
                                    setSubmitError(null);
                                  }}
                                  disabled={submittingTask}
                                >
                                  Batal
                                </Button>
                                <Button type="submit" variant="primary" loading={submittingTask}>
                                  Kirim Tugas
                                </Button>
                              </div>
                            </form>
                          ) : (
                            <Button
                              variant="primary"
                              onClick={() => {
                                setSubmitError(null);
                                setSubmittingTaskId(t.id);
                              }}
                            >
                              <Upload className="w-4 h-4" aria-hidden="true" />
                              <span>Kumpulkan Jawaban</span>
                            </Button>
                          )}
                        </div>
                      )}

                      {role === 'dosen' && (
                        <div className="text-xs sm:text-sm text-slate-600 tabular-nums">
                          Total Pengumpulan:{' '}
                          <span className="font-bold text-slate-900">
                            {t.submissions?.length || 0} Mahasiswa
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {/* TAB CONTENT: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              {attendanceLoading ? (
                <LoadingState message="Memuat rekap presensi kelas..." />
              ) : attendanceError ? (
                <ErrorState message={attendanceError} onRetry={loadAttendance} />
              ) : attendanceList.length === 0 ? (
                <EmptyState
                  title="Belum Ada Data Presensi"
                  description="Belum ada rekaman kehadiran mahasiswa yang tercatat pada kelas ini."
                />
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                  <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Rekapitulasi Kehadiran Mahasiswa
                      </h2>
                      <p className="text-xs text-slate-600">
                        Daftar status kehadiran per pertemuan perkuliahan
                      </p>
                    </div>
                    <StatusBadge variant="neutral">
                      {attendanceList.length} Mahasiswa Terdaftar
                    </StatusBadge>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                          <th className="py-3.5 px-6">NIM</th>
                          <th className="py-3.5 px-6">Nama Mahasiswa</th>
                          <th className="py-3.5 px-6">Program Studi</th>
                          <th className="py-3.5 px-6">Riwayat Pertemuan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-700">
                        {attendanceList.map((entry) => (
                          <tr key={entry.id} className="hover:bg-slate-50/80">
                            <td className="py-4 px-6 font-semibold text-slate-900 tabular-nums">
                              {entry.student?.nim || '-'}
                            </td>
                            <td className="py-4 px-6 font-bold text-slate-900">
                              {entry.student?.name || 'Mahasiswa'}
                            </td>
                            <td className="py-4 px-6 text-slate-600">
                              {entry.student?.prodi || 'Sistem Informasi'}
                            </td>
                            <td className="py-4 px-6">
                              {entry.attendances && entry.attendances.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {entry.attendances.map((att) => (
                                    <StatusBadge
                                      key={att.id}
                                      variant={mapAttendanceBadgeVariant(att.status)}
                                    >
                                      Pertemuan {att.meeting}: {att.status}
                                    </StatusBadge>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-slate-600">
                                  Belum ada catatan presensi
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DetailPageTemplate>

      {/* MODAL FORM TAMBAH RESOURCE DOSEN (Sesuai Part 10.8: FormSectionCard) */}
      <ModalDialog
        open={showAddModal}
        title="Tambah Bahan Ajar / Tugas Baru"
        description="Lengkapi informasi pertemuan dan dokumen lampiran untuk mahasiswa di kelas ini."
        onClose={() => setShowAddModal(false)}
      >
        <form onSubmit={handleAddResource} className="space-y-4">
          {modalError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700"
            >
              {modalError}
            </div>
          )}

          <FormSectionCard
            title="Informasi Pertemuan"
            description="Pilih kategori bahan ajar, urutan sesi pertemuan, dan judul materi."
          >
            <FormField id="resource-type" label="Kategori Bahan Ajar" required>
              <select
                id="resource-type"
                value={newType}
                onChange={(e) => setNewType(e.target.value as 'materials' | 'tasks')}
                className={inputBaseClass}
              >
                <option value="materials">Materi Kuliah (Slide / PDF)</option>
                <option value="tasks">Penugasan Mahasiswa</option>
              </select>
            </FormField>

            <FormField
              id="resource-meeting"
              label="Pertemuan Ke-"
              required
              hint="Rentang sesi perkuliahan standar adalah pertemuan 1 sampai 16."
            >
              <input
                id="resource-meeting"
                aria-describedby="resource-meeting-hint"
                type="number"
                min={1}
                max={16}
                required
                value={newMeeting}
                onChange={(e) => setNewMeeting(Number(e.target.value))}
                className={inputBaseClass}
              />
            </FormField>

            <FormField id="resource-title" label="Judul Materi / Tugas" required>
              <input
                id="resource-title"
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Modul Pertemuan 4: State Management"
                className={inputBaseClass}
              />
            </FormField>
          </FormSectionCard>

          <FormSectionCard
            title="Petunjuk & Lampiran Dokumen"
            description="Tuliskan arahan belajar atau instruksi soal beserta nama berkas pendukung."
          >
            <FormField id="resource-desc" label="Deskripsi / Petunjuk Pembelajaran">
              <textarea
                id="resource-desc"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Tuliskan petunjuk pembelajaran atau soal tugas secara jelas..."
                rows={3}
                className={inputBaseClass}
              />
            </FormField>

            <FormField
              id="resource-file"
              label="Nama Berkas Dokumen"
              hint="Kosongkan jika ingin memakai nama berkas bawaan (.pdf)."
            >
              <input
                id="resource-file"
                aria-describedby="resource-file-hint"
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Contoh: Slide_Materi_04.pdf"
                className={inputBaseClass}
              />
            </FormField>
          </FormSectionCard>

          <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-slate-200">
            <Button
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              disabled={savingResource}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" loading={savingResource}>
              Simpan Bahan Ajar
            </Button>
          </div>
        </form>
      </ModalDialog>
    </>
  );
};
