import React from 'react';
import { Card } from '../ui/Card';
import { Competitor } from '../../types';
import { Icons } from '../../constants';

interface Props {
  competitors: Competitor[];
}

export const CompetitorCard: React.FC<Props> = ({ competitors }) => {
  return (
    <Card title="Hostile Analysis" className="w-full max-w-lg mx-auto my-2">
      <div className="space-y-3">
        {competitors.length === 0 ? (
          <div className="text-center text-slate-500 py-4 italic border border-dashed border-white/10 rounded-lg">No hostiles detected.</div>
        ) : (
          competitors.map((comp) => (
            <div key={comp.id} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                <div className="bg-red-500/10 p-2 rounded-lg text-red-500 border border-red-500/20">
                  <Icons.Target className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white tracking-wide">{comp.name}</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-green-500/5 p-2 rounded border border-green-500/10">
                   <span className="text-green-400 font-bold block mb-1 uppercase text-[10px] tracking-wider">Strengths</span>
                   <p className="text-slate-300 leading-relaxed">{comp.strength}</p>
                </div>
                <div className="bg-red-500/5 p-2 rounded border border-red-500/10">
                   <span className="text-red-400 font-bold block mb-1 uppercase text-[10px] tracking-wider">Weaknesses</span>
                   <p className="text-slate-300 leading-relaxed">{comp.weakness}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};