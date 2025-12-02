import React from 'react';
import { Card } from '../ui/Card';
import { ContentItem } from '../../types';

interface Props {
  items: ContentItem[];
}

export const ContentPlanCard: React.FC<Props> = ({ items }) => {
  const columns = {
    Idea: items.filter(i => i.status === 'Idea'),
    Planned: items.filter(i => i.status === 'Planned'),
    Done: items.filter(i => i.status === 'Done'),
  };

  const renderColumn = (title: string, items: ContentItem[], colorClass: string, dotColor: string) => (
    <div className="flex-1 min-w-[140px] bg-void-950/30 rounded-xl p-3 flex flex-col gap-3 border border-white/5">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
         <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">{title}</h4>
         <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">{items.length}</span>
      </div>
      
      {items.length === 0 ? (
        <div className="text-[10px] text-slate-600 text-center py-4 italic border border-dashed border-white/5 rounded-lg">Leer</div>
      ) : (
        items.map(item => (
          <div key={item.id} className="group bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/5 hover:border-white/20 shadow-sm transition-all cursor-pointer">
            <div className="font-medium text-slate-200 mb-2 leading-tight text-sm group-hover:text-neon-blue transition-colors">{item.title}</div>
            <div className="flex justify-between items-center text-[10px] text-slate-500">
               <span className="font-mono">{item.channel}</span>
               <span className={`w-2 h-2 rounded-full ${dotColor} shadow-[0_0_8px_currentColor]`}></span>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <Card title="Content Matrix" className="w-full max-w-3xl mx-auto my-2">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {renderColumn('Transmission (Idee)', columns.Idea, 'text-slate-400', 'bg-slate-500')}
        {renderColumn('Geplant', columns.Planned, 'text-neon-blue', 'bg-neon-blue')}
        {renderColumn('Gesendet', columns.Done, 'text-green-400', 'bg-green-500')}
      </div>
      <div className="mt-4 text-center border-t border-white/5 pt-3">
          <button className="text-xs text-slate-400 hover:text-white font-medium flex items-center justify-center gap-2 mx-auto transition-colors group">
              <span className="w-5 h-5 rounded border border-dashed border-slate-500 flex items-center justify-center group-hover:border-white group-hover:bg-white/10">+</span>
              <span>Neues Element Initialisieren</span>
          </button>
      </div>
    </Card>
  );
};