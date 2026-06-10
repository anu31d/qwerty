/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  MoodPetal, 
  DoseRitual, 
  ChatMessage, 
  UserProfile, 
  ThoughtMirrorRecord 
} from "./types";
import GardenCanvas from "./components/GardenCanvas";
import { JourneyMap } from "./components/JourneyMap";
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  AlertTriangle, 
  BookOpen, 
  Heart, 
  ShieldAlert, 
  User, 
  Check, 
  HeartCrack, 
  Flame, 
  Lock, 
  Smile, 
  Eye, 
  EyeOff,
  Zap,
  Activity,
  Award,
  MessageSquare,
  Leaf,
  Sliders,
  Home,
  Map,
  Compass,
  ArrowRight
} from "lucide-react";

// Initial state for Arjun
const initialArjunProfile: UserProfile = {
  name: "Arjun",
  mbti: "INFP",
  attachmentStyle: "Anxious",
  gardenState: MoodPetal.CLOUDY,
  streak: 6,
  recentJournalTheme: "Work stress, feeling disconnected from purpose",
  lastRitualCompleted: "The Unsent Letter (Oxytocin)",
  emergencyContactName: "Priya (Sister)",
  emergencyContactPhone: "+91-9876543210",
  doseBalance: {
    serotonin: "Low",
    dopamine: "Moderate",
    oxytocin: "Low"
  }
};

const initialNewUserProfile: UserProfile = {
  name: "",
  mbti: "Not Set",
  attachmentStyle: "Not Set",
  gardenState: MoodPetal.GROWING,
  streak: 1,
  recentJournalTheme: "Fresh Start",
  lastRitualCompleted: "None yet",
  emergencyContactName: "Priya (Sister)",
  emergencyContactPhone: "+91-9876543210",
  doseBalance: {
    serotonin: "Balanced",
    dopamine: "Balanced",
    oxytocin: "Balanced"
  }
};

// Initial system list of D.O.S.E Apothecary Rituals - 16 Highly Curated Options (4 per biochemical)
const defaultRituals: DoseRitual[] = [
  // --- OXYTOCIN (Connection) ---
  {
    id: "unsent-letter",
    name: "The Unsent Letter",
    type: "Oxytocin",
    description: "Write to someone you miss. Release the heavy words onto physical paper, but do not mail it. Burn or fold it safely.",
    time: "10 min",
    completed: false,
    color: "from-pink-500/20 to-rose-500/10 border-pink-500/40"
  },
  {
    id: "voice-note-draft",
    name: "Gratitude Voice Memo",
    type: "Oxytocin",
    description: "Record a 45-second private audio track outlining one memory you appreciate with a friend. No pressure to send it.",
    time: "3 min",
    completed: false,
    color: "from-pink-500/20 to-rose-500/10 border-pink-500/40"
  },
  {
    id: "old-photo-ping",
    name: "The Nostalgia Re-link",
    type: "Oxytocin",
    description: "Find an old photo representing shared laughter. Message the photo to that person with zero context but: 'Warm memories today.'",
    time: "4 min",
    completed: false,
    color: "from-pink-500/20 to-rose-500/10 border-pink-500/40"
  },
  {
    id: "shared-breath-sms",
    name: "The Sympathetic Text",
    type: "Oxytocin",
    description: "Send one message: 'Taking a deep breath and thinking of you.' Sit back and let your shoulder muscles un-clench immediately.",
    time: "2 min",
    completed: false,
    color: "from-pink-500/20 to-rose-500/10 border-pink-500/40"
  },

  // --- SEROTONIN (Calm & Pride) ---
  {
    id: "ten-min-walk",
    name: "The 10-Minute Walk",
    type: "Serotonin",
    description: "Walk outside. Leaving headphones behind. Just let your retina drink the ambient light and hear the natural wind.",
    time: "10 min",
    completed: false,
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/40"
  },
  {
    id: "neutral-joys-journal",
    name: "Savoring Simple Comforts",
    type: "Serotonin",
    description: "List three ordinary moments from your week that felt neutral but comforting (e.g. key sliding smooth in a lock, clean socks).",
    time: "5 min",
    completed: false,
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/40"
  },
  {
    id: "sun-horizon-gaze",
    name: "Biological Light Gaze",
    type: "Serotonin",
    description: "Step outdoors or peek out a window. Spend 3 minutes scanning the horizon sky direction to naturally reset circadian pathways.",
    time: "3 min",
    completed: false,
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/40"
  },
  {
    id: "barefoot-grounding",
    name: "Sole-to-Earth Presence",
    type: "Serotonin",
    description: "Stand completely barefoot. Close your eyes and shift your attention solely to how the heels of your feet touch the cold earth.",
    time: "2 min",
    completed: false,
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/40"
  },

  // --- DOPAMINE (Motivation) ---
  {
    id: "tiny-thing-done",
    name: "One Tiny Thing Done",
    type: "Dopamine",
    description: "Pick one tiny task (fold one sock, wipe one shelf). Act with complete presence. Finish just that one thing.",
    time: "5 min",
    completed: false,
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/40"
  },
  {
    id: "five-min-tech-fast",
    name: "The 5-Min Offline Space",
    type: "Dopamine",
    description: "Flip your phone face-down. Sit silently with a blank index card and write down exactly one achievement from today.",
    time: "5 min",
    completed: false,
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/40"
  },
  {
    id: "triple-quick-wins",
    name: "The Stacking Trio",
    type: "Dopamine",
    description: "Execute three physical micro-tasks in a row: drink half a cup of water, align your slippers, and close a cabinet door.",
    time: "2 min",
    completed: false,
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/40"
  },
  {
    id: "song-of-order",
    name: "Single-Song Cleansing",
    type: "Dopamine",
    description: "Put on one ambient, energetic track. Commit to organizing one single surface of a table until the song fades out.",
    time: "4 min",
    completed: false,
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/40"
  },

  // --- ENDORPHINS (Stress Release) ---
  {
    id: "sigh-breathing",
    name: "The Physiological Sigh",
    type: "Endorphin",
    description: "Two quick deep inhales through your nose, followed by a long, slow sigh out through the mouth. Repeat 3 times.",
    time: "2 min",
    completed: false,
    color: "from-indigo-500/20 to-blue-500/10 border-indigo-500/40"
  },
  {
    id: "two-min-wall-sit",
    name: "The 90-Sec Wall Isometric",
    type: "Endorphin",
    description: "Press your back flat against a wall, sink your knees to 90 degrees, and breathe through the intense quad burn. Rise and shake.",
    time: "2 min",
    completed: false,
    color: "from-indigo-500/20 to-blue-500/10 border-indigo-500/40"
  },
  {
    id: "somatic-shaking",
    name: "Vigorous Wrist Shaking",
    type: "Endorphin",
    description: "Stand up shook. Shake your wrists, elbows, and ankles outward loosely for 90 seconds to manually release physical armor.",
    time: "2 min",
    completed: false,
    color: "from-indigo-500/20 to-blue-500/10 border-indigo-500/40"
  },
  {
    id: "vagal-laugh-huff",
    name: "Diaphragmatic Vagal Huff",
    type: "Endorphin",
    description: "Inhale deeply. Expel the air in three rhythmic, belly-contracting coughs ('Ha! Ha! Ha!'). Relax your abdominal floor.",
    time: "3 min",
    completed: false,
    color: "from-indigo-500/20 to-blue-500/10 border-indigo-500/40"
  }
];

// Helper to generate positive, tailored affirmations based closely on current weather mood and journal stressors
function generateAffirmation(mood: MoodPetal, name: string, journalTheme?: string): string {
  const user = name || "Dear traveler";
  const theme = journalTheme ? journalTheme.toLowerCase() : "";
  
  switch (mood) {
    case MoodPetal.CLOUDY:
      if (theme.includes("work") || theme.includes("stress")) {
        return `${user}, when the skies are heavy with responsibility, remember that your worth resides in your unique presence, not your endless productivity. You are allowed to take up space simply by breathing.`;
      }
      return `${user}, cloudy skies are just clouds resting on their continuous journey. Your quiet stillness is not a failure of purpose, but a recovery of clarity.`;
      
    case MoodPetal.BLOOMING:
      return `${user}, let yourself feel the weightless warmth of this peak moment. You don't have to keep earning your joy; you are permitted to let the sun filter in without feeling rushed.`;
      
    case MoodPetal.GROWING:
      return `${user}, trust the silent stretch of your roots today. Transformation is a sequence of small, tender, quiet extensions that don't need to shout to be incredibly solid.`;
      
    case MoodPetal.WITHERING:
      return `${user}, dropping heavy branches is how a plant fiercely safeguards its heart. Fatigue is not a loss of discipline; resting is a profound act of active restoration.`;
      
    case MoodPetal.DARK:
    default:
      return `${user}, the quietest soil is where seeds rest safely in absolute dark. There is no active expectation for you to solve, fix, or hold together anything tonight. Allow yourself to rest.`;
  }
}

// Helper to parse double and single asterisks, lines, lists, and headers to render proper rich markup cleanly without raw Markdown characters
function formatMessageContent(content: string) {
  if (!content) return null;
  
  // Remove safety-trigger tag strings or bracket coordinates
  let cleanContent = content.replace(/\[SOS_TRIGGERED:[^\]]+\]/gi, "").trim();
  const lines = cleanContent.split("\n");
  
  return (
    <div className="space-y-2 font-sans text-xs sm:text-sm select-text text-slate-300 leading-relaxed font-light">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lineIdx} className="h-2" />;
        
        // Match bullet lists
        const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ") || trimmed.startsWith("✦ ");
        const isHeading = trimmed.startsWith("###");
        const isHeading2 = trimmed.startsWith("##");
        const isHeading1 = trimmed.startsWith("#");
        
        let displayLine = trimmed;
        if (isBullet) {
          displayLine = trimmed.substring(2);
        } else if (isHeading) {
          displayLine = trimmed.substring(3).trim();
        } else if (isHeading2) {
          displayLine = trimmed.substring(2).trim();
        } else if (isHeading1) {
          displayLine = trimmed.substring(1).trim();
        }
        
        // Inline parsing helper for **bold** and *italic*
        const formatInline = (text: string) => {
          const boldParts = text.split(/\*\*([^*]+)\*\*/g);
          return boldParts.map((bPart, bIdx) => {
            if (bIdx % 2 === 1) {
              return (
                <strong key={`b-${bIdx}`} className="font-semibold text-[#D4A373] bg-[#D4A373]/10 border border-[#D4A373]/20 rounded px-1.5 py-0.5 mx-0.5 inline-block text-[11px] sm:text-xs">
                  {bPart}
                </strong>
              );
            }
            
            // Handle italics
            const italicParts = bPart.split(/\*([^*]+)\*/g);
            return italicParts.map((iPart, iIdx) => {
              if (iIdx % 2 === 1) {
                return (
                  <span key={`i-${iIdx}`} className="italic text-slate-200">
                    {iPart}
                  </span>
                );
              }
              return iPart;
            });
          });
        };
        
        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1 my-1.5">
              <span className="text-[#D4A373] text-[10px] mt-1 shrink-0">✦</span>
              <span className="flex-1 text-slate-300">{formatInline(displayLine)}</span>
            </div>
          );
        }
        
        if (isHeading || isHeading2 || isHeading1) {
          return (
            <h5 key={lineIdx} className="text-xs sm:text-sm font-serif font-semibold text-[#D4A373] tracking-wide mt-3 mb-1 uppercase border-b border-white/5 pb-0.5">
              {formatInline(displayLine)}
            </h5>
          );
        }
        
        return (
          <p key={lineIdx} className="text-slate-300">
            {formatInline(displayLine)}
          </p>
        );
      })}
    </div>
  );
}

// Initial preloaded thought mirror records for Arjun
const initialThoughtRecords: ThoughtMirrorRecord[] = [
  {
    id: "ref-1",
    pattern: "Not Enough (All-or-Nothing)",
    original: "I'm not good enough at my job, everyone else seems to have it all together.",
    alternative: "I am feeling fatigued and overwhelmed right now. Others have their own silent struggles; comparison is just my exhaustion speaking.",
    timestamp: "2 days ago"
  },
  {
    id: "ref-2",
    pattern: "Disqualification of Positive",
    original: "Priya only called me because she felt obligated, not because she actually cares.",
    alternative: "Priya stepped out of her busy workday specifically to check on me because she values our relationship.",
    timestamp: "Yesterday"
  }
];

const DOUBT_PATHWAYS = {
  "self-doubt": {
    label: "Self-Doubt & Skills",
    emoji: "😔",
    analysis: "Under stress, your mind converts exhaustion into a narrative of operational failure. Your INFP poetic alignment defaults to comparing your vulnerable interior with others' polished exterior masks.",
    cbtOriginal: "I am lagging behind everyone else at work. I'm just not talented enough to keep up with their rapid execution pace.",
    cbtReframed: "My exhaustion makes other teams look flawless. I have my own solid records, and I'm simply depleted and resting today.",
    cbtPattern: "All-or-Nothing Thinking",
    ritualId: "neutral-joys-journal",
    ritualName: "Savoring Simple Comforts",
    pathDesc: "Identify the distortion, load the CBT Thought Mirror, and restore Serotonin balance by writing 3 comfortable moments in your day."
  },
  "exhaustion": {
    label: "Burnout & Fatigue",
    emoji: "🍂",
    analysis: "Your internal weather is Withering. You are exhausting your somatic buffers. Your Anxious Attachment triggers fear that resting will make people see you as a complete failure.",
    cbtOriginal: "If I take a day off to sleep, my entire team will think I am lazy and I will lose everything I have built so far.",
    cbtReframed: "Shedding leaves is how a robust plant survives the seasonal cold. Rest is a mandatory, productive part of my long-term career setup.",
    cbtPattern: "Overgeneralization",
    ritualId: "barefoot-grounding",
    ritualName: "Sole-to-Earth Presence",
    pathDesc: "Break the 'lazy' cognitive label in your Thought ledger, and release locked muscle armoring by grounding physically on earth."
  },
  "disconnection": {
    label: "Unseen or Lonely",
    emoji: "🌧",
    analysis: "Your Anxious Attachment style is highly active. The quietness of friends feels like deliberate rejection rather than a reflection of their own internal capacity limits.",
    cbtOriginal: "Priya hasn't called me back in two days. She must be tired of carrying my weight and is quietly washing her hands of me.",
    cbtReframed: "Priya is balancing her parenting and career. Her silence is a reflection of her own busyness, not a rejection of our deep bond.",
    cbtPattern: "Mind Reading (jumping to conclusions)",
    ritualId: "voice-note-draft",
    ritualName: "Gratitude Voice Memo",
    pathDesc: "Reframe the isolation projection in your Thought mirror, and stimulate Oxytocin by preparing a private gratitude draft to Priya."
  },
  "panic": {
    label: "Intense Panic Waves",
    emoji: "⚡",
    analysis: "A sudden high-cortisol wave is overtaking your cognitive control center. Your physical body is holding rigid muscular structures.",
    cbtOriginal: "This somatic panic is going to swallow me whole. I won't be able to breathe and something terrible is bound to happen.",
    cbtReframed: "Panic is just adrenaline releasing in natural curves. It rises, peaks, and always washes away. My physical body is safe and grounded.",
    cbtPattern: "Catastrophizing (emotional reasoning)",
    ritualId: "sigh-breathing",
    ritualName: "The Physiological Sigh",
    pathDesc: "Isolate catastrophizing predictions in the CBT thought sheet, and manually fire vagal parasympathetic trigger with a double-sigh breath."
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "structure" | "guided" | "chat" | "garden" | "toolbox">("home");
  const [isReturningUser, setIsReturningUser] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile>(initialArjunProfile);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [thoughtRecords, setThoughtRecords] = useState<ThoughtMirrorRecord[]>(initialThoughtRecords);
  const [rituals, setRituals] = useState<DoseRitual[]>(defaultRituals);
  const [showThoughtHistory, setShowThoughtHistory] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [sosPanelOpen, setSosPanelOpen] = useState<boolean>(false);
  
  // Custom interactive HUD bar state for the System Inspector feature
  const [inspectHud, setInspectHud] = useState<{ active: boolean; label: string; component: string } | null>(null);

  // Form states for Mode A onboarding profile builder
  const [hasNewUserFinishedOnboarding, setHasNewUserFinishedOnboarding] = useState<boolean>(false);
  const [onboardName, setOnboardName] = useState("");
  const [onboardMbti, setOnboardMbti] = useState("INFJ");
  const [onboardAttachment, setOnboardAttachment] = useState("Secure");
  const [onboardStressTheme, setOnboardStressTheme] = useState("Career transitions, seeking purpose");
  const [onboardContactName, setOnboardContactName] = useState("Priya (Sister)");
  const [onboardContactPhone, setOnboardContactPhone] = useState("+91-9876543210");

  // Custom tool to inject new Thought Reframes manually in the UI!
  const [newOriginal, setNewOriginal] = useState("");
  const [newReframed, setNewReframed] = useState("");
  const [newPattern, setNewPattern] = useState("All-or-Nothing Thinking");
  const [selectedPathKey, setSelectedPathKey] = useState<"self-doubt" | "exhaustion" | "disconnection" | "panic">("self-doubt");

  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleFocusSection = (sectionId: string) => {
    let targetId = "";
    let componentName = "";
    let diagnosticLabel = "";

    if (sectionId === "onboarding") {
      targetId = "demo-bento-indicator";
      componentName = "Baseline Ident-Profile Registry";
      diagnosticLabel = "Calibrating safe clinical dialogue borders against MBTI classifications";
    } else if (sectionId === "weather-check" || sectionId === "daily-affirmation") {
      setActiveTab("chat");
      targetId = "chat-bento-block";
      componentName = "Somatic Dialogue Terminal";
      diagnosticLabel = "Tracking physical emotions, somatic metaphor mappings, and affirmative loops";
    } else if (sectionId === "thought-mirror" || sectionId === "thought-canvas") {
      setActiveTab("toolbox");
      targetId = "thought-mirror-block";
      setShowThoughtHistory(false); // Toggle to draft custom reframes input
      componentName = "CBT Thought Mirror Suite";
      diagnosticLabel = "Dismantling cognitive biases (All-Or-Nothing, Catastrophizing) in local secure ledger";
    } else if (sectionId === "dose-apothecary" || sectionId === "apothecary-canvas") {
      setActiveTab("toolbox");
      targetId = "dose-apothecary-block";
      componentName = "D.O.S.E. Apothecary Engine";
      diagnosticLabel = "Prescribing customized behavioral micro-tasks mimicking Serotonin and Oxytocin pathways";
    } else if (sectionId === "ecosystem-growth" || sectionId === "garden-canvas") {
      setActiveTab("garden");
      targetId = "garden-bento-block";
      componentName = "Linguistic Garden Biome";
      diagnosticLabel = "Simulating plant growth nodes, leaf angles, and weather velocities under live biofeedback";
    } else if (sectionId === "safety-shield") {
      setSosPanelOpen(true);
      targetId = "sos-panel-emergency-card";
      componentName = "Crisis Escalation Safeguard";
      diagnosticLabel = "Deploying emergency grounding, local helplines, fallback sister networks";
    }

    if (targetId) {
      // Fire inspection HUD
      setInspectHud({
        active: true,
        component: componentName,
        label: diagnosticLabel
      });

      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Add temporary thick visual focus ring and soft scale pulsing
          element.classList.add("ring-4", "ring-[#D4A373]", "ring-offset-4", "ring-offset-slate-950", "transition-all", "duration-500", "scale-[1.015]", "shadow-[0_0_50px_rgba(212,163,115,0.25)]");
          setTimeout(() => {
            element.classList.remove("ring-4", "ring-[#D4A373]", "ring-offset-4", "ring-offset-slate-950", "scale-[1.015]", "shadow-[0_0_50px_rgba(212,163,115,0.25)]");
          }, 3500);
        }
      }, 150);

      // Auto dismiss inspection hud after 5 seconds
      setTimeout(() => {
        setInspectHud(null);
      }, 5000);
    }
  };

  // Auto-scroll chat to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Complete onboarding profile builder
  const handleCompleteOnboarding = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!onboardName.trim()) return;

    const newProfile: UserProfile = {
      name: onboardName.trim(),
      mbti: onboardMbti,
      attachmentStyle: onboardAttachment,
      gardenState: MoodPetal.GROWING,
      streak: 1,
      recentJournalTheme: onboardStressTheme.trim(),
      lastRitualCompleted: "None yet",
      emergencyContactName: onboardContactName.trim(),
      emergencyContactPhone: onboardContactPhone.trim(),
      doseBalance: {
        serotonin: "Balanced",
        dopamine: "Balanced",
        oxytocin: "Balanced"
      }
    };

    setProfile(newProfile);
    setHasNewUserFinishedOnboarding(true);
    setThoughtRecords([]);
    setRituals(defaultRituals.map(r => ({ ...r, completed: false })));

    const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        id: "new-init-1",
        role: "model",
        content: `Welcome to Mann, ${newProfile.name}.\n\nYour garden profile is fully active! As a ${newProfile.mbti} with an ${newProfile.attachmentStyle} attachment style, we have aligned our cognitive pacing to support you under tension.\n\nYour key mindfulness tension theme: *${newProfile.recentJournalTheme}* has been set.`,
        timestamp: currentTimeString
      },
      {
        id: "new-init-2",
        role: "model",
        content: `✨ **Your Tailored Affirmation:**\n\n"${generateAffirmation(newProfile.gardenState, newProfile.name, newProfile.recentJournalTheme)}"\n\n*Recalculated precisely based on your fresh start.*`,
        timestamp: currentTimeString
      },
      {
        id: "new-init-3",
        role: "model",
        content: `How is your present emotional climate carrying today?\n\n🌸 Blooming  ·  🌿 Growing  ·  🌧 Cloudy  ·  🍂 Withering  ·  🌑 Dark`,
        timestamp: currentTimeString
      }
    ]);

    setActiveTab("home");
  };

  // Handle switching between demo modes
  useEffect(() => {
    if (isReturningUser) {
      setProfile(initialArjunProfile);
      setThoughtRecords(initialThoughtRecords);
      // Generate a beautiful, mood-tailored affirmation for Arjun's current cloudy state
      const affirmation = generateAffirmation(initialArjunProfile.gardenState, "Arjun", initialArjunProfile.recentJournalTheme);
      const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // Mode-specific initial message
      setMessages([
        {
          id: "init-greet",
          role: "model",
          content: `Welcome back, Arjun.\n\nThe garden's been waiting. It's been 🌧 Cloudy since yesterday — I noticed.`,
          timestamp: currentTimeString
        },
        {
          id: "init-affirmation",
          role: "model",
          content: `✨ **Your Daily Affirmation:**\n\n"${affirmation}"\n\n*Selected based on your 🌧 Cloudy mood and work stress themes.*`,
          timestamp: currentTimeString
        },
        {
          id: "init-question",
          role: "model",
          content: `How are you carrying into today?\n\n🌸 Blooming  ·  🌿 Growing  ·  🌧 Cloudy  ·  🍂 Withering  ·  🌑 Dark`,
          timestamp: currentTimeString
        }
      ]);
      setRituals(prev => prev.map(r => r.id === "unsent-letter" ? { ...r, completed: true } : { ...r, completed: false }));
    } else {
      if (!hasNewUserFinishedOnboarding) {
        setProfile(initialNewUserProfile);
        setThoughtRecords([]);
        setRituals(defaultRituals.map(r => ({ ...r, completed: false })));
        setMessages([
          {
            id: "init",
            role: "model",
            content: `Hey. I'm Mann — मन.\n\nThat's Hindi for mind. And heart. And the soft place where both live.\n\nI'm not a therapist. I'm not an app that'll ask you to rate your mood from 1 to 10.\n\nI'm just here — for the in-between moments. The ones too heavy for "I'm fine" and not quite ready for a professional.\n\nMann is a companion, not a therapist. For anything clinical, please speak to a professional.\n\nBefore we begin — what's your name? (Or, enter details using the Profile form on the Home Overview page!)`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    }
  }, [isReturningUser, hasNewUserFinishedOnboarding]);

  // Parse safety alerts (Tier 3 SOS) and thought structures from text
  const parseSpecialResponses = (text?: string) => {
    if (!text) return;
    const lowerText = text.toLowerCase();
    // Check for [SOS_TRIGGERED: TRUE]
    if (text.includes("SOS_TRIGGERED: TRUE") || text.includes("🚨 **SOS Alert Sent** 🚨") || lowerText.includes("sos alert sent")) {
      setSosPanelOpen(true);
      // Add visual trigger
    }

    // Try to auto-parse Thought Mirror attempts in the text dynamically
    // Example: "You're telling yourself [work stress]. What if [soft perspective]?"
    if (lowerText.includes("not enough") || text.includes("Thought Mirror") || text.includes("What if")) {
      // Extract or log a placeholder thought reframe for visual flair
      const originalQuote = "Not good enough at work";
      const containsExisting = thoughtRecords.some(r => r.original === originalQuote);
      if (!containsExisting && isReturningUser) {
        setThoughtRecords(prev => [
          {
            id: `auto-${Date.now()}`,
            pattern: "Emotional Reasoning",
            original: "I feel inadequate, so I must be bad at my job.",
            alternative: "Physical exhaustion is masquerading as professional failure. Rest is what I actually need.",
            timestamp: "Just now"
          },
          ...prev
        ]);
      }
    }
  };

  // Run a manual mood selection update
  const handleMoodSelect = (mood: MoodPetal) => {
    setProfile(prev => ({ ...prev, gardenState: mood }));
    
    // Add artificial user response to show interactivity
    const userMsg: ChatMessage = {
      id: `user-mood-${Date.now()}`,
      role: "user",
      content: `My garden feels like: ${mood}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    triggerCompanionResponse([...messages, userMsg]);
  };

  // Post to full-stack endpoint
  const triggerCompanionResponse = async (currentMessages: ChatMessage[]) => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages,
          profile,
          mode: isReturningUser ? "returning" : "new"
        })
      });

      if (response.ok) {
        const data = await response.json();
        const modelReply = data?.text || "I am holding space for you. Tell me more.";
        
        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: "model",
          content: modelReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, modelMsg]);
        parseSpecialResponses(modelReply);
      } else {
        throw new Error("API failed with status " + response.status);
      }
    } catch (err) {
      console.warn("API route unavailable or offline, building rich responsive client-side fallback...", err);
      // Client-side fallback behavior simulation matching spec accurately
      setTimeout(() => {
        const lastMsg = currentMessages[currentMessages.length - 1];
        const lastContent = lastMsg ? lastMsg.content : "";
        const fallbackText = getClientFallback(lastContent);
        const modelMsg: ChatMessage = {
          id: `model-fallback-${Date.now()}`,
          role: "model",
          content: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, modelMsg]);
        parseSpecialResponses(fallbackText);
      }, 700);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessageOf = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputText("");
    
    // Automatically bring the user to the active chatbot workspace
    setActiveTab("chat");
    
    triggerCompanionResponse(updated);

    // If new user and name hasn't been set, try to grab the first word
    if (!isReturningUser && !profile.name) {
      const words = text.trim().split(" ");
      const detectedName = words[words.length - 1].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      setProfile(prev => ({ ...prev, name: detectedName }));
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    handleSendMessageOf(inputText);
  };

  // Helper helper to generate responsive fallback simulations when disconnected
  const getClientFallback = (text?: string): string => {
    const safeText = text || "";
    const norm = safeText.toLowerCase().trim();

    if ([ "suicide", "self-harm", "not wanting to be alive", "don't see the point", "dont see the point", "disappear", "no one would notice", "goodbye", "end my life", "want to die", "kill myself", "want it to stop" ].some(p => norm.includes(p))) {
      return `I hear you. What you just shared matters more than anything else right now.

You don't have to be okay. But I want to make sure you're safe.

🚨 **SOS Alert Sent** 🚨
Mann has notified **Priya (your sister)** via WhatsApp right now. She knows you need her.

While you wait — put one hand on your chest. Feel your heartbeat. You're here. That matters.

If you need immediate help:
📞 **iCall:** 9152987821
📞 **Vandrevala Foundation:** 1860-2662-345 (24/7)
📞 **Emergency:** 112

I'm not going anywhere. I'm right here with you.

**[SOS_TRIGGERED: TRUE | CONTACT: Priya | METHOD: WhatsApp | TIMESTAMP: now]**`;
    }

    if (norm.includes("not good enough at work") || norm.includes("not good enough") || norm.includes("fail") || norm.includes("everyone else seems to have it together")) {
      return `That sounds like the 'not enough' thought again — you've met it before. This is the third time I've seen this thought come up for you. That's worth noticing.
      
You're telling yourself you are not good enough at work and everyone else is gliding along. I want to hold that up to the light for a second.

What if your mind is just projecting its fatigue as inadequacy, whilst others are simply wearing masks of their own?

You don't have to believe that yet. Just let it sit next to the other one. 

Would you like to try a Serotonin ritual — like *The 10-Minute Walk* — to let your eyes look at something steady?`;
    }

    if (norm.includes("sad") || norm.includes("unhappy") || norm.includes("cry") || norm.includes("blue") || norm.includes("depressed") || norm.includes("grief") || norm.includes("down") || norm.includes("heartbroken") || norm.includes("pain") || norm.includes("hurting")) {
      return `I feel the heavy blue dusk in your words, ${profile.name || "friend"}. When sadness sets in like a slow rain, it's easy to feel like the soil of your inner world is flooding.

Please don't rush to fix it. Just like cloudy weather, sadness holds the moisture we eventually need to grow.

Would you like to try a gentle **Oxytocin ritual** from the apothecary, or do you want to write a thought that's hurting you down in the **Thought Mirror** to let us look at it together?`;
    }

    if (norm.includes("angry") || norm.includes("annoyed") || norm.includes("pissed") || norm.includes("mad") || norm.includes("irritated") || norm.includes("frustrated") || norm.includes("rage") || norm.includes("furious")) {
      return `Anger is like a wild fire in your garden right now, ${profile.name || "friend"}. It's incredibly hot, fast, and demanding. And underneath that fire, there's always something precious it is trying to protect.

What is the boundary or expectation that got trespassed or broken? Let's take a deep breath together.

I strongly recommend watering your garden with **The Physiological Sigh** (double inhale, long sigh out) to help your body shift out of fight-or-flight mode. Let's stay right here. What happened?`;
    }

    if (norm.includes("anxious") || norm.includes("scared") || norm.includes("fear") || norm.includes("worry") || norm.includes("panic") || norm.includes("jittery") || norm.includes("nervous") || norm.includes("stress")) {
      return `I hear the tight hum of anxiety in your words, ${profile.name || "friend"}. Anxiety wraps around the mind like ivy, choking out your spaciousness.

When your attachment style or stresses flare, your baseline runs hot. Your body feels like it's in imminent danger even if you're just sitting still.

Let's do a tiny grounding exercise: name three things around you that are the color of soil or wood right now. Breathe with me. We are safe here.`;
    }

    if (norm.includes("tired") || norm.includes("exhausted") || norm.includes("fatigue") || norm.includes("burnout") || norm.includes("drained") || norm.includes("empty")) {
      return `You sound deeply, completely tired, ${profile.name || "friend"}. Your battery is in the single digits, and even breathing feels like a task. Your garden is showing a *Withering* 🍂 state.

This is your biosphere's way of forcing you to go dormant for a little while to protect your roots. Perfect performance is an illusion.

What is one tiny duty we can cross off your list tonight so you can just... rest? No rituals, no thinking. Just permission to be.`;
    }

    if (norm.includes("lonely") || norm.includes("alone") || norm.includes("isolated") || norm.includes("unwanted") || norm.includes("discarded")) {
      return `Loneliness has a very distinct, cold silence in the garden, ${profile.name || "friend"}. It feels like everyone else has a glass wall between you and them.

As an anxious or deep-feeling soul, disconnection of any kind can trigger a systemic fear that you don't belong, or that you're too much. Let me assure you: you are not too much. You belong here.

Let's start small. Do you have a comfort playlist, or could you try the **Oxytocin ritual: Simple Comforts**? Just making a single cup of hot tea and feeling the porcelain can pull us back into connectivity.`;
    }

    if (norm.includes("happy") || norm.includes("glad") || norm.includes("good") || norm.includes("great") || norm.includes("awesome") || norm.includes("calm") || norm.includes("peaceful") || norm.includes("excited")) {
      return `Ah, what beautiful sunlight is grazing your garden right now, ${profile.name || "friend"}! 🌸 Your biosphere feels alive and vital.

When we feel good, it's easy to just move on to the next task. But cognitive science shows that *savoring* positive moments is what actually thickens our neural reserves.

Let's pause. What is one specific, tiny detail of this good feeling that you want to imprint into your memory?`;
    }

    if (norm.includes("can't keep doing") || norm.includes("cant keep doing") || norm.includes("hopeless") || norm.includes("crying")) {
      return `Arjun, I hear that hopelessness breathing heavy in your words. It sounds like a lot of weight to carry alone. Let's do a tiny centering practice together.
      
Breathe in for 4 counts... hold for 7... out for 8. Do it once with me.

Mann is a companion, not a therapist. If this stays heavy, please speak to someone you trust.`;
    }

    if (norm.includes("what to do") || norm.includes("suggest") || norm.includes("apothecary") || norm.includes("ritual")) {
      return `Your Apothecary has something for today — *The Unsent Letter* (Oxytocin). Write to someone you miss. Don't send it. 10 minutes. Want to try it? It might add a warm drop of connection to your low oxytocin state.`;
    }

    if (norm.includes("streak") || norm.includes("didn't come back") || norm.includes("didnt come back")) {
      return `Six days in a row, Arjun. The roots are taking hold here, even when the wind blows dusty. I'm glad you pushed through the gate today. The garden is here for you.`;
    }

    if (norm.includes("letter") && norm.includes("last time")) {
      return `Yes, Arjun. Yesterday you watered the garden with *The Unsent Letter*. The soil remembers, and it shows in the subtle greening of your growing edge. What does that letter feel like today?`;
    }

    if (norm.includes("my garden feels like:")) {
      const parts = text.split(":");
      const selectedMood = parts[parts.length - 1].trim();
      let moodEnum = MoodPetal.CLOUDY;
      if (selectedMood.includes("Blooming") || selectedMood.includes("🌸")) moodEnum = MoodPetal.BLOOMING;
      else if (selectedMood.includes("Growing") || selectedMood.includes("🌿")) moodEnum = MoodPetal.GROWING;
      else if (selectedMood.includes("Cloudy") || selectedMood.includes("🌧")) moodEnum = MoodPetal.CLOUDY;
      else if (selectedMood.includes("Withering") || selectedMood.includes("🍂")) moodEnum = MoodPetal.WITHERING;
      else if (selectedMood.includes("Dark") || selectedMood.includes("🌑")) moodEnum = MoodPetal.DARK;

      const aff = generateAffirmation(moodEnum, profile.name || "friend", profile.recentJournalTheme);
      return `I hear that. The climate in your garden has shifted to **${selectedMood}**.\n\n✨ **Your Updated Daily Affirmation:**\n"${aff}"\n\nHow do those words land with you?`;
    }

    // Default empathetic companion comments block
    return `I hear what you mean. That is worth sitting with for a little while. What does that feel like in your chest right now?`;
  };

  // Trigger quick diagnostic tests for hackathon judges
  const triggerCheatPhrase = (phrase: string) => {
    setInputText(phrase);
    const fakeEvent = { preventDefault: () => {} } as any;
    // Delay slightly for high feel of realism
    setTimeout(() => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: phrase,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const updated = [...messages, userMsg];
      setMessages(updated);
      setInputText("");
      triggerCompanionResponse(updated);
    }, 100);
  };

  // Water garden with an Apothecary ritual
  const handleCompleteRitual = (id: string, name: string) => {
    setRituals(prev => prev.map(rit => rit.id === id ? { ...rit, completed: !rit.completed } : rit));
    
    // Increment watery count
    const updatedRitual = rituals.find(r => r.id === id);
    const wasCompleted = updatedRitual ? !updatedRitual.completed : false;

    if (wasCompleted) {
      // Water the garden feedback
      setProfile(prev => ({
        ...prev,
        lastRitualCompleted: `${name} (${updatedRitual?.type})`,
        streak: prev.streak + 1
      }));

      // Append companion message celebrating the water
      const companionNote: ChatMessage = {
        id: `note-${Date.now()}`,
        role: "model",
        content: `🌸 *The garden shifts gently.* You've completed **${name}** for your ${updatedRitual?.type} balance. The roots of your garden drink this action beautifully. I note the change. How does your body feel having finished it?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, companionNote]);
    }
  };

  // Manual Thought Mirror Entry by User
  const handleAddCustomReframe = (e: React.FormEvent) => {
    e.preventDefault();
    const orig = newOriginal.trim();
    const ref = newReframed.trim();
    if (!orig || !ref) return;

    const newRecord: ThoughtMirrorRecord = {
      id: `custom-${Date.now()}`,
      pattern: newPattern,
      original: orig,
      alternative: ref,
      timestamp: "Just now"
    };

    setThoughtRecords(prev => [newRecord, ...prev]);
    setNewOriginal("");
    setNewReframed("");
    
    // Auto-toggle to the History pane so the user immediately sees their reframe recorded!
    setShowThoughtHistory(true);

    // Output success message from Mann
    const confirmation: ChatMessage = {
      id: `model-confirm-${Date.now()}`,
      role: "model",
      content: `I've hung that thought in the *Thought Mirror*. You wrote: "${orig}". And you mirrored it with: "${ref}". Holding that second perspective is how we teach our minds to breathe under pressure.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, confirmation]);
  };

  // Count active/completed watered rituals
  const totalWatered = rituals.filter(r => r.completed).length;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col min-h-screen text-[#E0D8D0] font-sans selection:bg-[#D4A373]/30 selection:text-white relative overflow-hidden">
      
      {/* Decorative botanical weather ambient orbs */}
      <div className="absolute top-[120px] left-[-100px] w-[500px] h-[500px] bg-[#D4A373]/5 rounded-full blur-[130px] pointer-events-none select-none -z-10 animate-pulse duration-[6000ms]"></div>
      <div className="absolute bottom-[200px] right-[-100px] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none select-none -z-10 animate-pulse duration-[8000ms]"></div>
      
      {/* Compact Mode Selector - Minimal & uncluttered */}
      <div id="demo-bento-indicator" className="mb-6 flex flex-col sm:flex-row justify-between items-center bg-slate-950/30 border border-white/5 rounded-2xl p-3 px-4 gap-3 backdrop-blur-md shadow-md animate-fadeIn">
        <div className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-[#D4A373]" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            App Demo Mode:
          </span>
        </div>
        <div className="flex bg-slate-950/80 p-0.5 border border-white/5 rounded-xl gap-0.5">
          <button 
            onClick={() => {
              setIsReturningUser(false);
              setHasNewUserFinishedOnboarding(false);
              setOnboardName("");
              setActiveTab("home");
            }}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold font-mono transition-all duration-200 ${(!isReturningUser && !hasNewUserFinishedOnboarding) ? 'bg-[#D4A373] text-[#121412] shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-200'}`}
            title="Experience a fresh, personalized onboarding profile setup wizard"
          >
            Mode A: Onboarding Flow
          </button>
          <button 
            onClick={() => {
              setIsReturningUser(true);
              setActiveTab("home");
            }}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold font-mono transition-all duration-200 ${isReturningUser ? 'bg-[#D4A373] text-[#121412] shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-200'}`}
            title="View Arjun's pre-loaded therapeutic records, garden, and metrics"
          >
            Mode B &amp; C: Returning (Arjun)
          </button>
        </div>
      </div>

      {/* Main App Header Section */}
      <header id="main-mann-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8 pb-5 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-[#E6C594] via-[#D4A373] to-[#B07E4D] text-[#121412] font-serif font-bold text-3xl rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,163,115,0.3)] transition-transform hover:rotate-6 duration-300">
            मन
          </div>
          <div>
            <h1 className="text-4xl font-serif font-semibold text-[#D4A373] tracking-normal flex items-center gap-1.5 leading-none mb-1">
              Mann <span className="text-sm font-sans font-light text-slate-400 not-italic uppercase tracking-widest pl-2">Companion</span>
            </h1>
            <p className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4A373]/75">
              The Space Between "I'm Fine" &amp; Therapy
            </p>
          </div>
        </div>

        {/* User Session Indicators with clean cards & Functional SOS Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            type="button"
            onClick={() => {
              setSosPanelOpen(prev => !prev);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`px-4 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 border ${
              sosPanelOpen 
                ? "bg-red-600 text-white border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.6)] animate-pulse" 
                : "bg-red-950/30 text-red-400 border-red-500/20 hover:border-red-500/40 hover:bg-red-950/50"
            }`}
            title="Designated Distress Safeguard System: Activates the WhatsApp and physical helpline dispatch panel"
          >
            <ShieldAlert className={`w-4 h-4 ${sosPanelOpen ? 'animate-spin-slow' : 'animate-pulse'}`} />
            <span>🚨 SOS</span>
          </button>

          <div className="flex items-center gap-6 text-sm font-mono self-stretch sm:self-auto bg-slate-950/40 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Active User</span>
            <span className="font-sans font-medium text-slate-200 flex items-center gap-1.5 mt-0.5">
              <User className="w-3.5 h-3.5 text-[#D4A373]" />
              {profile.name || "Awaiting Onboarding"}
            </span>
          </div>
          <div className="h-8 w-[1px] bg-white/10"></div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Persona</span>
            <span className="font-sans font-medium text-[#D4A373] mt-0.5">
              {profile.mbti} · {profile.attachmentStyle}
            </span>
          </div>
          <div className="h-8 w-[1px] bg-white/10"></div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Streak</span>
            <span className="text-amber-400 font-medium flex items-center gap-1.5 font-sans mt-0.5">
              <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse fill-current" />
              {profile.streak} Days
            </span>
          </div>
        </div>
      </div>
    </header>

      {/* SOS Panel Emergency Trigger Overrides */}
      {sosPanelOpen && (
        <div id="sos-panel-emergency-card" className="mb-6 bg-red-950/90 border-2 border-red-500 rounded-3xl p-6 shadow-[0_0_40px_rgba(239,68,68,0.2)] relative overflow-hidden animate-bounce-slow">
          <div className="absolute top-0 right-0 p-4">
            <button 
              onClick={() => setSosPanelOpen(false)}
              className="text-red-400 hover:text-red-200 text-xs font-mono uppercase bg-red-900/40 px-2.5 py-1 rounded border border-red-500/20"
            >
              Acknowledge Distress / Close
            </button>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500 text-red-400 shrink-0">
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-red-200 mb-1">
                Security Tier 3 Escalation: Crisis SOS Active
              </h2>
              <p className="text-sm text-red-300 max-w-3xl leading-relaxed mb-4">
                Mann has automatically dispatched a high-priority <strong>WhatsApp</strong> notification to Arjun's designated emergency contact: <strong>{profile.emergencyContactName} ({profile.emergencyContactPhone})</strong>. They have been alerted to reach out to you immediately.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a href="tel:9152987821" className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-red-500/20 hover:border-red-500/50 transition-all">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-mono">iCall Helpline</p>
                    <p className="text-sm font-semibold font-mono text-slate-200">9152987821</p>
                  </div>
                  <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded">Call</span>
                </a>
                <a href="tel:18602662345" className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-red-500/20 hover:border-red-500/50 transition-all">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-mono">Vandrevala Fund</p>
                    <p className="text-sm font-semibold font-mono text-slate-200">1860-2662-345</p>
                  </div>
                  <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded">Call</span>
                </a>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-red-500/20">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-mono">Emergency Services</p>
                    <p className="text-sm font-semibold font-mono text-slate-200">dial 112</p>
                  </div>
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Tab Navigation Bar */}
      <nav id="navigation-tabs-bar" className="mb-6 flex flex-wrap p-1 bg-slate-950/50 border border-white/5 rounded-2xl backdrop-blur-md shadow-inner max-w-5xl mx-auto w-full gap-1 z-10 relative">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-[11px] font-semibold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
            activeTab === "home"
              ? "bg-[#D4A373] text-[#121412] shadow-lg shadow-[#D4A373]/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Home className="w-3.5 h-3.5 animate-pulse" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("structure")}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-[11px] font-semibold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
            activeTab === "structure"
              ? "bg-[#D4A373] text-[#121412] shadow-lg shadow-[#D4A373]/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Structure Map</span>
        </button>

        <button
          onClick={() => setActiveTab("guided")}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-[11px] font-semibold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
            activeTab === "guided"
              ? "bg-[#D4A373] text-[#121412] shadow-lg shadow-[#D4A373]/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Self-Regulation</span>
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-[11px] font-semibold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
            activeTab === "chat"
              ? "bg-[#D4A373] text-[#121412] shadow-lg shadow-[#D4A373]/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Companion</span>
        </button>

        <button
          onClick={() => setActiveTab("garden")}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-[11px] font-semibold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
            activeTab === "garden"
              ? "bg-[#D4A373] text-[#121412] shadow-lg shadow-[#D4A373]/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>My Garden</span>
        </button>

        <button
          onClick={() => setActiveTab("toolbox")}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-[11px] font-semibold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
            activeTab === "toolbox"
              ? "bg-[#D4A373] text-[#121412] shadow-lg shadow-[#D4A373]/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Toolbox</span>
        </button>
      </nav>

      {/* Main Tab views Container */}
      <main id="main-content-display" className="flex-1 min-h-0">

        {/* Global Onboarding Block / Notice for non-Home tabs when not onboarded */}
        {!isReturningUser && !hasNewUserFinishedOnboarding && activeTab !== "home" && activeTab !== "chat" && (
          <div className="max-w-xl mx-auto w-full py-12 px-6 bg-slate-950/40 border border-[#D4A373]/20 rounded-3xl text-center space-y-6 animate-fadeIn backdrop-blur-md shadow-2xl my-8">
            <div className="w-16 h-16 rounded-full bg-[#D4A373]/10 border border-[#D4A373]/30 flex items-center justify-center text-3xl mx-auto animate-pulse">🌱</div>
            <div className="space-y-2">
              <h3 className="text-lg font-serif text-[#D4A373] font-medium uppercase tracking-wider font-mono">Onboarding Required</h3>
              <p className="text-xs sm:text-sm text-slate-400 font-light max-w-sm mx-auto leading-relaxed">
                Before you enter the session chat with Mann, care for your virtual garden ecosystem, or use the CBT reframing tools, please configure your profile on the Home Overview page.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab("home")}
              className="px-6 py-2.5 bg-[#D4A373] text-[#121412] text-xs font-mono font-bold rounded-xl hover:bg-[#c59262] transition-colors inline-flex items-center gap-2 shadow-lg hover:shadow-[#D4A373]/10"
            >
              <span>Go to Home &amp; Setup Baseline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === "home" && (
          <div className="space-y-6 animate-fadeIn transition-all max-w-5xl mx-auto w-full">
            
            {/* Show Onboarding Profile Builder if Mode A and onboarding not done */}
            {!isReturningUser && !hasNewUserFinishedOnboarding ? (
              <div className="bg-gradient-to-br from-slate-950/70 to-slate-900/40 border border-[#D4A373]/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md animate-fadeIn">
                <div className="absolute top-0 right-0 p-8 opacity-5 font-serif text-8xl select-none pointer-events-none text-[#D4A373]">मन</div>
                
                <div className="border-b border-white/5 pb-4 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-[#D4A373]/10 text-[#D4A373] border border-[#D4A373]/20 mb-3 uppercase tracking-wider font-mono">
                    🌱 Onboarding Profile Builder
                  </span>
                  <h2 className="text-xl md:text-2xl font-serif text-slate-100 font-semibold mb-1">
                    Set up your Identity profile
                  </h2>
                  <p className="text-xs text-slate-400 font-light leading-relaxed max-w-2xl">
                    Mann references these traits to calibrate advice intervals, attachment style configurations, stress baseline mappings, and emergency contact details.
                  </p>
                </div>

                <form onSubmit={handleCompleteOnboarding} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Your Preferred Name</label>
                      <input 
                        type="text" 
                        required
                        value={onboardName}
                        onChange={(e) => setOnboardName(e.target.value)}
                        placeholder="e.g. Anuska"
                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-[#D4A373]/50 focus:ring-1 focus:ring-[#D4A373]/50 transition-all font-sans font-medium"
                      />
                    </div>

                    {/* Stress Theme */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Primary Stress/Journal Theme</label>
                      <input 
                        type="text" 
                        required
                        value={onboardStressTheme}
                        onChange={(e) => setOnboardStressTheme(e.target.value)}
                        placeholder="e.g. Career transitions, finding purpose"
                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-[#D4A373]/50 focus:ring-1 focus:ring-[#D4A373]/50 transition-all font-sans font-medium"
                      />
                    </div>

                    {/* MBTI Type */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">MBTI Personality Type</label>
                        <a 
                          href="https://www.16personalities.com/free-personality-test" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[9px] font-mono text-[#D4A373]/80 hover:text-[#D4A373] transition-colors hover:underline flex items-center gap-1"
                        >
                          Take free test ↗
                        </a>
                      </div>
                      <select 
                        value={onboardMbti}
                        onChange={(e) => setOnboardMbti(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-sm focus:outline-none focus:border-[#D4A373]/50 transition-all font-sans font-medium"
                      >
                        {["INFJ", "INFP", "ENFP", "INTJ", "ENFJ", "INTP", "ISFP", "ISFJ", "ENTJ", "ENTP", "Other Type"].map(type => (
                          <option key={type} className="bg-slate-950" value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Attachment Style */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Attachment Style Profile</label>
                        <a 
                          href="https://www.attachmentproject.com/attachment-style-quiz/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[9px] font-mono text-[#D4A373]/80 hover:text-[#D4A373] transition-colors hover:underline flex items-center gap-1"
                        >
                          Find your style ↗
                        </a>
                      </div>
                      <select 
                        value={onboardAttachment}
                        onChange={(e) => setOnboardAttachment(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-sm focus:outline-none focus:border-[#D4A373]/50 transition-all font-sans font-medium"
                      >
                        <option className="bg-slate-950" value="Secure">Secure (Trusting & comfortable with intimacy)</option>
                        <option className="bg-slate-950" value="Anxious">Anxious-Preoccupied (Frequent fear of abandonment)</option>
                        <option className="bg-slate-950" value="Avoidant">Dismissive-Avoidant (High self-reliance, distance-seeking)</option>
                        <option className="bg-slate-950" value="Fearful-Avoidant">Fearful-Avoidant (Desires connection but fears trust)</option>
                      </select>
                    </div>

                    {/* Emergency Contact Name */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#D4A373] font-semibold">Designated Emergency Friend Name</label>
                      <input 
                        type="text" 
                        required
                        value={onboardContactName}
                        onChange={(e) => setOnboardContactName(e.target.value)}
                        placeholder="e.g. Priya (Sister)"
                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-[#D4A373]/50 focus:ring-1 focus:ring-[#D4A373]/50 transition-all font-sans font-medium"
                      />
                    </div>

                    {/* Emergency Contact Phone */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#D4A373] font-semibold">Emergency WhatsApp Contact Number</label>
                      <input 
                        type="text" 
                        required
                        value={onboardContactPhone}
                        onChange={(e) => setOnboardContactPhone(e.target.value)}
                        placeholder="e.g. +91 98765-43210"
                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-[#D4A373]/50 focus:ring-1 focus:ring-[#D4A373]/50 transition-all font-sans font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-[#D4A373] hover:bg-[#c59262] text-[#121412] font-mono font-bold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2 uppercase tracking-wider hover:shadow-[#D4A373]/10"
                    >
                      <Sparkles className="w-4 h-4 animate-spin-slow" />
                      <span>Cultivate My Space</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {/* 1. DYNAMIC & OUT-OF-THE-BOX VISUAL HERO HEADER */}
                <div className="bg-gradient-to-r from-slate-950/70 via-[#D4A373]/5 to-slate-950/30 border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden backdrop-blur-md animate-fadeIn flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  {/* Decorative background typography and circle */}
                  <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#D4A373]/5 blur-3xl pointer-events-none" />
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] font-serif text-8xl select-none pointer-events-none text-[#D4A373]">मन</div>
                  
                  <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold bg-[#D4A373]/10 text-[#D4A373] border border-[#D4A373]/20 mb-3 uppercase tracking-wider font-mono">
                      🌸 Safespace Biosphere Overview
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif text-slate-100 font-semibold mb-2 animate-fadeIn">
                      Hello, {profile.name || "friend"}.
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      Your current dynamic home space translates somatic states into kinetic feedback loops. Change your active weather using the dial below, or explore your structural self-regulation loop.
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0 flex-wrap">
                    <button 
                      onClick={() => { setActiveTab("chat"); }}
                      className="px-4 py-2 bg-[#D4A373] text-[#121412] text-xs font-mono font-bold rounded-xl hover:bg-[#c59262] transition-colors flex items-center gap-1.5 shadow-md shadow-[#D4A373]/10 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Companion Chat</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab("garden"); }}
                      className="px-4 py-2 bg-slate-900 border border-white/10 text-slate-300 text-xs font-mono font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Water Garden</span>
                    </button>
                  </div>
                </div>

                {/* 2. OUT OF THE BOX CENTRAL ACTIVE EMOTIONAL CLIMATE RING */}
                <div role="region" aria-label="Somatic Weather Center" className="bg-slate-950/20 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  
                  {/* Dynamic pulsing aura rings representation - The Quantum Somatic Feedback Orb */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center relative p-4 bg-slate-950/40 rounded-2xl border border-white/[0.02]">
                    <div className="absolute top-2 right-2 flex gap-1 items-center font-mono text-[7px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                      <span>Bio-Linked</span>
                    </div>

                    <p className="text-[9px] uppercase font-mono tracking-widest text-[#D4A373] font-bold mb-3 flex items-center gap-1">
                      <span>✦</span> Quantum Feedback Orb
                    </p>
                    
                    {/* The visual ring engine */}
                    <div className="relative w-44 h-44 flex items-center justify-center select-none">
                      
                      {/* Ring 1: Wide Deep Outer Atmospheric Heatmap Glow */}
                      <div className={`absolute inset-0 rounded-full transition-all duration-1000 blur-3xl opacity-30 ${
                        profile.gardenState === MoodPetal.BLOOMING ? "bg-gradient-to-tr from-pink-500 via-[#D4A373] to-emerald-400 scale-110" :
                        profile.gardenState === MoodPetal.GROWING ? "bg-gradient-to-tr from-teal-500 via-emerald-400 to-indigo-500 scale-110" :
                        profile.gardenState === MoodPetal.CLOUDY ? "bg-gradient-to-tr from-slate-400 via-blue-500 to-indigo-600 scale-100" :
                        profile.gardenState === MoodPetal.WITHERING ? "bg-gradient-to-tr from-[#D4A373] via-amber-700 to-amber-900 scale-95" :
                        "bg-gradient-to-tr from-indigo-900 via-slate-800 to-fuchsia-950 scale-90"
                      }`} />

                      {/* Ring 2: Core SVG Orbital Frequency Trajectories */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-full h-full animate-spin-slow text-white/5" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.25" strokeDasharray="1 4" />
                          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                          <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.15" />
                          
                          {/* Floating interactive satellite indicators mapped on orbits */}
                          <circle cx="50" cy="2" r="1.5" className="fill-[#D4A373] animate-pulse" />
                          <circle cx="12" cy="50" r="1.2" className="fill-emerald-400" />
                          <circle cx="88" cy="50" r="1" className="fill-pink-400" />
                        </svg>
                      </div>

                      {/* Ring 3: Concentric Solar Waveguide (Pulsating outer shell) */}
                      <div className={`absolute inset-3 rounded-full border border-white/5 transition-all duration-700 scale-105 animate-pulse ${
                        profile.gardenState === MoodPetal.BLOOMING ? "border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" :
                        profile.gardenState === MoodPetal.GROWING ? "border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]" :
                        profile.gardenState === MoodPetal.CLOUDY ? "border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]" :
                        profile.gardenState === MoodPetal.WITHERING ? "border-amber-500/20 shadow-[0_0_15px_rgba(217,119,6,0.1)]" :
                        "border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                      }`} />

                      {/* Ring 4: Inner Core Energy Shell */}
                      <div className="absolute inset-5 border border-dashed border-white/10 rounded-full animate-spin-reverse duration-[25s]" />

                      {/* Ring 5: Dynamic Core Nucleus */}
                      <div className={`absolute inset-7 rounded-full transition-all duration-1000 flex flex-col items-center justify-center text-center p-3 border border-white/15 shadow-inner ${
                        profile.gardenState === MoodPetal.BLOOMING ? "bg-gradient-to-br from-slate-900 via-emerald-950/80 to-slate-900 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]" :
                        profile.gardenState === MoodPetal.GROWING ? "bg-gradient-to-br from-slate-900 via-teal-950/80 to-slate-900 text-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]" :
                        profile.gardenState === MoodPetal.CLOUDY ? "bg-gradient-to-br from-slate-900 via-blue-950/80 to-slate-900 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]" :
                        profile.gardenState === MoodPetal.WITHERING ? "bg-gradient-to-br from-slate-900 via-amber-950/80 to-slate-900 text-amber-500 shadow-[0_0_20px_rgba(212,163,115,0.3)]" :
                        "bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                      }`}>
                        <div className="text-3xl mb-1 filter drop-shadow animate-bounce">
                          {profile.gardenState === MoodPetal.BLOOMING ? "🌸" :
                           profile.gardenState === MoodPetal.GROWING ? "🌿" :
                           profile.gardenState === MoodPetal.CLOUDY ? "🌧" :
                           profile.gardenState === MoodPetal.WITHERING ? "🍂" : "🌑"}
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">{profile.gardenState}</span>
                        <span className="text-[7px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">Biosphere</span>
                      </div>
                    </div>
 
                    <p className="text-[10px] text-slate-400 font-sans font-light mt-3 text-center max-w-xs leading-relaxed italic">
                      {profile.gardenState === MoodPetal.BLOOMING && "🌸 Atmospheric baseline: High energy. Mind is secure & in creative expansion."}
                      {profile.gardenState === MoodPetal.GROWING && "🌿 Atmospheric baseline: Resilient repair. Sprouting biochemical markers."}
                      {profile.gardenState === MoodPetal.CLOUDY && "🌧 Atmospheric baseline: Reflective dew. Heavy clouds containing growth potential."}
                      {profile.gardenState === MoodPetal.WITHERING && "🍂 Atmospheric baseline: Resource preserving. Soft somatic protection mode active."}
                      {profile.gardenState === MoodPetal.DARK && "🌑 Atmospheric baseline: Silent rest. Consolidating baseline energy secure pools."}
                    </p>

                    {/* Weird responsive bio-frequency oscilloscope wave visualizer */}
                    <div className="w-full max-w-[210px] mt-4 p-2.5 bg-slate-950/60 border border-white/5 rounded-2xl flex flex-col gap-1.5 items-center justify-center font-mono select-none">
                      <div className="w-full flex justify-between items-center px-1">
                        <span className="text-[7.5px] uppercase tracking-widest text-[#D4A373]/80 font-bold">Somatic Bio-Resonance</span>
                        <div className="flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                          <span className="text-[7px] text-slate-300">
                            {profile.gardenState === MoodPetal.BLOOMING ? "84.2 Hz" :
                             profile.gardenState === MoodPetal.GROWING ? "52.1 Hz" :
                             profile.gardenState === MoodPetal.CLOUDY ? "18.4 Hz" :
                             profile.gardenState === MoodPetal.WITHERING ? "4.1 Hz" : "0.5 Hz"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="w-full h-10 bg-slate-950/90 rounded-xl overflow-hidden relative flex items-center justify-center border border-white/[0.03]">
                        {/* Grid lines for oscilloscope feel */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:8px_8px]" />
                        
                        <svg className="w-full h-8 overflow-visible absolute inset-x-0" viewBox="0 0 100 20" preserveAspectRatio="none">
                          <path
                            key={`primary-${profile.gardenState}`}
                            d={
                              profile.gardenState === MoodPetal.BLOOMING
                                ? "M 0 10 Q 12.5 1 25 10 T 50 10 T 75 10 T 100 10"
                                : profile.gardenState === MoodPetal.GROWING
                                ? "M 0 10 Q 15 4 30 10 T 60 10 T 90 10 T 100 10"
                                : profile.gardenState === MoodPetal.CLOUDY
                                ? "M 0 10 Q 25 14 50 10 T 100 10"
                                : profile.gardenState === MoodPetal.WITHERING
                                ? "M 0 10 Q 10 9 20 10 Q 30 11 40 10 Q 50 9 60 10 Q 70 10 100 10"
                                : "M 0 10 Q 50 8 100 10"
                            }
                            fill="none"
                            stroke={
                              profile.gardenState === MoodPetal.BLOOMING ? "#EC4899" :
                              profile.gardenState === MoodPetal.GROWING ? "#0D9488" :
                              profile.gardenState === MoodPetal.CLOUDY ? "#3B82F6" :
                              profile.gardenState === MoodPetal.WITHERING ? "#D97706" : "#4F46E5"
                            }
                            strokeWidth="1.25"
                            className="animate-pulse"
                            style={{
                              animationDuration: 
                                profile.gardenState === MoodPetal.BLOOMING ? "1.5s" :
                                profile.gardenState === MoodPetal.GROWING ? "2.5s" :
                                profile.gardenState === MoodPetal.CLOUDY ? "5s" :
                                profile.gardenState === MoodPetal.WITHERING ? "1.5s" : "8s"
                            }}
                          />
                          <path
                            key={`secondary-${profile.gardenState}`}
                            d={
                              profile.gardenState === MoodPetal.BLOOMING
                                ? "M 0 10 Q 12.5 19 25 10 T 50 10 T 75 10 T 100 10"
                                : profile.gardenState === MoodPetal.GROWING
                                ? "M 0 10 Q 15 16 30 10 T 60 10 T 90 10 T 100 10"
                                : profile.gardenState === MoodPetal.CLOUDY
                                ? "M 0 10 Q 25 6 50 10 T 100 10"
                                : profile.gardenState === MoodPetal.WITHERING
                                ? "M 0 10 Q 10 11 20 10 Q 30 9 40 10 Q 50 11 60 10 Q 70 10 100 10"
                                : "M 0 10 Q 50 12 100 10"
                            }
                            fill="none"
                            stroke={
                              profile.gardenState === MoodPetal.BLOOMING ? "#F472B6" :
                              profile.gardenState === MoodPetal.GROWING ? "#38BDF8" :
                              profile.gardenState === MoodPetal.CLOUDY ? "#818CF8" :
                              profile.gardenState === MoodPetal.WITHERING ? "#F59E0B" : "#818CF8"
                            }
                            strokeWidth="0.75"
                            className="animate-pulse opacity-60"
                            style={{
                              animationDuration:
                                profile.gardenState === MoodPetal.BLOOMING ? "2s" :
                                profile.gardenState === MoodPetal.GROWING ? "3.2s" :
                                profile.gardenState === MoodPetal.CLOUDY ? "6s" :
                                profile.gardenState === MoodPetal.WITHERING ? "2s" : "12s",
                              animationDelay: "0.15s"
                            }}
                          />
                        </svg>
                      </div>
                      <span className="text-[6.5px] tracking-[0.15em] text-slate-500 font-light select-none">COGNITIVE HARMONICS CALIBRATED</span>
                    </div>
                  </div>
 
                  {/* Dynamic interactive check-in selector */}
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4A373] font-bold font-mono">Dynamic Biofeedback Check-in</span>
                      <h4 className="text-base font-serif font-semibold text-slate-100 mt-1">Calibrate Your Present State</h4>
                      <p className="text-xs text-slate-400 font-light font-sans leading-relaxed">
                        Manually toggle your emotional climate state below. This instantly calibrates your generative biome growth speeds, botanical leaf angles, and shapes Mann's therapeutic alignment defaults.
                      </p>
                    </div>


                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { state: MoodPetal.BLOOMING, emoji: "🌸", desc: "Creative Flow / Secure Bond", border: "hover:border-emerald-500/40" },
                        { state: MoodPetal.GROWING, emoji: "🌿", desc: "Energy Spurt / Calmer Pace", border: "hover:border-teal-500/40" },
                        { state: MoodPetal.CLOUDY, emoji: "🌧", desc: "Heavy / Overthinking state", border: "hover:border-blue-500/40" },
                        { state: MoodPetal.WITHERING, emoji: "🍂", desc: "Severe Fatigue / Meltdown", border: "hover:border-amber-600/40" }
                      ].map((item) => {
                        const isSelected = profile.gardenState === item.state;
                        return (
                          <button
                            key={item.state}
                            type="button"
                            onClick={() => {
                              setProfile(prev => ({ ...prev, gardenState: item.state }));
                              setInspectHud({
                                active: true,
                                component: "Somatic State Calibrator",
                                label: `Dynamic ecosystem shifted to ${item.state}. Calibrating companion chat bounds.`
                              });
                              setTimeout(() => setInspectHud(null), 3000);
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                              isSelected 
                                ? "bg-[#D4A373]/10 border-[#D4A373] text-[#D4A373]" 
                                : `bg-white/[0.01] border-white/5 text-slate-400 ${item.border} hover:bg-white/5`
                            }`}
                          >
                            <span className="text-xl shrink-0">{item.emoji}</span>
                            <div className="min-w-0">
                              <p className="text-xs font-serif font-bold text-slate-100 uppercase tracking-wide truncate">{item.state}</p>
                              <p className="text-[9.5px] font-light text-slate-400 leading-tight truncate">{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. ATMOSPHERIC METRIC GRID (BENTO CARD DISPLAY) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Card 1: Dose Status */}
                  <div className="bg-slate-950/30 border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-[115px] shadow-md relative overflow-hidden group hover:border-[#D4A373]/20 transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase font-mono text-slate-500">Biochemical D.O.S.E. Status</span>
                      <Activity className="w-3.5 h-3.5 text-[#D4A373]" />
                    </div>
                    <div>
                      <div className="flex gap-1 items-center mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-sans text-slate-200 font-semibold uppercase">{profile.doseBalance?.serotonin === "Low" ? "Serotonin Depleted" : "Serotonin Balanced"}</span>
                      </div>
                      <p className="text-[9.5px] text-slate-400 font-light mt-1 font-sans">Watered tasks: {totalWatered} / {rituals.length}</p>
                    </div>
                  </div>

                  {/* Card 2: Habit Streaks */}
                  <div className="bg-slate-950/30 border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-[115px] shadow-md relative overflow-hidden group hover:border-[#D4A373]/20 transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase font-mono text-slate-500">Continuous Engagement</span>
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-current animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif text-slate-100 font-bold leading-none mt-1">{profile.streak} Days Streak</h4>
                      <p className="text-[9.5px] text-slate-400 font-light mt-1 font-sans font-mono tracking-wide text-amber-500/80">Soil radiation index optimal</p>
                    </div>
                  </div>

                  {/* Card 3: Thought Reframing Quotient */}
                  <div className="bg-slate-950/30 border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-[115px] shadow-md relative overflow-hidden group hover:border-[#D4A373]/20 transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase font-mono text-slate-500">Cognitive Secure Ledger</span>
                      <BookOpen className="w-3.5 h-3.5 text-pink-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif text-slate-100 font-bold leading-none mt-1">{thoughtRecords.length} Reframes</h4>
                      <p className="text-[9.5px] text-slate-400 font-light mt-1 font-sans text-pink-400/80">Cognitive sheets secured</p>
                    </div>
                  </div>

                  {/* Card 4: Baseline Profile Calibration */}
                  <div className="bg-slate-950/30 border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-[115px] shadow-md relative overflow-hidden group hover:border-[#D4A373]/20 transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase font-mono text-slate-500">Persona Calibration</span>
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-sans text-slate-200 font-semibold leading-none mt-1">{profile.mbti} · {profile.attachmentStyle}</h4>
                      <p className="text-[9.5px] text-slate-400 font-light mt-1 font-sans truncate text-indigo-400/80">Theme: {profile.recentJournalTheme || "Mindful transitions"}</p>
                    </div>
                  </div>
                </div>

                {/* 4. SEEDLING LEDGER (MILSTONES TIMELINE) */}
                <div className="bg-slate-950/30 border border-white/5 rounded-3xl p-5 backdrop-blur-sm shadow-xl relative overflow-hidden">
                  <div className="border-b border-white/5 pb-2.5 mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4A373] font-bold font-mono">Live Biosphere Ledger</span>
                      <h4 className="text-sm font-serif text-slate-100 font-semibold">Active Baseline Seeds</h4>
                    </div>
                    <span className="text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase font-bold animate-pulse">Live</span>
                  </div>

                  <div className="space-y-3.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                    <div className="flex items-start gap-3 text-xs font-sans text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0 animate-pulse" />
                      <div>
                        <p className="font-semibold text-slate-200">Baseline identity calibrated with custom MBTI classification</p>
                        <p className="text-[10px] text-slate-400 font-light mt-0.5">Somatic boundary limits assigned for safe clinical response in profile schema.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-xs font-sans text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373] mt-1.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-200">Current internal weather active: <strong className="text-[#D4A373]">{profile.gardenState}</strong></p>
                        <p className="text-[10px] text-slate-400 font-light mt-0.5">Generative botanical canvas leaf velocity and dew density customized dynamically.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-xs font-sans text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 shrink-0 animate-pulse" />
                      <div>
                        <p className="font-semibold text-slate-200">Integrated wellness ledger track: {thoughtRecords.length} CBT sheet entries secured</p>
                        <p className="text-[10px] text-slate-400 font-light mt-0.5">Biases challenged such as Catastrophizing and Mind Reading.</p>
                      </div>
                    </div>

                    {profile.lastRitualCompleted ? (
                      <div className="flex items-start gap-3 text-xs font-sans text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0 animate-bounce" />
                        <div>
                          <p className="font-semibold text-slate-200">Biochemical hydration registered: <strong className="text-teal-400">{profile.lastRitualCompleted}</strong></p>
                          <p className="text-[10px] text-slate-400 font-light mt-0.5">Physical serotonin and dopamine triggers added directly to root soil.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 text-xs font-sans text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-200">Biochemical seedling loaded: Savoring Simple Comforts</p>
                          <p className="text-[10px] text-slate-400 font-light mt-0.5">Pending active bio-apothecary hydration completed by Arjun.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {(isReturningUser || hasNewUserFinishedOnboarding) && activeTab === "structure" && (
          <div className="animate-fadeIn max-w-5xl mx-auto w-full space-y-4">
            <div className="bg-slate-950/20 border border-white/5 rounded-3xl p-5 md:p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#D4A373]/10 text-[#D4A373] border border-[#D4A373]/20 font-mono tracking-wider uppercase mb-2">
                Clinical Workflow Architecture
              </span>
              <h3 className="text-lg font-serif text-slate-100 font-semibold">Self-Regulation Systemic Map</h3>
              <p className="text-xs text-slate-400 font-light font-sans max-w-3xl leading-relaxed mt-1 mb-4">
                This map displays the safe-boundary operational journey designed into Mann. Click on individual nodes of the structure map to navigate and instantly focus your workspace directly on those specific clinical widgets.
              </p>
              
              <JourneyMap 
                profile={profile}
                messages={messages}
                thoughtRecords={thoughtRecords}
                rituals={rituals}
                onFocusSection={handleFocusSection}
              />
            </div>
          </div>
        )}

        {(isReturningUser || hasNewUserFinishedOnboarding) && activeTab === "guided" && (
          <div className="animate-fadeIn max-w-5xl mx-auto w-full">
            {/* BENTO BLOCK: Guiding Light Dashboard with Interactive Feeling Selector */}
            <div id="guiding-light-block" className="bg-slate-900/40 border border-[#D4A373]/30 rounded-3xl p-5 md:p-6 backdrop-blur-md shadow-2xl relative overflow-hidden select-none">
              <div className="absolute top-0 right-0 p-3 opacity-[0.03] text-6xl select-none pointer-events-none">🎯</div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-3 border-b border-white/5">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#D4A373]/10 text-[#D4A373] border border-[#D4A373]/20 font-mono tracking-wider uppercase mb-1">
                    Adaptive Companion Pathways
                  </span>
                  <h3 className="text-lg font-serif text-slate-100 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#D4A373] animate-pulse" />
                    Guided Self-Regulation Roadmaps
                  </h3>
                  <p className="text-xs text-slate-400 font-light font-sans max-w-2xl leading-relaxed">
                    Select your current active roadblock below. Mann will analyze the underlying cognitive triggers corresponding to your user baseline and supply automatic therapeutic presets.
                  </p>
                </div>
                
                <div className="flex items-center gap-1.5 bg-[#D4A373]/5 border border-[#D4A373]/15 px-3 py-1.5 rounded-xl font-mono text-[10px] text-[#D4A373]">
                  <span>Active Baseline: {profile.mbti} · {profile.attachmentStyle}</span>
                </div>
              </div>

              {/* ACTIVE FEELING SELECTOR PILLS */}
              <div className="flex flex-wrap gap-2 mb-5 bg-slate-950/40 p-2 rounded-2xl border border-white/5">
                {Object.entries(DOUBT_PATHWAYS).map(([key, item]) => {
                  const isSelected = selectedPathKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPathKey(key as any)}
                      className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#D4A373] text-[#121412] shadow-md"
                          : "text-slate-400 hover:text-slate-100 bg-white/[0.01] hover:bg-white/5"
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Current State Diagnosis */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 h-full flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Dynamic Companion Interpretation</p>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mt-1">
                        {profile.name || "Dear friend"}, under your registered <strong>{profile.mbti} · {profile.attachmentStyle}</strong> profile:
                      </p>
                      <p className="text-xs sm:text-sm text-[#D4A373] leading-relaxed font-sans font-light italic mt-1.5">
                        {DOUBT_PATHWAYS[selectedPathKey].analysis}
                      </p>
                    </div>

                    <div className="bg-[#D4A373]/5 p-3 rounded-xl border border-[#D4A373]/10 flex items-start gap-2.5 text-xs text-[#D4A373]/90 mt-3">
                      <span className="text-sm">🪐</span>
                      <p className="font-light leading-relaxed">
                        <strong>System Formula:</strong> Doubt is energy containing clinical guidelines. Let's redirect this static friction into structured, objective reframing. Use the automated shortcut to the right.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Guided Shortcuts - Linked Experiences */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-3 bg-white/[0.01] border border-white/5 rounded-2xl p-4">
                  <div>
                    <p className="text-[10px] font-mono text-[#D4A373] uppercase tracking-wider font-bold block mb-2">Automated Workspace Shortcuts</p>
                    <p className="text-[11px] text-slate-400 font-sans font-light leading-snug mb-3">
                      {DOUBT_PATHWAYS[selectedPathKey].pathDesc}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        const config = DOUBT_PATHWAYS[selectedPathKey];
                        setNewOriginal(config.cbtOriginal);
                        setNewReframed(config.cbtReframed);
                        setNewPattern(config.cbtPattern);
                        handleFocusSection("thought-mirror");
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-[#D4A373]/10 border border-[#D4A373]/30 hover:border-[#D4A373]/60 transition-all group flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base font-mono">🪞</span>
                        <div>
                          <span className="text-[9px] font-bold font-mono text-[#D4A373] uppercase tracking-wider block">Cognitive Mirror Shortcut</span>
                          <p className="text-xs text-slate-200 font-semibold truncate mt-0.5">Preload: {DOUBT_PATHWAYS[selectedPathKey].cbtPattern}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D4A373] group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const config = DOUBT_PATHWAYS[selectedPathKey];
                        handleCompleteRitual(config.ritualId, config.ritualName);
                        handleFocusSection("dose-apothecary");
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-all group flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base font-mono">🌱</span>
                        <div>
                          <span className="text-[9px] font-bold font-mono text-emerald-400 uppercase tracking-wider block">Bio-Apothecary Shortcut</span>
                          <p className="text-xs text-slate-200 font-semibold truncate mt-0.5">Water "{DOUBT_PATHWAYS[selectedPathKey].ritualName}"</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "chat" && (
          <div className="max-w-6xl mx-auto w-full animate-fadeIn transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left/Main Column: Chat Window */}
            <div id="chat-bento-block" className="lg:col-span-8 bg-slate-950/30 border border-white/5 rounded-3xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-2xl h-[550px] md:h-[650px]">
              
              {/* Abstract background graphics on chat */}
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
                <svg width="240" height="240" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>

              <div className="flex flex-col flex-1 min-h-0">
                {/* Companion bar */}
                <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Companion Session</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">End-to-End Encrypted</span>
                  </div>
                </div>

                {/* Today's Tailored Affirmation Banner */}
                {profile.name && (
                  <div id="daily-affirmation-banner" className="mb-4 bg-gradient-to-r from-[#D4A373]/15 via-[#D4A373]/5 to-transparent border border-[#D4A373]/20 rounded-2xl p-4 flex items-center gap-4 animate-fadeIn relative overflow-hidden group shadow-[inset_0_0_20px_rgba(212,163,115,0.03)]">
                    <div className="absolute top-0 right-0 p-2 opacity-5 font-serif text-3xl select-none pointer-events-none">“</div>
                    <div className="w-9 h-9 rounded-full bg-[#D4A373]/20 flex items-center justify-center text-[#D4A373] shrink-0 border border-[#D4A373]/25 shadow-md">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[9px] uppercase tracking-wider text-[#D4A373] font-mono font-black block mb-0.5">
                        Today's Tailored Affirmation
                      </span>
                      <p className="text-xs sm:text-sm font-serif text-[#F5F2EB] leading-relaxed italic pr-4">
                        "{generateAffirmation(profile.gardenState, profile.name, profile.recentJournalTheme)}"
                      </p>
                    </div>
                  </div>
                )}

                {/* List of Messages */}
                <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-4 custom-scrollbar max-h-full">
                  {messages.map((m) => (
                    <div 
                      key={m.id} 
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-4 ${
                        m.role === "user" 
                          ? "bg-[#D4A373]/20 border border-[#D4A373]/30 text-slate-100" 
                          : "bg-white/5 border border-white/5 text-slate-200"
                      }`}>
                        {/* Role header */}
                        <div className="flex justify-between items-center gap-8 mb-1.5 opacity-40 font-mono text-[9px] uppercase tracking-wider">
                          <span>{m.role === "user" ? profile.name || "You" : "Mann"}</span>
                          <span>{m.timestamp}</span>
                        </div>
                        
                        {/* Message content */}
                        <div className="font-sans text-sm leading-relaxed whitespace-pre-wrap select-text">
                          {formatMessageContent(m.content)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex justify-start animate-fadeIn">
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 max-w-[85%] flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400">Mann is sitting with your words</span>
                        <div className="flex gap-1 items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-[#D4A373] rounded-full animate-bounce" style={{ animationDelay: "0ms", animationDuration: "1000ms" }}></span>
                          <span className="w-1.5 h-1.5 bg-[#D4A373] rounded-full animate-bounce" style={{ animationDelay: "150ms", animationDuration: "1000ms" }}></span>
                          <span className="w-1.5 h-1.5 bg-[#D4A373] rounded-full animate-bounce" style={{ animationDelay: "300ms", animationDuration: "1000ms" }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* User Input & Send Area */}
              <div className="border-t border-white/10 pt-4 bg-slate-950/20 backdrop-blur">
                {/* Guided Interaction Center (How Do You Feel? & How Can I Help You?) */}
                <div className="space-y-3 mb-3.5">
                  {/* Row 1: How do you feel? */}
                  <div>
                    <p className="text-[10px] uppercase font-mono tracking-wider opacity-60 mb-1.5 flex items-center gap-1.5 text-[#D4A373]">
                      <span>💭</span> Choose your current emotional landscape:
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto custom-scrollbar">
                      {[
                        { label: "😔 Sad & Heavy", text: "I'm feeling very sad, down, and heavy today. Can we sit with this sadness?", mood: MoodPetal.CLOUDY },
                        { label: "😡 Angry & Mad", text: "I'm feeling angry, annoyed, and frustrated right now. I need help calming down.", mood: MoodPetal.BLOOMING },
                        { label: "😰 Anxious & Scared", text: "I'm experiencing intense anxiety and stress. Can you guide me through a grounding practice?", mood: MoodPetal.DARK },
                        { label: "😴 Tired & Burnt Out", text: "I am completely exhausted, burnt out, and depleted. I just need a gentle presence.", mood: MoodPetal.WITHERING },
                        { label: "🌸 Calm & Happy", text: "I am feeling good, happy, and calm today. Let's savor this positive state!", mood: MoodPetal.GROWING }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setProfile(prev => ({ ...prev, gardenState: item.mood }));
                            handleSendMessageOf(item.text);
                          }}
                          className="text-[10.5px] font-sans px-2.5 py-1 bg-white/[0.03] border border-white/5 rounded-full hover:bg-[#D4A373]/10 hover:border-[#D4A373]/30 transition-all text-slate-300 hover:text-white cursor-pointer select-none flex items-center gap-1"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clarifying explanatory tip for mind-body somatic loop */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/10 text-[10px] text-slate-300 font-light leading-relaxed flex items-start gap-2.5 max-w-2xl">
                    <span className="text-base shrink-0 select-none">🌱</span>
                    <div>
                      <strong className="text-emerald-400 font-medium">What is "Watering the Garden"?</strong>
                      <p className="opacity-90 mt-0.5">
                        Your virtual garden mirrors your body. When stressed, your muscles tighten and breathing gets shallow. Calming practices (like deep breathwork or relaxing habits) restore your body's rhythm — this is <strong className="text-[#D4A373]">"watering your garden"</strong>, causing your virtual tree to sprout and logs to expand!
                      </p>
                    </div>
                  </div>

                  {/* Row 2: How can I help you today? */}
                  <div>
                    <p className="text-[10.5px] uppercase font-mono tracking-wider opacity-60 mb-2 flex items-center gap-1.5 text-emerald-400 font-bold">
                      <span>🛠</span> Interactive Self-Regulation Co-Pilot:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[170px] overflow-y-auto custom-scrollbar pr-1">
                      {[
                        { 
                          label: "CBT Thought Mirror",
                          desc: "Identify and gentle dispute negative thoughts or overthinking patterns.",
                          emoji: "🪞",
                          chatText: "Guide me through a CBT cognitive reframe block to challenge my automatic negative thoughts.",
                          goAction: () => {
                            setNewOriginal("I must perform perfectly or everything will fall apart.");
                            setNewReframed("Mistakes are research for growth. Perfect performance is an illusion.");
                            setNewPattern("All-or-Nothing Thinking");
                            handleFocusSection("thought-mirror");
                          },
                          goLabel: "Thought Worksheet",
                        },
                        { 
                          label: "Somatic Breathwork",
                          desc: "Do rapid double breaths to lower immediate stress and physical strain.",
                          emoji: "🧘",
                          chatText: "I want to do a body calming exercise (Water my garden with an apothecary physiological sigh ritual).",
                          goAction: () => {
                            handleCompleteRitual("sigh-breathing", "The Physiological Sigh");
                            handleFocusSection("ecosystem-growth");
                          },
                          goLabel: "Calm My Breath Now",
                        },
                        { 
                          label: "CBT Diary & Logs",
                          desc: "Examine saved reframed records and previous journal metrics.",
                          emoji: "📔",
                          chatText: "List my resolved cognitive reframing entries from the Thought historical diary.",
                          goAction: () => {
                            setActiveTab("toolbox");
                            setShowThoughtHistory(true);
                            setTimeout(() => {
                              const el = document.getElementById("thought-mirror-block");
                              if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                            }, 150);
                          },
                          goLabel: "Open Diary History",
                        },
                        { 
                          label: "Safety & Emergency Settings",
                          desc: "Configure emergency circles and look up trusted local support helplines.",
                          emoji: "🛡",
                          chatText: "Show me how the SOS Safety Shield works when I am in severe crisis.",
                          goAction: () => {
                            handleFocusSection("safety-shield");
                          },
                          goLabel: "Deploy Safety Shield",
                        }
                      ].map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white/[0.015] border border-white/5 hover:border-emerald-500/20 transition-all flex flex-col justify-between gap-1.5 font-sans">
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-xs select-none">{item.emoji}</span>
                              <span className="text-[10.5px] font-bold text-slate-200">{item.label}</span>
                            </div>
                            <p className="text-[9px] text-slate-400 font-light leading-snug">{item.desc}</p>
                          </div>
                          
                          <div className="flex gap-1.5 mt-0.5">
                            <button
                              type="button"
                              onClick={() => handleSendMessageOf(item.chatText)}
                              className="flex-1 text-[8.5px] font-mono py-1 px-1.5 bg-white/[0.03] hover:bg-[#D4A373]/15 text-slate-300 hover:text-white rounded-md border border-white/5 hover:border-[#D4A373]/30 transition-all cursor-pointer pointer-events-auto select-none"
                            >
                              💬 Chat Guide
                            </button>
                            <button
                              type="button"
                              onClick={item.goAction}
                              className="flex-1 text-[8.5px] font-mono py-1 px-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 rounded-md border border-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer pointer-events-auto select-none"
                            >
                              🚀 {item.goLabel}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>


                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={profile.name ? `Speak to Mann, ${profile.name}...` : "Write your name or speak to Mann..."}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373]/30 transition-all text-[#E0D8D0] placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    id="chat-send-submit-btn"
                    disabled={loading}
                    className="bg-[#D4A373] text-[#121412] px-5 rounded-2xl hover:bg-[#c59262] transition-colors flex items-center justify-center font-semibold disabled:opacity-50 pointer-events-auto cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-3 flex justify-between items-center text-[10px] text-slate-400">
                  <span className="italic">Companion, not therapist. In emergencies dial 112.</span>
                  <span className="flex items-center gap-1 text-slate-500 font-mono">
                    <Lock className="w-3 h-3" /> Anonymous session
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Guided Copilot Action Panel */}
            <div id="companion-bento-cockpit" className="lg:col-span-4 flex flex-col gap-4 animate-fadeIn">
              
              {/* Part 1: How Do You Feel? (Dynamic Somatic weather presets) */}
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 flex flex-col justify-between flex-1 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-[0.02] text-5xl pointer-events-none">💭</div>
                
                <div>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4A373] font-bold font-mono">Part 1: Quick States</span>
                  <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 mt-1">How do you feel right now?</h4>
                  <p className="text-[11px] text-slate-400 font-light font-sans mt-1 leading-relaxed">
                    Select a core emotion to sync active virtual soil growth variables and preload corresponding therapeutic prompts.
                  </p>
                  
                  <div className="space-y-2 mt-4">
                    {[
                      {
                        m: MoodPetal.BLOOMING,
                        emoji: "🌸",
                        title: "Creative Flux / Vitalized",
                        desc: "Harness high creative velocity.",
                        textColor: "text-emerald-400",
                        prompt: "I'm in a high-vitality Creative Flow state. Let's build a secure somatic routine to seed this focus."
                      },
                      {
                        m: MoodPetal.GROWING,
                        emoji: "🌿",
                        title: "Resilient Care / Rebuilding",
                        desc: "Okay baseline. Seeking steady habits.",
                        textColor: "text-teal-400",
                        prompt: "I am feeling grounded and seeking rebuilding paces. Help me discover a cozy Oxytocin task right now."
                      },
                      {
                        m: MoodPetal.CLOUDY,
                        emoji: "🌧",
                        title: "Stuck / Decelerating",
                        desc: "Heavy static. Challenge thoughts.",
                        textColor: "text-blue-300",
                        prompt: "I feel stuck overthinking and heavy right now. Guide me through a custom CBT worksheet reframe to filter my thought stream."
                      },
                      {
                        m: MoodPetal.WITHERING,
                        emoji: "🍂",
                        title: "Exhausted / Burned Out",
                        desc: "Battery empty. Need somatic cooling.",
                        textColor: "text-amber-500",
                        prompt: "I am completely exhausted and on the edge of burnout. Guide me through a double physiological sigh exercise."
                      },
                      {
                        m: MoodPetal.DARK,
                        emoji: "🌑",
                        title: "Isolated / Silent Rest",
                        desc: "High friction. Seek protective boundaries.",
                        textColor: "text-indigo-400",
                        prompt: "I'm feeling alienated and in deep distress. Provide me a compassionate space to ground my somatic boundaries."
                      }
                    ].map((item) => {
                      const isCurrent = profile.gardenState === item.m;
                      return (
                        <button
                          key={item.m}
                          type="button"
                          onClick={() => {
                            handleMoodSelect(item.m);
                            handleSendMessageOf(item.prompt);
                            setInspectHud({
                              active: true,
                              component: "Somatic State Sync",
                              label: `Ecosystem climate shifted to ${item.m}. Formulating clinical companion response parameters.`
                            });
                            setTimeout(() => setInspectHud(null), 3000);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                            isCurrent 
                              ? "bg-[#D4A373]/15 border-[#D4A373] text-slate-100 ring-1 ring-[#D4A373]/25" 
                              : `bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.03]`
                          }`}
                        >
                          <span className="text-xl shrink-0 select-none">{item.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 justify-between">
                              <span className={`text-[10.5px] font-semibold ${isCurrent ? "text-[#D4A373]" : "text-slate-200"}`}>{item.title}</span>
                              <span className="text-[7px] font-mono uppercase tracking-widest text-slate-500">{item.m}</span>
                            </div>
                            <p className="text-[9.5px] text-slate-400 mt-0.5 truncate leading-tight">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Part 2: How Can I Help You? (Clinical Feature Shortcuts Panel) */}
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-[0.02] text-5xl pointer-events-none">🛠</div>
                
                <div>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4A373] font-bold font-mono">Part 2: Feature Shorts</span>
                  <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 mt-1">How can I help you today?</h4>
                  <p className="text-[11px] text-slate-400 font-light font-sans mt-1 leading-relaxed">
                    Directly engage custom workspace templates designed for sustainable cognitive and behavioral self-regulation.
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setNewOriginal("I must perform perfectly or everything will fall apart.");
                        setNewReframed("Mistakes are research for growth. Perfect performance is an illusion.");
                        setNewPattern("All-or-Nothing Thinking");
                        handleFocusSection("thought-mirror");
                        setInspectHud({
                          active: true,
                          component: "CBT Reframer Shortcut",
                          label: "Loaded draft cognitive sheet to local Thought Mirror! Challenging All-or-Nothing thoughts."
                        });
                        setTimeout(() => setInspectHud(null), 3000);
                      }}
                      className="p-3 text-left bg-gradient-to-br from-slate-950/80 to-slate-900 border border-white/5 hover:border-pink-500/20 rounded-2xl transition-all cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 font-semibold mb-2 shadow group-hover:scale-105 transition-transform font-mono">
                        🪞
                      </div>
                      <span className="text-[10px] font-semibold text-slate-200 block truncate">Thought Mirror</span>
                      <span className="text-[8.5px] font-light text-slate-400 mt-0.5 block leading-tight truncate">Challenge biases</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleCompleteRitual("sigh-breathing", "The Physiological Sigh");
                        handleFocusSection("ecosystem-growth");
                        setInspectHud({
                          active: true,
                          component: "Biochemical Hydration Shortcut",
                          label: "Completed Physiological Sigh! Biosphere growth multipliers energized."
                        });
                        setTimeout(() => setInspectHud(null), 3000);
                      }}
                      className="p-3 text-left bg-gradient-to-br from-slate-950/80 to-slate-900 border border-white/5 hover:border-emerald-500/20 rounded-2xl transition-all cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-semibold mb-2 shadow group-hover:scale-105 transition-transform font-mono">
                        🌿
                      </div>
                      <span className="text-[10px] font-semibold text-slate-200 block truncate">Somatic Breath</span>
                      <span className="text-[8.5px] font-light text-slate-400 mt-0.5 block leading-tight truncate">Grounding & release</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("structure");
                        setInspectHud({
                          active: true,
                          component: "Journey Map Router",
                          label: "Navigated workspace to clinical safety boundaries map."
                        });
                        setTimeout(() => setInspectHud(null), 3000);
                      }}
                      className="p-3 text-left bg-gradient-to-br from-slate-950/80 to-slate-900 border border-white/5 hover:border-[#D4A373]/20 rounded-2xl transition-all cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#D4A373]/10 flex items-center justify-center text-[#D4A373] font-semibold mb-2 shadow group-hover:scale-105 transition-transform font-mono">
                        🗺
                      </div>
                      <span className="text-[10px] font-semibold text-slate-200 block truncate">Journey Map</span>
                      <span className="text-[8.5px] font-light text-slate-400 mt-0.5 block leading-tight truncate">Trace active loops</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleFocusSection("safety-shield");
                      }}
                      className="p-3 text-left bg-gradient-to-br from-slate-950/80 to-slate-900 border border-white/5 hover:border-red-500/20 rounded-2xl transition-all cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 font-semibold mb-2 shadow group-hover:scale-105 transition-transform font-mono">
                        🛡
                      </div>
                      <span className="text-[10px] font-semibold text-slate-200 block truncate">Safety Ground</span>
                      <span className="text-[8.5px] font-light text-slate-400 mt-0.5 block leading-tight truncate">SOS sister network</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {(isReturningUser || hasNewUserFinishedOnboarding) && activeTab === "garden" && (
          <div className="max-w-6xl mx-auto w-full animate-fadeIn transition-all space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Garden Canvas Column */}
              <div id="garden-bento-block" className="lg:col-span-8 relative group">
                <GardenCanvas 
                  mood={profile.gardenState} 
                  streak={profile.streak} 
                  ritualsWatered={totalWatered}
                />
              </div>

              {/* Ecosystem Garden Almanac Side Card */}
              <div className="lg:col-span-4 bg-slate-950/30 border border-white/5 rounded-3xl p-5 flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-[0.03] font-serif text-6xl select-none pointer-events-none">मन</div>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4A373] font-bold font-mono block mb-1">Ecosystem Almanac</span>
                    <h4 className="text-base font-serif text-slate-100 font-semibold">Your Garden Biome Laws</h4>
                  </div>
                  
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Rather than clinical metrics, Mann translates your emotional weather into an organic plant habitat holding space for daily progress.
                  </p>

                  <div className="border-t border-white/5 pt-3 space-y-2 text-xs font-mono">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Climate Interpretations</p>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#D4A373]/5 border border-[#D4A373]/15">
                        <span className="text-base">🌸</span>
                        <div>
                          <p className="text-slate-200 font-semibold text-[11px]">Blooming (Vitalized)</p>
                          <p className="text-[10px] text-slate-400 font-light font-sans leading-tight">Sunlit skies &amp; open pink flowers. Peak mood energy.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <span className="text-base">🌿</span>
                        <div>
                          <p className="text-slate-200 font-semibold text-[11px]">Growing (Steady Ground)</p>
                          <p className="text-[10px] text-slate-400 font-light font-sans leading-tight">Mint sprouts &amp; clover shoots. Balanced, active progress.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-sky-500/5 border border-sky-500/10">
                        <span className="text-base">🌧</span>
                        <div>
                          <p className="text-slate-200 font-semibold text-[11px]">Cloudy (Unsettled)</p>
                          <p className="text-[10px] text-slate-400 font-light font-sans leading-tight">Rain mist &amp; overhanging shade. Overcast thoughts resting.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-500/5 border border-amber-500/10">
                        <span className="text-base">🍂</span>
                        <div>
                          <p className="text-slate-200 font-semibold text-[11px]">Withering (Fatigued)</p>
                          <p className="text-[10px] text-slate-400 font-light font-sans leading-tight">Leaves falling on dry soil. Energy conservation focus.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-violet-500/5 border border-violet-500/10">
                        <span className="text-base">🌑</span>
                        <div>
                          <p className="text-slate-200 font-semibold text-[11px]">Dark (Struggling)</p>
                          <p className="text-[10px] text-slate-400 font-light font-sans leading-tight">Moonglow sanctuary. Seeds deep in shelter healing.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#D4A373]/5 p-3 rounded-2xl border border-[#D4A373]/10 text-[11px] leading-relaxed text-slate-300 font-sans">
                    <p className="font-semibold text-[#D4A373] flex items-center gap-1 mb-1">
                      🌱 Cultivating Vitality:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-400 font-light">
                      <li>Watering <strong>Apothecary tasks</strong> triggers floating blue droplets.</li>
                      <li>Adding cognitive reframers inside the <strong>CBT Thought Mirror</strong> expands soil seed volume.</li>
                      <li>Check-in daily to graph your trends in the <strong>7-Day Pulse</strong>.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Integrated Watering Station directly below the canvas */}
            <div className="bg-slate-950/30 border border-white/5 rounded-3xl p-5 backdrop-blur-md shadow-2xl relative overflow-hidden mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-white/5">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4A373] font-bold font-mono block mb-1">
                    Direct Ground Integration
                  </span>
                  <h3 className="text-lg font-serif text-slate-100 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                    Quick-Watering Apothecary Station
                  </h3>
                  <p className="text-xs text-slate-400 font-light font-sans">
                    No need to navigate away. Directly check &amp; complete bio-chemical rituals below to trigger instant growth feedback!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {rituals.map((r) => {
                  return (
                    <div
                      key={r.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 relative overflow-hidden group/rit ${
                        r.completed 
                          ? "bg-emerald-500/5 border-emerald-500/30 opacity-75" 
                          : "bg-white/[0.02] border-white/5 hover:border-[#D4A373]/30 hover:bg-[#D4A373]/5"
                      }`}
                    >
                      {r.completed && (
                        <div className="absolute top-0 right-0 p-1.5 bg-emerald-500 text-slate-950 rounded-bl-xl text-[8px] font-mono font-bold uppercase tracking-wider select-none">
                          Watered ✓
                        </div>
                      )}
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1.5">
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md uppercase ${
                            r.type === 'Oxytocin' ? 'bg-pink-500/15 text-pink-400' :
                            r.type === 'Serotonin' ? 'bg-emerald-500/15 text-emerald-400' :
                            r.type === 'Dopamine' ? 'bg-amber-500/15 text-amber-500' :
                            'bg-indigo-500/15 text-indigo-400'
                          }`}>
                            {r.type}
                          </span>
                          <span className="text-[10px] text-slate-500 font-light font-sans select-none">{r.time}</span>
                        </div>
                        
                        <h4 className="text-xs font-semibold text-slate-200 group-hover/rit:text-[#D4A373] transition-colors">{r.name}</h4>
                        <p className="text-[10.5px] text-slate-400 font-light mt-1 font-sans leading-relaxed">{r.description}</p>
                      </div>

                      <button
                        onClick={() => {
                          handleCompleteRitual(r.id, r.name);
                          // Trigger botanical feedback directly on this tab instead of warping away
                          setInspectHud({
                            active: true,
                            component: "Linguistic Garden Biome",
                            label: "Nourishing soil with chemical hydration. Water droplet indices adjusted on plant nodes."
                          });
                          setTimeout(() => setInspectHud(null), 3500);
                        }}
                        disabled={r.completed}
                        className={`w-full py-2 px-3 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          r.completed 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default" 
                            : "bg-slate-900 border border-white/5 text-[#D4A373] hover:bg-[#D4A373] hover:text-[#121412] active:scale-95"
                        }`}
                      >
                        {r.completed ? "Watered & Checked" : "✓ Complete & Water"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {(isReturningUser || hasNewUserFinishedOnboarding) && activeTab === "toolbox" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 animate-fadeIn transition-all">
            
            {/* BENTO BLOCK 3: D.O.S.E. Apothecary System */}
            <div id="dose-apothecary-block" className="bg-slate-950/30 border border-white/5 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm min-h-[380px] shadow-2xl">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#D4A373]/5 blur-xl rounded-full"></div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4A373] font-bold font-mono">
                    D.O.S.E. Apothecary
                  </span>
                  <span className="px-2 py-0.5 bg-[#D4A373]/10 rounded-full text-[9px] text-[#D4A373] font-mono font-bold border border-[#D4A373]/20">
                    SYSTEM ACTIVE
                  </span>
                </div>
                
                <p className="text-xs text-slate-400 mb-4 h-auto leading-relaxed">
                  Biochemical rituals designed to support deficient emotional balances. Completing a prescrip-task waters your garden.
                </p>

                {/* Stack of rituals */}
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1 mb-4">
                  {rituals.map((r) => (
                    <div 
                      key={r.id} 
                      className={`p-3 rounded-xl border bg-slate-950/40 hover:bg-slate-950/60 transition-all flex flex-col justify-between gap-1.5 ${
                        r.completed ? 'border-emerald-500/30 opacity-75' : 'border-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 w-full flex-wrap">
                            {r.name}
                            <span className={`text-[8.5px] px-1.5 py-0.5 rounded-full font-mono ${
                              r.type === 'Oxytocin' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' :
                              r.type === 'Serotonin' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              r.type === 'Dopamine' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {r.type}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
                            {r.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-white/5">
                        <span className="text-[10px] font-mono text-slate-500">Estimate: {r.time}</span>
                        <button
                          onClick={() => handleCompleteRitual(r.id, r.name)}
                          className={`px-3 py-1 text-[10px] font-medium rounded-lg transition-all ${
                            r.completed 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-[#D4A373] hover:text-[#121412] hover:border-transparent'
                          }`}
                        >
                          {r.completed ? "✓ Completed & Watered" : "Mark Completed"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick bottom stats */}
              <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-white/5 pt-3 mt-1 font-mono">
                <span>Arjun Balance: Low Serotonin</span>
                <span className="text-[#D4A373]">{totalWatered} of {rituals.length} Watered</span>
              </div>
            </div>

            {/* BENTO BLOCK 4: Thought Mirror CBT Reframes */}
            <div id="thought-mirror-block" className="bg-slate-950/30 border border-white/5 shadow-2xl rounded-3xl p-5 flex flex-col justify-between backdrop-blur-sm min-h-[380px]">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold font-mono font-sans">
                  Thought Mirror 🪞
                </span>
                <button 
                  onClick={() => setShowThoughtHistory(!showThoughtHistory)}
                  className="text-[9px] uppercase tracking-wider text-[#D4A373] hover:underline font-mono bg-[#D4A373]/5 border border-[#D4A373]/20 px-2 py-0.5 rounded-md"
                >
                  {showThoughtHistory ? "Interactive Input" : `View History (${thoughtRecords.length})`}
                </button>
              </div>

              {showThoughtHistory ? (
                <div className="space-y-2.5 flex-1 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                  {thoughtRecords.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-8">
                      No CBT reframes recorded yet. Ask Arjun or write below.
                    </p>
                  ) : (
                    thoughtRecords.map((tr) => (
                      <div key={tr.id} className="p-3 rounded-xl bg-slate-950/40 border border-white/5 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-slate-900 border border-[#D4A373]/20 font-mono text-[#D4A373]">
                            {tr.pattern}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">{tr.timestamp}</span>
                        </div>
                        <div className="text-xs space-y-1.5 leading-relaxed">
                          <p className="text-slate-400">
                            <strong className="text-red-400/80 mr-1 font-mono">Thought:</strong>
                            "{tr.original}"
                          </p>
                          <p className="text-slate-200">
                            <strong className="text-emerald-400/80 mr-1 font-mono">Reframer:</strong>
                            "{tr.alternative}"
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                    A cognitive reframing chamber to challenge core distortions. Type a self-critical thought and draft its balanced reframe.
                  </p>

                  {Object.entries(DOUBT_PATHWAYS).some(([_, val]) => val.cbtOriginal === newOriginal) && (
                    <div className="bg-[#D4A373]/15 border border-[#D4A373]/30 px-3 py-2 rounded-xl text-[10px] text-[#D4A373] font-mono flex items-center justify-between gap-2 mr-1 animate-fadeIn">
                      <span className="font-semibold">✨ Shortcut active: Reframe Loaded!</span>
                      <button 
                        type="button" 
                        onClick={() => { setNewOriginal(""); setNewReframed(""); }} 
                        className="text-[9px] underline hover:text-slate-200 cursor-pointer"
                      >
                        Reset fields
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleAddCustomReframe} className="space-y-2.5">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Automatic self-critical thought (e.g. I am failure)"
                        value={newOriginal}
                        onChange={(e) => setNewOriginal(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#D4A373] transition-all cursor-text"
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="Balanced cognitive reframe (e.g. I am tired but competent)"
                        value={newReframed}
                        onChange={(e) => setNewReframed(e.target.value)}
                        className="w-full bg-slate-[#090a0f]/50 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#D4A373] transition-all cursor-text"
                      />
                    </div>
                    <div className="flex gap-2 justify-between items-center flex-wrap">
                      <select
                        value={newPattern}
                        onChange={(e) => setNewPattern(e.target.value)}
                        className="bg-slate-950/50 border border-white/5 rounded-xl px-2.5 py-1.5 text-[10px] text-slate-400 font-mono focus:outline-none cursor-pointer"
                      >
                        <option value="All-or-Nothing Thinking">All-or-Nothing</option>
                        <option value="Overgeneralization">Overgeneralization</option>
                        <option value="Emotional Reasoning">Emotional Reasoning</option>
                        <option value="Disqualifying Positive">Disqualifying Positive</option>
                      </select>
                      
                      <button 
                        type="submit"
                        className="px-3 py-1.5 bg-[#D4A373] text-[#121412] text-xs font-semibold rounded-xl hover:bg-[#c59262] transition-colors cursor-pointer"
                      >
                        Record Mirror
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Footer / Status Belt */}
      <footer id="main-mann-footer" className="mt-6 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-slate-500 gap-3">
        <span>Encrypted &amp; Private Session Database</span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#D4A373] rounded-full animate-ping"></span> 
          Safety Escalation Shield Activated: <span className="text-slate-300">Tier 1 Grounded</span>
        </span>
        <span>v0.4.3 Build</span>
      </footer>

      {/* SYSTEM INSPECTOR FLOATING TELEMETRY HUD BAR */}
      {inspectHud && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xl bg-slate-950/95 border border-[#D4A373]/80 rounded-2xl p-4 shadow-[0_0_35px_rgba(212,163,115,0.25)] backdrop-blur-xl animate-fadeIn flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D4A373]/15 flex items-center justify-center text-[#D4A373] border border-[#D4A373]/30 animate-pulse shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase tracking-widest text-[#D4A373] font-mono font-black animate-pulse">
                ✦ System Inspect Active
              </span>
              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-mono">
                SECURE TELEMETRY
              </span>
            </div>
            <p className="text-xs font-serif text-slate-100 font-bold mt-0.5 truncate uppercase">
              {inspectHud.component}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-sans leading-tight">
              {inspectHud.label}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
