
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Bottleneck } from '../../types';
import { Icons } from '../../constants';

interface Props {
  bottlenecks?: Bottleneck[];
  onSave?: (bottlenecks: Bottleneck[]) => void;
}

export const BottleneckCard: React.FC<Props> = ({ bottlenecks: initialBottlenecks, onSave }) => {
  // Default values if none provided by AI for demo/initial state
  const defaultBottlenecks: Bottleneck[] = initialBottlenecks || [
    { id: '1', category: 'Traffic', name: 'Zu wenig Webseiten-Besucher', severity: 'High', selected: false },
    { id: '2', category: 'Conversion', name: 'Besucher kaufen nicht', severity: 'High', selected: false },
    { id: '3', category: 'Offer', name: 'Angebot wird nicht verstanden', severity: 'Medium', selected: false },
    { id: '4', category: 'Trust', name: 'Fehlende Kundenstimmen', severity: 'Medium', selected: false },
    { id: '5', category: 'Retention', name: 'Keine Wiederkäufer', severity: 'Low', selected: false },
  ];

  const [items, setItems] = useState(defaultBottlenecks);

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(items);
    }
  };

  return (
    <Card title="System-Diagnose: Engpässe" className="w-full max-w-lg mx-auto my-2">
      <div className="space-y-4">
        <p className="text-xs text-slate-400 font-mono mb-2">
           SCAN COMPLETE. WÄHLE AKTIVE WARNSYSTEME:
        </p>
        <div className="grid gap-3">
          {items.map((item) => (
            <div 
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`
                relative cursor-pointer p-4 rounded-xl border transition-all duration-300 group
                ${item.selected 
                  ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}
              `}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className={`
                      w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                      ${item.selected ? 'bg-red-500 border-red-500' : 'border-slate-500'}
                   `}>
                      {item.selected && <Icons.CheckCircle className="w-3 h-3 text-white" />}
                   </div>
                   <div>
                      <div className={`font-bold text-sm ${item.selected ? 'text-white' : 'text-slate-300'}`}>
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-0.5">
                        Sektor: {item.category}
                      </div>
                   </div>
                </div>
                
                {item.selected && (
                  <div className="text-[10px] font-bold text-red-400 bg-red-500/20 px-2 py-1 rounded animate-pulse">
                    ALERT
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleSave}
          className="w-full mt-2 bg-gradient-to-r from-red-900/40 to-red-600/20 hover:from-red-900/60 hover:to-red-600/40 text-red-200 hover:text-white text-xs font-mono py-3 rounded-lg border border-red-500/30 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
        >
           <Icons.Zap className="w-3 h-3" />
           Diagnose Speichern
        </button>
      </div>
    </Card>
  );
};
