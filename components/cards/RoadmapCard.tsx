
import React from 'react';
import { Card } from '../ui/Card';
import { RoadmapPhase } from '../../types';

interface Props {
  phases: RoadmapPhase[];
}

export const RoadmapCard: React.FC<Props> = ({ phases }) => {
  return (
    <Card title="Mission Roadmap" className="w-full max-w-xl mx-auto my-2">
      <div className="relative pl-4 space-y-8 my-4">
        {/* Connection Line */}
        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-neon-blue via-purple-500 to-transparent opacity-30"></div>

        {phases.length === 0 ? (
           <div className="text-center text-slate-500 text-xs font-mono">Keine Flugroute berechnet.</div>
        ) : (
          phases.map((phase, idx) => (
            <div key={idx} className="relative flex gap-6 group">
              {/* Node */}
              <div className="relative z-10 shrink-0 mt-1">
                 <div className="w-6 h-6 rounded-full bg-void-900 border-2 border-neon-blue shadow-[0_0_10px_#00f0ff] flex items-center justify-center text-[10px] font-bold text-white group-hover:scale-110 transition-transform">
                    {phase.phase}
                 </div>
              </div>

              {/* Content */}
              <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-4 hover:border-neon-blue/30 transition-colors backdrop-blur-sm">
                 <div className="flex justify-between items-start mb-2">
                    <h4 className="font-display font-bold text-white tracking-wide">{phase.title}</h4>
                    <span className="text-[10px] font-mono text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded border border-neon-blue/20">
                      {phase.duration}
                    </span>
                 </div>
                 
                 <ul className="space-y-2">
                   {phase.tasks.map((task, tIdx) => (
                     <li key={tIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-neon-purple mt-0.5">›</span>
                        <span className="font-light">{task}</span>
                     </li>
                   ))}
                 </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
