import React from 'react';
import { PageHeader } from '../PageHeader';
import { LoadingState, EmptyState, ErrorState } from '../StateViews';

export interface ListPageTemplateProps {
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  loading: boolean;
  loadingMessage?: string;
  error?: string | null;
  onRetry?: () => void;
  isEmpty: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  children: React.ReactNode;
}

export const ListPageTemplate: React.FC<ListPageTemplateProps> = ({
  title,
  description,
  backTo,
  backLabel,
  actions,
  toolbar,
  loading,
  loadingMessage = 'Memuat daftar data...',
  error,
  onRetry,
  isEmpty,
  emptyTitle = 'Belum Ada Data',
  emptyMessage = 'Belum ada rekaman yang tersedia untuk ditampilkan.',
  emptyAction,
  children,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PageHeader
        title={title}
        description={description}
        backTo={backTo}
        backLabel={backLabel}
        actions={actions}
      />

      {toolbar && <div>{toolbar}</div>}

      {loading ? (
        <LoadingState message={loadingMessage} />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isEmpty ? (
        <EmptyState title={emptyTitle} description={emptyMessage} action={emptyAction} />
      ) : (
        <div className="space-y-4">{children}</div>
      )}
    </div>
  );
};
