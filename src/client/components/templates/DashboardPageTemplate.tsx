import React from 'react';
import { StatusBadge } from '../StatusBadge';
import { LoadingState, EmptyState, ErrorState } from '../StateViews';

export interface DashboardPageTemplateProps {
  semesterName: string;
  userName: string;
  roleDescription: string;
  summarySlot?: React.ReactNode;
  sectionTitle: string;
  sectionSubtitle: string;
  countLabel?: string;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  children: React.ReactNode;
}

export const DashboardPageTemplate: React.FC<DashboardPageTemplateProps> = ({
  semesterName,
  userName,
  roleDescription,
  summarySlot,
  sectionTitle,
  sectionSubtitle,
  countLabel,
  loading,
  error,
  onRetry,
  isEmpty,
  emptyTitle = 'Belum Ada Kelas Terdaftar',
  emptyMessage = 'Belum ada jadwal kelas perkuliahan pada semester aktif ini.',
  children,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Konteks Akademik (Khusus Dashboard) */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2.5">
          <span className="inline-block text-xs font-bold uppercase tracking-wider bg-white/20 text-yellow-300 px-3 py-1 rounded-full">
            Semester Aktif: {semesterName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Ruang Belajar, {userName}
          </h1>
          <p className="text-emerald-50 text-sm leading-relaxed max-w-2xl">{roleDescription}</p>
        </div>
      </div>

      {summarySlot && <div>{summarySlot}</div>}

      {/* Daftar Kelas Perkuliahan */}
      <section className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{sectionTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-600">{sectionSubtitle}</p>
          </div>
          {countLabel && <StatusBadge variant="neutral">{countLabel}</StatusBadge>}
        </div>

        {loading ? (
          <LoadingState message="Memuat daftar kelas perkuliahan..." />
        ) : error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : isEmpty ? (
          <EmptyState title={emptyTitle} description={emptyMessage} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
        )}
      </section>
    </div>
  );
};
