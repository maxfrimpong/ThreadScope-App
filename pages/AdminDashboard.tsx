
import React, { useEffect, useState } from 'react';
import { mockDb } from '../services/mockDb';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Users, Shield, Database, Globe, Server, Cpu, Wifi, AlertOctagon, Search } from 'lucide-react';
import { SystemHealth, GeoStat, MockUser, SubscriptionTier } from '../types';
import { LiveThreatMap } from '../components/LiveThreatMap';

export const AdminDashboard: React.FC = () => {
  const [threatStats, setThreatStats] = useState(mockDb.getMockAdminStats());
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [geoStats, setGeoStats] = useState<GeoStat[]>([]);
  const [users, setUsers] = useState<MockUser[]>([]);
  // Mock live traffic data
  const [trafficData, setTrafficData] = useState<any[]>([]);

  useEffect(() => {
    setSystemHealth(mockDb.getSystemHealth());
    setGeoStats(mockDb.getGeoStats());
    setUsers(mockDb.getAllUsers());
    
    // Generate initial traffic data
    const initialTraffic = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      requests: Math.floor(Math.random() * 500) + 1000
    }));
    setTrafficData(initialTraffic);

    // Simulate live updates
    const interval = setInterval(() => {
      setSystemHealth(mockDb.getSystemHealth());
      setTrafficData(prev => {
        const newData = [...prev.slice(1), { 
          time: prev[prev.length - 1].time + 1, 
          requests: Math.floor(Math.random() * 500) + 1000 + (Math.random() > 0.8 ? 1000 : 0) // Random spikes
        }];
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white flex items-center gap-3">
             <AlertOctagon className="w-8 h-8 text-emerald-500" />
             Global Overwatch
           </h1>
           <p className="text-slate-400 mt-1">System-wide surveillance and infrastructure status.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              SYSTEM OPERATIONAL
           </div>
           <div className="text-right">
              <p className="text-xs text-slate-500">Uptime</p>
              <p className="font-mono text-white font-bold">{systemHealth?.uptime || 'Loading...'}</p>
           </div>
        </div>
      </div>

      {/* Global Live Threat Map (Prominent placement for Admin) */}
      <div className="grid grid-cols-1">
        <LiveThreatMap height="h-[500px]" className="shadow-2xl shadow-red-900/10 border-slate-600" />
      </div>

      {/* System Health Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl relative overflow-hidden">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Cpu className="w-5 h-5" /></div>
              <h3 className="font-medium text-slate-300">CPU Load</h3>
           </div>
           <div className="flex items-end gap-2">
             <span className="text-4xl font-bold text-white">{systemHealth?.cpu}%</span>
             <span className="text-sm text-slate-500 mb-1">Average</span>
           </div>
           <div className="w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${systemHealth?.cpu}%` }} />
           </div>
         </div>

         <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl relative overflow-hidden">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Server className="w-5 h-5" /></div>
              <h3 className="font-medium text-slate-300">Memory Usage</h3>
           </div>
           <div className="flex items-end gap-2">
             <span className="text-4xl font-bold text-white">{systemHealth?.memory}%</span>
             <span className="text-sm text-slate-500 mb-1">Allocated</span>
           </div>
           <div className="w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${systemHealth?.memory}%` }} />
           </div>
         </div>

         <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl relative overflow-hidden">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Wifi className="w-5 h-5" /></div>
              <h3 className="font-medium text-slate-300">API Latency</h3>
           </div>
           <div className="flex items-end gap-2">
             <span className="text-4xl font-bold text-white">{systemHealth?.latency}</span>
             <span className="text-sm text-slate-500 mb-1">ms</span>
           </div>
           <div className="w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${systemHealth?.latency && systemHealth.latency > 100 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (systemHealth?.latency || 0) / 2)}%` }} />
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Network Traffic */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-white">Live Network Traffic</h3>
             <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">Requests / Sec</span>
          </div>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Area type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} fill="url(#colorTraffic)" isAnimationActive={false} />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Geo Distribution */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
           <h3 className="text-lg font-bold text-white mb-6">Threat Origin by Region</h3>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={geoStats} layout="vertical" margin={{ left: 40 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                   <XAxis type="number" stroke="#94a3b8" />
                   <YAxis dataKey="code" type="category" stroke="#94a3b8" width={30} />
                   <Tooltip 
                     cursor={{ fill: '#334155', opacity: 0.4 }}
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                   />
                   <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <h3 className="text-lg font-bold text-white">User Management</h3>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 w-64"
              />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900 text-slate-200 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Subscription</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <img src={user.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-700" />
                       <div>
                         <div className="font-bold text-white">{user.name}</div>
                         <div className="text-xs">{user.email}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-700 px-2 py-1 rounded text-xs font-bold text-slate-300">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                     {user.subscriptionTier === SubscriptionTier.ENTERPRISE && <span className="text-purple-400 font-bold flex items-center gap-1">Enterprise</span>}
                     {user.subscriptionTier === SubscriptionTier.PRO && <span className="text-emerald-400 font-bold flex items-center gap-1">Pro</span>}
                     {user.subscriptionTier === SubscriptionTier.FREE && <span className="text-slate-400 font-medium">Free</span>}
                  </td>
                  <td className="px-6 py-4">
                     {user.status === 'ACTIVE' && <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active</span>}
                     {user.status === 'SUSPENDED' && <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Suspended</span>}
                     {user.status === 'PENDING' && <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending</span>}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{user.lastLogin}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-white font-medium transition-colors">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-900 border-t border-slate-700 text-center text-xs text-slate-500">
           Showing 5 of 12,402 users
        </div>
      </div>
    </div>
  );
};
