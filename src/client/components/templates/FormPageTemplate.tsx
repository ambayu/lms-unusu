import React from 'react';
import { PageHeader } from '../PageHeader';
import { Button } from '../Button';

export interface FormPageTemplateProps {
  backTo?: string;
  backLabel?: string;
  title: string;
  description?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  submitting?: boolean;
  error?: string | null;
  children: React.ReactNode;
}

export const FormPageTemplate: React.FC<FormPageTemplateProps> = ({
  backTo,
  backLabel = 'Kembali',
  title,
  description,
  onSubmit,
  onCancel,
  submitLabel = 'Simpan',
  cancelLabel = 'Batal',
  submitting = false,
  error,
  children,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PageHeader
        title={title}
        description={description}
        backTo={backTo}
        backLabel={backLabel}
      />

      {error && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm font-semibold text-rose-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-6">{children}</div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:px-6 flex flex-wrap items-center justify-end gap-3 shadow-2xs">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel} disabled={submitting}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" variant="primary" loading={submitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};
