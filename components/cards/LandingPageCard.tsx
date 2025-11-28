
import React from 'react';
import { Card } from '../ui/Card';
import { LandingPageSection } from '../../types';

interface Props {
  sections: LandingPageSection[];
}

export const LandingPageCard: React.FC<Props> = ({ sections }) => {
  const getSectionColor = (type: string) => {
    switch(type) {
        case 'Hero': return 'bg-neon-blue/20 border-neon-blue/50 text-neon-blue';
        case 'CTA': return 'bg-neon-pink/20 border-neon-pink/50 text-neon-pink';
        case 'SocialProof': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500';
        default: return 'bg-white/5 border-white/10 text-slate-300';
    }
  };

  return (
    <Card title="Wireframe Blaupause" className="w-full max-w-md mx-auto my-2">
      <div className="bg-void-950 rounded-xl border border-white/10 p-2 space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide shadow-inner">
        
        {/* Browser Bar */}
        <div className="flex gap-1.5 px-2 py-1 mb-2 opacity-50">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>

        {sections.map((section, idx) => (
          <div 
            key={idx} 
            className={`
                p-4 rounded border-2 border-dashed flex flex-col items-center text-center transition-all hover:scale-[1.02] cursor-help
                ${getSectionColor(section.type)}
            `}
          >
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-70 mb-1">{section.type}</span>
            <h4 className="font-bold text-sm mb-1">{section.title}</h4>
            <p className="text-[10px] opacity-80 max-w-[90%]">{section.description}</p>
            
            {section.type === 'Hero' && (
                <div className="mt-2 w-20 h-6 bg-current opacity-20 rounded animate-pulse"></div>
            )}
            {section.type === 'CTA' && (
                <div className="mt-2 w-24 h-8 bg-current opacity-100 rounded shadow-lg text-void-900 text-[10px] font-bold flex items-center justify-center uppercase">
                    Action
                </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 text-center">
         <button className="text-[10px] text-slate-400 hover:text-white underline underline-offset-4 decoration-neon-blue">
            Struktur exportieren
         </button>
      </div>
    </Card>
  );
};
