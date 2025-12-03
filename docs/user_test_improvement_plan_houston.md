# User Test Improvement Plan: Houston

**Based on:** Simulated User Tests (Dec 2025)
**Goal:** Align product with "AI Coach" vision and remove friction for core personas.

## 1. Strategic Objectives

- **Increase First-Session Success:** Ensure the user leaves the first session with a _completed_ task (not just a plan).
- **Reduce Cognitive Load:** Simplify the Dashboard for non-tech users (Sandra, Lukas).
- **Clarify "Coach" vs. "Tool":** Emphasize the _active guidance_ aspect over the _passive tracking_ aspect.
- **Expand Niche Appeal:** Add specific tools for High-Value niches (Agencies, Startups, E-com).

## 2. Prioritised Roadmap

### Phase 1: Critical Fixes (Weeks 1-2) [COMPLETED & VALIDATED ✅]

_Focus: Fixing the "Broken" narratives from testing._

#### 1.1 Fix "Today's Focus" State Logic (Done)

- **Problem:** Users who just completed onboarding (told Houston everything) are greeted with "Tell Houston about your business".
- **Solution:** Update `Dashboard.tsx` to recognize `onboardingCompleted` status and change the Hero copy to: "Thanks for the details, [Name]! Let's tackle your first goal: [Goal 1]."
- **Status:** ✅ Live. Validated with Lukas.

#### 1.2 Enable Goal Editing in Onboarding (Done)

- **Problem:** Sandra felt forced to accept a "LinkedIn" goal she didn't want.
- **Solution:** Add a simple "Edit" or "Regenerate" button next to the SMART goals in the wizard.
- **Status:** ✅ Live. Validated with Sandra.

#### 1.3 "Playbook" Tooltips/Renaming (Done)

- **Problem:** Lukas didn't understand "Playbooks".
- **Solution:** Add a subtitle or tooltip: "Playbooks (Step-by-Step Guides)". Or change to "Marketing Missions".
- **Status:** ✅ Live. Renamed to "Playbooks (Anleitungen)".

### Phase 2: User Experience Polish (Weeks 3-4) [COMPLETED & VALIDATED ✅]

_Focus: Delighting the specific personas._

#### 2.1 Mobile Input Optimization (for Daniel) (Done)

- **Problem:** Typing long business descriptions on mobile is tedious.
- **Solution:** Add "Pills/Tags" for common answers in Onboarding (e.g., Industry selector, common goals) to reduce typing.
- **Files:** `client/src/components/OnboardingWizard.tsx`
- **Status:** ✅ Live. Validated with Daniel.

#### 2.2 "Manual Check-in" Flow (for Lukas/Mia) (Done)

- **Problem:** Users are skeptical about how Houston tracks offline/external goals.
- **Solution:** Add a "Weekly Check-in" button where Houston asks: "Did you get any new customers this week?" and updates the progress bar manually based on user input. This bridges the integration gap.
- **Files:** `client/src/pages/Dashboard.tsx`, `client/src/components/CheckInModal.tsx`
- **Status:** ✅ Live. Validated with Lukas.

### Phase 3: Growth & Agency Features (Month 2) [COMPLETED ✅]

_Focus: Unlocking the "Alex" persona._

#### 3.1 Explicit Workspace Management

- **Problem:** Alex is unclear about billing for multiple clients.
- **Solution:** Add a clear "Workspaces" management screen in Settings with billing transparency ("Included in Team Plan" vs "Add-on").
- **Files:** `client/src/pages/Settings.tsx`
- **Status:** ✅ Live. Workspace-Verwaltung mit Billing-Transparenz implementiert. Zeigt klar an, ob Workspaces im Team Plan enthalten sind oder ein Upgrade nötig ist.

#### 3.2 PDF Strategy Export

- **Problem:** Alex wants to sell the strategy.
- **Solution:** Make the "Export Strategy" button prominent in the Strategy view and brand it as a "Report".
- **Files:** `client/src/pages/Strategy.tsx`
- **Status:** ✅ Live. Export-Button ist jetzt prominent als "Als Report exportieren" gebrandet und mit Gradient-Styling hervorgehoben.

### Phase 4: Specialist Features (Month 3) [NEW]

_Focus: Deepening value for Startups, E-Com, and Creatives._

#### 4.1 Brand Voice Settings (for Fiona)

- **Problem:** AI tone is too generic ("Delve", "Unlock").
- **Solution:** Add a "Brand Voice" field in the `Strategy` section (e.g., "Witty", "Professional", "No jargon"). Pass this context to all Chat interactions.
- **Files:** `client/src/pages/Strategy.tsx`, `server/routers/chat.ts` (context injection).

#### 4.2 Content Library / Saved Responses (for Emily)

- **Problem:** Good ad hooks generated in Chat are lost in the stream.
- **Solution:** Add a "Save to Library" button on Chat messages. A simple "Saved" tab in the Dashboard or Strategy section.
- **Files:** `client/src/pages/Chats.tsx`, `client/src/pages/Strategy.tsx` (Library tab).

#### 4.3 Startup Pitch Framework (for Steve)

- **Problem:** "Marketing Strategy" structure doesn't fit "Investor Pitch".
- **Solution:** Add a toggle in Strategy: "Mode: Marketing" vs "Mode: Startup Pitch". This changes the fields from "Positioning/Channels" to "Problem/Solution/Market".
- **Files:** `client/src/pages/Strategy.tsx`

## 3. Alignment with Product Vision

_Reference: The AI Coach for Marketing_

- **Simplicity:** The fix to "Today's Focus" (1.1) ensures the Coach feels _smart_ and _context-aware_, not like a generic tool.
- **Focus:** The "Check-in" flow (2.2) reinforces the "Accountability Partner" aspect of a Coach. A Coach asks "Did you do it?", they don't just show a dashboard.
- **Professional Tone:** The Agency features (3.1, 3.2) allow Houston to "graduate" from a solo tool to a professional asset.
- **Specialization:** Phase 4 proves that Houston isn't just a "Wrapper", but a specialized tool that understands _Voice_ and _Pitching_.
