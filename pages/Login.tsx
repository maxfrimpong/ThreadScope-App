
import React, { useState } from 'react';
import { User, UserRole, SubscriptionTier } from '../types';
import { Shield, ArrowRight, Mail, Lock, User as UserIcon, Loader2, AlertCircle } from 'lucide-react';
import { mockDb } from '../services/mockDb';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      const demoUser: User = {
        id: crypto.randomUUID(),
        name: role === UserRole.ADMIN ? 'Admin User' : 'Security Analyst',
        email: role === UserRole.ADMIN ? 'admin@threatscope.io' : 'analyst@threatscope.io',
        role: role,
        avatar: `https://ui-avatars.com/api/?name=${role}&background=10b981&color=fff`,
        subscriptionTier: role === UserRole.ADMIN ? SubscriptionTier.ENTERPRISE : SubscriptionTier.FREE
      };
      onLogin(demoUser);
      setIsLoading(false);
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (activeTab === 'login') {
        const user = mockDb.authenticate(email);
        if (user) {
          onLogin(user);
        } else {
          setError("Invalid credentials. For demo, try a registered email or use Quick Access.");
        }
      } else {
        // Register flow
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (password.length < 6) {
           throw new Error("Password must be at least 6 characters");
        }
        
        try {
          const newUser = mockDb.registerUser(name, email);
          onLogin(newUser);
        } catch (err: any) {
          throw new Error(err.message || "Registration failed");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 px-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
         <div className="absolute top-[40%] right-[0%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 overflow-hidden">
        
        <div className="p-8 pb-0 flex flex-col items-center">
           <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/30 shadow-lg shadow-emerald-900/20">
              <Shield className="w-8 h-8 text-emerald-500" />
           </div>
           <h1 className="text-2xl font-bold text-white tracking-tight">ThreatScope AI</h1>
           <p className="text-slate-400 text-sm mt-1">Advanced Malware Analysis Platform</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 mt-6 mx-8">
           <button 
             onClick={() => { setActiveTab('login'); setError(null); }}
             className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${activeTab === 'login' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Sign In
             {activeTab === 'login' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-t-full"></div>}
           </button>
           <button 
             onClick={() => { setActiveTab('register'); setError(null); }}
             className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${activeTab === 'register' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Create Account
             {activeTab === 'register' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-t-full"></div>}
           </button>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {activeTab === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {activeTab === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                 <AlertCircle className="w-4 h-4 flex-shrink-0" />
                 {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Access Section (Demo Only) */}
          {activeTab === 'login' && (
            <div className="mt-8 pt-6 border-t border-slate-800">
               <p className="text-xs text-center text-slate-500 mb-4 uppercase tracking-wider font-semibold">Quick Access (Demo)</p>
               <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleDemoLogin(UserRole.USER)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors text-xs font-medium text-slate-300 hover:text-white"
                  >
                    Analyst Demo
                  </button>
                  <button 
                    onClick={() => handleDemoLogin(UserRole.ADMIN)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors text-xs font-medium text-slate-300 hover:text-white"
                  >
                    Admin Demo
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
