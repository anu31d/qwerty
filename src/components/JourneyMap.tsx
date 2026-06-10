import React, { useState } from "react";
import { 
  User, 
  MessageSquare, 
  Sparkles, 
  BookOpen, 
  Activity, 
  Sprout, 
  ShieldAlert, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { DoseRitual, ThoughtMirrorRecord } from "../types";

interface JourneyMapProps {
  profile: {
    name: string;
    mbti: string;
    attachmentStyle: string;
    gardenState: string;
    recentJournalTheme?: string;
  };
  messages: Array<{ id: string; role: string; content: string }>;
  thoughtRecords: ThoughtMirrorRecord[];
  rituals: DoseRitual[];
  onFocusSection?: (sectionId: string) => void;
  isDemoMode?: boolean;
}

interface StepNode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  psychologyBase: string;
  psychologyDesc: string;
  icon: React.ComponentType<any>;
  color: string;
  keyLabel: string;
  metricLabel: string;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({
  profile,
  messages,
  thoughtRecords,
  rituals,
  onFocusSection,
  isDemoMode = true
}) => {
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);

  const completedRitualsCount = rituals.filter(r => r.completed).length;
  const isProfileComplete = !!profile.name;
  const hasSentMessages = messages.length > 2;
  const hasThoughts = thoughtRecords.length > 0;
  const hasWatered = completedRitualsCount > 0;

  const steps: StepNode[] = [
    {
      id: "onboarding",
      title: "1. Profile Setup",
      subtitle: "Identity Grounding",
      description: "Define your name, MBTI, and attachment style. This sets up custom clinical boundaries, personality-bounded guidance, and safe chat limits in India/worldwide.",
      psychologyBase: "Attachment Calibration Theory",
      psychologyDesc: "Using attachment-style profiles (Anxious, Avoidant, Secure) to tune response lengths and pacing, matching user-defined communication barriers.",
      icon: User,
      color: "from-blue-500 to-indigo-600",
      keyLabel: "Profile Status",
      metricLabel: isProfileComplete ? `${profile.mbti} · ${profile.attachmentStyle}` : "Awaiting Name & Persona Setup"
    },
    {
      id: "weather-check",
      title: "2. Mood Check-In",
      subtitle: "Emotional Climate",
      description: "Reflecting on your mood as organic weather. Selecting Blooming, Growing, Cloudy, Withering, or Dark landscapes rather than clinical numbers.",
      psychologyBase: "Somatic Emotional Externalization",
      psychologyDesc: "Substituting diagnostic scores with clean environmental weather metaphors, relieving the user's performance anxiety and self-judgment.",
      icon: MessageSquare,
      color: "from-[#D4A373] to-amber-600",
      keyLabel: "Inner Environment",
      metricLabel: `Current active sky: ${profile.gardenState}`
    },
    {
      id: "daily-affirmation",
      title: "3. Affirmation",
      subtitle: "Linguistic Calibration",
      description: "Receive a real-time, personalized positive linguistic feedback statement generated dynamically based on your stressors and weather configuration.",
      psychologyBase: "Cognitive Self-Affirmation Theory",
      psychologyDesc: "Using specific positive blocks of written language to actively counteract automatically triggered negative self-appraisal pathways.",
      icon: Sparkles,
      color: "from-amber-400 to-[#D4A373]",
      keyLabel: "Affirmation Active",
      metricLabel: isProfileComplete ? "Calibrated to your stressors" : "Requires profile name"
    },
    {
      id: "thought-mirror",
      title: "4. CBT Reframer",
      subtitle: "Thought Mirror",
      description: "The Cognitive Behavioral space to isolate negative automatic beliefs, identify cognitive biases (e.g. all-or-nothing), and draft steady alternatives.",
      psychologyBase: "Cognitive Distortion Re-patterning",
      psychologyDesc: "Dissecting inner doubt logically with a double-standard test (What would you tell a friend?). Builds objective self-compassion.",
      icon: BookOpen,
      color: "from-[#E6C594] to-[#B07E4D]",
      keyLabel: "CBT Ledger",
      metricLabel: `${thoughtRecords.length} Reframed Thoughts Recorded`
    },
    {
      id: "dose-apothecary",
      title: "5. Biochemical Tasks",
      subtitle: "D.O.S.E. Apothecary",
      description: "Translate emotional deficits into specific physical neurotransmitter rituals. Completing serotonin, dopamine, oxytocin, or endorphin micro-tasks.",
      psychologyBase: "Neurochemical Behavioral Activation",
      psychologyDesc: "Stimulating raw neurochemicals (Dopamine, Oxytocin, Serotonin) using active behavioral steps to successfully bypass heavy executive dysfunction.",
      icon: Activity,
      color: "from-emerald-500 to-teal-600",
      keyLabel: "Watering Status",
      metricLabel: `${completedRitualsCount} / ${rituals.length} Tasks Watered`
    },
    {
      id: "ecosystem-growth",
      title: "6. Kinetic Garden",
      subtitle: "Ecosystem Reflection",
      description: "Watch your physical progress take life. Soil seeds and leaf nodes shift, grow, or cloud over directly based on your CBT entries and watered tasks.",
      psychologyBase: "Aesthetic Biofeeback Rewards",
      psychologyDesc: "Using visual botanical feedback loops to satisfy the mind's desire for rewards without clinical bars, scores, or gamified stress metrics.",
      icon: Sprout,
      color: "from-emerald-400 to-[#D4A373]",
      keyLabel: "Garden Vegetation",
      metricLabel: completedRitualsCount > 0 ? "Flourishing biome active" : "Waiting for first task completion"
    },
    {
      id: "safety-shield",
      title: "7. Safe Distress",
      subtitle: "Crisis Escalation Safeguards",
      description: "The emergency grounding overlay. Intercepting crisis indicators, locking workspace tabs into safe mode, and instantly dispatching localized backup contacts.",
      psychologyBase: "Grounded Harm Reduction Protocol",
      psychologyDesc: "Strict clinical protection layers. Keeps communication safe and provides immediate offline connection overrides under intense strain.",
      icon: ShieldAlert,
      color: "from-red-500 to-rose-600",
      keyLabel: "Safeguard Status",
      metricLabel: "Armed & Encrypted Locally"
    }
  ];

  const getStepStatus = (index: number) => {
    switch (index) {
      case 0: return isProfileComplete ? "completed" : "active";
      case 1: return hasSentMessages ? "completed" : isProfileComplete ? "active" : "pending";
      case 2: return isProfileComplete ? "completed" : "pending";
      case 3: return hasThoughts ? "completed" : hasSentMessages ? "active" : "pending";
      case 4: return hasWatered ? (completedRitualsCount === rituals.length ? "completed" : "active") : "pending";
      case 5: return hasWatered ? "completed" : "pending";
      case 6: return "completed";
      default: return "pending";
    }
  };

  const currentStep = steps[selectedStepIndex];

  return (
    <div id="mann-journey-map-widget" className="bg-slate-950/60 border border-white/10 rounded-3xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] font-serif text-8xl select-none pointer-events-none text-[#D4A373]">मन</div>
      
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#D4A373]/10 text-[#D4A373] border border-[#D4A373]/20 font-mono tracking-wider mb-1 uppercase">
            Interactive Structure Map
          </span>
          <h3 className="text-lg font-serif text-slate-100 flex items-center gap-2 font-semibold">
            The Self-Regulation Loop
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            How Mann channels emotional feedback into real-world recovery steps.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Done
          </span>
          <span className="flex items-center gap-1">
            <Circle className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10 animate-pulse" /> Active
          </span>
          <span className="flex items-center gap-1">
            <Circle className="w-3.5 h-3.5 text-slate-600" /> Ready
          </span>
        </div>
      </div>

      {/* SUPER SIMPLE SUBWAY LINE / HORIZONTAL PIPELINE */}
      <div className="relative mb-6 pt-2 pb-4 border-b border-white/5">
        {/* Grey Connector Rail Background */}
        <div className="absolute left-4 right-4 top-[25px] h-[3px] bg-slate-800 rounded-full z-0"></div>
        {/* Glowing Progress Color Overlay */}
        <div 
          className="absolute left-4 top-[25px] h-[3px] bg-gradient-to-r from-emerald-500 via-[#D4A373] to-amber-500 rounded-full transition-all duration-700 z-0"
          style={{ width: `${(selectedStepIndex / 6) * 100}%`, maxWidth: "98%" }}
        ></div>

        <div className="grid grid-cols-7 relative z-10">
          {steps.map((step, idx) => {
            const status = getStepStatus(idx);
            const isSelected = idx === selectedStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setSelectedStepIndex(idx)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer relative ${
                    isSelected 
                      ? "bg-[#D4A373] text-[#121412] scale-125 ring-4 ring-[#D4A373]/30" 
                      : status === "completed"
                      ? "bg-emerald-500/15 border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500/30"
                      : "bg-slate-900 border border-slate-700 text-slate-400 hover:border-slate-500"
                  }`}
                  title={step.title}
                >
                  <Icon className="w-4 h-4" />
                  
                  {/* Small absolute indicator for active step */}
                  {status === "active" && !isSelected && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                    </span>
                  )}
                </button>

                {/* Highly readable vertical badge label */}
                <span className={`text-[10px] font-mono mt-2 bg-transparent text-center select-none max-w-[65px] truncate px-0.5 ${
                  isSelected ? "text-[#D4A373] font-bold" : "text-slate-400"
                }`}>
                  {step.title.split(".")[1].trim()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Explanation Detail Card - Fully simplified and visual */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4A373]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${currentStep.color} flex items-center justify-center text-white shrink-0`}>
                  <currentStep.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-mono text-slate-500 block">
                    Interactive Workspace Section {selectedStepIndex + 1} of 7
                  </span>
                  <h4 className="text-base font-serif text-slate-100 font-semibold">{currentStep.title}</h4>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed font-sans mb-4">
                {currentStep.description}
              </p>
            </div>

            <div className="bg-slate-950/40 p-3 rounded-2xl border border-white/5 flex flex-col gap-1">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 font-bold block">{currentStep.keyLabel}</span>
              <span className="text-xs font-mono text-[#D4A373] font-semibold">{currentStep.metricLabel}</span>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col justify-between bg-white/[0.01] border border-white/5 rounded-2xl p-4">
            <div className="flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-mono text-[9px] uppercase tracking-wider font-bold text-slate-300">The Clinical Foundation</h5>
                <p className="text-[10px] text-amber-300 font-medium font-mono mt-0.5">{currentStep.psychologyBase}</p>
                <p className="text-[10.5px] text-slate-400 mt-1 font-light font-sans leading-relaxed">{currentStep.psychologyDesc}</p>
              </div>
            </div>

            {onFocusSection && (
              <button
                type="button"
                onClick={() => onFocusSection(currentStep.id)}
                className="w-full mt-4 inline-flex items-center justify-center gap-1.5 bg-[#D4A373] text-[#121412] py-2 px-4 rounded-xl text-xs font-mono font-black tracking-wider uppercase hover:bg-[#c59262] transition-colors shadow-lg active:scale-98 cursor-pointer"
              >
                👉 Guide Me to This Step
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
