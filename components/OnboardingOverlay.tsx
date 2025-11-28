import React, { useEffect, useState } from 'react';
import { Icons } from '../constants';

interface Props {
  onComplete: () => void;
}

export const OnboardingOverlay: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [bootText, setBootText] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      { text: "INITIALIZING HOUSTON KERNEL...", delay: 500 },
      { text: "LOADING NEURAL MODULES...", delay: 1200 },
      { text: "CALIBRATING MARKETING SENSORS...", delay: 2000 },
      { text: "ESTABLISHING UPLINK TO GEMINI-3...", delay: 2800 },
      { text: "SYSTEM READY.", delay: 3500 },
    ];

    let timeouts: ReturnType<typeof setTimeout>[] = [];

    sequence.forEach(({ text, delay }, index) => {
      const timeout = setTimeout(() => {
        setBootText(prev => [...prev, text]);
        if (index === sequence.length - 1) {
          setTimeout(() => setStep(1), 800);
        }
      }, delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  if (step === 2) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-void-950 flex flex-col items-center justify-center transition-opacity duration-1000 ${step === 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Background Grid & CRT Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 radial-gradient(circle_at_center,transparent_0%,#000_100%)"></div>
      <div className="crt-overlay absolute inset-0"></div>
      <div className="scanline"></div>

      <div className="relative z-10 max-w-lg w-full p-8 text-center">
        
        {step === 0 && (
          <div className="font-mono text-neon-blue text-sm space-y-2 text-left h-48">
            {bootText.map((line, i) => (
              <div key={i} className="animate-pulse">
                <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                {line}
              </div>
            ))}
            <div className="w-2 h-4 bg-neon-blue animate-blink inline-block ml-1"></div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fadeIn flex flex-col items-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-neon-blue blur-3xl opacity-20 rounded-full animate-pulse-slow"></div>
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-blue to-primary-600 flex items-center justify-center shadow-[0_0_50px_rgba(0,240,255,0.4)] relative z-10 border border-white/20">
                <Icons.Rocket className="w-12 h-12 text-white animate-float" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-blue to-white tracking-tight">
                HOUSTON
              </h1>
              <p className="text-slate-400 font-mono text-sm tracking-[0.3em] uppercase">AI Marketing OS v2.4</p>
            </div>

            <p className="text-slate-300 max-w-sm mx-auto leading-relaxed">
              Dein Copilot für Strategie, Wachstum und Automatisierung. Bereit für den Start?
            </p>

            <button 
              onClick={() => {
                setStep(2);
                setTimeout(onComplete, 1000);
              }}
              className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full"
            >
              <div className="absolute inset-0 w-full h-full bg-neon-blue/10 border border-neon-blue/50 rounded-full group-hover:bg-neon-blue/20 transition-all duration-300"></div>
              <div className="absolute inset-0 w-full h-full bg-neon-blue/20 blur-xl opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
              <span className="relative flex items-center gap-3 text-neon-blue font-bold tracking-widest uppercase group-hover:text-white transition-colors">
                System Hochfahren <Icons.Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};