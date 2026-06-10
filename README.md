# mann. · मन
### *A non-clinical AI companion that lives in the space between "I'm fine" and "I need therapy."*

> Built for the Capgemini Hackathon · Healthcare & Wellness · Use Case #21

---

## 📌 Problem Statement
Global mental health systems suffer from a vast **middle-ground gap**. On one side, there are shallow wellness or productivity trackers that gamify self-care with streak metrics and numbers. On the other end, there are clinical therapy frameworks, which are scarce, stigmatized, and frequently require immediate financial or professional commitments. Millions of individuals facing sub-clinical, daily distress, career transitions, relationship fatigue, or anxiety belong to the **71% who never speak to a professional**. They are too heavy for "I'm fine" but not ready or fit for formal medical crisis registries.

Current digitized assistants act as simple automated rule-checkers or standard GPT clones that fail to acknowledge the user's personality structure, current attachment styles, or visual metaphors for emotional climate. 

---

## 💡 Proposed Solution
**Mann** (Hindi for *mind*, *heart*, and *the subjective inner seat of emotional feeling*) is an offline-capable, local-first conversational space and a kinetic self-regulation ecosystem. It acts as an empathetic, subjective mirror, avoiding dry medicalized terminology. 

Mann introduces:
1. **Adaptive AI Companion Engine (ChatGPT-Like Model)**: Generates safe, personality-bounded guidance utilizing the **@google/genai SDK** over Gemini, adjusted across **64 distinct personality alignments** (16 MBTI profiles * 4 Attachment Styles). It features clean inline badge rendering that strips and formats raw text formatting (`**`), interactive diagnostic input starters, and a responsive bouncing dots typing container.
2. **The Living Garden (Kinetic Canvas & Almanac)**: Translates psychological wellness states from a sterile numeric percentage scale into an organic vector garden that blooms, shifts, or clouds depending on real-time dialogue and completed apothecary rituals. It is coupled with a permanent side-adjacent **Ecosystem Almanac** breaking down climates, wind speeds, and visual indicators.
3. **Adaptive Guiding Light Pathway Dashboard**: A personalized, zero-click guidance board that dynamically matches active weather (e.g. Cloudy/Withering) and MBTI traits against immediate action items (like pre-filling CBT Thought Record self-doubts or directly watering dopamine elements) to avoid navigation friction.
4. **System Inspector Active Telemetry HUD**: A diagnostic sidebar driver mapping human self-regulation workflows. Under focus-actions, a beautiful telemetry HUD overlay slides into view, analyzing psychological foundations (Attachment styles, Somatic metaphorical states, etc.) with real-time feedback.
5. **Reactive Safety Safeguards (Tiered SOS Dispatch)**: Intercepts crisis indicators semantically without sacrificing the companion's presence, exposing immediate localized helpline overlays and safety tools.

---

## 📖 The Innovation Story: Why Mann is Different
Traditional wellness platforms treat the human spirit like a data-dashboard, complete with bars, percentages, and gamified pressure. Mann throws away numerical mood tracking in favor of **honest metaphors, unhurried design, and absolute guidance**. 

We asked ourselves: *"What if an application didn't demand change, but simply witnessed and reflected?"*

By selecting a **Deep Dusk** palette (`#121412` and `#1A1625`) styled around twilight gradients—the hour when human isolation is most keenly felt—coupled with organic spring-back particle elements, Mann changes the digital companion landscape. It is not an automated doctor; it is a warm, kinetic pocket garden that changes color and growth density based on how you water your chemical baseline (D.O.S.E. rituals) and record automatic negative thoughts (CBT cognitive reframes).

With the new **Guiding Light** module, users who doubt themselves don't have to seek out toolbox systems; the platform automatically analyzes their personality traits isomorphically and provides direct, one-click action shortcuts right on their dashboard.

---

## 🛠 Approach & Methodology
The development team executed a rigorous, iterative problem-solving workflow:

1. **Deconstructive Empathy Mapping**: Researched clinical CBT thought-record structures and translated them into interactive UI patterns (The "CBT Thought Mirror") to reduce barriers for end-users.
2. **Framework Alignment**: Embedded three primary psychological structures:
   * **Cognitive Behavioral Therapy (CBT)**: Uncovering rigid assumptions and proposing single-step cognitive reframes.
   * **Attachment Theory**: Controlling interpersonal pacing, distance, and messaging boundaries (Anxious profiles receive regular secure reassurance; Avoidant profiles get highly structured, non-intrusive spaces).
   * **D.O.S.E. Chemistry**: Tailoring actual activities targeting Dopamine, Oxytocin, Serotonin, and Endorphins.
3. **Visual Architecture Iterations**: Optimized the SVG-based Canvas render pipeline, integrating spring-mass physics via Framer Motion so changes in mood states feel fluid and organic.
4. **Key Assumption Safeguards**: Assumed that in states of severe isolation, network reliability and setup complexity are high barriers. Thus, Mann operates with instant sandbox toggles (Mode A Onboarding VS Mode B Returning User), pre-populated databases, and instant client-first fallback states.

---

## ⚡ Functional Requirements & Use Cases
### Functional Requirements
* **FR-1 [Onboarding]**: Allow the user to configure their baseline: name, MBTI, Attachment Style, primary stress context, and emergency contact details.
* **FR-2 [Ecosystem Garden]**: Render a responsive SVG garden that morphs through 5 stages: Blooming, Growing, Cloudy, Withering, and Dark based on current mood state.
* **FR-3 [Thought Mirror]**: Feed cognitive distortions into an interactive system that outputs reframed thought tracks.
* **FR-4 [D.O.S.E. Apothecary]**: Track biochemically grounded mental-health rituals (e.g., Unsent Letter, Sun Exposure, Diaphragmatic Breath) and allow state toggling that instantly impacts overall garden vitality.
* **FR-5 [Semantic Crisis Interception]**: Synthesize real-time emergency contact data, overlaying WhatsApp API and immediate human helplines upon SOS flag dispatch (manual or chat-inferred).

### Non-Functional Requirements
* **NFR-1 [Emotional Safety / Polish]**: Animations must feel slow and unhurried (300-600ms transitions) to promote grounding states and minimize visual noise.
* **NFR-2 [Performance / Canvas Size]**: SVGs must scale cleanly on ultra-wide desktop monitors as well as mobile devices (desktop-first precision with mobile-first responsiveness).
* **NFR-3 [Offline Resilience]**: Use local state persistence so the user never loses progress due to sudden connection losses.
* **NFR-4 [Secure Sandbox Boundary]**: Prevent exposing API keys to client browsers by maintaining robust server-proxies for AI systems.

---

## 🌐 Domain, Use Case, & Target Audience
* **Domain**: Digital Safe Tech, Self-Regulation, Mental Wellness Solutions.
* **Target Audience**: Students, corporate professionals, and individuals going through high-fatigue career transitions or relationship changes.
* **Primary Use Case**: Checking in when feeling anxious, walking through a CBT cycle after receiving unexpected criticism, resetting breathing patterns under extreme stress, and tracking non-intrusive self-care habits.

---

## 💎 Unique Selling Proposition (USP)
> **64 Unique Response Personalities Coupled with a Biological Metaphor Garden Canvas.**
Unlike traditional linear mental health apps, Mann completely adapts its dialogue pacing, reframe advice, and visual garden gravity based on your specific attachment structure and MBTI type. It is the only safe space that remains fully engaged even in critical crisis states, bridging medical disclaimers with immediate real-time human connection hooks.

---

## 📐 System Architecture

Below is the structured data and communication flow of the application:

```
  ┌────────────────────────────────────────────────────────┐
  │                      CLIENT-SIDE                       │
  │                  React (Vite) / Tailwind               │
  ├────────────────────────────────────────────────────────┤
  │  ┌───────────────────────┐   ┌──────────────────────┐  │
  │  │     JOURNEY MAP       │   │    GARDEN CANVAS     │  │
  │  │ (Cognitive State logs)│   │ (Framer Motion / SVG)│  │
  │  └──────────┬────────────┘   └──────────▲───────────┘  │
  │             │                           │              │
  │             │ Updates                   │ Re-renders   │
  │             ▼                           │              │
  │  ┌──────────────────────────────────────┴───────────┐  │
  │  │              React State & Local Engine          │  │
  │  │      - Profile: { MBTI, Attachment }             │  │
  │  │      - Records: { CBT, DOSE Apothecary }         │  │
  │  └──────────────────┬───────────────────────────────┘  │
  └─────────────────────┼──────────────────────────────────┘
                        │ Secure Proxy Requests
                        ▼ (Port 3000)
  ┌────────────────────────────────────────────────────────┐
  │                      BACKEND SERVER                    │
  │                  Node.js / Express Server              │
  ├────────────────────────────────────────────────────────┤
  │  ┌───────────────────────┐   ┌──────────────────────┐  │
  │  │      API ROUTING      │   │   @google/genai SDK  │  │
  │  │ (Proxy endpoints)     │   │  (Server-Side API)   │  │
  │  └──────────┬────────────┘   └──────────▲───────────┘  │
  └─────────────┼───────────────────────────┼──────────────┘
                │                           │
                ▼                           ▼
        Local Storage / State       Gemini 1.5 Pro
        (Durable Sandboxes)         (System Instructions)
```

---

## 📦 Core Modules & System Structure
* `/src/App.tsx`: Represents the application's central nervous system, managing tab navigation, the profile building states, chatbot integrations, CBT registers, and reactive SOS dispatch modules.
* `/src/components/GardenCanvas.tsx`: SVG canvas rendering plant structures dynamically. It receives mood values and calculates custom growth sizes, branch angles, wind speed fluctuations, and color gradients synchronized with the user's "Inner Weather."
* `/src/components/JourneyMap.tsx`: Translates user activity into a cohesive timeline of self-regulation loops, enabling structural feedback on cognitive progress.
* `/src/types.ts`: Strongly-typed TypeScript interfaces specifying `UserProfile`, `CbtThoughtMirror`, `DoseRitual`, and global `MoodPetal` configurations.

---

## ⚙️ Setup & Execution Instructions

Ensure you have Node.js 18+ installed on your system.

### Running locally
1. Install initial project dependencies:
   ```bash
   npm install
   ```
2. Set up your client environmental variables by creating a `.env` or copying the example file:
   ```bash
   cp .env.example .env
   ```
3. Set your `GEMINI_API_KEY` inside `.env` to leverage Mann's full generative conversational engine.
4. Launch the local high-fidelity development server:
   ```bash
   npm run dev
   ```
5. Build the application for optimized containerized cloud deployments:
   ```bash
   npm run build
   ```

### ⛵ GitHub Pages Live Publishing Instructions
Mann is fully pre-configured to be deployed directly from a GitHub repository to a live site on **GitHub Pages** (e.g. `https://<username>.github.io/<repo-name>`).

1. **Static Relative Paths Confirmed**: We have added the asset root base configuration (`base: "./"`) in `vite.config.ts`. This ensures CSS, JS, and image assets resolve correctly regardless of whether the site is hosted at a domain root or a nested repository folder (sub-directory pathing).
2. **Deploy with `gh-pages` Package**:
   To publish with one command:
   * Install the dev utility: `npm install -D gh-pages`
   * Add these deployment scripts into your `package.json`:
     ```json
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
     ```
   * Execute: `npm run deploy`
   * Your build outcome will be automatically pushed to a dedicated `gh-pages` branch, and GitHub will instantly publish the live version of your space.
3. **Alternatively (Action Deploy)**:
   You can also simply push the repository to GitHub, configure your repository's **Settings -> Pages -> Build and deployment** source to utilize "GitHub Actions", and select the default "Vite" workflow to build and host your companion space automatically in real-time.

---

## ⚖️ Safety & Ethics Guide
Mann enforces high security and clinical guardrails:
* **The Non-Clinical Promise**: We clearly separate conversational reflection from medical treatment. A prominent warning banner is visible across the main header workspace.
* **Instant Safety Dispatch**: Unlike systems that shut down dialogue during crisis states, Mann triggers real-world support systems instantly while maintaining a grounding, calm presence within the active conversation.
* **Data Discretion**: Zero-data egress defaults ensure all personal journals, MBTI attributes, and emergency contact details remain locked inside the local runtime sandboxes.

---

## 🧩 Challenges faced & Learnings during Development
* **Iframe Sandbox Constraints**: Overriding standard pop-up mechanisms led the team to build custom overlay panels (such as the SOS layout), resolving the sandbox blockade and guaranteeing access to distress helplines across all viewports.
* **SVG Morphing Transitions**: Translating rigid mood profiles into natural plants was resolved by combining Framer Motion spring engines with custom SVG rendering algorithms. This ensures wind speed fluctuations, branch angles, and plant heights animate dynamically, avoiding the visual fatigue of standard charting.
* **AI Hallucination Containment**: Ensured the system conforms to non-clinical outputs by hardcoding safety boundaries inside the server-side Gemini system instructions, avoiding unsolicited diagnostic statements.

---

*mann. · मन · Mind. Heart. The soft place where both live.*
