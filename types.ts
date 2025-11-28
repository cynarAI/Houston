
export enum Sender {
  USER = 'user',
  BOT = 'bot'
}

export enum WidgetType {
  BUSINESS_PROFILE = 'BUSINESS_PROFILE',
  GOAL_SETUP = 'GOAL_SETUP',
  CONTENT_PLAN = 'CONTENT_PLAN',
  KPI_REPORT = 'KPI_REPORT',
  STRATEGY = 'STRATEGY',
  PERSONA = 'PERSONA',
  COMPETITOR_ANALYSIS = 'COMPETITOR_ANALYSIS',
  NONE = 'NONE'
}

export interface WidgetData {
  type: WidgetType;
  data?: any;
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  widget?: WidgetData;
  timestamp: Date;
}

// Business Context Types
export interface BusinessProfile {
  name: string;
  industry: string;
  description: string;
  targetAudience: string[];
}

export interface Goal {
  id: string;
  kpi: string; // e.g., 'Leads', 'Revenue'
  targetValue: number;
  currentValue: number;
  deadline: string;
  unit: string;
}

export interface ContentItem {
  id: string;
  title: string;
  channel: string;
  status: 'Idea' | 'Planned' | 'Done';
  date: string;
}

export interface StrategyPillar {
  id: string;
  title: string;
  description: string;
  actionItems: string[];
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  needs: string;
  painPoints: string;
}

export interface Competitor {
  id: string;
  name: string;
  strength: string;
  weakness: string;
}

export interface AppContextState {
  profile: BusinessProfile;
  goals: Goal[];
  contentPlan: ContentItem[];
  strategy: StrategyPillar[];
  personas: Persona[];
  competitors: Competitor[];
  kpiHistory: { month: string; value: number }[];
  darkMode: boolean;
}

export interface GeminiResponse {
  text: string;
  widget?: {
    type: string;
    data?: any;
  }
}
