import React from 'react';

export interface FormSectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSectionCard: React.FC<FormSectionCardProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <section
      className={`bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-2xs ${className}`}
    >
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>
        {description && <p className="text-xs text-slate-600 mt-0.5">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
};
