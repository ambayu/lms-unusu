import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 shadow-sm border border-transparent',
  secondary:
    'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 active:bg-slate-200 border border-slate-200/80',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm border border-transparent',
  ghost:
    'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 border border-transparent',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  type = 'button',
  children,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />}
      {children}
    </button>
  );
};
