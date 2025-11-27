
import React, { useEffect, useState } from 'react';
import { ScanResult, ThreatLevel, DailyStat } from '../types';
import { mockDb } from '../services/mockDb';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, ShieldCheck, AlertTriangle, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { LiveThreatMap } from '../components/LiveThreatMap';

export const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [trendData, setTrendData] = useState<DailyStat[]>([]);

  useEffect(() => {
    setHistory(mockDb.getHistory());
    setStats(mockDb.getStats());
    setTrendData(mockDb.getTrendData());
  }, []);

  const chartData = stats ? [
    { name: 'Safe', value: stats.safe, color: '#10b981' }, // Emerald 500
    { name: 'Suspicious', value: stats.suspicious, color: '#f59e0b' }, // Amber 500
    { name: 'Malicious', value: stats.malicious, color: '#ef4444' }, // Red 500
  ] : [];

  // Calculate Security Score (Simple mock logic)
  const totalScans = stats?.total || 1;
  const maliciousCount = stats?.malicious || 0;
  const securityScore = Math.max(0, 100 - (maliciousCount * 10)); // Lose 10 points per threat

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Security Command Center</h1>
          <p className="text-slate-400 mt-1">Real-time threat monitoring and response status.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2">
           <div className="flex flex-col items-end">
             <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Posture Score</span>
             <span className={`text-2xl font-bold ${getScoreColor(securityScore)}`}>{securityScore}/100</span>
           </div>
           <div className="h-10 w-10 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="20" cy="20" r="16" fill="transparent" strokeWidth="4" className="stroke-slate-700" />
                <circle cx="20" cy="20" r="16" fill="transparent" strokeWidth="4" className={getScoreColor(securityScore).replace('text', 'stroke')} strokeDasharray="100" strokeDashoffset={100 - securityScore} />
              </svg>
           </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-slate-600 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-16 h-16 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Scans</p>
            <p className="text-3xl font-bold text-white mt-2">{stats?.total || 0}</p>
          </div>
          <div className="mt-4 flex items-center text-xs text-emerald-400 font-medium">
             <TrendingUp className="w-3 h-3 mr-1" /> +12% this week
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert className="w-16 h-16 text-amber-500" />
          </div>
           <div>
            <p className="text-sm font-medium text-slate-400">Suspicious Objects</p>
            <p className="text-3xl font-bold text-amber-400 mt-2">{stats?.suspicious || 0}</p>
          </div>
           <div className="mt-4 flex items-center text-xs text-slate-500">
             Requires Review
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-red-500/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
           <div>
            <p className="text-sm font-medium text-slate-400">Active Threats</p>
            <p className="text-3xl font-bold text-red-400 mt-2">{stats?.malicious || 0}</p>
          </div>
           <div className="mt-4 flex items-center text-xs text-red-400 font-medium">
             Action Required
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="w-16 h-16 text-emerald-500" />
          </div>
           <div>
            <p className="text-sm font-medium text-slate-400">Neutralized</p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">{Math.floor((stats?.malicious || 0) * 0.8)}</p>
          </div>
           <div className="mt-4 flex items-center text-xs text-emerald-400 font-medium">
             <CheckCircle2 className="w-3 h-3 mr-1" /> Automated Cleanup
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
             <div className="flex items-center justify-between mb-6">
               <div>
                 <h3 className="text-lg font-bold text-white">Activity Analysis</h3>
                 <p className="text-xs text-slate-400">Scan volume vs detected threats (7 Days)</p>
               </div>
               <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Scans</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Threats</div>
               </div>
             </div>
             <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={trendData}>
                   <defs>
                     <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                   <XAxis dataKey="date" stroke="#94a3b8" tick={{fontSize: 12}} />
                   <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                   />
                   <Area type="monotone" dataKey="scans" stroke="#10b981" fillOpacity={1} fill="url(#colorScans)" strokeWidth={2} />
                   <Area type="monotone" dataKey="threats" stroke="#ef4444" fillOpacity={1} fill="url(#colorThreats)" strokeWidth={2} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
          
          {/* Live Threat Map for User */}
          <LiveThreatMap height="h-[300px]" />
        </div>

        {/* Threat Distribution Donut */}
        <div className="flex flex-col gap-8">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex-1">
            <h3 className="text-lg font-bold text-white mb-6">Composition</h3>
            <div className="h-56 relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={chartData}
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {chartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                     itemStyle={{ color: '#fff' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">{stats?.total || 0}</p>
                    <p className="text-xs text-slate-500 uppercase">Items</p>
                  </div>
               </div>
            </div>
            <div className="space-y-3 mt-4">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                     <span className="text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
         <div className="flex items-center justify-between mb-6">
           <h3 className="text-lg font-bold text-white">Recent Investigations</h3>
           <Link to="/scan" className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium">Start New Scan <ArrowRight className="w-3 h-3"/></Link>
         </div>
         <div className="space-y-1">
           {history.slice(0, 5).map((scan) => (
             <div key={scan.id} className="group flex items-center justify-between p-4 rounded-xl hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-700">
               <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`p-2 rounded-lg ${
                    scan.threatLevel === ThreatLevel.SAFE ? 'bg-emerald-500/10 text-emerald-500' : 
                    scan.threatLevel === ThreatLevel.MALICIOUS ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {scan.threatLevel === ThreatLevel.SAFE ? <ShieldCheck className="w-5 h-5"/> : 
                     scan.threatLevel === ThreatLevel.MALICIOUS ? <AlertTriangle className="w-5 h-5"/> : <ShieldAlert className="w-5 h-5"/>}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate group-hover:text-emerald-400 transition-colors">{scan.target}</p>
                    <p className="text-xs text-slate-500">{new Date(scan.timestamp).toLocaleString()} • {scan.type}</p>
                  </div>
               </div>
               <div className="text-right flex-shrink-0 flex items-center gap-6">
                  {scan.remediationStatus === 'COMPLETED' && (
                     <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 font-bold uppercase tracking-wider">
                       Remediated
                     </span>
                  )}
                 <div className="w-16 text-right">
                   <span className={`text-sm font-bold ${
                      scan.threatLevel === ThreatLevel.SAFE ? 'text-emerald-400' : 
                      scan.threatLevel === ThreatLevel.MALICIOUS ? 'text-red-400' : 'text-amber-400'
                   }`}>
                     {scan.score}
                   </span>
                   <span className="text-xs text-slate-500">/100</span>
                 </div>
               </div>
             </div>
           ))}
           {history.length === 0 && <div className="text-center py-12 text-slate-500">No scans found.</div>}
         </div>
      </div>
    </div>
  );
};
