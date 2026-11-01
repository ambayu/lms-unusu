import React from 'react';

export type StatusBadgeVariant = 'neutral' | 'emerald' | 'info' | 'warning' | 'danger';

export interface StatusBadgeProps {
  variant?: StatusBadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<StatusBadgeVariant, string> = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
