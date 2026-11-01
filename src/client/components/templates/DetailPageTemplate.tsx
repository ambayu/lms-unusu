import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import { LoadingState, ErrorState } from '../StateViews';

export interface DetailTabItem {
  id: string;
  label: string;
  count?: number;
}

export interface DetailPageTemplateProps {
  backTo?: string;
  backLabel?: string;
  loading: boolean;
  loadingMessage?: string;
  error?: string | null;
  onRetry?: () => void;
  badgeText?: string;
  title?: string;
  metadata?: string;
  actions?: React.ReactNode;
  tabs?: DetailTabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children?: React.ReactNode;
}

export const DetailPageTemplate: React.FC<DetailPageTemplateProps> = ({
  backTo = '/',
  backLabel = 'Kembali ke Daftar Kelas',
  loading,
  loadingMessage = 'Memuat detail data...',
  error,
  onRetry,
  badgeText,
  title,
  metadata,
  actions,
  tabs = [],
  activeTab,
  onTabChange,
  children,
}) => {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingState message={loadingMessage} />
      </div>
    );
  }

  if (error || !title) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <Link
          to={backTo}
          className="inline-flex items-center min-h-[44px] px-2 -ml-2 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 shrink-0" aria-hidden="true" />
          <span>{backLabel}</span>
        </Link>
        <ErrorState
          title="Kelas Tidak Dapat Dimuat"
          message={error || 'Data kelas perkuliahan tidak ditemukan.'}
          onRetry={onRetry}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          to={backTo}
          className="inline-flex items-center min-h-[44px] px-2 -ml-2 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 transition mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 shrink-0" aria-hidden="true" />
          <span>{backLabel}</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              {badgeText && <StatusBadge variant="emerald">{badgeText}</StatusBadge>}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h1>
              {metadata && <p className="text-xs sm:text-sm text-slate-600">{metadata}</p>}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
        </div>
      </div>

      {tabs.length > 0 && onTabChange && (
        <div
          role="tablist"
          aria-label="Seksi detail kelas"
          className="flex flex-wrap gap-2 border-b border-slate-200"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab.id)}
                className={`min-h-[44px] px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-t-lg ${
                  isActive
                    ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className="ml-1.5 tabular-nums">({tab.count})</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
};
