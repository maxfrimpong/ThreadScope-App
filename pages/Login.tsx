import React, { useState } from 'react';
import { UserRole } from '../types';
import { Shield, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
         <div className="absolute top-[40%] right-[0%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-8">
           <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/30">
              <Shield className="w-8 h-8 text-emerald-500" />
           </div>
           <h1 className="text-2xl font-bold text-white">ThreatScope AI</h1>
           <p className="text-slate-400 text-sm mt-1">Advanced Malware Analysis Platform</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => onLogin(UserRole.USER)}
            className="w-full group relative flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/20"
          >
            <div className="text-left">
              <p className="font-bold text-white">Security Analyst</p>
              <p className="text-xs text-slate-500">Log in as standard user</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </button>

          <button 
            onClick={() => onLogin(UserRole.ADMIN)}
            className="w-full group relative flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/20"
          >
            <div className="text-left">
              <p className="font-bold text-white">System Administrator</p>
              <p className="text-xs text-slate-500">Log in with admin privileges</p>
            </div>
             <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </button>
        </div>

        <div className="mt-8 text-center">
           <p className="text-xs text-slate-600">
             By accessing this system, you agree to the monitoring of all activities.
             <br/>Unauthorized access is prohibited.
           </p>
        </div>
      </div>
    </div>
  );
};