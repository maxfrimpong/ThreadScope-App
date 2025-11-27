
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Play, Pause, AlertTriangle, ShieldCheck, Globe, Activity, Terminal, Users, Monitor, UserCheck } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { BotLog, BotCategory } from '../types';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export const BotWatch: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [logs, setLogs] = useState<BotLog[]>([]);
  const [stats, setStats] = useState({ human: 0, good: 0, bad: 0, total: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial dummy chart data
  useEffect(() => {
    const initial = Array.from({ length: 20 }, (_, i) => ({ time: i, human: 0, good: 0, bad: 0 }));
    setChartData(initial);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isMonitoring) {
      interval = setInterval(() => {
        const newLogs = mockDb.generateBotTraffic(Math.floor(Math.random() * 3) + 1);
        
        setLogs(prev => {
          const updated = [...newLogs, ...prev].slice(0, 50); // Keep last 50
          return updated;
        });

        // Update Stats
        newLogs.forEach(log => {
          setStats(prev => ({
            total: prev.total + 1,
            human: log.category === BotCategory.HUMAN ? prev.human + 1 : prev.human,
            good: log.category === BotCategory.GOOD ? prev.good + 1 : prev.good,
            bad: log.category === BotCategory.BAD ? prev.bad + 1 : prev.bad
          }));
        });

        // Update Chart
        setChartData(prev => {
          const humanCount = newLogs.filter(l => l.category === BotCategory.HUMAN).length;
          const goodCount = newLogs.filter(l => l.category === BotCategory.GOOD).length;
          const badCount = newLogs.filter(l => l.category === BotCategory.BAD).length;
          
          const newPoint = {
            time: (prev[prev.length - 1]?.time || 0) + 1,
            human: humanCount * 10 + Math.random() * 5,
            good: goodCount * 10 + Math.random() * 5,
            bad: badCount * 10 + Math.random() * 5
          };
          
          return [...prev.slice(1), newPoint];
        });

      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const toggleMonitoring = () => {
    if (!url && !isMonitoring) return;
    setIsMonitoring(!isMonitoring);
  };

  const badPercentage = stats.total > 0 ? Math.round((stats.bad / stats.total) * 100) : 0;
  const humanPercentage = stats.total > 0 ? Math.round((stats.human / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white flex items-center gap-3">
             <Activity className="w-8 h-8 text-cyan-400" />
             Live Traffic & Bot Monitor
           </h1>
           <p className="text-slate-400 mt-1">Real-time surveillance of user visits and bot activity.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center shadow-lg">
        <div className="flex-1 w-full relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to monitor (e.g. https://mywebsite.com)"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
            disabled={isMonitoring}
          />
        </div>
        <button 
          onClick={toggleMonitoring}
          disabled={!url && !isMonitoring}
          className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all min-w-[140px] justify-center ${
            isMonitoring 
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30' 
              : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-900/20'
          } ${!url ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isMonitoring ? <><Pause className="w-4 h-4" /> Pause Feed</> : <><Play className="w-4 h-4" /> Start Watch</>}
        </button>
      </div>

      {!isMonitoring && stats.total === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl p-12 text-center">
           <Monitor className="w-16 h-16 text-slate-600 mb-4" />
           <h3 className="text-xl font-bold text-slate-300">Traffic Monitor Offline</h3>
           <p className="text-slate-500 mt-2 max-w-md">Enter your target URL above to start visualizing live page visits, user sessions, and bot traffic classification.</p>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
           
           {/* Left Column: Stats & Charts */}
           <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
              {/* KPIs */}
              <div className="grid grid-cols-4 gap-4">
                 <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase font-bold">Requests</p>
                    <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
                 </div>
                 
                 <div className="bg-slate-800 border border-blue-500/30 p-4 rounded-xl bg-blue-500/5">
                    <p className="text-xs text-blue-400 uppercase font-bold flex items-center gap-1"><Users className="w-3 h-3" /> Real Users</p>
                    <p className="text-2xl font-bold text-white mt-1 flex items-end gap-2">
                       {stats.human}
                       <span className="text-sm text-slate-500 font-medium mb-1">({humanPercentage}%)</span>
                    </p>
                 </div>

                 <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                    <p className="text-xs text-emerald-400 uppercase font-bold flex items-center gap-1"><Bot className="w-3 h-3" /> Good Bots</p>
                    <p className="text-2xl font-bold text-white mt-1 flex items-end gap-2">
                       {stats.good}
                    </p>
                 </div>

                 <div className="bg-slate-800 border border-red-900/30 p-4 rounded-xl relative overflow-hidden bg-red-500/5">
                    <div className={`absolute inset-0 bg-red-500/10 transition-opacity ${badPercentage > 20 ? 'opacity-100' : 'opacity-0'}`} />
                    <p className="text-xs text-red-400 uppercase font-bold relative z-10 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Threats</p>
                    <p className="text-2xl font-bold text-white mt-1 relative z-10 flex items-end gap-2">
                       {stats.bad}
                       <span className="text-sm text-slate-500 font-medium mb-1">({badPercentage}%)</span>
                    </p>
                 </div>
              </div>

              {/* Traffic Chart */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex-1 flex flex-col">
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2"><Activity className="w-4 h-4" /> Live Traffic Composition</h3>
                    <div className="flex items-center gap-3 text-xs">
                       <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Humans</span>
                       <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Crawlers</span>
                       <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Attacks</span>
                    </div>
                 </div>
                 <div className="flex-1 w-full min-h-[200px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={chartData}>
                       <defs>
                         <linearGradient id="gradHuman" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                         </linearGradient>
                         <linearGradient id="gradGood" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                         </linearGradient>
                         <linearGradient id="gradBad" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <XAxis dataKey="time" hide />
                       <YAxis hide />
                       <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
                       <Area type="monotone" dataKey="human" stackId="1" stroke="#3b82f6" fill="url(#gradHuman)" isAnimationActive={false} />
                       <Area type="monotone" dataKey="bad" stackId="1" stroke="#ef4444" fill="url(#gradBad)" isAnimationActive={false} />
                       <Area type="monotone" dataKey="good" stackId="1" stroke="#10b981" fill="url(#gradGood)" isAnimationActive={false} />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
              </div>
           </div>

           {/* Right Column: Console Log */}
           <div className="bg-slate-950 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-inner">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                 <h3 className="text-xs font-mono font-bold text-slate-400 flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> ACCESS_LOG_STREAM
                 </h3>
                 <div className="flex gap-1.5 animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs" ref={scrollRef}>
                 {logs.map((log) => {
                    let borderClass = 'border-slate-700 bg-slate-900/50 text-slate-300';
                    let statusClass = 'bg-slate-600 text-white';
                    let icon = <Bot className="w-3 h-3" />;

                    if (log.category === BotCategory.HUMAN) {
                      borderClass = 'border-blue-500/50 bg-blue-900/10 text-blue-200';
                      statusClass = 'bg-blue-600 text-white';
                      icon = <UserCheck className="w-3 h-3" />;
                    } else if (log.category === BotCategory.BAD) {
                      borderClass = 'border-red-500/50 bg-red-900/10 text-red-200';
                      statusClass = 'bg-red-600 text-white';
                      icon = <AlertTriangle className="w-3 h-3" />;
                    } else {
                      borderClass = 'border-emerald-500/50 bg-emerald-900/10 text-emerald-200';
                      statusClass = 'bg-emerald-600 text-white';
                      icon = <ShieldCheck className="w-3 h-3" />;
                    }

                    return (
                      <div key={log.id} className={`p-2 rounded border-l-2 ${borderClass} animate-in fade-in slide-in-from-right-4 duration-300`}>
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold flex items-center gap-1.5">
                              {icon} {log.botName}
                            </span>
                            <span className={`px-1.5 rounded text-[10px] ${statusClass}`}>
                              {log.statusCode}
                            </span>
                        </div>
                        <div className="opacity-90 font-medium mb-1 truncate flex items-center gap-1 text-[11px]">
                          <span className="opacity-50">{log.method}</span> {log.path}
                        </div>
                        <div className="flex justify-between opacity-50 text-[10px]">
                            <span>{log.ip}</span>
                            <span>{log.country}</span>
                        </div>
                      </div>
                    );
                 })}
                 {logs.length === 0 && <div className="text-center text-slate-600 mt-10 italic">Waiting for traffic...</div>}
              </div>
           </div>

        </div>
      )}
    </div>
  );
};
