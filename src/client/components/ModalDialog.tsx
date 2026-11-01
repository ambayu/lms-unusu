import React, { useEffect, useId } from 'react';
import { X } from 'lucide-react';

export interface ModalDialogProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalDialog: React.FC<ModalDialogProps> = ({
  open,
  title,
  description,
  onClose,
  children,
}) => {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-slate-50 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-bold text-slate-900">
              {title}
            </h2>
            {description && <p className="text-xs text-slate-600 mt-1">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 transition"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
