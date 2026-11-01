import React from 'react';

export interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  hint,
  error,
  children,
}) => {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs sm:text-sm font-semibold text-slate-700">
        <span>{label}</span>
        {required && <span className="text-rose-600 ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && (
        <p id={hintId} className="text-xs text-slate-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-semibold text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
};
