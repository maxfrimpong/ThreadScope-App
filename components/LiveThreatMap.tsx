
import React, { useEffect, useState, useRef } from 'react';
import { mockDb } from '../services/mockDb';
import { ThreatEvent } from '../types';
import { Globe, ShieldAlert, Crosshair } from 'lucide-react';

interface LiveThreatMapProps {
  className?: string;
  height?: string;
}

export const LiveThreatMap: React.FC<LiveThreatMapProps> = ({ className = '', height = 'h-[400px]' }) => {
  const [events, setEvents] = useState<ThreatEvent[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredEvent, setHoveredEvent] = useState<ThreatEvent | null>(null);

  // Simulation loop
  useEffect(() => {
    // Initial load
    setEvents([mockDb.getRandomThreatEvent(), mockDb.getRandomThreatEvent()]);

    const interval = setInterval(() => {
      const newEvent = mockDb.getRandomThreatEvent();
      setEvents(prev => {
        const updated = [...prev, newEvent];
        // Keep last 15 events to prevent overcrowding
        return updated.slice(-15);
      });
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  // Equirectangular projection mapping
  // X = (Lon + 180) / 360 * 100%
  // Y = (90 - Lat) / 180 * 100%
  const getPosition = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className={`relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden ${className}`}>
      {/* Header Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <div className="bg-slate-900/90 backdrop-blur border border-red-500/30 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-red-900/20">
           <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
           </div>
           <span className="text-xs font-bold text-red-400 tracking-wider">LIVE THREAT FEED</span>
        </div>
        <div className="hidden md:flex bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-full items-center gap-2">
           <Globe className="w-3 h-3 text-slate-400" />
           <span className="text-xs font-medium text-slate-400">Global Monitoring Active</span>
        </div>
      </div>

      <div className={`relative w-full ${height} bg-[#0b1121] overflow-hidden`} ref={containerRef}>
        
        {/* World Map SVG (Equirectangular Projection) */}
        <div className="absolute inset-0 z-0">
          <svg viewBox="0 0 1009.6727 493.5786" className="w-full h-full fill-slate-800 stroke-slate-700/50 stroke-[0.5]" preserveAspectRatio="none">
             {/* Detailed World Map Path */}
             <path d="M962.3,101.4c-2.8-4.5-8.4-5.3-10.7-0.9c-2.4,4.5-0.1,8.1-1.3,13c-2.4,9.6-18.7,21.5-22.1,30.3c-2.3,6-7.3,31.7,3.1,34
	c6.4,1.4,16.5-6.6,22.3-9c8.2-3.4,17-4.6,25.8-5c12.5-0.6,23.1,5.6,30.3,15.6c0,0,0,0,0,0l0,0c0,0,0,0,0,0
	c-7.2-10-17.8-16.2-30.3-15.6c-8.8,0.4-17.6,1.6-25.8,5c-5.8,2.4-15.9,10.4-22.3,9c-10.4-2.3-5.4-28-3.1-34
	c3.4-8.8,19.7-20.7,22.1-30.3c1.2-4.9-1.1-8.5,1.3-13C953.9,96.1,959.5,96.9,962.3,101.4L962.3,101.4z M266.3,95.6
	c-4.4-4.8-13.3,11.5-12.8,14.6c0.3,2.2,2.6,3.6,4.6,4.4c1.3,0.5,2.6,1.1,3.8,1.7c5.2,2.8,9,8.7,14.5,10.6c3.2,1.1,6.8,0.3,9.8-1.2
	c6.4-3.1,10.6-9.8,13.6-16.3c1.6-3.4,2.9-7,3.8-10.7c1-4.2-2.1-7.8-5.9-9.1c-11.4-3.9-23.7,1.1-31.4,10
	C266.3,98.6,266.3,97.1,266.3,95.6L266.3,95.6z M266.3,95.6c0,1.5,0,3,0,4.1c7.7-8.9,20-13.9,31.4-10c3.8,1.3,6.9,4.9,5.9,9.1
	c-0.9,3.7-2.2,7.3-3.8,10.7c-3,6.5-7.2,13.2-13.6,16.3c-3,1.5-6.6,2.3-9.8,1.2c-5.5-1.9-9.3-7.8-14.5-10.6c-1.2-0.6-2.5-1.2-3.8-1.7
	c-2-0.8-4.3-2.2-4.6-4.4C253,107.1,261.9,90.8,266.3,95.6L266.3,95.6z M168.3,99c0,1.3-1.6,2.2-2.4,3.1c-2.4,2.6-4.5,5.6-5.8,8.9
	c-1.3,3.3-1.5,7.1-0.7,10.6c0.6,2.4,1.8,4.7,3.6,6.4c3.2,2.9,7.6,3.8,11.8,4.4c8.4,1.2,17.1,1.1,25.4-1.2c4.1-1.1,8-2.9,11.4-5.5
	c4.7-3.7,8.2-9,9.5-14.9c0.9-4-0.1-8.2-2.5-11.5c-2.3-3.2-5.9-5.4-9.6-6.9c-8.9-3.7-18.7-4.4-28.2-2.6
	C175.7,90.9,168.3,94.2,168.3,99L168.3,99z M168.3,99c7.4-4.8,14.8-8.1,22.5-9.2c9.5-1.8,19.3-1.1,28.2,2.6c3.7,1.5,7.3,3.7,9.6,6.9
	c2.4,3.3,3.4,7.5,2.5,11.5c-1.3,5.9-4.8,11.2-9.5,14.9c-3.4,2.6-7.3,4.4-11.4,5.5c-8.3,2.3-17,2.4-25.4,1.2
	c-4.2-0.6-8.6-1.5-11.8-4.4c-1.8-1.7-3-4-3.6-6.4c-0.8-3.5-0.6-7.3,0.7-10.6c1.3-3.3,3.4-6.3,5.8-8.9C166.7,101.2,168.3,100.3,168.3,99
	L168.3,99z M800,200c10,0,20,10,30,20s10,20,5,30s-20,10-30,5s-20-20-15-30S800,200,800,200z M720,150c5,0,10,5,12,10s0,10-5,12
	s-10,0-12-5S715,150,720,150z M180,60c-20,20-40,40-30,60s40,20,60,10s30-40,20-60S200,40,180,60z M300,350c-10,20-20,40-10,50
	s30,10,50-10s20-40,10-60S310,330,300,350z M550,250c-20,0-40,20-30,40s40,20,60,0s20-40,0-60S570,250,550,250z" />
            
             {/* Realistic Continents Approximation Path */}
             <path d="M495.6,23.3l18.4,4.2l-3.3,11.7l15,6.7l-4.2,14.2l12.5,9.2l10,20l-10,13.3l5,15l20,5l10,18.3l-5,16.7l-15,6.7
	l-18.3-5l-13.3-15l-6.7,6.7l-5,15l-16.7,8.3l-20-5l-11.7-16.7l3.3-18.3l-10-10l-15,3.3l-13.3-11.7l5-16.7l15-10l20,6.7l11.7-8.3
	l-3.3-15l10-11.7l18.3-3.3L495.6,23.3z M867.3,86.7l13.3,10l-5,18.3l-16.7,10l-15-5l-8.3-15l5-15L867.3,86.7z M182.3,66.7l30,15
	l15,30l-10,25l-25,10l-35-15l-20-30l10-25L182.3,66.7z M302.3,316.7l20,15l10,35l-15,25l-30,10l-25-20l-10-35l15-20L302.3,316.7z
	 M777.3,336.7l35,5l15,25l-5,30l-30,15l-35-10l-10-30l10-25L777.3,336.7z" className="opacity-0" />
            
             {/* Simple High Quality World Map Path */}
             <path d="M152.1,58.8c0,0,16.3-14.9,28.8-16.8s26.9,2.4,30.3,10.6s-9.1,23.6-13,31.7s-2.4,22.6,9.1,30.3s28.4,9.6,35.1,19.7
	s-1.4,19.2-12,24s-32.2-1-42.3-9.1s-13-27.4-18.3-33.2S152.1,58.8,152.1,58.8z M265,248.8c0,0,14.9-3.4,24,6.2s11.5,23.6,12.5,33.2
	s-9.1,24-18.3,28.8s-22.1,3.4-30.8-2.9s-12-19.2-11-28.8s4.8-19.2,12-25.9S265,248.8,265,248.8z M517.1,104.9
	c0,0,17.3-13.5,34.1-9.6s29.8,12,33.2,21.6s-2.4,25-8.6,34.1s-19.7,14.9-30.3,13.9s-18.3-7.2-22.6-15.9s-7.7-19.7-8.2-28.4
	S517.1,104.9,517.1,104.9z M616.1,228.6c0,0,13.9-9.1,27.9-5.3s23.1,13.9,24.5,24.5s-7.2,21.6-16.8,26.4s-21.6,2.9-28.8-4.3
	s-9.6-17.3-8.6-26.4S616.1,228.6,616.1,228.6z M826.6,339.1c0,0,21.6-4.8,36,2.4s21.6,20.2,20.2,30.8s-13,19.7-25,20.6
	s-23.6-5.8-28.8-14.9s-6.7-21.6-4.8-29.3S826.6,339.1,826.6,339.1z" />

            <path d="M48.5,84c16.3-18.1,43-15.3,55.1-13.1c25.7,4.7,42.4,18.8,42.4,18.8s15.9,4.7,24.6,22.1c8.7,17.4,1.4,43.5-13.8,59.4
	c-15.2,15.9-46.4,18.8-46.4,18.8S92,209.7,85.5,223.5c-6.5,13.8-11.6,44.9-7.2,56.5c4.3,11.6,23.2,30.4,26.1,39.1
	c2.9,8.7-2.9,15.2-14.5,13.8c-11.6-1.4-29-10.1-37-23.9c-8-13.8-13-33.3-10.1-50.7c2.9-17.4,15.2-38.4,15.2-38.4
	s-10.9-18.8-20.3-29.7c-9.4-10.9-26.1-23.9-30.4-38.4C3.6,137.3,16.6,107.8,48.5,84z" />
            
            <path d="M259.4,229.3c15.2-5.1,35.5,1.4,43.5,10.9c8,9.4,10.1,26.1,5.8,39.1c-4.3,13-17.4,31.2-25.4,42.8
	c-8,11.6-4.3,31.9,1.4,43.5c5.8,11.6,14.5,31.9,7.2,50c-7.2,18.1-24.6,50-37,55.1c-12.3,5.1-31.9-5.1-39.1-15.9
	c-7.2-10.9-8.7-27.5-4.3-43.5c4.3-15.9,15.9-34.8,18.8-47.8c2.9-13-1.4-31.9-7.2-43.5c-5.8-11.6-14.5-23.2-13-34.8
	C211.6,273.5,229,239.5,259.4,229.3z" />
            
            <path d="M466.6,63.7c18.8-8.7,47.8-1.4,63.8,10.1c15.9,11.6,29,31.9,29,31.9s20.3,5.8,31.9,0s29-23.2,46.4-23.2
	c17.4,0,37.7,11.6,44.9,29c7.2,17.4,5.8,40.6-5.8,55.1c-11.6,14.5-31.9,20.3-46.4,20.3c-14.5,0-34.8-8.7-43.5-2.9
	c-8.7,5.8-11.6,23.2-17.4,34.8c-5.8,11.6-17.4,26.1-29,31.9c-11.6,5.8-31.9,2.9-46.4-7.2c-14.5-10.1-34.8-31.9-40.6-49.3
	c-5.8-17.4-2.9-40.6,8.7-55.1C473.9,124.6,458,78.2,466.6,63.7z" />

            <path d="M473.9,195.6c14.5-4.3,31.9,2.9,40.6,14.5c8.7,11.6,11.6,31.9,5.8,49.3c-5.8,17.4-20.3,37.7-29,52.2
	c-8.7,14.5-5.8,37.7,2.9,52.2c8.7,14.5,23.2,34.8,20.3,52.2c-2.9,17.4-14.5,31.9-29,34.8c-14.5,2.9-37.7-5.8-49.3-17.4
	c-11.6-11.6-17.4-29-20.3-46.4c-2.9-17.4,2.9-37.7,11.6-52.2c8.7-14.5,20.3-26.1,23.2-40.6c2.9-14.5-2.9-31.9-11.6-43.5
	C430.4,239.1,444.9,204.3,473.9,195.6z" />

            <path d="M784,330.4c17.4-2.9,34.8,5.8,43.5,18.8c8.7,13,8.7,31.9,1.4,46.4c-7.2,14.5-20.3,26.1-34.8,29
	c-14.5,2.9-31.9-2.9-40.6-15.9c-8.7-13-8.7-31.9-1.4-46.4C759.4,347.8,766.6,333.3,784,330.4z" />
          </svg>
        </div>

        {/* Grid Overlay for "Cyber" feel */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQwIDBMMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzNjNDU1NiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4zIi8+PC9zdmc+')] opacity-30 pointer-events-none"></div>

        {/* Threat Markers */}
        {events.map((evt) => {
          const pos = getPosition(evt.sourceLat, evt.sourceLng);
          const targetPos = getPosition(evt.targetLat, evt.targetLng);
          const isHovered = hoveredEvent?.id === evt.id;

          return (
            <React.Fragment key={evt.id}>
              {/* Attack Line (simplified bezier) */}
              <svg className="absolute inset-0 pointer-events-none w-full h-full">
                <defs>
                   <linearGradient id={`grad-${evt.id}`} gradientUnits="userSpaceOnUse" x1={pos.left} y1={pos.top} x2={targetPos.left} y2={targetPos.top}>
                     <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
                     <stop offset="50%" stopColor="#ef4444" stopOpacity="0.5" />
                     <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                   </linearGradient>
                </defs>
                <line 
                  x1={pos.left} y1={pos.top} 
                  x2={targetPos.left} y2={targetPos.top} 
                  stroke={`url(#grad-${evt.id})`}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  className="opacity-40"
                />
              </svg>

              {/* Source Marker */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                style={{ left: pos.left, top: pos.top }}
                onMouseEnter={() => setHoveredEvent(evt)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                <div className="absolute -inset-4 bg-red-500/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-red-500/40 animate-ping"></div>
                  <div className="relative w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)]"></div>
                </div>
                
                {/* Tooltip */}
                <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-56 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-lg p-3 shadow-2xl z-50 transition-all pointer-events-none ${isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}>
                   <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50">
                     <ShieldAlert className="w-4 h-4 text-red-500" />
                     <span className="text-xs font-bold text-red-400 uppercase">{evt.type}</span>
                   </div>
                   <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Source</span>
                        <span className="text-white font-mono">{evt.sourceCountry}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Target</span>
                        <span className="text-white font-mono">US-EAST-1</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Time</span>
                        <span className="text-slate-500 font-mono">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      </div>
                   </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
