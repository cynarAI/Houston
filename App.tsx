import React, { useState, useEffect } from 'react';
import { Icons } from './constants';
import { ContextPanel } from './components/ContextPanel';
import { ChatInterface } from './components/ChatInterface';
import { OnboardingOverlay } from './components/OnboardingOverlay';
import { AppContextState, Message, Sender, WidgetType } from './types';
import { sendMessageToGemini } from './services/geminiService';

const INITIAL_STATE: AppContextState = {
  profile: {
    name: "TechNova GmbH",
    industry: "SaaS / B2B",
    description: "",
    targetAudience: ["CTOs", "Gründer", "Entwickler"]
  },
  goals: [],
  contentPlan: [
    { id: '1', title: 'LinkedIn Launch Post', channel: 'LinkedIn', status: 'Planned', date: '2023-11-01' },
    { id: '2', title: 'Case Study Video', channel: 'YouTube', status: 'Idea', date: '2023-11-05' },
    { id: '3', title: 'Halloween Newsletter', channel: 'Email', status: 'Done', date: '2023-10-31' }
  ],
  strategy: [],
  personas: [],
  competitors: [],
  bottlenecks: [
     { id: '1', category: 'Traffic', name: 'Organische Reichweite zu gering', severity: 'Medium', selected: true },
     { id: '2', category: 'Conversion', name: 'Bounce Rate auf Landingpage > 70%', severity: 'High', selected: true },
  ],
  roadmap: [
      { 
          phase: 1, 
          title: "Analyse & Fundament", 
          duration: "Woche 1-2", 
          tasks: ["Website Audit durchführen", "Tracking Pixel fixen", "Wettbewerber screenen"] 
      },
      { 
          phase: 2, 
          title: "Content Offensive", 
          duration: "Woche 3-6", 
          tasks: ["LinkedIn Redaktionsplan", "Video-Assets erstellen"] 
      }
  ],
  kpiHistory: [
      { month: 'Jan', value: 40 },
      { month: 'Feb', value: 30 },
      { month: 'Mrz', value: 55 },
      { month: 'Apr', value: 80 },
      { month: 'Mai', value: 65 },
      { month: 'Jun', value: 124 },
  ],
  darkMode: true // Forced Dark Mode for Space Theme
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    sender: Sender.BOT,
    text: "Willkommen an Bord, Commander. 🚀\n\nAlle Systeme sind online. Ich bin Houston, dein strategischer KI-Copilot. Ich helfe dir dabei, dein Marketing-Universum zu navigieren.\n\nSollen wir mit einem Status-Check beginnen oder hast du eine direkte Mission?",
    timestamp: new Date(),
    widget: { type: WidgetType.NONE }
  }
];

export default function App() {
  const [appState, setAppState] = useState<AppContextState>(INITIAL_STATE);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Initialize Stars
  useEffect(() => {
    const container = document.getElementById('star-container');
    if (container) {
       for(let i=0; i<70; i++) {
         const star = document.createElement('div');
         star.className = 'star';
         star.style.left = `${Math.random() * 100}%`;
         star.style.top = `${Math.random() * 100}%`;
         const size = Math.random() * 2 + 1;
         star.style.width = `${size}px`;
         star.style.height = `${size}px`;
         star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
         star.style.setProperty('--opacity', `${Math.random() * 0.7 + 0.3}`);
         container.appendChild(star);
       }
    }
    // Force dark class
    document.documentElement.classList.add('dark');
  }, []);

  const updateAppState = (updates: Partial<AppContextState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await sendMessageToGemini(messages, text, appState);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.BOT,
        text: response.text,
        timestamp: new Date(),
        widget: response.widget ? { type: response.widget.type as WidgetType, data: response.widget.data } : undefined
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.BOT,
        text: "Verbindung unterbrochen. Signal verloren. Bitte erneut senden.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {showOnboarding && <OnboardingOverlay onComplete={() => setShowOnboarding(false)} />}
      
      {/* Root Container: Removed bg-void-900 so stars are visible. Added min-h-0 for proper flex nesting. */}
      <div className="flex h-[100dvh] w-full text-slate-100 font-sans overflow-hidden transition-opacity duration-1000 relative">
        
        {/* Dynamic Background */}
        <div id="star-container" className="stars-container"></div>
        <div className="ambient-glow top-[-20%] left-[-10%] opacity-50"></div>
        <div className="ambient-glow bottom-[-20%] right-[-10%] bg-purple-900/20 opacity-50"></div>

        {/* Floating Sidebar Navigation (Desktop) */}
        <aside className="hidden md:flex flex-col items-center py-6 w-20 z-30 ml-4 my-4 rounded-2xl glass-panel border-white/5 shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-primary-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] mb-8 animate-pulse-slow">
              <Icons.Rocket className="w-5 h-5" />
          </div>
          <nav className="flex flex-col gap-6 w-full items-center flex-1">
              <button className="group relative p-3 rounded-xl bg-white/10 text-neon-blue border border-white/10 shadow-[0_0_10px_rgba(0,240,255,0.2)]" title="Chat">
                  <Icons.MessageSquare className="w-5 h-5 relative z-10" />
                  <div className="absolute inset-0 bg-neon-blue/20 blur-md rounded-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all hover:scale-110" title="Dashboard">
                  <Icons.LayoutDashboard className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all hover:scale-110" title="Ziele">
                  <Icons.Target className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all hover:scale-110" title="Planer">
                  <Icons.Calendar className="w-5 h-5" />
              </button>
          </nav>
        </aside>

        {/* Main Content Area - Use flex-1 and min-w-0 to prevent flexbox overflow bugs */}
        <main className="flex-1 flex flex-col h-full min-w-0 relative z-10">
          
          {/* Mobile Header - Absolute for overlap effect */}
          <header className="md:hidden h-16 glass-panel border-b border-white/5 flex items-center justify-between px-4 z-50 shrink-0 absolute top-0 left-0 right-0 w-full backdrop-blur-xl bg-void-900/50">
            <div className="flex items-center gap-3 font-display font-bold text-lg tracking-wider">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-primary-600 flex items-center justify-center shadow-lg shadow-neon-blue/20">
                  <Icons.Rocket className="w-4 h-4 text-white" />
                </div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">HOUSTON</span>
            </div>
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-300">
                  <Icons.Menu className="w-6 h-6" />
            </button>
          </header>

          {/* Desktop Header */}
          <header className="hidden md:flex h-20 items-center justify-between px-8 z-40 shrink-0">
             <div>
                <h1 className="text-2xl font-display font-bold text-white tracking-wide">
                  MISSION CONTROL
                </h1>
                <p className="text-xs text-neon-blue/80 font-mono tracking-widest uppercase">
                  SYSTEM ONLINE // <span className="text-white">GEMINI-3 CONNECTED</span>
                </p>
             </div>
             <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e] animate-pulse"></span>
                  LIVE
                </div>
             </div>
          </header>

          {/* Chat Interface Container */}
          <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
            <ChatInterface 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              isTyping={isTyping} 
              appState={appState}
              updateAppState={updateAppState}
            />
          </div>
        </main>

        {/* Context Panel (Right Sidebar) */}
        <ContextPanel 
          state={appState} 
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

      </div>
    </>
  );
}