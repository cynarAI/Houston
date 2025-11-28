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
  const { profile, goals, strategy, personas } = state;

  return (
    <div className={`
      fixed inset-y-0 right-0 w-80 
      bg-void-900/80 backdrop-blur-xl border-l border-white/10
      shadow-2xl transform transition-transform duration-300 z-30
      ${isOpenMobile ? 'translate-x-0' : 'translate-x-full'}
      lg:translate-x-0 lg:static lg:shadow-none
      flex flex-col
      ${className}
    `}>
      <div className="p-5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-void-800 to-transparent">
        <h2 className="font-display font-bold text-white tracking-widest flex items-center gap-2 text-sm uppercase">
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
        <section className="relative pl-2">
          <div className="absolute -left-[1px] top-0 bottom-0 w-[3px] bg-neon-purple rounded-r-full"></div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 font-mono">Entity Status</h3>
          <div className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-neon-purple/30 transition-colors group">
            <div className="font-display font-semibold text-lg text-white group-hover:text-neon-purple transition-colors">{profile.name || "Unbekannt"}</div>
            <div className="text-sm text-slate-400">{profile.industry || "Branche N/A"}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.targetAudience.map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-void-950 border border-white/10 rounded text-slate-300">{tag}</span>
                ))}
            </div>
          </div>
        </section>

        {/* Goals Progress */}
        <section className="relative pl-2">
            <div className="absolute -left-[1px] top-0 bottom-0 w-[3px] bg-neon-blue rounded-r-full"></div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 font-mono">Active Objectives</h3>
            {goals.length === 0 ? (
                <div className="text-xs text-slate-500 font-mono border border-dashed border-white/10 p-2 rounded">Waiting for input...</div>
            ) : (
                <div className="space-y-4">
                    {goals.map(goal => {
                        const percent = Math.min(100, (goal.currentValue / goal.targetValue) * 100);
                        return (
                            <div key={goal.id} className="relative group">
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="font-medium text-slate-200">{goal.kpi}</span>
                                    <span className="text-neon-blue font-mono">{percent.toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-void-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                                    <div 
                                        className="bg-gradient-to-r from-neon-blue to-primary-500 h-full shadow-[0_0_10px_#4f46e5]" 
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
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 font-mono">Strategic Grid</h3>
            <div className="grid grid-cols-1 gap-2">
            {strategy.length === 0 ? (
                <div className="text-xs text-slate-500 font-mono border border-dashed border-white/10 p-2 rounded">No Data.</div>
            ) : (
                strategy.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-slate-300 bg-white/5 p-2.5 rounded border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-pink shadow-[0_0_5px_#ff0055]"></div>
                        <span className="truncate font-medium">{s.title}</span>
                    </div>
                ))
            )}
            </div>
        </section>

        {/* Personas Summary */}
        <section className="relative pl-2">
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 font-mono">Target Signatures</h3>
             {personas.length === 0 ? (
                <div className="text-xs text-slate-500 font-mono border border-dashed border-white/10 p-2 rounded">No Profiles.</div>
             ) : (
                 <div className="flex -space-x-2 overflow-hidden py-1">
                    {personas.map((p, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-void-800 border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-lg relative group cursor-help">
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