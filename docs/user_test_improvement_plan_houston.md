# User Test Improvement Plan: Houston

**Based on:** Simulated User Tests (Dec 2025)
**Goal:** Align product with "AI Coach" vision and remove friction for core personas.

## 1. Strategic Objectives
*   **Increase First-Session Success:** Ensure the user leaves the first session with a *completed* task (not just a plan).
*   **Reduce Cognitive Load:** Simplify the Dashboard for non-tech users (Sandra, Lukas).
*   **Clarify "Coach" vs. "Tool":** Emphasize the *active guidance* aspect over the *passive tracking* aspect.

## 2. Prioritised Roadmap

### Phase 1: Critical Fixes (Weeks 1-2) [COMPLETED & VALIDATED ✅]
*Focus: Fixing the "Broken" narratives from testing.*

#### 1.1 Fix "Today's Focus" State Logic (Done)
*   **Problem:** Users who just completed onboarding (told Houston everything) are greeted with "Tell Houston about your business".
*   **Solution:** Update `Dashboard.tsx` to recognize `onboardingCompleted` status and change the Hero copy to: "Thanks for the details, [Name]! Let's tackle your first goal: [Goal 1]."
*   **Status:** ✅ Live. Validated with Lukas.

#### 1.2 Enable Goal Editing in Onboarding (Done)
*   **Problem:** Sandra felt forced to accept a "LinkedIn" goal she didn't want.
*   **Solution:** Add a simple "Edit" or "Regenerate" button next to the SMART goals in the wizard.
*   **Status:** ✅ Live. Validated with Sandra.

#### 1.3 "Playbook" Tooltips/Renaming (Done)
*   **Problem:** Lukas didn't understand "Playbooks".
*   **Solution:** Add a subtitle or tooltip: "Playbooks (Step-by-Step Guides)". Or change to "Marketing Missions".
*   **Status:** ✅ Live. Renamed to "Playbooks (Anleitungen)".

### Phase 2: User Experience Polish (Weeks 3-4) [COMPLETED & VALIDATED ✅]
*Focus: Delighting the specific personas.*

#### 2.1 Mobile Input Optimization (for Daniel) (Done)
*   **Problem:** Typing long business descriptions on mobile is tedious.
*   **Solution:** Add "Pills/Tags" for common answers in Onboarding (e.g., Industry selector, common goals) to reduce typing.
*   **Files:** `client/src/components/OnboardingWizard.tsx`
*   **Status:** ✅ Live. Validated with Daniel.

#### 2.2 "Manual Check-in" Flow (for Lukas/Mia) (Done)
*   **Problem:** Users are skeptical about how Houston tracks offline/external goals.
*   **Solution:** Add a "Weekly Check-in" button where Houston asks: "Did you get any new customers this week?" and updates the progress bar manually based on user input. This bridges the integration gap.
*   **Files:** `client/src/pages/Dashboard.tsx`, `client/src/components/CheckInModal.tsx`
*   **Status:** ✅ Live. Validated with Lukas.

### Phase 3: Growth & Agency Features (Month 2)
*Focus: Unlocking the "Alex" persona.*

#### 3.1 Explicit Workspace Management
*   **Problem:** Alex is unclear about billing for multiple clients.
*   **Solution:** Add a clear "Workspaces" management screen in Settings with billing transparency ("Included in Team Plan" vs "Add-on").
*   **Files:** `client/src/pages/Settings.tsx`

#### 3.2 PDF Strategy Export
*   **Problem:** Alex wants to sell the strategy.
*   **Solution:** Make the "Export Strategy" button prominent in the Strategy view and brand it as a "Report".
*   **Files:** `client/src/pages/Strategy.tsx`

## 3. Alignment with Product Vision
*Reference: The AI Coach for Marketing*

*   **Simplicity:** The fix to "Today's Focus" (1.1) ensures the Coach feels *smart* and *context-aware*, not like a generic tool.
*   **Focus:** The "Check-in" flow (2.2) reinforces the "Accountability Partner" aspect of a Coach. A Coach asks "Did you do it?", they don't just show a dashboard.
*   **Professional Tone:** The Agency features (3.1, 3.2) allow Houston to "graduate" from a solo tool to a professional asset.
