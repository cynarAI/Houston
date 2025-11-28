import React from 'react';
import { Card } from '../ui/Card';
import { StrategyPillar } from '../../types';
import { Icons } from '../../constants';

interface Props {
  pillars: StrategyPillar[];
}

export const StrategyCard: React.FC<Props> = ({ pillars }) => {
  return (
    <Card title="Strategic Vectors" className="w-full max-w-2xl mx-auto my-2">
      <div className="grid gap-4 md:grid-cols-3">
        {pillars.length === 0 ? (
          <div className="col-span-3 text-center text-slate-500 py-6 italic border border-dashed border-white/10 rounded-xl">
            Awaiting strategic calculation...
          </div>
        ) : (
          pillars.map((pillar, idx) => (
            <div key={idx} className="bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/5 flex flex-col h-full group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-neon-purple/20 p-2 rounded-lg text-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.3)]">
                  <Icons.Compass className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-sm tracking-wide">{pillar.title}</h4>
              </div>
              <p className="text-xs text-slate-400 mb-4 flex-grow leading-relaxed font-light">{pillar.description}</p>
              <div className="space-y-2 mt-auto">
                {pillar.actionItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <div className="mt-1 w-1 h-1 rounded-full bg-neon-purple shrink-0 shadow-[0_0_5px_currentColor]"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};