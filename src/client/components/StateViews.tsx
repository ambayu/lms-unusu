import React from 'react';
import { Loader2, Inbox, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Memuat data...',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-3"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700">
        <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-slate-600">{message}</p>
    </div>
  );
};

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-3">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 text-slate-600">
        <Inbox className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        {description && <p className="text-xs sm:text-sm text-slate-600">{description}</p>}
      </div>
      {action && <div className="pt-2 flex justify-center">{action}</div>}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Gagal Memuat Data',
  message,
  onRetry,
}) => {
  return (
    <div
      role="alert"
      className="bg-white rounded-2xl border border-rose-200 p-8 sm:p-12 text-center space-y-4"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 text-rose-600">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-600">{message}</p>
      </div>
      {onRetry && (
        <div className="pt-1 flex justify-center">
          <Button variant="secondary" onClick={onRetry}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}
    </div>
  );
};
