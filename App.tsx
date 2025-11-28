import React, { useState, useEffect } from 'react';
import { Icons } from './constants';
import { ContextPanel } from './components/ContextPanel';
import { ChatInterface } from './components/ChatInterface';
import { AppContextState, Message, Sender, WidgetType } from './types';
import { sendMessageToGemini } from './services/geminiService';

const INITIAL_STATE: AppContextState = {
  profile: {
    name: "Acme Corp",
    industry: "Online Handel",
    description: "",
    targetAudience: ["Startups", "Techies"]
  },
  goals: [],
  contentPlan: [
    { id: '1', title: 'Launch Post', channel: 'LinkedIn', status: 'Planned', date: '2023-11-01' },
    { id: '2', title: 'User Story Video', channel: 'Instagram', status: 'Idea', date: '2023-11-05' },
    { id: '3', title: 'Halloween Sale', channel: 'Email', status: 'Done', date: '2023-10-31' }
  ],
  strategy: [],
  personas: [],
  competitors: [],
  kpiHistory: [
      { month: 'Jan', value: 40 },
      { month: 'Feb', value: 30 },
      { month: 'Mar', value: 55 },
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
    text: "Willkommen an Bord, Commander. 🚀\n\nSysteme sind online. Ich bin Houston, bereit dein Marketing-Universum zu navigieren. Womit sollen wir den Schub starten?",
    timestamp: new Date(),
    widget: { type: WidgetType.NONE }
  }
];

export default function App() {
  const [appState, setAppState] = useState<AppContextState>(INITIAL_STATE);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize Stars
  useEffect(() => {
    const container = document.getElementById('star-container');
    if (container) {
       for(let i=0; i<50; i++) {
         const star = document.createElement('div');
         star.className = 'star';
         star.style.left = `${Math.random() * 100}%`;
         star.style.top = `${Math.random() * 100}%`;
         star.style.width = `${Math.random() * 3}px`;
         star.style.height = star.style.width;
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
    <div className="flex h-screen bg-void-900 text-slate-100 font-sans overflow-hidden relative">
      
      {/* Dynamic Background */}
      <div id="star-container" className="stars-container"></div>
      <div className="ambient-glow top-[-10%] left-[-10%]"></div>
      <div className="ambient-glow bottom-[-10%] right-[-10%] bg-purple-900/20"></div>

      {/* Floating Sidebar Navigation */}
      <aside className="hidden md:flex w-20 flex-col items-center py-8 z-20 ml-4 my-4 rounded-2xl glass-panel border-white/5">
        <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-primary-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] mb-8 animate-pulse-slow">
            <Icons.Rocket className="w-5 h-5" />
        </div>
        <nav className="flex flex-col gap-6 w-full items-center flex-1">
            <button className="group relative p-3 rounded-xl bg-white/10 text-neon-blue border border-white/10">
                <Icons.MessageSquare className="w-5 h-5 relative z-10" />
                <div className="absolute inset-0 bg-neon-blue/20 blur-md rounded-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all hover:scale-110">
                <Icons.LayoutDashboard className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all hover:scale-110">
                <Icons.Target className="w-5 h-5" />
            </button>
             <button className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all hover:scale-110">
                <Icons.Calendar className="w-5 h-5" />
            </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0 z-10">
        {/* Mobile Header */}
        <header className="md:hidden h-16 glass-panel border-b border-white/5 flex items-center justify-between px-4 z-50">
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

        {/* Chat Interface */}
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isTyping={isTyping} 
          appState={appState}
          updateAppState={updateAppState}
        />
      </main>

      {/* Context Panel (Right Sidebar) */}
      <ContextPanel 
        state={appState} 
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

    </div>
  );
}