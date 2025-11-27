import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, UserRole, SubscriptionTier } from '../types';
import { ShieldAlert, LayoutDashboard, ScanLine, CreditCard, LogOut, Database, Crown } from 'lucide-react';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getTierBadge = () => {
    if (user.role === UserRole.ADMIN) {
      return <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> ADMIN</span>;
    }

    switch(user.subscriptionTier) {
      case SubscriptionTier.PRO:
        return <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-bold flex items-center gap-1"><Crown className="w-3 h-3" /> PRO</span>;
      case SubscriptionTier.ENTERPRISE:
        return <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30 font-bold flex items-center gap-1"><Crown className="w-3 h-3" /> ENT</span>;
      default:
        return <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-600 font-bold">FREE</span>;
    }
  };

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-800 fixed h-full flex flex-col justify-between">
      <div>
        <div className="p-6 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-emerald-500" />
          <span className="text-xl font-bold tracking-tight text-white">ThreatScope</span>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/') ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </Link>
          
          <Link to="/scan" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/scan') ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
            <ScanLine className="w-5 h-5" />
            <span className="font-medium">New Scan</span>
          </Link>

          {user.role !== UserRole.ADMIN && (
            <Link to="/subscription" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/subscription') ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Subscription</span>
            </Link>
          )}

          {user.role === UserRole.ADMIN && (
             <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin') ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
             <Database className="w-5 h-5" />
             <span className="font-medium">Admin Console</span>
           </Link>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full bg-slate-800" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              {getTierBadge()}
            </div>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors text-sm">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};