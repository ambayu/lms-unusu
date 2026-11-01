import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backTo,
  backLabel = 'Kembali',
  badge,
  actions,
}) => {
  return (
    <div className="space-y-3">
      {backTo && (
        <Link
          to={backTo}
          className="inline-flex items-center min-h-[44px] px-2 -ml-2 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 shrink-0" aria-hidden="true" />
          <span>{backLabel}</span>
        </Link>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          {badge && <div>{badge}</div>}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
          {description && <p className="text-xs sm:text-sm text-slate-600">{description}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
};
