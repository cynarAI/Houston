import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender, WidgetType, AppContextState } from '../types';
import { BusinessProfileCard } from './cards/BusinessProfileCard';
import { GoalSetupCard } from './cards/GoalSetupCard';
import { ContentPlanCard } from './cards/ContentPlanCard';
import { KPIDashboardCard } from './cards/KPIDashboardCard';
import { StrategyCard } from './cards/StrategyCard';
import { PersonaCard } from './cards/PersonaCard';
import { CompetitorCard } from './cards/CompetitorCard';
import { BottleneckCard } from './cards/BottleneckCard';
import { RoadmapCard } from './cards/RoadmapCard';
import { LandingPageCard } from './cards/LandingPageCard';
import { ValuePropositionCard } from './cards/ValuePropositionCard';
import { Icons } from '../constants';

interface Props {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  appState: AppContextState;
  updateAppState: (updates: Partial<AppContextState>) => void;
}

export const ChatInterface: React.FC<Props> = ({ messages, onSendMessage, isTyping, appState, updateAppState }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderWidget = (widgetType: WidgetType, widgetData: any) => {
    switch (widgetType) {
      case WidgetType.BUSINESS_PROFILE:
        return (
          <BusinessProfileCard 
            profile={appState.profile} 
            onSave={(updated) => updateAppState({ profile: updated })} 
          />
        );
      case WidgetType.GOAL_SETUP:
        return (
            <GoalSetupCard 
                onSave={(goal) => updateAppState({ goals: [...appState.goals, goal] })}
            />
        );
      case WidgetType.CONTENT_PLAN:
          return <ContentPlanCard items={appState.contentPlan} />;
      case WidgetType.KPI_REPORT:
          return <KPIDashboardCard data={appState.kpiHistory} />;
      case WidgetType.STRATEGY:
          if(widgetData?.pillars && appState.strategy.length === 0) {
              setTimeout(() => updateAppState({ strategy: widgetData.pillars }), 0);
          }
          return <StrategyCard pillars={widgetData?.pillars || appState.strategy} />;
      case WidgetType.PERSONA:
          if(widgetData?.personas && appState.personas.length === 0) {
              setTimeout(() => updateAppState({ personas: widgetData.personas }), 0);
          }
          return <PersonaCard personas={widgetData?.personas || appState.personas} />;
      case WidgetType.COMPETITOR_ANALYSIS:
          if(widgetData?.competitors && appState.competitors.length === 0) {
              setTimeout(() => updateAppState({ competitors: widgetData.competitors }), 0);
          }
          return <CompetitorCard competitors={widgetData?.competitors || appState.competitors} />;
      case WidgetType.BOTTLENECK_ANALYSIS:
          return (
            <BottleneckCard 
              bottlenecks={widgetData?.bottlenecks || appState.bottlenecks} 
              onSave={(updated) => updateAppState({ bottlenecks: updated })}
            />
          );
      case WidgetType.ROADMAP:
          if(widgetData?.phases && appState.roadmap.length === 0) {
              setTimeout(() => updateAppState({ roadmap: widgetData.phases }), 0);
          }
          return <RoadmapCard phases={widgetData?.phases || appState.roadmap} />;
      case WidgetType.LANDING_PAGE_STRUCTURE:
          return <LandingPageCard sections={widgetData?.sections || []} />;
      case WidgetType.VALUE_PROPOSITION:
          return <ValuePropositionCard canvas={widgetData?.canvas || { customerProfile: {jobs:[], pains:[], gains:[]}, valueMap: {products:[], painRelievers:[], gainCreators:[]} }} />;
      default:
        return null;
    }
  };

  const quickActions = [
    { label: "Scan Engpässe", icon: <Icons.Target className="w-4 h-4 text-red-400"/>, action: "Analysiere meine Marketing-Engpässe." },
    { label: "Roadmap", icon: <Icons.Compass className="w-4 h-4 text-neon-blue"/>, action: "Erstelle eine Roadmap für die nächsten 8 Wochen." },
    { label: "Landing Page", icon: <Icons.LayoutDashboard className="w-4 h-4 text-neon-green"/>, action: "Wie sollte meine Landing Page aufgebaut sein?" },
    { label: "Value Prop", icon: <Icons.Zap className="w-4 h-4 text-yellow-400"/>, action: "Erstelle ein Value Proposition Canvas für mein Angebot." },
  ];

  return (
    <div className="flex-1 flex flex-col h-full relative">
      
      {/* Chat Area */}
      {/* 
        Layout Fix:
        - Mobile: pt-20 pushes content below the absolute header (h-16 + spacing).
        - Desktop: pt-0 because header is in normal flow above this component.
        - Removed mask-image-gradient to prevent cutting off top content.
      */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-20 md:pt-4 pb-4 space-y-8 scrollbar-hide z-10">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender === Sender.USER ? 'items-end' : 'items-start'} animate-fadeIn`}
          >
            {/* Message Bubble */}
            <div className={`
              max-w-[90%] md:max-w-[70%] px-6 py-4 rounded-2xl text-sm md:text-base leading-relaxed backdrop-blur-md shadow-lg border
              ${msg.sender === Sender.USER 
                ? 'bg-primary-600 border-primary-500/50 text-white rounded-br-none shadow-[0_4px_20px_-5px_rgba(79,70,229,0.5)]' 
                : 'bg-void-800/80 border-white/10 text-slate-200 rounded-bl-none shadow-xl hover:border-white/20 transition-colors'}
            `}>
              {msg.sender === Sender.BOT && (
                 <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-neon-blue to-purple-500 flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                       <Icons.Rocket className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white tracking-wide">HOUSTON AI</span>
                 </div>
              )}
              <p className="whitespace-pre-wrap font-light tracking-wide">{msg.text}</p>
            </div>

            {/* Widget Attachment */}
            {msg.widget && msg.widget.type !== WidgetType.NONE && (
              <div className="mt-4 w-full md:max-w-[90%] lg:max-w-[85%] animate-float">
                 {renderWidget(msg.widget.type, msg.widget.data)}
              </div>
            )}
            
            <div className="text-[10px] text-slate-500 mt-2 px-1 font-mono opacity-60">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start">
             <div className="bg-white/5 backdrop-blur-md px-4 py-3 rounded-2xl rounded-bl-none border border-white/10 shadow-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce delay-200"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Deck (Floating) */}
      <div className="p-4 md:p-6 z-20 mt-auto bg-gradient-to-t from-void-900 via-void-900/90 to-transparent">
        <div className="max-w-4xl mx-auto">
            {/* Quick Actions Chips */}
            <div className="flex gap-3 mb-4 overflow-x-auto scrollbar-hide pb-2">
            {quickActions.map((qa, idx) => (
                <button 
                key={idx}
                onClick={() => onSendMessage(qa.action)}
                className="group flex items-center gap-2 px-4 py-2 bg-void-800/80 hover:bg-white/10 border border-white/10 hover:border-neon-blue/50 rounded-full text-xs font-medium text-slate-300 transition-all duration-300 backdrop-blur-md hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] shrink-0 whitespace-nowrap"
                >
                <span className="group-hover:scale-110 transition-transform duration-300">{qa.icon}</span>
                {qa.label}
                </button>
            ))}
            </div>

            {/* Input Field */}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue via-purple-500 to-pink-500 rounded-2xl opacity-30 group-focus-within:opacity-100 blur transition duration-500"></div>
                <div className="relative flex items-end gap-2 bg-void-900/90 backdrop-blur-xl p-2 rounded-2xl border border-white/10">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Starte eine Mission..."
                        className="flex-1 bg-transparent border-none focus:ring-0 p-3 min-h-[50px] max-h-32 resize-none text-slate-100 placeholder-slate-500 font-light text-base scrollbar-hide focus:outline-none"
                        rows={1}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isTyping}
                        className="p-3 bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                        <Icons.Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <div className="text-center mt-3 text-[10px] text-slate-600 font-mono tracking-widest uppercase">
                AI Powered Marketing OS v2.4 // Connected to Gemini-3
            </div>
        </div>
      </div>
    </div>
  );
};