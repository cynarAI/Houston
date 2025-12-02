
import React from 'react';
import { Card } from '../ui/Card';
import { ValuePropCanvas } from '../../types';
import { Icons } from '../../constants';

interface Props {
  canvas: ValuePropCanvas;
}

export const ValuePropositionCard: React.FC<Props> = ({ canvas }) => {
  return (
    <Card title="Value Proposition Canvas" className="w-full max-w-2xl mx-auto my-2">
      <div className="grid md:grid-cols-2 gap-4">
        
        {/* Right Side: Customer Profile (Circle usually, visually distinct) */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icons.Users className="w-24 h-24 text-neon-blue" />
            </div>
            <h4 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                Kunden-Profil
            </h4>
            
            <div className="space-y-4 relative z-10">
                <div>
                    <span className="text-[10px] font-mono text-neon-blue uppercase block mb-1">Customer Jobs</span>
                    <ul className="text-xs text-slate-300 list-disc list-inside marker:text-neon-blue">
                        {canvas.customerProfile.jobs.map((j, i) => <li key={i}>{j}</li>)}
                    </ul>
                </div>
                <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase block mb-1">Pains (Schmerzen)</span>
                    <ul className="text-xs text-slate-300 list-disc list-inside marker:text-red-400">
                        {canvas.customerProfile.pains.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                </div>
                <div>
                    <span className="text-[10px] font-mono text-green-400 uppercase block mb-1">Gains (Gewinne)</span>
                    <ul className="text-xs text-slate-300 list-disc list-inside marker:text-green-400">
                        {canvas.customerProfile.gains.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                </div>
            </div>
        </div>

        {/* Left Side: Value Map (Square usually) */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icons.Briefcase className="w-24 h-24 text-neon-purple" />
            </div>
            <h4 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-purple rounded-full"></span>
                Value Map
            </h4>

            <div className="space-y-4 relative z-10">
                 <div>
                    <span className="text-[10px] font-mono text-neon-purple uppercase block mb-1">Produkte & Services</span>
                    <ul className="text-xs text-slate-300 list-disc list-inside marker:text-neon-purple">
                        {canvas.valueMap.products.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                </div>
                <div>
                    <span className="text-[10px] font-mono text-green-400 uppercase block mb-1">Gain Creators</span>
                    <ul className="text-xs text-slate-300 list-disc list-inside marker:text-green-400">
                        {canvas.valueMap.gainCreators.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                </div>
                <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase block mb-1">Pain Relievers</span>
                    <ul className="text-xs text-slate-300 list-disc list-inside marker:text-red-400">
                        {canvas.valueMap.painRelievers.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                </div>
            </div>
        </div>

      </div>
    </Card>
  );
};
