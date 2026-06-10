/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * MoodPetal Enum: Representing the active physiological/emotional state of the user.
 * Translates directly to the clinical soil and climate parameters of the virtual garden.
 */
export enum MoodPetal {
  BLOOMING = "Blooming",   // Creative flux, high energy/resilience (Green/Emerald)
  GROWING = "Growing",     // Nourishing base state, steady self-regulation (Teal/Mint)
  CLOUDY = "Cloudy",       // Cognitive fog, overthinking patterns emerging (Blue/Indigo)
  WITHERING = "Withering", // Burnout, severe sensory depletion (Amber/Rust)
  DARK = "Dark"            // Intense isolation, high pain/crisis threshold (Charcoal/Dark slate)
}

/**
 * DoseRitual Interface: Denotes behavioral activation exercises tailored to neurotransmitter pathways.
 * Works as a somatic rehydration database mechanism within the virtual garden.
 */
export interface DoseRitual {
  id: string;
  name: string;
  type: "Oxytocin" | "Serotonin" | "Dopamine" | "Endorphin"; // Chemical classification
  description: string;
  time: string; // Time of day or typical duration
  completed: boolean; // Persistence flag for habit logging
  color: string; // Tailored color swatch used for layout highlights
}

/**
 * UserProfile Schema: The baseline mental database record of the user.
 * Combines somatic parameters (MBTI traits, secure proximity levels) with growth streaks.
 */
export interface UserProfile {
  name: string;             // User's name (prepopulated or input during onboarding)
  mbti: string;             // MBTI personality type (clinical cognitive processing lens)
  attachmentStyle: string;  // Romantic/interpersonal attachment format (e.g. Secure, Anxious)
  gardenState: MoodPetal;   // The primary weather state, tying the chat and garden canvas together
  streak: number;           // Consecutive days or cycles of successful safe regulation
  recentJournalTheme: string; // Tracked topics for personalized somatic prompt generation
  lastRitualCompleted: string; // ISO timestamp or name of the last successful behavior activation
  emergencyContactName: string; // Designated support person for low-threshold crisis outreach (SOS safety network)
  emergencyContactPhone: string; // Validation-vetted phone details for SOS triggers
  doseBalance: {
    serotonin: string; // Neuro-receptors state track (e.g., "Steady", "Replenishing")
    dopamine: string;  // Reward cycle track
    oxytocin: string;  // Connectedness track
  };
}

/**
 * ChatMessage Schema: Tracks user-companion interactive therapeutic turns.
 * Proxied server-side to deep language models or resolved locally via resilient fallback.
 */
export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string; // Supporting full markdown and inline therapeutic exercises
  timestamp: string; // Vetted human-readable time (e.g., "04:58 AM")
}

/**
 * ThoughtMirrorRecord Schema: Store logs of Cognitive Behavioral Therapy (CBT) Thought Record reframes.
 * Persists negative automatic thoughts and their functional balanced counterparts.
 */
export interface ThoughtMirrorRecord {
  id: string;
  pattern: string;   // Cognitive distortion type (e.g. "Catastrophizing", "All-or-Nothing")
  original: string;  // The visceral raw thought running hot
  alternative: string; // The balanced, evidence-based reframed statement
  timestamp: string;  // Clean human-friendly timestamp for diary logs
}

/**
 * AppState Interface: Represents the root database/state container.
 * Persisted persistently into standard browser storage (localStorage) for continuous progression.
 */
export interface AppState {
  profile: UserProfile;
  messages: ChatMessage[];
  thoughtRecords: ThoughtMirrorRecord[];
  rituals: DoseRitual[];
  sosTriggered: boolean;
  sosDetails: {
    contact: string;
    method: string;
    timestamp: string;
  } | null;
  mode: "new" | "returning";
}
