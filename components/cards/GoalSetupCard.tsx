import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Goal } from '../../types';

interface Props {
  onSave: (goal: Goal) => void;
}

export const GoalSetupCard: React.FC<Props> = ({ onSave }) => {
  const [goal, setGoal] = useState<Partial<Goal>>({
    kpi: 'Leads',
    targetValue: 100,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    unit: 'Einheiten'
  });

  const handleSubmit = () => {
    if (goal.kpi && goal.targetValue && goal.deadline) {
      onSave({
        id: Date.now().toString(),
        kpi: goal.kpi,
        targetValue: Number(goal.targetValue),
        currentValue: 0,
        deadline: goal.deadline,
        unit: goal.unit || ''
      });
    }
  };

  return (
    <Card title="Zieldefinition" className="w-full max-w-md mx-auto my-2">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-2 font-mono uppercase">Metrik Typ</label>
            <select 
              className="w-full p-2.5 rounded-lg border border-white/10 bg-void-950/50 text-white focus:border-neon-blue outline-none"
              value={goal.kpi}
              onChange={e => setGoal({...goal, kpi: e.target.value})}
            >
              <option value="Leads">Leads</option>
              <option value="Umsatz">Umsatz</option>
              <option value="Traffic">Traffic</option>
              <option value="Follower">Follower</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-2 font-mono uppercase">Zielwert</label>
            <input 
              type="number" 
              className="w-full p-2.5 rounded-lg border border-white/10 bg-void-950/50 text-white focus:border-neon-blue outline-none font-mono"
              value={goal.targetValue}
              onChange={e => setGoal({...goal, targetValue: Number(e.target.value)})}
            />
          </div>
        </div>

        <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-2 font-mono uppercase">Deadline</label>
            <input 
              type="date"
              className="w-full p-2.5 rounded-lg border border-white/10 bg-void-950/50 text-white focus:border-neon-blue outline-none [color-scheme:dark]"
              value={goal.deadline}
              onChange={e => setGoal({...goal, deadline: e.target.value})}
            />
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/50 font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] uppercase tracking-wide text-xs"
        >
          Protokoll Aktivieren
        </button>
      </div>
    </Card>
  );
};