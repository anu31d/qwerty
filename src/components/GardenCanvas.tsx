/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MoodPetal } from "../types";
import { Sparkles, CloudRain, Sun, Moon, Leaf, LineChart as ChartIcon, Calendar, Activity, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line,
  ReferenceLine
} from "recharts";

interface GardenCanvasProps {
  mood: MoodPetal;
  streak: number;
  ritualsWatered: number;
}

export default function GardenCanvas({ mood, streak, ritualsWatered }: GardenCanvasProps) {
  const [activeTab, setActiveTab] = useState<"live" | "history">("live");

  // Configs based on mood
  const getMoodConfig = () => {
    switch (mood) {
      case MoodPetal.BLOOMING:
        return {
          title: "Blooming Garden",
          desc: "Your inner world is high energy and vitalized. Flowers are opening.",
          bgGradient: "from-[#1a1c32] via-[#2d1b4e] to-[#40203f]",
          accentColor: "text-pink-400",
          particleColor: "bg-pink-300/40",
          statusText: "Vibrant & Expressive",
          icon: <Sun className="w-5 h-5 text-amber-300 animate-spin-slow" />
        };
      case MoodPetal.GROWING:
        return {
          title: "Growing Meadow",
          desc: "Fleshing out steady foundations. Fresh green shoots taking hold.",
          bgGradient: "from-[#0d1c24] via-[#0f2e2d] to-[#164132]",
          accentColor: "text-emerald-400",
          particleColor: "bg-emerald-300/30",
          statusText: "Steady Grounding",
          icon: <Leaf className="w-5 h-5 text-emerald-300 animate-pulse" />
        };
      case MoodPetal.CLOUDY:
        return {
          title: "Cloudy Solitude",
          desc: "Unsettled winds and overcast thoughts. It is safe to rest here.",
          bgGradient: "from-[#111625] via-[#1c2333] to-[#252f44]",
          accentColor: "text-sky-300",
          particleColor: "bg-sky-200/20",
          statusText: "Gentle Flow (Patience)",
          icon: <CloudRain className="w-5 h-5 text-sky-300 animate-bounce" />
        };
      case MoodPetal.WITHERING:
        return {
          title: "Withering Autumn",
          desc: "Energy is depleted. Gently shedding leaves that no longer serve.",
          bgGradient: "from-[#1c1412] via-[#2e1d15] to-[#3a2012]",
          accentColor: "text-amber-500",
          particleColor: "bg-amber-500/15",
          statusText: "Conserving Depleted Energy",
          icon: <Leaf className="w-5 h-5 text-amber-500" />
        };
      case MoodPetal.DARK:
      default:
        return {
          title: "Nocturnal Sanctuary",
          desc: "Struggling or numb. Sitting in quiet, moonlit restorative dark.",
          bgGradient: "from-[#08080f] via-[#0e0e1a] to-[#151221]",
          accentColor: "text-indigo-400",
          particleColor: "bg-purple-300/10",
          statusText: "Restorative Incubation",
          icon: <Moon className="w-5 h-5 text-indigo-300" />
        };
    }
  };

  const config = getMoodConfig();

  // Helper converters for Recharts mapping
  const moodToNumeric = (m: MoodPetal) => {
    switch (m) {
      case MoodPetal.BLOOMING: return 5;
      case MoodPetal.GROWING: return 4;
      case MoodPetal.CLOUDY: return 3;
      case MoodPetal.WITHERING: return 2;
      case MoodPetal.DARK: return 1;
      default: return 3;
    }
  };

  const moodToEmoji = (m: MoodPetal) => {
    switch (m) {
      case MoodPetal.BLOOMING: return "🌸";
      case MoodPetal.GROWING: return "🌿";
      case MoodPetal.CLOUDY: return "🌧";
      case MoodPetal.WITHERING: return "🍂";
      case MoodPetal.DARK: return "🌑";
      default: return "🌿";
    }
  };

  // 7-day emotional log dataset
  const moodHistoryData = [
    { day: "06/03", moodVal: 5, moodName: "Blooming", emoji: "🌸" },
    { day: "06/04", moodVal: 4, moodName: "Growing", emoji: "🌿" },
    { day: "06/05", moodVal: 3, moodName: "Cloudy", emoji: "🌧" },
    { day: "06/06", moodVal: 1, moodName: "Dark", emoji: "🌑" },
    { day: "06/07", moodVal: 4, moodName: "Growing", emoji: "🌿" },
    { day: "06/08", moodVal: 3, moodName: "Cloudy", emoji: "🌧" },
    { day: "Today", moodVal: moodToNumeric(mood), moodName: mood, emoji: moodToEmoji(mood) }
  ];

  // Custom formatted labels for chart axes
  const formatYAxis = (tick: number) => {
    switch (tick) {
      case 5: return "🌸 Bloom";
      case 4: return "🌿 Grow";
      case 3: return "🌧 Cloud";
      case 2: return "🍂 Wither";
      case 1: return "🌑 Dark";
      default: return "";
    }
  };

  // Custom tooltips for nice styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const getInterpretation = (name: string) => {
        switch (name) {
          case "Blooming": return "Vitalized, open & expressive";
          case "Growing": return "Steady progress & grounded ok";
          case "Cloudy": return "Drooping thoughts, carrying uncertainty";
          case "Withering": return "Shedding loads, energy low";
          case "Dark": return "Restorative dark, incubating strength";
          default: return "Processing";
        }
      };

      return (
        <div className="bg-slate-950/95 border border-[#D4A373]/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md">
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Atmosphere Record</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-base">{data.emoji}</span>
            <span className="text-sm font-serif font-semibold text-[#D4A373]">{data.moodName}</span>
            <span className="text-[10px] font-mono text-slate-400 ml-auto">{data.day}</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1.5 italic font-sans border-t border-white/5 pt-1.5">
            "{getInterpretation(data.moodName)}"
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="garden-visualizer-card" className="bg-slate-950/60 border border-white/10 rounded-3xl p-5 sm:p-6 relative overflow-hidden backdrop-blur-md shadow-2xl flex flex-col justify-between h-full min-h-[410px] transition-all duration-300 hover:border-[#D4A373]/35 group/canvas hover:shadow-3xl">
      
      {/* Dynamic Ambient Background under the Garden */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} transition-all duration-1000 opacity-40 z-0`} />

      {/* Grid Pattern overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

      {/* Decorative corner glow */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#D4A373]/10 rounded-full blur-2xl pointer-events-none group-hover/canvas:bg-[#D4A373]/20 transition-all duration-500"></div>

      {/* Content Header */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#D4A373] font-black">Ecosystem Biometrics</span>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-950/70 backdrop-blur-md border border-white/5 ${config.accentColor}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {mood}
            </span>
          </div>
          <h3 className="font-serif text-xl font-semibold text-slate-100 tracking-tight flex items-center gap-1.5">
            {activeTab === "live" ? config.title : "7-Day Climate Curve"}
          </h3>
        </div>

        {/* Dynamic View Toggle Selector */}
        <div className="flex gap-1 p-0.5 bg-slate-950/60 rounded-xl border border-white/5 shadow-inner self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === "live" 
                ? "bg-[#D4A373] text-[#121412] shadow-md" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Ecosystem
          </button>
          
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === "history" 
                ? "bg-[#D4A373] text-[#121412] shadow-md" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ChartIcon className="w-3.5 h-3.5" />
            7-Day Pulse
          </button>
        </div>
      </div>

      {/* Dynamic Content Display with Framer Motion AnimatePresence */}
      <div className="relative flex-1 flex flex-col justify-center min-h-[220px] z-10 py-2">
        <AnimatePresence mode="wait">
          {activeTab === "live" ? (
            <motion.div 
              key="live-canvas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              {/* Left Side: Interactive Botanical SVGs */}
              <div className="w-full sm:w-2/3 h-full flex items-center justify-center pointer-events-none min-h-[160px]">
                <svg viewBox="0 0 400 200" className="w-full h-full max-h-[180px] drop-shadow-3xl">
                  {/* Ground */}
                  <path d="M 10,180 Q 200,165 390,180 L 390,200 L 10,200 Z" fill="#06080c" opacity="0.95" />
                  <path d="M 30,182 Q 200,172 370,182" stroke="#1e293b" strokeWidth="2.5" fill="none" opacity="0.3" />

                  {/* Render Garden Plants based on state */}
                  <AnimatePresence mode="wait">
                    <motion.g
                      key={mood}
                      style={{ transformOrigin: "bottom center" }}
                      initial={{ opacity: 0, scaleY: 0.7, y: 10 }}
                      animate={{ opacity: 1, scaleY: 1, y: 0 }}
                      exit={{ opacity: 0, scaleY: 0.8, y: 5 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 85,
                        damping: 15,
                        mass: 1.2
                      }}
                    >
                      {mood === MoodPetal.BLOOMING && (
                        <>
                          {/* Central Stem */}
                          <path d="M 200,180 Q 190,130 180,90" stroke="#059669" strokeWidth="6" fill="none" strokeLinecap="round" />
                          <path d="M 200,180 Q 220,140 230,110" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" />
                          
                          {/* Leaves */}
                          <path d="M 193,150 Q 165,145 170,135 Q 185,140 193,155 Z" fill="#047857" />
                          <path d="M 205,140 Q 235,135 225,123 Q 215,130 205,140 Z" fill="#10b981" />

                          {/* Blooming Big Flower */}
                          <g transform="translate(180, 85)" className="animate-pulse">
                            <circle cx="0" cy="0" r="14" fill="#f472b6" opacity="0.75" />
                            <circle cx="0" cy="-15" r="12" fill="#ec4899" />
                            <circle cx="15" cy="0" r="12" fill="#ec4899" />
                            <circle cx="0" cy="15" r="12" fill="#ec4899" />
                            <circle cx="-15" cy="0" r="12" fill="#ec4899" />
                            <circle cx="10" cy="-10" r="12" fill="#f43f5e" />
                            <circle cx="-10" cy="-10" r="12" fill="#f43f5e" />
                            <circle cx="10" cy="10" r="12" fill="#f43f5e" />
                            <circle cx="-10" cy="10" r="12" fill="#f43f5e" />
                            <circle cx="0" cy="0" r="8" fill="#f6e05e" />
                          </g>

                          {/* Second smaller blooming flower */}
                          <g transform="translate(230, 108)">
                            <circle cx="0" cy="0" r="7" fill="#f472b6" />
                            <circle cx="0" cy="-9" r="6" fill="#fb7185" />
                            <circle cx="9" cy="0" r="6" fill="#fb7185" />
                            <circle cx="0" cy="9" r="6" fill="#fb7185" />
                            <circle cx="-9" cy="0" r="6" fill="#fb7185" />
                            <circle cx="0" cy="0" r="4" fill="#fbbf24" />
                          </g>
                        </>
                      )}

                      {mood === MoodPetal.GROWING && (
                        <>
                          {/* Green Sprouts */}
                          <path d="M 120,180 Q 115,150 100,135" stroke="#34d399" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                          <path d="M 100,135 C 95,125 75,130 85,140 C 95,145 100,135 100,135 Z" fill="#10b981" />
                          
                          {/* Central Sapling */}
                          <path d="M 200,180 Q 202,120 205,80" stroke="#059669" strokeWidth="5.5" fill="none" strokeLinecap="round" />
                          <path d="M 205,80 Q 185,55 170,68 C 175,80 195,80 205,80 Z" fill="#34d399" />
                          <path d="M 205,80 Q 230,60 235,75 C 225,85 210,82 205,80 Z" fill="#059669" />

                          {/* Sprout Right */}
                          <path d="M 280,180 Q 285,155 305,140" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" />
                          <path d="M 305,140 Q 320,125 310,123 C 300,125 302,135 305,140 Z" fill="#047857" />
                        </>
                      )}

                      {mood === MoodPetal.CLOUDY && (
                        <>
                          {/* Slanted drooping plants with rainy mist */}
                          <path d="M 170,180 Q 155,145 140,130" stroke="#475569" strokeWidth="4" fill="none" strokeLinecap="round" />
                          <path d="M 220,180 Q 215,150 195,138" stroke="#334155" strokeWidth="4" fill="none" strokeLinecap="round" />
                          
                          {/* Drooping Leaf */}
                          <path d="M 140,130 Q 115,125 125,138 Z" fill="#1e293b" stroke="#334155" />

                          {/* Overhanging Clouds */}
                          <g opacity="0.7" className="animate-pulse">
                            <path d="M 50,40 Q 75,20 100,40 Q 120,25 140,40 Q 155,55 140,70 L 50,70 Z" fill="#38425d" />
                            <path d="M 250,50 Q 275,30 300,50 Q 325,35 345,50 Q 360,65 345,80 L 250,80 Z" fill="#20293d" />
                          </g>

                          {/* Rainfall lines */}
                          <line x1="90" y1="80" x2="80" y2="120" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.6" />
                          <line x1="140" y1="85" x2="130" y2="135" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.4" />
                          <line x1="280" y1="90" x2="270" y2="140" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.6" />
                          <line x1="330" y1="80" x2="320" y2="120" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.3" />
                        </>
                      )}

                      {mood === MoodPetal.WITHERING && (
                        <>
                          {/* Bare, Dry branching tree structures */}
                          <path d="M 200,180 Q 195,120 185,95" stroke="#4a3728" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                          <path d="M 185,95 Q 165,70 150,60" stroke="#4a3728" strokeWidth="3" fill="none" strokeLinecap="round" />
                          <path d="M 185,95 Q 210,80 220,70" stroke="#5c4432" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                          
                          {/* Fallen Golden foliage on ground */}
                          <path d="M 130,178 Q 140,172 155,178 Z" fill="#b45309" opacity="0.8" />
                          <path d="M 220,181 Q 235,176 245,181 Z" fill="#b45309" opacity="0.6" />
                          
                          {/* Single falling leaf */}
                          <g transform="translate(160, 110)" className="animate-bounce">
                            <path d="M 0,0 Q -10,12 5,15 C 10,7 5,2 0,0 Z" fill="#d97706" opacity="0.8" />
                          </g>
                        </>
                      )}

                      {mood === MoodPetal.DARK && (
                        <>
                          {/* Nocturnal starry background hints */}
                          <circle cx="80" cy="50" r="1.5" fill="#ffffff" opacity="0.7" className="animate-ping" />
                          <circle cx="310" cy="40" r="1.2" fill="#ffffff" opacity="0.8" />
                          <circle cx="160" cy="25" r="1.5" fill="#ffffff" opacity="0.4" />
                          <circle cx="280" cy="80" r="1.0" fill="#ffffff" opacity="0.5" />

                          {/* Sleeping single silver flower */}
                          <path d="M 200,180 Q 200,135 200,110" stroke="#312e81" strokeWidth="4" fill="none" strokeLinecap="round" />
                          
                          {/* Closed, glowing blueish/silver petals */}
                          <g transform="translate(200, 105)">
                            <ellipse cx="0" cy="0" rx="8" ry="12" fill="#818cf8" opacity="0.6" />
                            <ellipse cx="-4" cy="-2" rx="4" ry="10" fill="#c084fc" opacity="0.7" />
                            <ellipse cx="4" cy="-2" rx="4" ry="10" fill="#c084fc" opacity="0.7" />
                            <circle cx="0" cy="0" r="3" fill="#ffffff" />
                          </g>
                        </>
                      )}
                    </motion.g>
                  </AnimatePresence>

                  {/* Render extra glowing droplets on top if a ritual was completed *during* session */}
                  {ritualsWatered > 0 && (
                    <g>
                      <circle cx="180" cy="115" r="5" fill="#38bdf8" opacity="0.8" className="animate-ping" />
                      <circle cx="225" cy="130" r="7" fill="#818cf8" opacity="0.6" className="animate-ping" />
                    </g>
                  )}
                </svg>

                {/* Floating feedback particles */}
                <div className="absolute inset-0 z-0 pointer-events-none flex justify-around">
                  <div className={`w-1.5 h-1.5 rounded-full ${config.particleColor} animate-bounce`} style={{ animationDelay: "0.2s" }} />
                  <div className={`w-2 h-2 rounded-full ${config.particleColor} animate-bounce`} style={{ animationDelay: "0.7s" }} />
                  <div className={`w-1 h-1 rounded-full ${config.particleColor} animate-bounce`} style={{ animationDelay: "1.2s" }} />
                </div>
              </div>

              {/* Right Side: Micro-Bento Style high-density metrics */}
              <div className="w-full sm:w-1/3 flex flex-row sm:flex-col gap-2.5 shrink-0 pointer-events-auto">
                <div className="flex-1 bg-slate-950/50 backdrop-blur-md rounded-2xl p-3 border border-white/5 shadow-md hover:border-[#D4A373]/20 transition-colors flex flex-col justify-center">
                  <span className="text-[8px] uppercase tracking-wider font-mono text-slate-500 font-bold block mb-1">Consistency Streak</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-serif font-black text-[#D4A373]">{streak}</span>
                    <span className="text-[10px] font-sans text-slate-400">Days Active</span>
                  </div>
                </div>

                <div className="flex-1 bg-slate-950/50 backdrop-blur-md rounded-2xl p-3 border border-white/5 shadow-md hover:border-[#D4A373]/20 transition-colors flex flex-col justify-center">
                  <span className="text-[8px] uppercase tracking-wider font-mono text-slate-500 font-bold block mb-1">Ecosystem Treatment</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-serif font-black text-emerald-400">{ritualsWatered}</span>
                    <span className="text-[10px] font-sans text-slate-400">Vital Elements</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="history-chart"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1 flex flex-col justify-center select-none"
            >
              {/* Recharts Area Flow Visualization */}
              <div className="w-full h-[180px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={moodHistoryData}
                    margin={{ top: 10, right: 15, left: -24, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4A373" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#D4A373" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#ffffff08" 
                      vertical={false} 
                    />
                    <XAxis 
                      dataKey="day" 
                      stroke="#475569" 
                      fontSize={9} 
                      fontFamily="monospace"
                      tickLine={false}
                      axisLine={false}
                      dy={8}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={9} 
                      fontFamily="monospace"
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tickFormatter={formatYAxis}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={{ stroke: "#D4A37320", strokeWidth: 1 }}
                    />
                    
                    {/* Golden Mean / Benchmark Line for Cloudy threshold */}
                    <ReferenceLine y={3} stroke="#ffffff0a" strokeDasharray="2 4" />

                    <Area 
                      type="monotone" 
                      dataKey="moodVal" 
                      stroke="#D4A373" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#colorMood)"
                      activeDot={{ 
                        fill: "#111625", 
                        stroke: "#D4A373", 
                        strokeWidth: 2.5, 
                        r: 6 
                      }}
                      dot={{
                        fill: "#0f172a",
                        stroke: "#D4A373",
                        strokeWidth: 2,
                        r: 4
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Mini Helper Legend */}
              <div className="flex justify-around items-center bg-slate-950/40 p-1.5 rounded-xl border border-white/5 mx-2 mt-2 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D4A373]" /> Daily Pulse</span>
                <span>Y-Axis: Mood Density</span>
                <span>Active Tracking Loop</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Description Footer of current weather status */}
      <div className="relative z-10 flex items-center justify-between border-t border-slate-800/60 pt-3 text-slate-400 text-xs">
        <span className="flex items-center gap-1.5 font-mono">
          {activeTab === "live" ? config.icon : <Activity className="w-4 h-4 text-[#D4A373] animate-pulse" />}
          {activeTab === "live" ? config.statusText : "Fluctuation Amplitude"}
        </span>

        <span className="text-slate-500 max-w-[65%] text-right font-light line-clamp-1 italic">
          {activeTab === "live" ? config.desc : "Select different items in the chat inline menu to watch your curve evolve."}
        </span>
      </div>
    </div>
  );
}
