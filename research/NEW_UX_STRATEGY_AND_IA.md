# Houston - New UX Strategy & Information Architecture

**Date:** 2025-12-01  
**Based on:** Premium UX Pattern Library + Houston Audit  
**Goal:** Transform Houston from 4/10 to 10/10 Premium UX

---

## Core UX Strategy

### Vision Statement

**Houston is a trusted AI marketing partner** that guides small and medium businesses (SMBs) from confusion to clarity, from goals to growth. It's not a chatbot with forms—it's a proactive coach that anticipates needs, provides transparent guidance, and makes marketing strategy accessible to non-experts.

### Design Principles

1. **Guided, Not Generic** - Every interaction should move the user toward their marketing goals
2. **Transparent, Not Black Box** - Always show what Houston is doing and why
3. **Proactive, Not Reactive** - Anticipate needs, don't wait for questions
4. **Fast, Not Friction** - Keyboard shortcuts, instant updates, minimal clicks
5. **Flexible, Not Rigid** - Multiple views, customizable layouts, user control

### Target User Persona

**Primary:** Marketing Manager at SMB (25-45 years old)
- **Pain Points:** Limited budget, no marketing team, overwhelmed by options
- **Goals:** Clear strategy, measurable results, time savings
- **Behavior:** Prefers guided workflows, values transparency, wants quick wins

**Secondary:** Small Business Owner (35-55 years old)
- **Pain Points:** No marketing expertise, limited time, DIY mindset
- **Goals:** Simple tools, actionable advice, affordable solutions
- **Behavior:** Needs hand-holding, skeptical of AI, wants proven tactics

---

## New Information Architecture

### Site Map

```
Landing Page
├── Hero (value prop + CTA)
├── How It Works (3 steps)
├── Features (4 key features)
├── Testimonials (social proof)
├── Pricing (Free vs Pro)
└── FAQ

Login/Sign Up
└── Manus OAuth

Onboarding Wizard (first-time users only)
├── Step 1: Business Info
│   ├── Industry (dropdown)
│   ├── Company size (1-10, 11-50, 51-200, 200+)
│   └── Location (city, country)
├── Step 2: Marketing Goals
│   ├── Select from templates (Increase brand awareness, Generate leads, Boost sales, etc.)
│   └── Or create custom goal
├── Step 3: Target Audience
│   ├── Who are your ideal customers?
│   └── What problems do they have?
├── Step 4: Current Channels
│   ├── Select channels (Social media, Email, Ads, SEO, Content, Events, etc.)
│   └── What's working? What's not?
└── Step 5: Personalized Roadmap
    ├── Houston generates:
    │   ├── 2-3 SMART goals (based on answers)
    │   ├── 5-10 quick-win tasks
    │   └── Strategy outline
    └── CTA: "Start Coaching" → Dashboard

Dashboard (authenticated)
├── Home
│   ├── Welcome message + next steps
│   ├── Progress overview (goals, tasks, campaigns)
│   ├── AI insights (proactive suggestions)
│   └── Quick actions (New goal, Start chat, View analytics)
├── Coach (AI Chat)
│   ├── Chat interface (left sidebar: history, right: conversation)
│   ├── Quick-reply chips (contextual suggestions)
│   ├── Command palette (Cmd+K)
│   └── Chat history (search, filter, export)
├── Goals
│   ├── View switcher (Table, Board, Timeline, Calendar)
│   ├── Filters (Status, Priority, Deadline)
│   ├── Properties (Custom fields)
│   ├── Relations (Link to strategies, tasks, campaigns)
│   └── Templates (Pre-built goal templates)
├── Strategy
│   ├── Overview (strategy canvas)
│   ├── Positioning (UVP, target market)
│   ├── Personas (customer profiles)
│   ├── Channels (where to reach customers)
│   ├── Messaging (key messages, tone)
│   └── AI review (Houston critiques strategy)
├── Campaigns (new)
│   ├── Active campaigns (list view)
│   ├── Campaign planner (create new)
│   ├── Campaign templates (email, social, ads, etc.)
│   └── Performance metrics (ROI, conversions, reach)
├── Tasks
│   ├── View switcher (List, Board, Calendar)
│   ├── My tasks (assigned to me)
│   ├── All tasks (team view)
│   ├── Completed (archive)
│   └── Quick add (Cmd+N)
├── Analytics (new)
│   ├── Performance dashboard (key metrics)
│   ├── Goal progress (visual charts)
│   ├── Campaign ROI (cost vs revenue)
│   └── Export reports (PDF, CSV)
└── Settings
    ├── Account (name, email, avatar)
    ├── Notifications (email, in-app, frequency)
    ├── Subscription (Free vs Pro, billing)
    ├── Privacy (data export, delete account)
    └── Integrations (Google Analytics, Facebook Ads, Mailchimp, etc.)
```

### Navigation Structure

**Primary Navigation (Sidebar):**
- Home (Dashboard icon)
- Coach (MessageSquare icon)
- Goals (Target icon)
- Strategy (Lightbulb icon)
- Campaigns (Megaphone icon)
- Tasks (CheckSquare icon)
- Analytics (BarChart icon)
- Settings (Settings icon)

**Secondary Navigation (Context-dependent):**
- View switchers (Table, Board, Timeline, Calendar)
- Filters (Status, Priority, Deadline, Owner)
- Sorting (Date, Name, Status)
- Bulk actions (Select multiple, Archive, Delete)

**Tertiary Navigation (Keyboard Shortcuts):**
- `Cmd+K` - Command palette
- `G+H` - Go to Home
- `G+C` - Go to Coach
- `G+G` - Go to Goals
- `G+S` - Go to Strategy
- `G+T` - Go to Tasks
- `G+A` - Go to Analytics
- `Cmd+N` - New (context-dependent: goal, task, campaign)
- `Cmd+F` - Search
- `Cmd+/` - Show keyboard shortcuts
- `Esc` - Close modal/dialog

---

## Core User Journeys

### Journey 1: First-Time Onboarding

**Goal:** Transform new user from confused to confident in 5 minutes

**Steps:**

1. **Land on Homepage**
   - See clear value prop: "Your AI Marketing Coach for SMBs"
   - See "How It Works" (3 simple steps)
   - Click "Get Started Free"

2. **Sign Up with Manus OAuth**
   - One-click login (no password)
   - Redirect to Onboarding Wizard

3. **Onboarding Wizard - Step 1: Business Info**
   - Houston greets: "Hi! I'm Houston, your AI marketing coach. Let's get to know your business."
   - Form fields:
     - Industry (dropdown with search)
     - Company size (radio buttons)
     - Location (autocomplete)
   - Progress indicator: 1/5
   - CTA: "Next"

4. **Onboarding Wizard - Step 2: Marketing Goals**
   - Houston asks: "What do you want to achieve with marketing?"
   - Goal templates (cards with icons):
     - Increase brand awareness
     - Generate more leads
     - Boost sales
     - Improve customer retention
     - Launch new product
     - Custom goal
   - User selects 1-3 templates or creates custom
   - CTA: "Next"

5. **Onboarding Wizard - Step 3: Target Audience**
   - Houston asks: "Who are your ideal customers?"
   - Form fields:
     - Demographics (age, gender, location)
     - Psychographics (interests, values, pain points)
     - Behavior (where they hang out, what they read)
   - AI suggestions based on industry
   - CTA: "Next"

6. **Onboarding Wizard - Step 4: Current Channels**
   - Houston asks: "Which marketing channels do you currently use?"
   - Channel checklist (with icons):
     - Social media (Facebook, Instagram, LinkedIn, Twitter, TikTok)
     - Email marketing
     - Paid ads (Google, Facebook, LinkedIn)
     - SEO & Content marketing
     - Events & Networking
     - Referrals & Word-of-mouth
   - For each selected: "What's working? What's not?" (textarea)
   - CTA: "Next"

7. **Onboarding Wizard - Step 5: Personalized Roadmap**
   - Houston generates (with loading animation):
     - 2-3 SMART goals (based on user's answers)
     - 5-10 quick-win tasks (prioritized)
     - Strategy outline (positioning, personas, channels)
   - User reviews and edits
   - Houston explains: "Here's your personalized marketing roadmap. I'll help you execute it step by step."
   - CTA: "Start Coaching" → Dashboard

8. **Dashboard (Pre-Populated)**
   - Welcome message: "Welcome to Houston, [Name]! Let's get started."
   - Progress overview: "You have 2 active goals and 5 tasks to complete this week."
   - AI insight: "Based on your industry, I recommend starting with content marketing. Want to learn more?"
   - Quick actions:
     - "Chat with Houston"
     - "View your goals"
     - "See your strategy"
   - Next step: Click "Chat with Houston" → Coach page

**Success Metrics:**
- Time to complete onboarding: < 5 minutes
- User activation rate: > 80% (complete onboarding)
- User retention (Day 7): > 60%

---

### Journey 2: Setting a Marketing Goal (AI-Assisted)

**Goal:** Create a SMART goal with Houston's help in < 2 minutes

**Steps:**

1. **Go to Goals Page**
   - See existing goals (if any) in Table view
   - Click "New Goal" or press `Cmd+N`

2. **AI-Assisted Goal Creation (Modal)**
   - Houston asks: "What do you want to achieve?"
   - User types: "Increase Instagram followers"
   - Houston suggests SMART version:
     - **Specific:** Increase Instagram followers by 25%
     - **Measurable:** From 1,000 to 1,250 followers
     - **Achievable:** Through daily content posting and engagement
     - **Relevant:** Aligns with brand awareness goal
     - **Time-bound:** By end of Q1 2025 (March 31)
   - User can edit any field
   - Houston shows confidence: "I'm 85% sure this goal is achievable based on your industry benchmarks."

3. **Add Measurement Method**
   - Houston asks: "How will you track this?"
   - Suggests: "Instagram Insights (native analytics)"
   - User confirms or edits

4. **Auto-Generate Tasks**
   - Houston suggests tasks:
     - "Create content calendar for Q1"
     - "Post 1 Reel per day"
     - "Engage with 10 accounts in your niche daily"
     - "Run a giveaway to boost followers"
     - "Analyze top-performing posts weekly"
   - User selects which tasks to add (checkboxes)
   - CTA: "Create Goal"

5. **Goal Created**
   - Goal appears in Goals page (Table view)
   - Tasks appear in Tasks page (Board view)
   - Houston sends proactive message: "Your Instagram goal is live! I'll check in with you weekly to track progress."

6. **Proactive Check-In (2 weeks later)**
   - Houston messages: "It's been 2 weeks. How's your Instagram goal going?"
   - User can:
     - Update progress (slider: 0% → 100%)
     - Report blockers (textarea)
     - Ask for help (quick-reply chip)
   - Houston analyzes and suggests:
     - "Your engagement is up 15%! Keep it up."
     - "Your posting frequency dropped. Want me to send daily reminders?"

**Success Metrics:**
- Time to create goal: < 2 minutes
- Goal completion rate: > 70%
- User engagement with proactive check-ins: > 50%

---

### Journey 3: Getting AI Strategy Advice (Conversational)

**Goal:** Get personalized, actionable marketing advice in < 5 minutes

**Steps:**

1. **Go to Coach Page**
   - See chat interface (left: history, right: conversation)
   - Houston greets: "Hi [Name]! How can I help you today?"
   - Quick-reply chips appear:
     - "Help me set a goal"
     - "Review my strategy"
     - "Suggest tasks for this week"
     - "Analyze my progress"

2. **User Asks Question**
   - User clicks "Review my strategy" or types custom question
   - Houston responds:
     - **Personalized advice** (based on user's business, goals, past conversations)
     - **Sources** ("Based on your industry benchmarks from HubSpot...")
     - **Confidence cues** ("I'm 80% sure this will work for your audience")
     - **Visual formatting** (headings, lists, bold)

3. **Houston Provides Actionable Next Steps**
   - Quick-reply chips appear:
     - "Add this to my strategy"
     - "Create tasks from this"
     - "Tell me more about X"
     - "I have a different question"

4. **User Takes Action**
   - User clicks "Add this to my strategy"
   - Houston auto-fills Strategy page with suggested content
   - User reviews and edits
   - Strategy saved and linked to Goals

5. **Houston Follows Up**
   - Houston messages (1 week later): "You added my content marketing strategy last week. Have you started implementing it?"
   - User can:
     - Report progress (quick-reply chips: "Yes, it's working!", "Not yet", "I need help")
     - Ask follow-up questions
     - Request more detailed guidance

**Success Metrics:**
- Time to get advice: < 5 minutes
- User satisfaction with advice: > 80% (thumbs up)
- Action taken rate: > 60% (user adds to strategy or creates tasks)

---

### Journey 4: Tracking Progress (Proactive AI Insights)

**Goal:** Understand marketing performance without manual analysis

**Steps:**

1. **Go to Dashboard**
   - See progress overview:
     - Goal progress bars (e.g., "Instagram followers: 15% of 25% target")
     - Sparklines (mini charts) showing trends
     - AI insights: "You're on track to hit your Q1 goal! Keep posting daily."

2. **Click on a Goal**
   - See detailed analytics:
     - Timeline view (progress over time)
     - Task completion rate (e.g., "80% of tasks completed")
     - Blockers or risks (AI-detected: "Your posting frequency dropped 20% this week")

3. **Houston Proactively Messages**
   - "Your Instagram engagement dropped 10% this week. Want to brainstorm ideas?"
   - Quick-reply chips:
     - "Yes, let's brainstorm"
     - "I know, I'm working on it"
     - "Show me the data"

4. **User Clicks "Yes, let's brainstorm"**
   - Houston suggests:
     - "Try posting Reels instead of static images (Reels get 2x more reach)"
     - "Engage with 10 accounts in your niche daily (builds community)"
     - "Run a giveaway to boost followers (proven tactic for SMBs)"
   - User selects suggestions (checkboxes)
   - Houston creates tasks automatically

5. **Go to Analytics Page**
   - See performance dashboard:
     - Key metrics (followers, engagement, reach, conversions)
     - Goal progress (visual charts)
     - Campaign ROI (cost vs revenue)
   - Export reports (PDF, CSV) for stakeholders

**Success Metrics:**
- Time to understand progress: < 2 minutes
- User engagement with AI insights: > 70%
- Action taken rate: > 50% (user creates tasks from suggestions)

---

### Journey 5: Upgrading to Pro (Contextual Upsell)

**Goal:** Convert free users to Pro when they hit limits

**Steps:**

1. **User Hits Free Plan Limit**
   - Example: User tries to create 4th goal (limit: 3)
   - Contextual modal appears:
     - "You've reached your 3-goal limit on the Free plan."
     - "Upgrade to Pro for unlimited goals, advanced analytics, and priority support."
     - "Not ready? Archive a goal to free up space."
   - CTAs:
     - "See Pro Features" (primary)
     - "Archive a Goal" (secondary)

2. **User Clicks "See Pro Features"**
   - In-app pricing modal appears:
     - Feature comparison table (Free vs Pro)
     - Testimonials from Pro users
     - "14-day free trial" badge
   - CTAs:
     - "Start Free Trial" (primary)
     - "Learn More" (secondary)

3. **User Clicks "Start Free Trial"**
   - Stripe checkout (pre-integrated)
   - Payment form (card details)
   - Submit → Pro features unlock immediately

4. **Pro Features Unlocked**
   - Houston celebrates: "Welcome to Houston Pro! 🎉"
   - "You now have unlimited goals, advanced analytics, and priority support."
   - Quick tour of new features:
     - "Create unlimited goals"
     - "View advanced analytics"
     - "Export reports as PDF"
     - "Get priority support (24h response time)"

5. **Trial Reminder (Day 12 of 14)**
   - Houston messages: "Your free trial ends in 2 days. Want to continue with Pro?"
   - CTAs:
     - "Yes, keep Pro" (auto-renew)
     - "No, downgrade to Free" (cancel trial)
     - "I need more time" (extend trial)

**Success Metrics:**
- Free-to-Pro conversion rate: > 10%
- Trial-to-paid conversion rate: > 40%
- Churn rate (Pro users): < 5% per month

---

## Screen Types & Layouts

### 1. Onboarding Wizard

**Layout:** Centered card (max-width: 600px)

**Components:**
- Progress indicator (5 steps)
- Step title (h2)
- Step description (p)
- Form fields (inputs, textareas, dropdowns, checkboxes)
- AI suggestions (chips, cards)
- Navigation (Back, Next, Skip)

**Behavior:**
- Auto-save on each step (no data loss)
- Keyboard navigation (Tab, Enter, Esc)
- Mobile-responsive (stack vertically)

---

### 2. Dashboard (Home)

**Layout:** 3-column grid (sidebar + main + right panel)

**Components:**
- Welcome message (h1)
- Progress overview (stats cards with sparklines)
- AI insights (card with icon + message + quick-reply chips)
- Quick actions (button grid: New goal, Start chat, View analytics)
- Recent activity (list of recent goals, tasks, chats)

**Behavior:**
- Real-time updates (stats refresh every 30s)
- Keyboard shortcuts (G+H to go home)
- Mobile-responsive (stack vertically, hide right panel)

---

### 3. Coach (AI Chat)

**Layout:** 2-column (left: chat history sidebar, right: conversation)

**Components:**
- Chat history sidebar (list of past chats with search)
- Conversation area (user messages right, AI messages left)
- Input field (textarea with send button)
- Quick-reply chips (contextual suggestions below AI messages)
- Typing indicator ("Houston is thinking...")
- Feedback buttons (thumbs up/down, copy, regenerate)

**Behavior:**
- Streaming responses (text appears in real-time)
- Auto-scroll to latest message
- Keyboard shortcuts (Cmd+K for command palette, Enter to send)
- Mobile-responsive (hide sidebar, show hamburger menu)

---

### 4. Goals (Multiple Views)

**Layout:** Full-width with view switcher (Table, Board, Timeline, Calendar)

**Components:**
- View switcher (tabs)
- Filters (dropdown: Status, Priority, Deadline)
- Sorting (dropdown: Date, Name, Status)
- Search (input field)
- New Goal button (top-right)
- Goal cards/rows (depending on view)

**Table View:**
- Columns: Name, Status, Priority, Deadline, Progress, Actions
- Sortable columns
- Bulk select (checkboxes)

**Board View (Kanban):**
- Columns: Not Started, In Progress, At Risk, Completed
- Drag-and-drop between columns
- Card shows: Name, Progress bar, Deadline, Tags

**Timeline View:**
- Horizontal timeline (months)
- Goals as bars (start date → deadline)
- Drag to adjust dates

**Calendar View:**
- Monthly calendar
- Goals as events (deadline date)
- Click to view details

**Behavior:**
- View preference saved per user
- Keyboard shortcuts (Cmd+N for new goal, Cmd+F for search)
- Mobile-responsive (Table → List, Board → Swipeable columns)

---

### 5. Strategy (Canvas)

**Layout:** Full-width canvas with sections

**Components:**
- Strategy canvas (visual overview)
- Sections (collapsible):
  - Positioning (UVP, target market)
  - Personas (customer profiles)
  - Channels (where to reach customers)
  - Messaging (key messages, tone)
- AI review button (top-right)
- Export button (PDF, Markdown)

**Behavior:**
- Auto-save on every change
- AI review: Houston critiques strategy and suggests improvements
- Keyboard shortcuts (Cmd+S to save, Cmd+E to export)
- Mobile-responsive (stack sections vertically)

---

### 6. Campaigns (List + Planner)

**Layout:** 2-column (left: campaign list, right: campaign details)

**Components:**
- Campaign list (cards with status, metrics, actions)
- Campaign planner (form to create new campaign)
- Campaign templates (pre-built: email, social, ads, etc.)
- Performance metrics (ROI, conversions, reach)

**Behavior:**
- Real-time metrics (refresh every 60s)
- Keyboard shortcuts (Cmd+N for new campaign)
- Mobile-responsive (stack vertically)

---

### 7. Tasks (List + Board)

**Layout:** Full-width with view switcher (List, Board, Calendar)

**Components:**
- View switcher (tabs)
- Filters (My tasks, All tasks, Completed)
- New Task button (top-right)
- Task cards/rows (depending on view)

**List View:**
- Grouped by status (Open, In Progress, Completed)
- Checkbox to mark complete
- Drag to reorder

**Board View (Kanban):**
- Columns: To Do, Doing, Done
- Drag-and-drop between columns

**Calendar View:**
- Weekly calendar
- Tasks as events (due date)

**Behavior:**
- Quick add (Cmd+N)
- Keyboard shortcuts (Space to mark complete, E to edit)
- Mobile-responsive (List → Cards, Board → Swipeable columns)

---

### 8. Analytics (Dashboard)

**Layout:** Full-width with metric cards + charts

**Components:**
- Key metrics (cards with sparklines)
- Goal progress (bar charts)
- Campaign ROI (line charts)
- Export button (PDF, CSV)

**Behavior:**
- Real-time updates (refresh every 60s)
- Interactive charts (hover for details)
- Keyboard shortcuts (Cmd+E to export)
- Mobile-responsive (stack vertically)

---

### 9. Settings (Sections)

**Layout:** 2-column (left: section nav, right: section content)

**Components:**
- Section navigation (Account, Notifications, Subscription, Privacy, Integrations)
- Section content (forms, toggles, buttons)

**Behavior:**
- Auto-save on every change
- Confirmation dialogs for destructive actions (Delete account)
- Keyboard shortcuts (Cmd+S to save)
- Mobile-responsive (hide section nav, show dropdown)

---

## Mobile-First Adaptations

### Breakpoints

- **Mobile:** 320-639px (single column, stack vertically)
- **Tablet:** 640-1023px (2 columns, collapsible sidebar)
- **Desktop:** 1024px+ (3 columns, fixed sidebar)

### Mobile-Specific Patterns

1. **Sidebar Navigation** → **Bottom Tab Bar**
   - 5 tabs: Home, Coach, Goals, Tasks, More
   - "More" opens full menu (Strategy, Campaigns, Analytics, Settings)

2. **Table View** → **List View**
   - Each row becomes a card
   - Swipe left to reveal actions (Edit, Delete)

3. **Board View** → **Swipeable Columns**
   - Horizontal scroll between columns
   - Drag-and-drop still works

4. **Timeline View** → **Vertical Timeline**
   - Rotate 90° (horizontal → vertical)
   - Scroll vertically instead of horizontally

5. **Command Palette** → **Search Bar**
   - Always visible at top
   - Tap to open full-screen search

6. **Keyboard Shortcuts** → **Gesture Shortcuts**
   - Swipe right: Go back
   - Swipe left: Go forward
   - Pull down: Refresh
   - Long press: Context menu

---

## Success Metrics (KPIs)

### User Activation
- Onboarding completion rate: > 80%
- Time to first goal: < 10 minutes
- Time to first chat: < 5 minutes

### User Engagement
- Daily active users (DAU): > 40% of total users
- Weekly active users (WAU): > 70% of total users
- Average session duration: > 10 minutes
- Chat messages per user per week: > 5

### User Retention
- Day 1 retention: > 80%
- Day 7 retention: > 60%
- Day 30 retention: > 40%
- Churn rate: < 5% per month

### User Satisfaction
- NPS (Net Promoter Score): > 50
- CSAT (Customer Satisfaction): > 4.5/5
- AI response quality (thumbs up rate): > 80%

### Business Metrics
- Free-to-Pro conversion rate: > 10%
- Trial-to-paid conversion rate: > 40%
- Monthly recurring revenue (MRR) growth: > 20% per month
- Customer lifetime value (LTV): > $500

---

## Next Steps

With this UX strategy and IA defined, we can now:

1. **Task 4:** Create comprehensive design system (colors, typography, spacing, components, motion)
2. **Task 5:** Redesign all key screens with detailed specs
3. **Task 6:** Implement design system and refactor code
4. **Task 7:** Quality check and deliver final premium app

**Estimated Time:** 4-6 weeks for full redesign + implementation
