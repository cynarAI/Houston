import { 
  FileText, 
  Gift, 
  Rocket, 
  TrendingUp, 
  Mail, 
  Share2, 
  Video, 
  Star,
  type LucideIcon 
} from "lucide-react";

export type PlaybookCategory = "content" | "leadgen" | "campaign" | "nurturing" | "social";
export type PlaybookDifficulty = "easy" | "medium" | "advanced";

export interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g. "2 Tage"
  todoTemplate?: {
    title: string;
    description: string;
  };
}

export interface PlaybookGoal {
  title: string;
  description: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
}

export interface Playbook {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  category: PlaybookCategory;
  difficulty: PlaybookDifficulty;
  durationDays: number;
  steps: PlaybookStep[];
  goals: PlaybookGoal[];
  houstonPrompts: string[];
  benefits: string[];
  tags: string[];
}

export const PLAYBOOK_CATEGORIES: Record<PlaybookCategory, { label: string; labelEn: string }> = {
  content: { label: "Content Marketing", labelEn: "Content Marketing" },
  leadgen: { label: "Lead-Generierung", labelEn: "Lead Generation" },
  campaign: { label: "Kampagnen", labelEn: "Campaigns" },
  nurturing: { label: "Nurturing", labelEn: "Nurturing" },
  social: { label: "Social Media", labelEn: "Social Media" },
};

export const PLAYBOOK_DIFFICULTIES: Record<PlaybookDifficulty, { label: string; labelEn: string; color: string }> = {
  easy: { label: "Einfach", labelEn: "Easy", color: "green" },
  medium: { label: "Mittel", labelEn: "Medium", color: "yellow" },
  advanced: { label: "Fortgeschritten", labelEn: "Advanced", color: "red" },
};

export const playbooks: Playbook[] = [
  // 1. Blog-Funnel Playbook
  {
    id: "blog-funnel",
    slug: "blog-funnel",
    title: "Blog-Funnel",
    subtitle: "Lead-Generierung durch SEO-Content",
    description: "Baue einen nachhaltigen Content-Funnel auf, der organisch Leads generiert. Von der Keyword-Recherche über die Content-Erstellung bis zur Conversion-Optimierung.",
    icon: FileText,
    category: "content",
    difficulty: "medium",
    durationDays: 90,
    benefits: [
      "Organischer Traffic ohne Werbekosten",
      "Langfristige Lead-Quelle",
      "Expertise-Positionierung",
      "Skalierbare Content-Strategie",
    ],
    tags: ["SEO", "Blog", "Content", "Organic"],
    steps: [
      {
        id: "bf-1",
        title: "Keyword-Recherche durchführen",
        description: "Identifiziere 20-30 relevante Keywords mit Suchvolumen und niedrigem Wettbewerb für deine Nische.",
        duration: "3 Tage",
        todoTemplate: {
          title: "Keyword-Recherche abschließen",
          description: "20-30 Keywords identifizieren mit Search Volume und Difficulty Score",
        },
      },
      {
        id: "bf-2",
        title: "Content-Cluster planen",
        description: "Gruppiere Keywords in 3-5 Pillar-Themen und plane Cluster-Artikel drumherum.",
        duration: "2 Tage",
        todoTemplate: {
          title: "Content-Cluster-Map erstellen",
          description: "3-5 Pillar-Seiten und zugehörige Cluster-Artikel definieren",
        },
      },
      {
        id: "bf-3",
        title: "Pillar-Content erstellen",
        description: "Schreibe 3-5 ausführliche Pillar-Artikel (2000+ Wörter) zu deinen Hauptthemen.",
        duration: "14 Tage",
        todoTemplate: {
          title: "Ersten Pillar-Artikel schreiben",
          description: "Ausführlichen Artikel (2000+ Wörter) zum Hauptthema erstellen",
        },
      },
      {
        id: "bf-4",
        title: "Cluster-Artikel produzieren",
        description: "Erstelle 15-20 Cluster-Artikel, die intern auf Pillar-Content verlinken.",
        duration: "30 Tage",
        todoTemplate: {
          title: "Wöchentlich 2-3 Cluster-Artikel",
          description: "Regelmäßig Blog-Artikel veröffentlichen und intern verlinken",
        },
      },
      {
        id: "bf-5",
        title: "Lead-Magneten integrieren",
        description: "Füge relevante Lead-Magneten (Checklisten, Templates) in jeden Artikel ein.",
        duration: "7 Tage",
        todoTemplate: {
          title: "Lead-Magneten für jeden Cluster erstellen",
          description: "Passenden Lead-Magnet pro Content-Cluster entwickeln",
        },
      },
      {
        id: "bf-6",
        title: "Conversion-Rate optimieren",
        description: "Teste verschiedene CTAs, Pop-ups und Exit-Intent-Formulare.",
        duration: "14 Tage",
        todoTemplate: {
          title: "A/B-Tests für CTAs einrichten",
          description: "3 verschiedene CTA-Varianten testen und messen",
        },
      },
      {
        id: "bf-7",
        title: "Content-Performance analysieren",
        description: "Überprüfe Rankings, Traffic und Conversions. Optimiere Top-Performer.",
        duration: "Laufend",
        todoTemplate: {
          title: "Monatliches Content-Reporting",
          description: "Traffic, Rankings und Conversions analysieren",
        },
      },
    ],
    goals: [
      {
        title: "50 organische Leads pro Monat generieren",
        description: "Durch den Blog-Funnel nachhaltig Leads gewinnen",
        specific: "50 qualifizierte Leads pro Monat über organischen Blog-Traffic",
        measurable: "Tracking über Google Analytics und E-Mail-Signup-Rate",
        achievable: "Mit 20+ Artikeln und optimierten Lead-Magneten erreichbar",
        relevant: "Reduziert Abhängigkeit von bezahlter Werbung",
        timeBound: "Innerhalb von 90 Tagen aufbauen",
      },
    ],
    houstonPrompts: [
      "Hilf mir bei der Keyword-Recherche für meinen Blog-Funnel",
      "Erstelle einen Content-Cluster-Plan für mein Thema",
      "Gib mir eine Outline für einen Pillar-Artikel",
      "Welche Lead-Magneten passen zu meinem Content?",
    ],
  },

  // 2. Leadmagnet Playbook
  {
    id: "leadmagnet",
    slug: "leadmagnet",
    title: "Leadmagnet",
    subtitle: "E-Mail-Liste aufbauen mit Freebie",
    description: "Erstelle einen unwiderstehlichen Lead-Magneten, der deine E-Mail-Liste explodieren lässt. Von der Idee bis zur Landing-Page.",
    icon: Gift,
    category: "leadgen",
    difficulty: "easy",
    durationDays: 14,
    benefits: [
      "Schneller E-Mail-Listen-Aufbau",
      "Qualifizierte Leads",
      "Wiederverwendbar für Ads",
      "Zeigt Expertise",
    ],
    tags: ["Lead-Magnet", "E-Mail", "Freebie", "Landing Page"],
    steps: [
      {
        id: "lm-1",
        title: "Zielgruppen-Problem identifizieren",
        description: "Finde das größte Problem deiner Zielgruppe, das du schnell lösen kannst.",
        duration: "1 Tag",
        todoTemplate: {
          title: "Top 3 Zielgruppen-Probleme auflisten",
          description: "Die dringendsten Probleme der Zielgruppe identifizieren",
        },
      },
      {
        id: "lm-2",
        title: "Lead-Magnet-Format wählen",
        description: "Entscheide: Checkliste, Template, E-Book, Mini-Kurs oder Tool?",
        duration: "1 Tag",
        todoTemplate: {
          title: "Lead-Magnet-Format festlegen",
          description: "Format basierend auf Zielgruppen-Präferenzen wählen",
        },
      },
      {
        id: "lm-3",
        title: "Lead-Magnet erstellen",
        description: "Produziere den Inhalt mit Fokus auf Quick Wins für den Nutzer.",
        duration: "5 Tage",
        todoTemplate: {
          title: "Lead-Magnet-Inhalt erstellen",
          description: "Hochwertigen Content mit schnellem Mehrwert produzieren",
        },
      },
      {
        id: "lm-4",
        title: "Landing-Page bauen",
        description: "Erstelle eine conversion-optimierte Landing-Page mit klarem CTA.",
        duration: "2 Tage",
        todoTemplate: {
          title: "Landing-Page erstellen",
          description: "Seite mit Headline, Benefits, Social Proof und Formular",
        },
      },
      {
        id: "lm-5",
        title: "E-Mail-Sequenz aufsetzen",
        description: "Schreibe eine 5-teilige Willkommens-Sequenz für neue Subscriber.",
        duration: "3 Tage",
        todoTemplate: {
          title: "Welcome-E-Mail-Serie schreiben",
          description: "5 E-Mails für die Onboarding-Sequenz verfassen",
        },
      },
      {
        id: "lm-6",
        title: "Promotion starten",
        description: "Bewirb den Lead-Magneten über Social Media, Website und ggf. Ads.",
        duration: "2 Tage",
        todoTemplate: {
          title: "Lead-Magnet-Promotion planen",
          description: "Verteilungskanäle definieren und ersten Push starten",
        },
      },
    ],
    goals: [
      {
        title: "100 neue E-Mail-Subscriber in 14 Tagen",
        description: "Mit dem Lead-Magneten die E-Mail-Liste aufbauen",
        specific: "100 neue, qualifizierte E-Mail-Subscriber gewinnen",
        measurable: "Tracking über E-Mail-Marketing-Tool",
        achievable: "Mit guter Promotion und optimierter Landing-Page",
        relevant: "E-Mail-Liste ist Basis für nachhaltiges Marketing",
        timeBound: "Innerhalb von 14 Tagen",
      },
    ],
    houstonPrompts: [
      "Welcher Lead-Magnet passt zu meiner Zielgruppe?",
      "Hilf mir, einen Titel für meinen Lead-Magneten zu finden",
      "Erstelle eine Outline für mein E-Book",
      "Schreibe mir eine Welcome-E-Mail-Sequenz",
    ],
  },

  // 3. Launch-Kampagne Playbook
  {
    id: "launch-campaign",
    slug: "launch-kampagne",
    title: "Launch-Kampagne",
    subtitle: "Produkt/Service erfolgreich launchen",
    description: "Plane und führe einen erfolgreichen Produkt-Launch durch. Pre-Launch Hype, Launch-Woche und Post-Launch Follow-up.",
    icon: Rocket,
    category: "campaign",
    difficulty: "advanced",
    durationDays: 30,
    benefits: [
      "Maximale Aufmerksamkeit zum Launch",
      "Strukturierter Launch-Prozess",
      "Momentum für Verkäufe",
      "Social Proof aufbauen",
    ],
    tags: ["Launch", "Kampagne", "Produkt", "Hype"],
    steps: [
      {
        id: "lc-1",
        title: "Launch-Ziele definieren",
        description: "Setze klare Umsatz- und Reichweiten-Ziele für den Launch.",
        duration: "1 Tag",
        todoTemplate: {
          title: "Launch-KPIs festlegen",
          description: "Umsatz, Verkäufe, Reach und Engagement-Ziele definieren",
        },
      },
      {
        id: "lc-2",
        title: "Pre-Launch Content planen",
        description: "Erstelle einen Content-Kalender für die Pre-Launch-Phase (14 Tage).",
        duration: "2 Tage",
        todoTemplate: {
          title: "Pre-Launch Content-Kalender",
          description: "14 Tage Content vor dem Launch planen",
        },
      },
      {
        id: "lc-3",
        title: "Waitlist aufbauen",
        description: "Sammle E-Mail-Adressen von Interessenten mit Early-Bird-Angebot.",
        duration: "7 Tage",
        todoTemplate: {
          title: "Waitlist-Landing-Page erstellen",
          description: "Seite für Interessenten mit Early-Bird-Incentive",
        },
      },
      {
        id: "lc-4",
        title: "Launch-Assets vorbereiten",
        description: "Erstelle alle Grafiken, Videos, E-Mails und Ads für die Launch-Woche.",
        duration: "7 Tage",
        todoTemplate: {
          title: "Launch-Grafiken erstellen",
          description: "Social Media Grafiken, Banner und E-Mail-Templates",
        },
      },
      {
        id: "lc-5",
        title: "Launch-Woche durchführen",
        description: "Führe den Launch mit täglichen Posts, E-Mails und Live-Events durch.",
        duration: "7 Tage",
        todoTemplate: {
          title: "Launch-Woche starten",
          description: "Tägliche Posts, E-Mails und Engagement",
        },
      },
      {
        id: "lc-6",
        title: "Post-Launch Follow-up",
        description: "Sammle Testimonials, bearbeite Feedback und plane Re-Launch.",
        duration: "6 Tage",
        todoTemplate: {
          title: "Testimonials sammeln",
          description: "Erste Kunden um Feedback und Reviews bitten",
        },
      },
    ],
    goals: [
      {
        title: "Launch-Umsatz von X€ erreichen",
        description: "Erfolgreicher Produkt-Launch mit definiertem Umsatzziel",
        specific: "Definiertes Umsatzziel in der Launch-Woche erreichen",
        measurable: "Tracking über Shop/Payment-System",
        achievable: "Mit Waitlist und Pre-Launch-Hype realistisch",
        relevant: "Umsatz für Produktweiterentwicklung",
        timeBound: "Innerhalb der 7-tägigen Launch-Woche",
      },
    ],
    houstonPrompts: [
      "Hilf mir, einen Launch-Plan zu erstellen",
      "Welche Pre-Launch-Aktivitäten sind am wichtigsten?",
      "Schreibe mir Launch-E-Mails für meine Waitlist",
      "Wie baue ich Hype für meinen Launch auf?",
    ],
  },

  // 4. Evergreen-Ads Playbook
  {
    id: "evergreen-ads",
    slug: "evergreen-ads",
    title: "Evergreen-Ads",
    subtitle: "Dauerhaft performante Werbung",
    description: "Baue ein Evergreen-Ads-System auf, das kontinuierlich Leads und Sales generiert. Von der Zielgruppen-Definition bis zur Skalierung.",
    icon: TrendingUp,
    category: "campaign",
    difficulty: "medium",
    durationDays: 60,
    benefits: [
      "Vorhersehbare Lead-Generierung",
      "Skalierbar bei Erfolg",
      "Funktioniert automatisch",
      "ROI-optimiert",
    ],
    tags: ["Ads", "Facebook", "Google", "Evergreen", "Paid"],
    steps: [
      {
        id: "ea-1",
        title: "Funnel definieren",
        description: "Definiere den Funnel: Lead-Magnet → Nurturing → Angebot.",
        duration: "2 Tage",
        todoTemplate: {
          title: "Evergreen-Funnel skizzieren",
          description: "Schritte vom Lead zum Kunden definieren",
        },
      },
      {
        id: "ea-2",
        title: "Zielgruppen recherchieren",
        description: "Erstelle 3-5 Zielgruppen-Segmente mit Interessen und Demographics.",
        duration: "3 Tage",
        todoTemplate: {
          title: "Audience-Research durchführen",
          description: "3-5 Zielgruppen mit Interessen und Merkmalen definieren",
        },
      },
      {
        id: "ea-3",
        title: "Ad-Creatives erstellen",
        description: "Produziere 5-10 verschiedene Ad-Varianten (Bilder, Videos, Copy).",
        duration: "7 Tage",
        todoTemplate: {
          title: "Ad-Creatives produzieren",
          description: "Mindestens 5 verschiedene Anzeigen-Varianten erstellen",
        },
      },
      {
        id: "ea-4",
        title: "Test-Kampagnen starten",
        description: "Starte A/B-Tests mit kleinem Budget pro Zielgruppe.",
        duration: "14 Tage",
        todoTemplate: {
          title: "Test-Kampagnen einrichten",
          description: "Kleine Budget-Tests für alle Zielgruppen starten",
        },
      },
      {
        id: "ea-5",
        title: "Gewinner identifizieren",
        description: "Analysiere die Daten und identifiziere die besten Kombinationen.",
        duration: "7 Tage",
        todoTemplate: {
          title: "Kampagnen-Performance analysieren",
          description: "Beste Zielgruppe/Creative-Kombinationen finden",
        },
      },
      {
        id: "ea-6",
        title: "Gewinner skalieren",
        description: "Erhöhe das Budget für die performantesten Ads schrittweise.",
        duration: "14 Tage",
        todoTemplate: {
          title: "Top-Performer skalieren",
          description: "Budget für beste Kampagnen erhöhen",
        },
      },
      {
        id: "ea-7",
        title: "Optimieren & Iterieren",
        description: "Kontinuierlich neue Creatives testen und Performance überwachen.",
        duration: "Laufend",
        todoTemplate: {
          title: "Wöchentliches Ad-Reporting",
          description: "Performance tracken und neue Tests planen",
        },
      },
    ],
    goals: [
      {
        title: "Cost per Lead unter X€",
        description: "Profitables Evergreen-Ads-System aufbauen",
        specific: "Konstanter CPL unter definiertem Zielwert",
        measurable: "Tracking über Ad-Plattform und CRM",
        achievable: "Mit systematischem Testing erreichbar",
        relevant: "Vorhersehbare Lead-Generierung",
        timeBound: "Nach 60 Tagen Optimierung",
      },
    ],
    houstonPrompts: [
      "Hilf mir, meinen Ad-Funnel zu planen",
      "Welche Zielgruppen sollte ich für meine Ads testen?",
      "Gib mir Ideen für Ad-Creatives",
      "Wie optimiere ich meine Facebook Ads?",
    ],
  },

  // 5. Newsletter-Serie Playbook
  {
    id: "newsletter-series",
    slug: "newsletter-serie",
    title: "Newsletter-Serie",
    subtitle: "Nurturing-Sequenz erstellen",
    description: "Erstelle eine automatisierte E-Mail-Serie, die neue Subscriber in Kunden verwandelt. Perfekt für Onboarding und Nurturing.",
    icon: Mail,
    category: "nurturing",
    difficulty: "easy",
    durationDays: 7,
    benefits: [
      "Automatisiertes Nurturing",
      "Höhere Conversion-Rate",
      "Vertrauensaufbau",
      "Skaliert ohne Mehraufwand",
    ],
    tags: ["E-Mail", "Newsletter", "Automation", "Nurturing"],
    steps: [
      {
        id: "ns-1",
        title: "Customer Journey mappen",
        description: "Definiere die Reise vom Lead zum Kunden und die nötigen Touchpoints.",
        duration: "1 Tag",
        todoTemplate: {
          title: "Customer Journey skizzieren",
          description: "Schritte und Touchpoints vom Signup bis zum Kauf",
        },
      },
      {
        id: "ns-2",
        title: "E-Mail-Sequenz planen",
        description: "Plane 5-7 E-Mails mit Timing und Hauptbotschaft pro Mail.",
        duration: "1 Tag",
        todoTemplate: {
          title: "E-Mail-Sequenz-Plan erstellen",
          description: "5-7 E-Mails mit Thema und Timing definieren",
        },
      },
      {
        id: "ns-3",
        title: "E-Mails schreiben",
        description: "Verfasse alle E-Mails mit Betreffzeile, Body und CTA.",
        duration: "3 Tage",
        todoTemplate: {
          title: "E-Mail-Texte verfassen",
          description: "Alle E-Mails der Sequenz schreiben",
        },
      },
      {
        id: "ns-4",
        title: "Automation einrichten",
        description: "Richte die E-Mail-Sequenz in deinem Tool ein (Trigger, Timing, Segmente).",
        duration: "1 Tag",
        todoTemplate: {
          title: "E-Mail-Automation aufsetzen",
          description: "Sequenz im E-Mail-Tool einrichten und testen",
        },
      },
      {
        id: "ns-5",
        title: "Testen & Optimieren",
        description: "Teste die Sequenz, analysiere Open/Click-Rates und optimiere.",
        duration: "1 Tag",
        todoTemplate: {
          title: "E-Mail-Sequenz testen",
          description: "Test-Durchlauf und erste Optimierungen",
        },
      },
    ],
    goals: [
      {
        title: "30% Open Rate, 5% Click Rate",
        description: "Hochperformante E-Mail-Sequenz aufbauen",
        specific: "E-Mail-Sequenz mit überdurchschnittlichen Engagement-Rates",
        measurable: "Tracking über E-Mail-Marketing-Tool",
        achievable: "Mit guten Betreffzeilen und relevantem Content",
        relevant: "Basis für automatisiertes Nurturing",
        timeBound: "Innerhalb von 7 Tagen aufgesetzt",
      },
    ],
    houstonPrompts: [
      "Hilf mir, eine Welcome-E-Mail-Sequenz zu planen",
      "Schreibe mir E-Mail-Betreffzeilen, die geöffnet werden",
      "Welche Inhalte sollte ich in meine Nurturing-Mails packen?",
      "Wie oft sollte ich E-Mails versenden?",
    ],
  },

  // 6. Social Media 30-Tage Playbook
  {
    id: "social-media-30",
    slug: "social-media-30-tage",
    title: "Social Media 30-Tage",
    subtitle: "Konsistente Präsenz aufbauen",
    description: "Baue in 30 Tagen eine konsistente Social-Media-Präsenz auf. Content-Plan, Posting-Routine und Community-Building.",
    icon: Share2,
    category: "social",
    difficulty: "easy",
    durationDays: 30,
    benefits: [
      "Konsistente Sichtbarkeit",
      "Community aufbauen",
      "Markenbekanntheit steigern",
      "Organische Reichweite",
    ],
    tags: ["Social Media", "Content", "Community", "Branding"],
    steps: [
      {
        id: "sm-1",
        title: "Plattform-Fokus setzen",
        description: "Wähle 1-2 Plattformen, auf denen deine Zielgruppe aktiv ist.",
        duration: "1 Tag",
        todoTemplate: {
          title: "Social-Media-Plattformen auswählen",
          description: "1-2 Haupt-Plattformen basierend auf Zielgruppe festlegen",
        },
      },
      {
        id: "sm-2",
        title: "Content-Pillars definieren",
        description: "Definiere 3-5 Themen-Säulen für deinen Content.",
        duration: "1 Tag",
        todoTemplate: {
          title: "Content-Pillars festlegen",
          description: "3-5 wiederkehrende Themen für Posts definieren",
        },
      },
      {
        id: "sm-3",
        title: "30-Tage-Content-Plan erstellen",
        description: "Plane 30 Tage Content mit Mix aus Formaten (Text, Bild, Video).",
        duration: "2 Tage",
        todoTemplate: {
          title: "30-Tage Content-Kalender erstellen",
          description: "Jeden Tag Content mit Format und Thema planen",
        },
      },
      {
        id: "sm-4",
        title: "Content vorproduzieren",
        description: "Erstelle Content für die ersten 2 Wochen im Voraus.",
        duration: "5 Tage",
        todoTemplate: {
          title: "2 Wochen Content vorproduzieren",
          description: "Posts für Tag 1-14 erstellen und planen",
        },
      },
      {
        id: "sm-5",
        title: "Posting-Routine starten",
        description: "Starte mit täglichem Posting und fixem Engagement-Zeitfenster.",
        duration: "14 Tage",
        todoTemplate: {
          title: "Tägliches Posting starten",
          description: "Jeden Tag posten und 30 Min. engagen",
        },
      },
      {
        id: "sm-6",
        title: "Community engagen",
        description: "Antworte auf jeden Kommentar, kommentiere bei 10+ Accounts pro Tag.",
        duration: "Laufend",
        todoTemplate: {
          title: "Community-Engagement",
          description: "Täglich 30 Min. für Engagement einplanen",
        },
      },
      {
        id: "sm-7",
        title: "Performance analysieren",
        description: "Analysiere nach 30 Tagen: Was funktioniert? Was nicht?",
        duration: "1 Tag",
        todoTemplate: {
          title: "30-Tage Social Media Review",
          description: "Performance analysieren und Strategie anpassen",
        },
      },
    ],
    goals: [
      {
        title: "30 Posts in 30 Tagen",
        description: "Konsistente Social-Media-Präsenz aufbauen",
        specific: "Täglich auf ausgewählter Plattform posten",
        measurable: "Post-Count und Engagement-Rate tracken",
        achievable: "Mit Content-Vorproduktion machbar",
        relevant: "Basis für organische Reichweite",
        timeBound: "30 Tage Challenge",
      },
    ],
    houstonPrompts: [
      "Hilf mir, Content-Pillars für meine Branche zu definieren",
      "Gib mir 30 Content-Ideen für LinkedIn",
      "Wie optimiere ich mein Instagram-Profil?",
      "Was sind die besten Posting-Zeiten?",
    ],
  },

  // 7. Webinar-Funnel Playbook
  {
    id: "webinar-funnel",
    slug: "webinar-funnel",
    title: "Webinar-Funnel",
    subtitle: "Leads über Live-Events gewinnen",
    description: "Nutze Webinare als Hochkonversions-Tool für Lead-Generierung und Sales. Von der Planung bis zum Follow-up.",
    icon: Video,
    category: "leadgen",
    difficulty: "advanced",
    durationDays: 21,
    benefits: [
      "Hohe Conversion-Rate",
      "Persönliche Verbindung",
      "Expertise demonstrieren",
      "Wiederverwendbar als Evergreen",
    ],
    tags: ["Webinar", "Live", "Lead-Gen", "Sales"],
    steps: [
      {
        id: "wf-1",
        title: "Webinar-Thema wählen",
        description: "Wähle ein Thema, das ein akutes Problem löst und zu deinem Angebot führt.",
        duration: "1 Tag",
        todoTemplate: {
          title: "Webinar-Thema festlegen",
          description: "Thema mit hohem Interesse und Angebots-Fit wählen",
        },
      },
      {
        id: "wf-2",
        title: "Webinar-Struktur planen",
        description: "Erstelle eine Agenda: Intro, Content, Pitch, Q&A (60-90 Min.).",
        duration: "2 Tage",
        todoTemplate: {
          title: "Webinar-Agenda erstellen",
          description: "60-90 Min. Ablauf mit allen Elementen planen",
        },
      },
      {
        id: "wf-3",
        title: "Präsentation erstellen",
        description: "Baue deine Slides mit Fokus auf Storytelling und Mehrwert.",
        duration: "3 Tage",
        todoTemplate: {
          title: "Webinar-Slides erstellen",
          description: "Präsentation mit Storytelling-Struktur bauen",
        },
      },
      {
        id: "wf-4",
        title: "Registrierungs-Page bauen",
        description: "Erstelle eine Landing-Page mit klarem Nutzenversprechen.",
        duration: "2 Tage",
        todoTemplate: {
          title: "Webinar-Landing-Page erstellen",
          description: "Registrierungsseite mit Benefits und Social Proof",
        },
      },
      {
        id: "wf-5",
        title: "Promotion starten",
        description: "Bewirb das Webinar über E-Mail, Social Media und ggf. Ads.",
        duration: "7 Tage",
        todoTemplate: {
          title: "Webinar-Promotion",
          description: "Anmeldungen über alle Kanäle generieren",
        },
      },
      {
        id: "wf-6",
        title: "Webinar durchführen",
        description: "Halte das Live-Webinar mit Q&A und Angebot am Ende.",
        duration: "1 Tag",
        todoTemplate: {
          title: "Webinar halten",
          description: "Live-Webinar mit allen geplanten Elementen",
        },
      },
      {
        id: "wf-7",
        title: "Follow-up Sequenz",
        description: "Sende Replay, zusätzliche Ressourcen und Angebots-Reminder.",
        duration: "5 Tage",
        todoTemplate: {
          title: "Webinar-Follow-up senden",
          description: "E-Mail-Sequenz für Teilnehmer und No-Shows",
        },
      },
    ],
    goals: [
      {
        title: "100 Webinar-Anmeldungen",
        description: "Qualifizierte Leads über Webinar generieren",
        specific: "100 Registrierungen für das Live-Webinar",
        measurable: "Tracking über Webinar-Tool",
        achievable: "Mit gezielter Promotion über alle Kanäle",
        relevant: "Webinar-Leads haben hohe Kaufbereitschaft",
        timeBound: "Innerhalb der 7-tägigen Promotion-Phase",
      },
    ],
    houstonPrompts: [
      "Hilf mir, ein Webinar-Thema zu finden",
      "Erstelle eine Webinar-Struktur für mein Thema",
      "Welche E-Mails brauche ich für den Webinar-Follow-up?",
      "Wie kann ich mein Webinar als Evergreen nutzen?",
    ],
  },

  // 8. Testimonial-Kampagne Playbook
  {
    id: "testimonial-campaign",
    slug: "testimonial-kampagne",
    title: "Testimonial-Kampagne",
    subtitle: "Social Proof sammeln und nutzen",
    description: "Sammle systematisch Kundenstimmen und setze sie für maximale Wirkung ein. Von der Anfrage bis zur strategischen Platzierung.",
    icon: Star,
    category: "campaign",
    difficulty: "easy",
    durationDays: 14,
    benefits: [
      "Stärkt Vertrauen",
      "Erhöht Conversion-Rate",
      "Content für Marketing",
      "Kundenbindung",
    ],
    tags: ["Testimonials", "Social Proof", "Reviews", "Kundenstimmen"],
    steps: [
      {
        id: "tc-1",
        title: "Kunden-Liste erstellen",
        description: "Identifiziere 20-30 zufriedene Kunden, die du um Feedback bitten kannst.",
        duration: "1 Tag",
        todoTemplate: {
          title: "Testimonial-Kandidaten identifizieren",
          description: "20-30 zufriedene Kunden auflisten",
        },
      },
      {
        id: "tc-2",
        title: "Testimonial-Anfrage vorbereiten",
        description: "Schreibe eine persönliche Anfrage-Mail mit klaren Fragen.",
        duration: "1 Tag",
        todoTemplate: {
          title: "Testimonial-Anfrage-Template erstellen",
          description: "E-Mail-Vorlage mit spezifischen Fragen",
        },
      },
      {
        id: "tc-3",
        title: "Anfragen versenden",
        description: "Sende personalisierte Anfragen an alle Kunden auf der Liste.",
        duration: "2 Tage",
        todoTemplate: {
          title: "Testimonial-Anfragen senden",
          description: "Personalisierte Mails an alle Kandidaten",
        },
      },
      {
        id: "tc-4",
        title: "Testimonials sammeln",
        description: "Sammle und dokumentiere alle eingehenden Testimonials.",
        duration: "5 Tage",
        todoTemplate: {
          title: "Testimonials dokumentieren",
          description: "Alle Testimonials in einem Dokument sammeln",
        },
      },
      {
        id: "tc-5",
        title: "Testimonials aufbereiten",
        description: "Formatiere Testimonials für verschiedene Formate (Zitate, Videos, Case Studies).",
        duration: "3 Tage",
        todoTemplate: {
          title: "Testimonial-Formate erstellen",
          description: "Zitate, Grafiken und ggf. Videos erstellen",
        },
      },
      {
        id: "tc-6",
        title: "Strategisch platzieren",
        description: "Platziere Testimonials auf Website, Landing-Pages, Social Media und in E-Mails.",
        duration: "2 Tage",
        todoTemplate: {
          title: "Testimonials verteilen",
          description: "Testimonials auf allen relevanten Kanälen platzieren",
        },
      },
    ],
    goals: [
      {
        title: "10+ neue Testimonials sammeln",
        description: "Social-Proof-Bibliothek aufbauen",
        specific: "Mindestens 10 qualitative Kundenstimmen sammeln",
        measurable: "Anzahl der gesammelten Testimonials",
        achievable: "Mit 20-30 Anfragen realistisch",
        relevant: "Testimonials steigern Conversion-Rate um bis zu 34%",
        timeBound: "Innerhalb von 14 Tagen",
      },
    ],
    houstonPrompts: [
      "Schreibe mir eine Testimonial-Anfrage-E-Mail",
      "Welche Fragen sollte ich für Testimonials stellen?",
      "Wo sollte ich Testimonials auf meiner Website platzieren?",
      "Wie mache ich aus einem Testimonial eine Case Study?",
    ],
  },
];

// Helper function to get playbook by ID or slug
export function getPlaybookById(idOrSlug: string): Playbook | undefined {
  return playbooks.find(p => p.id === idOrSlug || p.slug === idOrSlug);
}

// Helper function to filter playbooks
export function filterPlaybooks(options: {
  category?: PlaybookCategory;
  difficulty?: PlaybookDifficulty;
  maxDays?: number;
}): Playbook[] {
  return playbooks.filter(p => {
    if (options.category && p.category !== options.category) return false;
    if (options.difficulty && p.difficulty !== options.difficulty) return false;
    if (options.maxDays && p.durationDays > options.maxDays) return false;
    return true;
  });
}

// Get suggested playbooks based on user state
export function getSuggestedPlaybooks(options: {
  hasGoals: boolean;
  hasStrategy: boolean;
  hasTodos: boolean;
  hasEmailList: boolean;
}): Playbook[] {
  const suggestions: Playbook[] = [];
  
  // If no goals or strategy, suggest beginner-friendly playbooks
  if (!options.hasGoals && !options.hasStrategy) {
    suggestions.push(
      getPlaybookById("leadmagnet")!,
      getPlaybookById("social-media-30")!,
    );
  }
  
  // If has goals but no strategy, suggest content playbooks
  if (options.hasGoals && !options.hasStrategy) {
    suggestions.push(
      getPlaybookById("blog-funnel")!,
      getPlaybookById("newsletter-series")!,
    );
  }
  
  // If has email list, suggest nurturing and advanced playbooks
  if (options.hasEmailList) {
    suggestions.push(
      getPlaybookById("webinar-funnel")!,
      getPlaybookById("launch-campaign")!,
    );
  }
  
  // Always suggest testimonials if they have some traction
  if (options.hasGoals && options.hasTodos) {
    suggestions.push(getPlaybookById("testimonial-campaign")!);
  }
  
  // Remove duplicates and limit to 3
  const uniqueSuggestions = suggestions.filter((playbook, index, self) =>
    index === self.findIndex((p) => p.id === playbook.id)
  );
  return uniqueSuggestions.slice(0, 3);
}
