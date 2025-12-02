# Houston - Screen Redesigns (Detailed Specs)

**Version:** 2.0  
**Date:** 2025-12-01  
**Based on:** Design System + UX Strategy + Premium UX Patterns

---

## Overview

This document contains detailed redesign specifications for all key screens in Houston. Each screen includes:
- **Layout Spec** - Grid structure, spacing, component placement
- **Content Spec** - Copy, microcopy, CTAs
- **Interaction Spec** - Hover states, animations, keyboard shortcuts
- **Mobile Adaptation** - Responsive behavior

---

## 1. Landing Page

### Current Problems
- Competing CTAs (two equal buttons)
- Generic microcopy ("Features that move you forward")
- No social proof
- Inconsistent spacing
- Purple text may fail WCAG contrast

### Redesign Goals
- Single primary CTA
- Specific, benefit-driven copy
- Add social proof (testimonials, logos)
- 8pt grid spacing
- WCAG AAA contrast

---

### Layout Spec

```
┌─────────────────────────────────────────────────────────┐
│                     HEADER (sticky)                      │
│  [Houston Logo]              [Features] [Pricing] [DE/EN]│
│                                        [Login] [Get Started]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│                      HERO SECTION                        │
│                   (centered, max-width 800px)            │
│                                                          │
│              🧠 [Brain Icon - animated pulse]            │
│                                                          │
│         Launch Your AI-Powered Marketing Mission        │
│              (h1, text-4xl, font-display)                │
│                                                          │
│    Houston guides SMBs from confusion to clarity with    │
│      AI-powered strategy, goals, and task management     │
│              (p, text-lg, text-secondary)                │
│                                                          │
│              [Get Started Free →]                        │
│           (btn-primary, btn-lg, with arrow)              │
│                                                          │
│         ✨ No credit card required · 14-day trial        │
│              (text-sm, text-tertiary)                    │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                   SOCIAL PROOF SECTION                   │
│                   (bg-secondary, py-12)                  │
│                                                          │
│         Trusted by 500+ SMBs across Europe              │
│              (text-sm, text-secondary)                   │
│                                                          │
│      [Logo 1]  [Logo 2]  [Logo 3]  [Logo 4]  [Logo 5]   │
│           (grayscale, opacity-50, hover:opacity-100)     │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                    FEATURES SECTION                      │
│                      (py-20, px-8)                       │
│                                                          │
│              Features that drive growth                  │
│              (h2, text-3xl, font-display)                │
│                                                          │
│     Professional AI-powered tools for data-driven        │
│                     marketing.                           │
│              (p, text-lg, text-secondary)                │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   🎯 Icon    │  │   📊 Icon    │  │   ⚡ Icon    │  │
│  │              │  │              │  │              │  │
│  │  Strategic   │  │ Data-Driven  │  │ Intelligent  │  │
│  │ Goal Setting │  │  Strategy    │  │Optimization  │  │
│  │              │  │              │  │              │  │
│  │ Set SMART    │  │ Build your   │  │ AI analyzes  │  │
│  │ goals with   │  │ marketing    │  │ performance  │  │
│  │ AI guidance  │  │ strategy     │  │ and suggests │  │
│  │              │  │ step-by-step │  │ improvements │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   💬 Icon    │  │   ✅ Icon    │  │   📈 Icon    │  │
│  │              │  │              │  │              │  │
│  │ AI Marketing │  │ Task & Campaign│ Real-Time    │  │
│  │    Coach     │  │  Management  │  │ Analytics    │  │
│  │              │  │              │  │              │  │
│  │ Chat with    │  │ Organize     │  │ Track goals, │  │
│  │ Houston for  │  │ tasks in     │  │ campaigns,   │  │
│  │ personalized │  │ Kanban view  │  │ and ROI      │  │
│  │ advice       │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                   TESTIMONIALS SECTION                   │
│                   (bg-secondary, py-20)                  │
│                                                          │
│           What our customers say                         │
│              (h2, text-3xl, font-display)                │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ "Houston     │  │ "Finally, a  │  │ "The AI      │  │
│  │ transformed  │  │ marketing    │  │ coach is     │  │
│  │ our marketing│  │ tool that    │  │ like having  │  │
│  │ strategy in  │  │ understands  │  │ a CMO on     │  │
│  │ just 2 weeks"│  │ SMBs"        │  │ demand"      │  │
│  │              │  │              │  │              │  │
│  │ — Sarah M.   │  │ — Thomas K.  │  │ — Lisa R.    │  │
│  │ Founder, XYZ │  │ Marketing    │  │ CEO, ABC     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                     PRICING SECTION                      │
│                      (py-20, px-8)                       │
│                                                          │
│              Simple, transparent pricing                 │
│              (h2, text-3xl, font-display)                │
│                                                          │
│  ┌──────────────────┐        ┌──────────────────┐      │
│  │      FREE        │        │       PRO        │      │
│  │                  │        │                  │      │
│  │      €0/mo       │        │     €29/mo       │      │
│  │                  │        │                  │      │
│  │ ✓ 3 goals        │        │ ✓ Unlimited goals│      │
│  │ ✓ 20 chats/mo    │        │ ✓ Unlimited chats│      │
│  │ ✓ Basic analytics│        │ ✓ Advanced       │      │
│  │ ✓ Email support  │        │   analytics      │      │
│  │                  │        │ ✓ Priority       │      │
│  │                  │        │   support (24h)  │      │
│  │                  │        │ ✓ Export reports │      │
│  │                  │        │ ✓ Integrations   │      │
│  │                  │        │                  │      │
│  │ [Get Started]    │        │ [Start Free Trial│      │
│  │                  │        │     (14 days)]   │      │
│  └──────────────────┘        └──────────────────┘      │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                       FAQ SECTION                        │
│                      (py-20, px-8)                       │
│                                                          │
│              Frequently asked questions                  │
│              (h2, text-3xl, font-display)                │
│                                                          │
│  [Accordion items with common questions]                │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                    CTA SECTION (final)                   │
│                   (bg-accent-primary, py-20)             │
│                                                          │
│         Ready to launch your marketing mission?          │
│              (h2, text-3xl, font-display,                │
│                   color: text-inverse)                   │
│                                                          │
│              [Get Started Free →]                        │
│           (btn with white bg, text-primary)              │
│                                                          │
│         ✨ No credit card required · 14-day trial        │
│              (text-sm, opacity-80)                       │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                      FOOTER                              │
│  [Houston Logo]                                          │
│  Product  |  Company  |  Resources  |  Legal             │
│  © 2025 Houston. All rights reserved.                    │
└─────────────────────────────────────────────────────────┘
```

### Content Spec

**Hero Copy:**
- Headline: "Launch Your AI-Powered Marketing Mission"
- Subheadline: "Houston guides SMBs from confusion to clarity with AI-powered strategy, goals, and task management"
- Primary CTA: "Get Started Free →"
- Trust badge: "✨ No credit card required · 14-day trial"

**Feature Cards:**
1. Strategic Goal Setting - "Set SMART goals with AI guidance and track progress in real-time"
2. Data-Driven Strategy - "Build your marketing strategy step-by-step with Houston's expert framework"
3. Intelligent Optimization - "AI analyzes your performance and suggests data-driven improvements"
4. AI Marketing Coach - "Chat with Houston for personalized advice tailored to your business"
5. Task & Campaign Management - "Organize tasks in Kanban view and plan campaigns with templates"
6. Real-Time Analytics - "Track goals, campaigns, and ROI with beautiful, actionable dashboards"

**Testimonials:**
- "Houston transformed our marketing strategy in just 2 weeks. The AI coach is incredibly helpful!" — Sarah M., Founder, XYZ GmbH
- "Finally, a marketing tool that understands SMBs. No bloat, just what we need." — Thomas K., Marketing Manager, ABC Ltd
- "The AI coach is like having a CMO on demand. Best investment we've made." — Lisa R., CEO, DEF Inc

### Interaction Spec

**Header:**
- Sticky on scroll
- Blur background when scrolled (backdrop-filter: blur(8px))
- Logo: Hover → scale(1.05)
- Nav links: Hover → underline with accent color
- Login button: Ghost variant
- Get Started button: Primary variant

**Hero:**
- Brain icon: Subtle pulse animation (scale 1 → 1.05 → 1, 3s loop)
- Primary CTA: Hover → translateY(-2px) + shadow-lg
- Trust badge: Fade in after 1s delay

**Feature Cards:**
- Default: card-glass with border
- Hover: translateY(-4px) + glow shadow (color matches icon)
- Icon: Rotate 360° on hover (duration-slow)

**Testimonial Cards:**
- Default: card-elevated
- Hover: scale(1.02) + shadow-xl
- Avatar: Circular, 48px

**Pricing Cards:**
- Free: card-outlined
- Pro: card-glass with glow-blue shadow
- Hover: scale(1.03) + increase glow intensity
- CTA buttons: Primary for Pro, Secondary for Free

**FAQ Accordion:**
- Collapsed: Show question + chevron-down icon
- Expanded: Rotate chevron 180°, slide down answer (duration-base)
- Hover: bg-tertiary

### Mobile Adaptation (< 640px)

- Hero: Stack vertically, reduce font sizes (h1: text-3xl → text-2xl)
- Feature cards: 1 column (grid-cols-1)
- Testimonials: Horizontal scroll (snap-scroll)
- Pricing cards: Stack vertically, full width
- FAQ: Full width accordion

---

## 2. Onboarding Wizard

### Current Problems
- Doesn't exist! (Critical gap)
- New users see empty dashboard (confusing)

### Redesign Goals
- 5-step guided wizard
- Pre-populate dashboard with personalized data
- < 5 minutes to complete
- Mobile-friendly

---

### Layout Spec (All Steps)

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│                    [Houston Logo]                        │
│                                                          │
│              ●━━━○━━━○━━━○━━━○                          │
│           Step 1 of 5 (progress indicator)               │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  │              STEP CONTENT CARD                  │    │
│  │           (max-width: 600px, centered)          │    │
│  │                                                 │    │
│  │  [Step Title]                                   │    │
│  │  (h2, text-2xl, font-display)                   │    │
│  │                                                 │    │
│  │  [Step Description]                             │    │
│  │  (p, text-base, text-secondary)                 │    │
│  │                                                 │    │
│  │  [Form Fields / Content]                        │    │
│  │                                                 │    │
│  │                                                 │    │
│  │  [← Back]              [Next →]  [Skip]         │    │
│  │  (btn-ghost)        (btn-primary) (btn-ghost)   │    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Step 1: Business Info

**Content:**
- Title: "Tell us about your business"
- Description: "This helps Houston personalize your experience"

**Form Fields:**
1. Industry (dropdown with search)
   - Options: E-commerce, SaaS, Consulting, Agency, Retail, Hospitality, Healthcare, Education, Other
   - Placeholder: "Select your industry"
2. Company size (radio buttons)
   - 1-10 employees
   - 11-50 employees
   - 51-200 employees
   - 200+ employees
3. Location (autocomplete input)
   - Placeholder: "City, Country"
   - Uses Google Places API

**Interactions:**
- Auto-save on field change (no data loss)
- Next button: Disabled until all fields filled
- Keyboard: Tab to navigate, Enter to submit

### Step 2: Marketing Goals

**Content:**
- Title: "What do you want to achieve?"
- Description: "Select 1-3 goals. We'll help you make them SMART."

**Goal Templates (cards):**
1. 🎯 Increase brand awareness
2. 📈 Generate more leads
3. 💰 Boost sales
4. 🔁 Improve customer retention
5. 🚀 Launch new product
6. ✏️ Custom goal

**Interactions:**
- Click to select (max 3)
- Selected: border-accent-primary + glow shadow
- Hover: scale(1.02)
- Custom goal: Opens textarea modal

### Step 3: Target Audience

**Content:**
- Title: "Who are your ideal customers?"
- Description: "Describe your target audience so Houston can tailor advice"

**Form Fields:**
1. Demographics (textarea)
   - Placeholder: "Age, gender, location, income level..."
   - AI suggestions based on industry
2. Pain points (textarea)
   - Placeholder: "What problems do they have that you solve?"
   - AI suggestions
3. Where they hang out (checkboxes)
   - Instagram, Facebook, LinkedIn, Twitter, TikTok, YouTube, Google Search, Email, Other

**Interactions:**
- AI suggestions appear as chips below textareas
- Click chip to insert into textarea
- Auto-expand textarea as user types

### Step 4: Current Channels

**Content:**
- Title: "Which marketing channels do you use?"
- Description: "Select all that apply"

**Channel Checklist:**
- ☐ Social media (Facebook, Instagram, LinkedIn, Twitter, TikTok)
- ☐ Email marketing
- ☐ Paid ads (Google, Facebook, LinkedIn)
- ☐ SEO & Content marketing
- ☐ Events & Networking
- ☐ Referrals & Word-of-mouth
- ☐ Other

**For each selected channel:**
- "What's working?" (textarea, optional)
- "What's not working?" (textarea, optional)

**Interactions:**
- Check/uncheck channels
- Textareas appear below checked channels
- Skip button: Visible (not all users have channels yet)

### Step 5: Personalized Roadmap

**Content:**
- Title: "Your personalized marketing roadmap"
- Description: "Houston has created a custom plan based on your answers"

**Generated Content (AI):**
1. **SMART Goals** (2-3 cards)
   - Example: "Increase Instagram followers by 25% (from 1,000 to 1,250) in Q1 2025"
   - Edit button on each card
2. **Quick-Win Tasks** (5-10 items, checklist)
   - Example: "Create content calendar for Q1"
   - Example: "Optimize Google My Business listing"
3. **Strategy Outline** (collapsible sections)
   - Positioning
   - Personas
   - Channels

**Interactions:**
- Edit goals: Opens inline editor
- Check tasks: Marks as complete (saved to Tasks page)
- Expand/collapse strategy sections
- Primary CTA: "Start Coaching" → Dashboard

### Mobile Adaptation

- Progress indicator: Dots instead of line
- Form fields: Full width
- Goal templates: Stack vertically (1 column)
- Back/Next buttons: Full width, stacked

---

## 3. Dashboard (Home)

### Current Problems
- Confusing "Workspaces" metric
- Redundant empty state sections
- No hierarchy
- No real-time updates
- Upgrade CTA too prominent

### Redesign Goals
- Clear next steps
- Proactive AI insights
- Real-time progress visualization
- Contextual upgrade prompts

---

### Layout Spec

```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR (fixed, 240px)          MAIN CONTENT            │
│                                                          │
│ [Houston Logo]                                           │
│                           Welcome back, Ingo!            │
│ ● Home                    (h1, text-2xl, font-display)   │
│ ○ Coach                                                  │
│ ○ Goals                   Here's your progress today.    │
│ ○ Strategy                (p, text-secondary)            │
│ ○ Campaigns                                              │
│ ○ Tasks                   ┌──────────────────────────┐  │
│ ○ Analytics               │ 🎯 Next Steps            │  │
│ ○ Settings                │                          │  │
│                           │ ✓ Complete onboarding    │  │
│ ───────────               │ ○ Set your first goal    │  │
│                           │ ○ Chat with Houston      │  │
│ [User Avatar]             │                          │  │
│ Ingo Wagner               │ [Start Now →]            │  │
│ ingo.wagner...            │                          │  │
│ (hidden by default,       └──────────────────────────┘  │
│  show on hover)                                          │
│                           ┌─────┐ ┌─────┐ ┌─────┐ ┌────┐│
│ [Upgrade to Pro]          │ 🎯  │ │ 📊  │ │ ✅  │ │ 💬 ││
│ (contextual, only         │Goals│ │Strat│ │Tasks│ │Chat││
│  when hitting limits)     │     │ │egy  │ │     │ │    ││
│                           │  2  │ │  1  │ │  0  │ │  1 ││
│                           │of 3 │ │draft│ │open │ │actv││
│                           └─────┘ └─────┘ └─────┘ └────┘│
│                           (glassmorphism cards with glow)│
│                                                          │
│                           ┌──────────────────────────┐  │
│                           │ 💡 AI Insight            │  │
│                           │                          │  │
│                           │ Your Instagram goal is   │  │
│                           │ on track! You've gained  │  │
│                           │ 50 followers this week.  │  │
│                           │                          │  │
│                           │ [View Details]           │  │
│                           └──────────────────────────┘  │
│                                                          │
│                           ┌──────────────────────────┐  │
│                           │ 📈 Goal Progress         │  │
│                           │                          │  │
│                           │ Instagram Followers      │  │
│                           │ ████████░░░░░░░░ 40%     │  │
│                           │ 1,100 / 1,250            │  │
│                           │                          │  │
│                           │ Email Subscribers        │  │
│                           │ ██████░░░░░░░░░░ 30%     │  │
│                           │ 650 / 1,000              │  │
│                           │                          │  │
│                           │ [View All Goals →]       │  │
│                           └──────────────────────────┘  │
│                                                          │
│                           ┌──────────────────────────┐  │
│                           │ 📅 This Week's Tasks     │  │
│                           │                          │  │
│                           │ ☐ Create content calendar│  │
│                           │ ☐ Post 5 Instagram Reels │  │
│                           │ ✓ Engage with followers  │  │
│                           │                          │  │
│                           │ [View All Tasks →]       │  │
│                           └──────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Content Spec

**Welcome Message:**
- Personalized: "Welcome back, [Name]!"
- Subtext: "Here's your progress today." (or "Here's what's new." if no progress)

**Next Steps Card:**
- Title: "🎯 Next Steps"
- Checklist:
  - ✓ Complete onboarding (if done)
  - ○ Set your first goal (if no goals)
  - ○ Chat with Houston (if no chats)
  - ○ Define your strategy (if no strategy)
- CTA: "Start Now →" (links to first incomplete step)

**Stats Cards:**
1. Goals: "2 of 3" + "active goals"
2. Strategy: "1 draft" + "in progress"
3. Tasks: "0 open" + "tasks today"
4. Chat: "1 active" + "conversation"

**AI Insight Card:**
- Title: "💡 AI Insight"
- Message: Personalized based on user's data
  - Example: "Your Instagram goal is on track! You've gained 50 followers this week."
  - Example: "Your posting frequency dropped 20%. Want to brainstorm ideas?"
- CTA: "View Details" or "Get Help"

**Goal Progress Card:**
- Title: "📈 Goal Progress"
- List of active goals with progress bars
- Each goal shows: Name, Progress bar, Current / Target
- CTA: "View All Goals →"

**This Week's Tasks Card:**
- Title: "📅 This Week's Tasks"
- Checklist of tasks due this week
- Checkboxes to mark complete
- CTA: "View All Tasks →"

### Interaction Spec

**Sidebar:**
- Active page: Filled circle (●) + accent color
- Inactive pages: Outline circle (○)
- Hover: bg-tertiary + scale(1.02)
- User dropdown: Hidden email by default, show on hover
- Upgrade button: Only visible when user hits limits (contextual)

**Stats Cards:**
- Glassmorphism with individual glow shadows
- Hover: scale(1.02) + increase glow intensity
- Click: Navigate to respective page

**AI Insight Card:**
- Fade in animation on load
- Icon: Subtle pulse (lightbulb)
- Hover: bg-tertiary

**Goal Progress Bars:**
- Animated fill on load (0% → current%, duration-slow)
- Color: accent-primary (default), success (>75%), warning (25-50%), error (<25%)

**Tasks Checklist:**
- Click checkbox: Mark complete + strikethrough text + fade out
- Hover: bg-tertiary

### Mobile Adaptation

- Sidebar: Collapse to bottom tab bar (5 tabs: Home, Coach, Goals, Tasks, More)
- Stats cards: 2 columns on tablet, 1 column on mobile
- AI Insight: Full width
- Goal Progress: Full width, stack vertically
- Tasks: Full width

---

## 4. Coach (AI Chat)

### Current Problems
- No typing indicator
- No quick-reply buttons
- No sources/grounding
- No undo/edit
- No stop button
- No feedback buttons
- Generic AI responses

### Redesign Goals
- Conversational UX best practices
- AI transparency (show what Houston is doing)
- User control (undo, edit, stop, regenerate)
- Quick-reply chips for common actions

---

### Layout Spec

```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR (240px)                CHAT AREA                │
│                                                          │
│ [+ New Chat]                   Houston                   │
│ (btn-primary, full-width)      AI Marketing Assistant    │
│                                                          │
│ ┌─ Search ─────────┐          ┌──────────────────────┐ │
│ │ 🔍 Search chats  │          │ 💬 Houston           │ │
│ └──────────────────┘          │                      │ │
│                                │ Hi Ingo! How can I   │ │
│ Today                          │ help you today?      │ │
│ ○ Marketing strategy           │                      │ │
│   for Q1                       │ [Help me set a goal] │ │
│                                │ [Review my strategy] │ │
│ Yesterday                      │ [Suggest tasks]      │ │
│ ○ Instagram growth             │ [Analyze progress]   │ │
│   tips                         │                      │ │
│                                └──────────────────────┘ │
│ This Week                      (quick-reply chips)      │
│ ○ Email marketing                                       │
│   best practices               ┌──────────────────────┐ │
│ ○ SEO optimization             │ What are the top 3   │ │
│                                │ marketing strategies │ │
│ Last Month                     │ for SMEs?            │ │
│ ○ Content calendar             │                      │ │
│   planning                     │ [IW]                 │ │
│                                └──────────────────────┘ │
│                                (user message, right)    │
│                                                          │
│                                ┌──────────────────────┐ │
│                                │ 💬 Houston           │ │
│                                │                      │ │
│                                │ Great question! Here │ │
│                                │ are the top 3...     │ │
│                                │                      │ │
│                                │ 1. Content Marketing │ │
│                                │ 2. Email Marketing   │ │
│                                │ 3. Social Proof      │ │
│                                │                      │ │
│                                │ [👍] [👎] [📋 Copy] │ │
│                                │ [🔄 Regenerate]      │ │
│                                └──────────────────────┘ │
│                                (AI message, left)       │
│                                                          │
│                                ┌──────────────────────┐ │
│                                │ Type your message... │ │
│                                │ [Send →]             │ │
│                                └──────────────────────┘ │
│                                (input area, bottom)     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Content Spec

**Houston Greeting:**
- "Hi [Name]! How can I help you today?"
- Quick-reply chips:
  - "Help me set a goal"
  - "Review my strategy"
  - "Suggest tasks for this week"
  - "Analyze my progress"

**AI Response Format:**
- Use headings, lists, bold for structure
- Cite sources when relevant: "(Based on HubSpot benchmarks...)"
- Show confidence: "I'm 80% sure this will work for your audience"
- Provide next steps: Quick-reply chips after response

**Typing Indicator:**
- "Houston is thinking..." (animated dots)
- Shows while AI is generating response

**Feedback Buttons:**
- 👍 Thumbs up
- 👎 Thumbs down
- 📋 Copy to clipboard
- 🔄 Regenerate response

### Interaction Spec

**Chat History Sidebar:**
- Search: Filter chats by keyword
- Click chat: Load conversation
- Hover: bg-tertiary + show delete icon
- Delete: Confirm dialog ("Are you sure?")

**Quick-Reply Chips:**
- Click: Send as user message
- Hover: bg-accent-primary + text-inverse
- Fade in after AI response (staggered animation)

**User Messages:**
- Right-aligned
- bg-accent-primary + text-inverse
- Hover: Show edit/delete icons
- Edit: Inline editor, regenerate AI response
- Delete: Remove message + all subsequent messages

**AI Messages:**
- Left-aligned
- bg-secondary + text-primary
- Streaming: Text appears word-by-word (typewriter effect)
- Hover: Show feedback buttons
- Thumbs up/down: Send feedback to backend
- Copy: Copy text to clipboard + toast ("Copied!")
- Regenerate: Generate new response for same prompt

**Input Area:**
- Textarea: Auto-expand as user types (max 5 lines)
- Send button: Disabled if empty
- Keyboard: Enter to send, Shift+Enter for new line
- Stop button: Visible while AI is generating (click to stop)

**Keyboard Shortcuts:**
- Cmd+K: Focus input
- Cmd+N: New chat
- Cmd+F: Focus search
- Esc: Close chat (return to sidebar)

### Mobile Adaptation

- Sidebar: Hide by default, show as slide-out drawer (hamburger menu)
- Chat area: Full width
- Quick-reply chips: Horizontal scroll
- Input: Fixed at bottom (sticky)

---

## 5. Goals (Multiple Views)

### Current Problems
- Only one view (list)
- No properties system
- No filters/sorting
- No bulk actions
- No templates
- No AI suggestions

### Redesign Goals
- 4 views (Table, Board, Timeline, Calendar)
- Properties (priority, deadline, tags, owner)
- Filters & sorting
- Bulk actions
- Goal templates
- AI-assisted goal creation

---

### Layout Spec (Table View)

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                   │
│                                                          │
│ Goals & Progress                    [+ New Goal]         │
│ (h1, text-2xl)                      (btn-primary)        │
│                                                          │
│ Track your SMART marketing goals and measure success.    │
│ (p, text-secondary)                                      │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ VIEW SWITCHER & FILTERS                                  │
│                                                          │
│ [Table] [Board] [Timeline] [Calendar]                    │
│ (tabs)                                                   │
│                                                          │
│ [🔍 Search]  [Filter: All]  [Sort: Deadline]  [...]      │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ TABLE                                                    │
│                                                          │
│ ☐ Name            Status    Priority  Deadline  Progress│
│ ───────────────────────────────────────────────────────│
│ ☐ Instagram       Active    High      Mar 31    ████░░ │
│   followers +25%                                  40%   │
│                                                          │
│ ☐ Email subs      Active    Medium    Jun 30    ███░░░ │
│   +500                                            30%   │
│                                                          │
│ ☐ Website traffic Draft     Low       Dec 31    ░░░░░░ │
│   +50%                                            0%    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Layout Spec (Board View)

```
┌─────────────────────────────────────────────────────────┐
│ KANBAN BOARD                                             │
│                                                          │
│ ┌─ Not Started ─┐ ┌─ In Progress ─┐ ┌─ At Risk ──┐ ┌─ Done ─┐│
│ │               │ │                │ │            │ │        ││
│ │ ┌───────────┐ │ │ ┌────────────┐ │ │ ┌────────┐ │ │ ┌────┐││
│ │ │ Website   │ │ │ │ Instagram  │ │ │ │        │ │ │ │    │││
│ │ │ traffic   │ │ │ │ followers  │ │ │ │        │ │ │ │    │││
│ │ │ +50%      │ │ │ │ +25%       │ │ │ │        │ │ │ │    │││
│ │ │           │ │ │ │            │ │ │ │        │ │ │ │    │││
│ │ │ ░░░░░░ 0% │ │ │ │ ████░░ 40% │ │ │ │        │ │ │ │    │││
│ │ │ Dec 31    │ │ │ │ Mar 31     │ │ │ │        │ │ │ │    │││
│ │ └───────────┘ │ │ └────────────┘ │ │ └────────┘ │ │ └────┘││
│ │               │ │                │ │            │ │        ││
│ │               │ │ ┌────────────┐ │ │            │ │        ││
│ │               │ │ │ Email subs │ │ │            │ │        ││
│ │               │ │ │ +500       │ │ │            │ │        ││
│ │               │ │ │            │ │ │            │ │        ││
│ │               │ │ │ ███░░░ 30% │ │ │            │ │        ││
│ │               │ │ │ Jun 30     │ │ │            │ │        ││
│ │               │ │ └────────────┘ │ │            │ │        ││
│ └───────────────┘ └────────────────┘ └────────────┘ └────────┘│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Content Spec

**Table Columns:**
- Checkbox (bulk select)
- Name (goal title)
- Status (badge: Draft, Active, At Risk, Completed)
- Priority (badge: High, Medium, Low)
- Deadline (date)
- Progress (progress bar + percentage)
- Actions (edit, delete, duplicate)

**Board Columns:**
- Not Started (goals with 0% progress)
- In Progress (goals with 1-74% progress)
- At Risk (goals with <25% progress and deadline < 30 days)
- Done (goals with 100% progress)

**Goal Card (Board View):**
- Title
- Progress bar + percentage
- Deadline
- Priority badge
- Tags (if any)

### Interaction Spec

**View Switcher:**
- Tabs: Table, Board, Timeline, Calendar
- Active tab: border-bottom accent-primary
- Hover: bg-tertiary
- Click: Switch view (save preference)

**Filters:**
- Status: All, Draft, Active, At Risk, Completed
- Priority: All, High, Medium, Low
- Deadline: All, This Week, This Month, This Quarter
- Click: Open dropdown, select filter
- Active filter: badge with count

**Sorting:**
- Columns: Name, Status, Priority, Deadline, Progress
- Click column header: Sort ascending
- Click again: Sort descending
- Active sort: Arrow icon (↑ or ↓)

**Bulk Actions:**
- Select multiple goals (checkboxes)
- Actions: Archive, Delete, Change Status, Change Priority
- Confirm dialog for destructive actions

**New Goal (AI-Assisted):**
- Click "+ New Goal"
- Modal opens with AI chat interface
- Houston asks: "What do you want to achieve?"
- User types goal
- Houston suggests SMART version
- User edits and confirms
- Goal created and added to table/board

**Drag-and-Drop (Board View):**
- Drag goal card to different column
- Drop: Update status automatically
- Visual feedback: Highlight drop zone

**Edit Goal:**
- Click goal row/card
- Side panel opens with form
- Fields: Name, Description, SMART criteria, Deadline, Priority, Tags
- Save: Update goal
- Cancel: Close panel

### Mobile Adaptation

- Table view → List view (cards)
- Board view → Horizontal scroll (swipeable columns)
- Timeline view → Vertical timeline
- Calendar view → Monthly calendar (tap to view details)
- Filters: Bottom sheet (slide up)

---

## 6. Strategy (Canvas)

### Current Problems
- Form-based UI (feels like survey)
- No AI assistance
- No templates
- No visual hierarchy
- No export

### Redesign Goals
- Visual canvas (not forms)
- AI-assisted strategy building
- Templates (pre-built frameworks)
- Export as PDF/Markdown
- AI review and critique

---

### Layout Spec

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                   │
│                                                          │
│ Marketing Strategy              [AI Review] [Export PDF] │
│ (h1, text-2xl)                  (btn-ghost) (btn-primary)│
│                                                          │
│ Define your positioning, audience, and channels.         │
│ (p, text-secondary)                                      │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ STRATEGY CANVAS                                          │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ 🎯 Positioning & UVP                             │   │
│ │                                                   │   │
│ │ What makes your offering unique?                 │   │
│ │                                                   │   │
│ │ [Editable text area]                              │   │
│ │                                                   │   │
│ │ We help SMBs launch AI-powered marketing         │   │
│ │ strategies without hiring expensive agencies.    │   │
│ │                                                   │   │
│ │ [💡 Ask Houston for help]                        │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ 👥 Target Audience & Personas                    │   │
│ │                                                   │   │
│ │ ┌─ Persona 1 ────┐  ┌─ Persona 2 ────┐          │   │
│ │ │ Marketing Mgr  │  │ Small Biz Owner│          │   │
│ │ │ 25-45 years    │  │ 35-55 years    │          │   │
│ │ │ SMB (11-50)    │  │ Solopreneur    │          │   │
│ │ │                │  │                │          │   │
│ │ │ Pain: Limited  │  │ Pain: No time  │          │   │
│ │ │ budget, no team│  │ or expertise   │          │   │
│ │ └────────────────┘  └────────────────┘          │   │
│ │                                                   │   │
│ │ [+ Add Persona]                                   │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ 📢 Channels & Tactics                            │   │
│ │                                                   │   │
│ │ ☑ Content Marketing (Blog, SEO)                  │   │
│ │ ☑ Email Marketing (Newsletter, Drip campaigns)   │   │
│ │ ☑ Social Media (LinkedIn, Instagram)             │   │
│ │ ☐ Paid Ads (Google, Facebook)                    │   │
│ │ ☐ Events & Networking                            │   │
│ │                                                   │   │
│ │ [+ Add Custom Channel]                            │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ 💬 Messaging & Tone                              │   │
│ │                                                   │   │
│ │ Key Messages:                                     │   │
│ │ • AI-powered marketing for SMBs                   │   │
│ │ • No expensive agencies needed                    │   │
│ │ • Data-driven strategies that work                │   │
│ │                                                   │   │
│ │ Tone: Professional, friendly, empowering          │   │
│ │                                                   │   │
│ │ [💡 Ask Houston for help]                        │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Content Spec

**Sections:**
1. Positioning & UVP
   - "What makes your offering unique?"
   - Editable textarea
   - AI assistance button

2. Target Audience & Personas
   - Persona cards (name, age, role, pain points, goals)
   - Add/edit/delete personas
   - AI suggestions based on industry

3. Channels & Tactics
   - Checklist of common channels
   - Add custom channels
   - For each channel: Tactics (editable list)

4. Messaging & Tone
   - Key messages (bullet list)
   - Tone (dropdown: Professional, Casual, Friendly, Authoritative, etc.)
   - AI assistance button

### Interaction Spec

**AI Assistance:**
- Click "💡 Ask Houston for help"
- Side panel opens with chat interface
- Houston asks clarifying questions
- User answers
- Houston generates content
- User reviews and inserts into strategy

**AI Review:**
- Click "AI Review" button
- Houston analyzes entire strategy
- Provides feedback:
  - Strengths
  - Weaknesses
  - Suggestions for improvement
- User can accept/reject suggestions

**Export:**
- Click "Export PDF"
- Generate PDF with:
  - Cover page (company name, date)
  - Table of contents
  - All strategy sections
  - Branded design (Houston logo, colors)
- Download PDF

**Auto-Save:**
- Save on every change (debounced, 2s delay)
- Show "Saved" indicator (checkmark icon)
- Show "Saving..." while in progress

**Templates:**
- Click "Use Template" (in header, not shown in layout)
- Modal with template options:
  - SaaS Marketing Strategy
  - E-commerce Marketing Strategy
  - Local Business Marketing Strategy
  - Agency Marketing Strategy
- Select template → Pre-fill strategy canvas

### Mobile Adaptation

- Sections: Stack vertically
- Persona cards: Horizontal scroll
- Channels: Full width checklist
- AI assistance: Full-screen modal (not side panel)

---

## 7. Tasks (Kanban)

### Current Problems
- Only Kanban view
- No drag-and-drop (?)
- No properties
- No filters
- No AI suggestions

### Redesign Goals
- 3 views (List, Board, Calendar)
- Drag-and-drop
- Properties (priority, due date, tags, assignee)
- Filters & sorting
- AI-suggested tasks (based on goals)

---

### Layout Spec (Board View)

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                   │
│                                                          │
│ Tasks & Campaigns                   [+ New Task]         │
│ (h1, text-2xl)                      (btn-primary)        │
│                                                          │
│ Organize your marketing tasks and stay on track.         │
│ (p, text-secondary)                                      │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ VIEW SWITCHER & FILTERS                                  │
│                                                          │
│ [List] [Board] [Calendar]                                │
│ (tabs)                                                   │
│                                                          │
│ [🔍 Search]  [Filter: My Tasks]  [Sort: Due Date]  [...] │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ KANBAN BOARD                                             │
│                                                          │
│ ┌─ To Do (5) ───┐ ┌─ Doing (2) ───┐ ┌─ Done (12) ───┐ │
│ │               │ │                │ │                │ │
│ │ ┌───────────┐ │ │ ┌────────────┐ │ │ ┌────────────┐ │ │
│ │ │ Create    │ │ │ │ Post 5     │ │ │ │ Engage with│ │ │
│ │ │ content   │ │ │ │ Instagram  │ │ │ │ followers  │ │ │
│ │ │ calendar  │ │ │ │ Reels      │ │ │ │            │ │ │
│ │ │           │ │ │ │            │ │ │ │ ✓ Completed│ │ │
│ │ │ 📅 Mar 15 │ │ │ │ 📅 Today   │ │ │ │ Mar 1      │ │ │
│ │ │ 🔴 High   │ │ │ │ 🟡 Medium  │ │ │ │            │ │ │
│ │ └───────────┘ │ │ └────────────┘ │ │ └────────────┘ │ │
│ │               │ │                │ │                │ │
│ │ ┌───────────┐ │ │ ┌────────────┐ │ │ [Load more]    │ │
│ │ │ Optimize  │ │ │ │ Write blog │ │ │                │ │
│ │ │ GMB       │ │ │ │ post       │ │ │                │ │
│ │ │ listing   │ │ │ │            │ │ │                │ │
│ │ │           │ │ │ │ 📅 Mar 20  │ │ │                │ │
│ │ │ 📅 Mar 18 │ │ │ │ 🟢 Low     │ │ │                │ │
│ │ │ 🟡 Medium │ │ │ └────────────┘ │ │                │ │
│ │ └───────────┘ │ │                │ │                │ │
│ │               │ │                │ │                │ │
│ │ [+ Add task]  │ │ [+ Add task]   │ │ [+ Add task]   │ │
│ └───────────────┘ └────────────────┘ └────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Content Spec

**Task Card:**
- Title
- Due date (📅 icon + date)
- Priority (🔴 High, 🟡 Medium, 🟢 Low)
- Tags (if any)
- Assignee (if team feature enabled)
- Linked goal (if any)

**Columns:**
- To Do (tasks not started)
- Doing (tasks in progress)
- Done (completed tasks)

### Interaction Spec

**Drag-and-Drop:**
- Drag task card to different column
- Drop: Update status automatically
- Visual feedback: Highlight drop zone
- Reorder tasks within column

**Quick Add:**
- Click "+ Add task" in column
- Inline input appears
- Type task title + Enter to create
- Task added to column

**New Task (Full Form):**
- Click "+ New Task" (header)
- Modal opens with form:
  - Title (required)
  - Description (textarea)
  - Due date (date picker)
  - Priority (dropdown: High, Medium, Low)
  - Tags (multi-select)
  - Linked goal (dropdown)
- Save: Create task
- Cancel: Close modal

**Edit Task:**
- Click task card
- Side panel opens with form
- Edit fields
- Save: Update task
- Delete: Confirm dialog

**Keyboard Shortcuts:**
- Cmd+N: New task
- Space: Mark task as complete (when focused)
- E: Edit task (when focused)
- Del: Delete task (when focused)

### Mobile Adaptation

- Board view → Horizontal scroll (swipeable columns)
- List view → Full width cards
- Calendar view → Monthly calendar
- Quick add: Bottom sheet (slide up)

---

## 8. Settings

### Current Problems
- No sidebar navigation
- No search
- No confirmation dialogs
- No export data
- No theme switcher

### Redesign Goals
- Sidebar navigation (sections)
- Search settings
- Confirmation dialogs for destructive actions
- Export data (goals, chats, strategies)
- Theme switcher (dark/light)

---

### Layout Spec

```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR (200px)              CONTENT AREA                │
│                                                          │
│ Settings                     Account                     │
│                              (h2, text-xl, font-display) │
│ ● Account                                                │
│ ○ Notifications              Your personal information   │
│ ○ Subscription               (p, text-secondary)         │
│ ○ Privacy                                                │
│ ○ Integrations               ┌────────────────────────┐ │
│                              │ Name                   │ │
│ ───────────                  │ [Ingo Wagner]          │ │
│                              │                        │ │
│ [🔍 Search]                  │ Email                  │ │
│                              │ [ingo.wagner1303@...] │ │
│                              │ (read-only, via OAuth) │ │
│                              │                        │ │
│                              │ Avatar                 │ │
│                              │ [Upload Image]         │ │
│                              │                        │ │
│                              │ [Save Changes]         │ │
│                              └────────────────────────┘ │
│                                                          │
│                              ┌────────────────────────┐ │
│                              │ Theme                  │ │
│                              │                        │ │
│                              │ ○ Light                │ │
│                              │ ● Dark                 │ │
│                              │ ○ System (auto)        │ │
│                              └────────────────────────┘ │
│                                                          │
│                              ┌────────────────────────┐ │
│                              │ Language               │ │
│                              │                        │ │
│                              │ [Deutsch ▼]            │ │
│                              └────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Content Spec

**Sections:**
1. Account
   - Name (editable)
   - Email (read-only, via Manus OAuth)
   - Avatar (upload image)
   - Theme (Light, Dark, System)
   - Language (DE, EN)

2. Notifications
   - Email notifications (toggle)
   - In-app notifications (toggle)
   - Notification frequency (dropdown: Real-time, Daily digest, Weekly digest)

3. Subscription
   - Current plan (Free or Pro)
   - Usage (goals, chats, storage)
   - Upgrade/Downgrade buttons
   - Billing history (table)

4. Privacy
   - Export data (goals, chats, strategies as JSON)
   - Delete account (destructive action, confirm dialog)
   - Clear chat history (confirm dialog)

5. Integrations
   - Google Analytics (connect/disconnect)
   - Facebook Ads (connect/disconnect)
   - Mailchimp (connect/disconnect)
   - Stripe (connect/disconnect)

### Interaction Spec

**Sidebar Navigation:**
- Active section: Filled circle (●) + accent color
- Inactive sections: Outline circle (○)
- Hover: bg-tertiary
- Click: Load section content

**Search:**
- Type to filter settings
- Highlight matching sections in sidebar
- Show matching settings in content area

**Auto-Save:**
- Save on every change (debounced, 2s delay)
- Show "Saved" indicator
- Show "Saving..." while in progress

**Destructive Actions:**
- Delete account: Confirm dialog with password input
- Clear chat history: Confirm dialog ("Are you sure?")
- Downgrade plan: Warn about feature loss

**Export Data:**
- Click "Export Data"
- Generate JSON file with all user data
- Download file (houston_data_2025-12-01.json)

### Mobile Adaptation

- Sidebar → Dropdown (select section)
- Content: Full width
- Forms: Stack vertically

---

## Summary

All 8 key screens have been redesigned with:
- ✅ Detailed layout specs
- ✅ Content specs (copy, microcopy, CTAs)
- ✅ Interaction specs (hover, focus, animations, keyboard shortcuts)
- ✅ Mobile adaptations

**Next Steps:**
- Task 6: Implement design system and redesigned screens in code
- Task 7: Quality check and deliver final premium app

**Estimated Implementation Time:** 3-4 weeks
