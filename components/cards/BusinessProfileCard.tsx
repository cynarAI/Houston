import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { BusinessProfile } from '../../types';

interface Props {
  profile: BusinessProfile;
  onSave: (p: BusinessProfile) => void;
}

export const BusinessProfileCard: React.FC<Props> = ({ profile, onSave }) => {
  const [data, setData] = useState(profile);
  const [isEditing, setIsEditing] = useState(true);

  const handleSave = () => {
    onSave(data);
    setIsEditing(false);
  };

  return (
    <Card title="Entity Configuration" className="w-full max-w-md mx-auto my-2">
      <div className="space-y-5">
        <div className="group">
          <label className="block text-[10px] font-bold text-neon-blue uppercase tracking-widest mb-2 font-mono">Entity Name</label>
          {isEditing ? (
            <input 
              className="w-full p-3 rounded-xl border border-white/10 bg-void-950/50 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all placeholder-slate-600"
              value={data.name} 
              onChange={e => setData({...data, name: e.target.value})} 
              placeholder="Enter name..."
            />
          ) : (
            <p className="text-xl font-display font-medium text-white">{data.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Sector</label>
          {isEditing ? (
            <input 
              className="w-full p-3 rounded-xl border border-white/10 bg-void-950/50 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
              value={data.industry} 
              onChange={e => setData({...data, industry: e.target.value})} 
            />
          ) : (
             <p className="text-slate-300">{data.industry}</p>
          )}
        </div>

        <div>
           <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Target Coordinates</label>
           {isEditing ? (
             <input 
                className="w-full p-3 rounded-xl border border-white/10 bg-void-950/50 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                value={data.targetAudience.join(', ')}
                onChange={e => setData({...data, targetAudience: e.target.value.split(',').map(s => s.trim())})}
             />
           ) : (
             <div className="flex flex-wrap gap-2 mt-1">
               {data.targetAudience.map((tag, i) => (
                 <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-xs rounded-full">
                   {tag}
                 </span>
               ))}
             </div>
           )}
        </div>

        {isEditing ? (
          <button 
            onClick={handleSave}
            className="w-full mt-2 bg-gradient-to-r from-neon-blue to-primary-600 hover:to-primary-500 text-void-900 font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transform hover:scale-[1.02]"
          >
            Save Configuration
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full mt-2 text-slate-400 hover:text-white font-medium py-3 px-4 hover:bg-white/5 rounded-xl transition-colors border border-dashed border-white/10 hover:border-white/30"
          >
            Modify Data
          </button>
        )}
      </div>
    </Card>
  );
};