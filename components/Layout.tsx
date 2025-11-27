import React from 'react';
import { Sidebar } from './Sidebar';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  if (!user) {
    return <div className="min-h-screen bg-slate-900 text-slate-200">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
