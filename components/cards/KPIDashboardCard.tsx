import React from 'react';
import { Card } from '../ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Icons } from '../../constants';

interface Props {
  data: { month: string; value: number }[];
}

export const KPIDashboardCard: React.FC<Props> = ({ data }) => {
  const handleExport = () => {
    alert("Export startet...");
  };

  const Actions = (
    <button onClick={handleExport} className="text-[10px] uppercase tracking-wider flex items-center gap-1.5 text-neon-blue hover:text-white transition-colors bg-white/5 border border-neon-blue/30 hover:bg-neon-blue/20 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.1)]">
      <Icons.Briefcase className="w-3 h-3" />
      Export PDF
    </button>
  );

  return (
    <Card title="Performance Scan" className="w-full max-w-lg mx-auto my-2" actions={Actions}>
      <div className="h-56 w-full relative">
        {/* Chart Background Grid Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-neon-blue/5 to-transparent pointer-events-none"></div>
        
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#94a3b8', fontFamily: 'monospace'}} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#94a3b8', fontFamily: 'monospace'}} 
            />
            <Tooltip 
              contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                  color: '#fff'
              }}
              itemStyle={{ color: '#00f0ff' }}
            />
            <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#00f0ff" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-white/10">
        <div className="text-center group cursor-pointer">
            <div className="text-3xl font-display font-bold text-white group-hover:text-neon-blue transition-colors group-hover:scale-110 transform duration-300">124</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-1">Leads</div>
        </div>
        <div className="text-center group cursor-pointer">
            <div className="text-3xl font-display font-bold text-neon-blue group-hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all">+12%</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-1">Growth</div>
        </div>
        <div className="text-center group cursor-pointer">
            <div className="text-3xl font-display font-bold text-white group-hover:text-neon-purple transition-colors">3.4%</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-1">Conv. Rate</div>
        </div>
      </div>
    </Card>
  );
};