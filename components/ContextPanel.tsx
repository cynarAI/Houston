import React from 'react';
import { AppContextState } from '../types';
import { Icons } from '../constants';

interface Props {
  state: AppContextState;
  className?: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ContextPanel: React.FC<Props> = ({ state, className = "", isOpenMobile, onCloseMobile }) => {
  const { profile, goals, strategy, personas, bottlenecks, roadmap } = state;
  
  const activeBottlenecks = bottlenecks.filter(b => b.selected);
  const currentPhase = roadmap.length > 0 ? roadmap[0] : null;

  return (
    <div className={`
      fixed inset-y-0 right-0 w-80 
      bg-void-900/90 backdrop-blur-2xl border-l border-white/10
      shadow-2xl transform transition-transform duration-300 z-50
      ${isOpenMobile ? 'translate-x-0' : 'translate-x-full'}
      lg:translate-x-0 lg:static lg:shadow-none
      flex flex-col h-full
      ${className}
    `}>
      <div className="p-5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-void-800 to-transparent shrink-0">
        <h2 className="font-display font-bold text-white tracking-widest flex items-center gap-2 text-xs uppercase">
           <Icons.Briefcase className="w-4 h-4 text-neon-blue" />
           Mission Control
        </h2>
        <button onClick={onCloseMobile} className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
           <Icons.X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-hide relative">
        {/* Decorative line */}
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>

        {/* Business Profile Summary */}
        <section className="relative pl-2 group">
          <div className="absolute -left-[1px] top-0 bottom-0 w-[3px] bg-neon-purple rounded-r-full transition-height duration-300 h-full group-hover:h-full"></div>
          <div className="flex justify-between items-center mb-3">
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">Unternehmensstatus</h3>
             <span className="opacity-0 group-hover:opacity-100 text-[10px] text-neon-purple cursor-pointer transition-opacity hover:underline">Edit</span>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-neon-purple/30 transition-all cursor-default">
            <div className="font-display font-semibold text-lg text-white group-hover:text-neon-purple transition-colors">{profile.name || "Unbekannt"}</div>
            <div className="text-sm text-slate-400">{profile.industry || "Branche N/A"}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.targetAudience.map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-void-950 border border-white/10 rounded text-slate-300">{tag}</span>
                ))}
            </div>
          </div>
        </section>

        {/* Active Bottlenecks (Alerts) */}
        <section className="relative pl-2">
          <h3 className="text-[10px] font-bold text-red-400/80 uppercase tracking-[0.2em] mb-3 font-mono flex items-center gap-2">
            System Warnungen
            {activeBottlenecks.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
          </h3>
          {activeBottlenecks.length === 0 ? (
             <div className="text-xs text-green-400/50 font-mono border border-dashed border-green-500/20 p-2 rounded flex items-center gap-2">
               <Icons.CheckCircle className="w-3 h-3" /> Keine kritischen Fehler.
             </div>
          ) : (
            <div className="space-y-2">
              {activeBottlenecks.map(b => (
                <div key={b.id} className="bg-red-500/5 border border-red-500/20 rounded-lg p-2.5 flex items-start gap-2 hover:bg-red-500/10 transition-colors cursor-pointer">
                   <div className="mt-0.5 text-red-500"><Icons.Zap className="w-3 h-3" /></div>
                   <div>
                     <div className="text-xs font-bold text-slate-200 leading-tight">{b.name}</div>
                     <div className="text-[10px] text-red-400 uppercase tracking-wider mt-1 font-mono">{b.category} • {b.severity}</div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Current Roadmap Phase */}
        <section className="relative pl-2">
            <div className="absolute -left-[1px] top-0 bottom-0 w-[3px] bg-neon-green rounded-r-full"></div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 font-mono">Operations Phase</h3>
            {currentPhase ? (
               <div className="bg-white/5 border border-neon-green/20 rounded-lg p-3 relative overflow-hidden group hover:border-neon-green/40 transition-colors">
                  <div className="absolute top-0 right-0 p-1">
                     <div className="w-1.5 h-1.5 bg-neon-green rounded-full shadow-[0_0_5px_#22c55e]"></div>
                  </div>
                  <div className="text-xs text-neon-green font-mono mb-1">{currentPhase.duration}</div>
                  <div className="font-bold text-white text-sm mb-2 group-hover:text-neon-green transition-colors">{currentPhase.title}</div>
                  <div className="space-y-1">
                     {currentPhase.tasks.slice(0, 2).map((t, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] text-slate-400">
                           <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                           <span className="truncate">{t}</span>
                        </div>
                     ))}
                     {currentPhase.tasks.length > 2 && <div className="text-[10px] text-slate-600 pl-3">+{currentPhase.tasks.length - 2} weitere Tasks</div>}
                  </div>
               </div>
            ) : (
               <div className="text-xs text-slate-500 font-mono border border-dashed border-white/10 p-2 rounded">Keine Route aktiv.</div>
            )}
        </section>

        {/* Goals Progress */}
        <section className="relative pl-2">
            <div className="absolute -left-[1px] top-0 bottom-0 w-[3px] bg-neon-blue rounded-r-full"></div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 font-mono">Aktive Ziele</h3>
            {goals.length === 0 ? (
                <div className="text-xs text-slate-500 font-mono border border-dashed border-white/10 p-2 rounded">Warte auf Input...</div>
            ) : (
                <div className="space-y-4">
                    {goals.map(goal => {
                        const percent = Math.min(100, (goal.currentValue / goal.targetValue) * 100);
                        return (
                            <div key={goal.id} className="relative group cursor-pointer">
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{goal.kpi}</span>
                                    <span className="text-neon-blue font-mono">{percent.toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-void-950 rounded-full h-1.5 overflow-hidden border border-white/5 group-hover:border-white/20 transition-colors">
                                    <div 
                                        className="bg-gradient-to-r from-neon-blue to-primary-500 h-full shadow-[0_0_10px_#4f46e5] transition-all duration-1000" 
                                        style={{width: `${percent}%`}}
                                    />
                                </div>
                                <div className="text-[10px] text-slate-500 mt-1 font-mono text-right">{goal.currentValue} / {goal.targetValue} {goal.unit}</div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>

        {/* Strategy Pillars Summary */}
        <section className="relative pl-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 font-mono">Strategisches Raster</h3>
            <div className="grid grid-cols-1 gap-2">
            {strategy.length === 0 ? (
                <div className="text-xs text-slate-500 font-mono border border-dashed border-white/10 p-2 rounded">Keine Daten.</div>
            ) : (
                strategy.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-slate-300 bg-white/5 p-2.5 rounded border border-white/5 hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer group">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-pink shadow-[0_0_5px_#ff0055] group-hover:scale-125 transition-transform"></div>
                        <span className="truncate font-medium">{s.title}</span>
                    </div>
                ))
            )}
            </div>
        </section>

        {/* Personas Summary */}
        <section className="relative pl-2">
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 font-mono">Zielgruppen Profile</h3>
             {personas.length === 0 ? (
                <div className="text-xs text-slate-500 font-mono border border-dashed border-white/10 p-2 rounded">Keine Profile.</div>
             ) : (
                 <div className="flex -space-x-2 overflow-hidden py-1 pl-1">
                    {personas.map((p, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-void-800 border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-lg relative group cursor-help hover:scale-110 hover:z-10 transition-all hover:border-neon-pink/50">
                             <span className="bg-gradient-to-br from-neon-pink to-purple-600 bg-clip-text text-transparent">{p.name.charAt(0)}</span>
                        </div>
                    ))}
                 </div>
             )}
        </section>
      </div>
    </div>
  );
};