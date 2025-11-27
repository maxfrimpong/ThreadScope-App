import React from 'react';
import { ScanResult, ThreatLevel, SubscriptionTier, User, UserRole } from '../types';
import { AlertOctagon, CheckCircle2, AlertTriangle, ExternalLink, Calendar, Zap, Lock, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResultCardProps {
  result: ScanResult;
  user: User;
  onRemediate?: (result: ScanResult) => void;
  isRemediating?: boolean;
}

const ThreatBadge = ({ level }: { level: ThreatLevel }) => {
  switch (level) {
    case ThreatLevel.SAFE:
      return <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase"><CheckCircle2 className="w-3 h-3"/> Clean</div>;
    case ThreatLevel.SUSPICIOUS:
      return <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase"><AlertTriangle className="w-3 h-3"/> Suspicious</div>;
    case ThreatLevel.MALICIOUS:
      return <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase"><AlertOctagon className="w-3 h-3"/> Malicious</div>;
    default:
      return <div className="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-bold uppercase">Unknown</div>;
  }
};

const ScoreGauge = ({ score }: { score: number }) => {
  let color = 'text-emerald-500';
  let bg = 'stroke-emerald-900';
  if (score < 50) { color = 'text-red-500'; bg = 'stroke-red-900'; }
  else if (score < 80) { color = 'text-amber-500'; bg = 'stroke-amber-900'; }

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
       <svg className="w-full h-full transform -rotate-90">
         <circle cx="40" cy="40" r={radius} fill="transparent" strokeWidth="6" className={`stroke-slate-800`} />
         <circle 
            cx="40" cy="40" r={radius} 
            fill="transparent" 
            strokeWidth="6" 
            className={color}
            strokeDasharray={circumference} 
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
       </svg>
       <div className="absolute flex flex-col items-center">
         <span className={`text-xl font-bold ${color}`}>{score}</span>
         <span className="text-[10px] text-slate-500 uppercase">Score</span>
       </div>
    </div>
  );
};

export const ResultCard: React.FC<ResultCardProps> = ({ result, user, onRemediate, isRemediating }) => {
  const isThreat = result.threatLevel === ThreatLevel.MALICIOUS || result.threatLevel === ThreatLevel.SUSPICIOUS;
  const canRemediate = user.role === UserRole.ADMIN || user.subscriptionTier !== SubscriptionTier.FREE;
  const isRemediated = result.remediationStatus === 'COMPLETED';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center border-b border-slate-700">
        <ScoreGauge score={result.score} />
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <ThreatBadge level={result.threatLevel} />
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3"/> {new Date(result.timestamp).toLocaleDateString()} {new Date(result.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white break-all">{result.target}</h2>
          <p className="text-slate-400 mt-1">{result.summary}</p>
        </div>
        
        {isThreat && !isRemediated && (
           <div className="flex-shrink-0">
             {canRemediate ? (
               <button 
                onClick={() => onRemediate && onRemediate(result)}
                disabled={isRemediating}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-lg shadow-red-900/30 transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isRemediating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Zap className="w-4 h-4" />}
                 {isRemediating ? 'Neutralizing...' : 'Neutralize Threat'}
               </button>
             ) : (
                <Link to="/subscription" className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg border border-slate-600 transition-all font-medium text-sm group">
                  <Lock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span>Unlock Removal</span>
                </Link>
             )}
           </div>
        )}

        {isRemediated && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg text-sm font-bold">
            <CheckCircle2 className="w-4 h-4" />
            Threat Neutralized
          </div>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Analysis Details</h3>
            <div className="prose prose-invert prose-sm max-w-none bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <div className="whitespace-pre-wrap">{result.details}</div>
            </div>
          </div>

          {/* Remediation Output Section */}
          {isRemediated && result.remediationDetails && (
             <div className="space-y-4 animate-in fade-in duration-500">
               <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                 <Terminal className="w-4 h-4"/> Remediation Playbook
               </h3>
               <div className="bg-slate-950 p-6 rounded-xl border border-emerald-500/30 shadow-inner">
                 <pre className="text-xs md:text-sm font-mono text-emerald-300 whitespace-pre-wrap overflow-x-auto">
                   {result.remediationDetails}
                 </pre>
               </div>
             </div>
          )}
        </div>

        <div className="space-y-6">
           {result.groundingUrls && result.groundingUrls.length > 0 && (
             <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Intelligence Sources</h3>
                <ul className="space-y-2">
                  {result.groundingUrls.map((url, idx) => (
                    <li key={idx}>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 hover:underline truncate">
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{url}</span>
                      </a>
                    </li>
                  ))}
                </ul>
             </div>
           )}

           <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Threat Indicators</h3>
              <div className="flex flex-wrap gap-2">
                {result.threatLevel === ThreatLevel.MALICIOUS && (
                   <span className="px-2 py-1 bg-red-900/30 border border-red-800 text-red-400 text-xs rounded">Critical Risk</span>
                )}
                 {result.score < 50 && (
                   <span className="px-2 py-1 bg-amber-900/30 border border-amber-800 text-amber-400 text-xs rounded">Low Reputation</span>
                )}
                {/* Mock tags based on scan type */}
                <span className="px-2 py-1 bg-slate-800 border border-slate-700 text-slate-400 text-xs rounded">{result.type} Analysis</span>
                <span className="px-2 py-1 bg-slate-800 border border-slate-700 text-slate-400 text-xs rounded">Gemini Powered</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};