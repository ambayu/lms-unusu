import React from 'react';

export interface AuthCardTemplateProps {
  children: React.ReactNode;
}

export const AuthCardTemplate: React.FC<AuthCardTemplateProps> = ({ children }) => {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6">
        {children}
      </div>
    </main>
  );
};
