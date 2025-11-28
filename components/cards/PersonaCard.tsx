import React from 'react';
import { Card } from '../ui/Card';
import { Persona } from '../../types';
import { Icons } from '../../constants';

interface Props {
  personas: Persona[];
}

export const PersonaCard: React.FC<Props> = ({ personas }) => {
  return (
    <Card title="Target Profiles" className="w-full max-w-lg mx-auto my-2">
      <div className="space-y-4">
        {personas.length === 0 ? (
           <div className="text-center text-slate-500 py-4 italic">No profiles loaded.</div>
        ) : (
          personas.map((persona) => (
            <div key={persona.id} className="flex gap-5 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
              <div className="shrink-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 p-[1px] shadow-lg shadow-pink-600/20">
                    <div className="w-full h-full rounded-full bg-void-900 flex items-center justify-center text-pink-400">
                        <Icons.Users className="w-6 h-6" />
                    </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="font-display font-bold text-white text-lg">{persona.name}</h4>
                    <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded border border-pink-500/20 uppercase tracking-wide">{persona.role}</span>
                </div>
                
                <div className="mt-3 text-sm space-y-3">
                  <div className="relative pl-3 border-l-2 border-slate-700">
                    <span className="font-mono text-[10px] text-slate-500 block uppercase mb-0.5">Primary Directive</span>
                    <p className="text-slate-300 font-light">{persona.needs}</p>
                  </div>
                  <div className="relative pl-3 border-l-2 border-red-900/50">
                    <span className="font-mono text-[10px] text-red-400 block uppercase mb-0.5">Critical Friction</span>
                    <p className="text-slate-300 font-light">{persona.painPoints}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};