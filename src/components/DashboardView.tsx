import React from "react";
import { UserProfile, WorkoutProgram, WorkoutDay } from "../types";
import { 
  Dumbbell, Trophy, Flame, ChevronRight, Sparkles, 
  TrendingUp, Award, Zap, Heart, RefreshCw, Compass 
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface DashboardViewProps {
  profile: UserProfile;
  activeProgram: WorkoutProgram | null;
  activeDayIndex: number;
  onNavigate: (tab: string) => void;
  completedLogsCount: number;
  weeklyXp: number;
}

export default function DashboardView({
  profile,
  activeProgram,
  activeDayIndex,
  onNavigate,
  completedLogsCount,
  weeklyXp
}: DashboardViewProps) {
  // Safe calculation for XP levels
  const xpNeededForNextLevel = 1000;
  const xpProgressPercent = Math.min(100, Math.round((profile.xp % xpNeededForNextLevel) / 10));
  
  // Recovery calculations
  const recoveryScore = 84;
  const currentDay = activeProgram?.weeks[0]?.days[activeDayIndex];

  // Demo stat history for Recharts
  const statHistory = [
    { name: "Day 1", burn: 310, strength: 100 },
    { name: "Day 2", burn: 450, strength: 105 },
    { name: "Day 3", burn: 380, strength: 110 },
    { name: "Day 4", burn: 520, strength: 115 },
    { name: "Day 5", burn: 480, strength: 120 },
    { name: "Day 6", burn: 610, strength: 125 },
    { name: "Day 7", burn: 640, strength: 135 }
  ];

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Dynamic Profile Welcome Banner */}
      <div className="bg-gradient-to-r from-lime-900/40 via-slate-900 to-slate-950 p-6 rounded-3xl border border-lime-500/20 shadow-xl relative overflow-hidden" id="welcome-banner">
        <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-lime-400 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                {profile.experienceLevel} ATHLETE
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-ping"></span>
                Coach Feedback: Active & Adapting
              </span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight pt-1">
              Welcome back, <span className="text-lime-400 font-serif italic">{profile.name}</span>!
            </h2>
            <p className="text-sm text-slate-400 max-w-lg">
              The AI Engine analyzed your session completion. Your muscular endurance suggests raising dumbbells setup by 1.5kg this week.
            </p>
          </div>

          {/* XP & LEVEL CARRIER */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl min-w-[200px] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold">Level {profile.level}</span>
              <span className="text-lime-400 font-mono font-bold">{profile.xp} XP</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-lime-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500">
              <span>Beginner (Lvl 1)</span>
              <span>{xpNeededForNextLevel - (profile.xp % xpNeededForNextLevel)} XP to Level {profile.level + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE PERFORMANCE ANALYTICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="stats-grid">
        <div className="bg-[#121218] border border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex justify-between items-center text-slate-500 text-xs uppercase font-bold tracking-wider">
            <span>Active Calories</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-white italic">
              {completedLogsCount * 320 || 1240}
            </span>
            <span className="text-xs text-slate-500 uppercase ml-1">kcal</span>
          </div>
          <p className="text-[10px] text-lime-400 mt-1 font-semibold">Total physical burn logged</p>
        </div>

        <div className="bg-[#121218] border border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex justify-between items-center text-slate-500 text-xs uppercase font-bold tracking-wider">
            <span>Logged Workouts</span>
            <Dumbbell className="w-4 h-4 text-lime-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-white italic">
              {completedLogsCount || 4}
            </span>
            <span className="text-xs text-slate-500 uppercase ml-1">sessions</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Goal: {profile.frequency} days / week</p>
        </div>

        <div className="bg-[#121218] border border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all font-sans">
          <div className="flex justify-between items-center text-slate-500 text-xs uppercase font-bold tracking-wider">
            <span>Streak Force</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-white italic">7</span>
            <span className="text-xs text-slate-400 ml-1">days</span>
          </div>
          <p className="text-[10px] text-amber-400 mt-1">Weekly Shield Active</p>
        </div>

        <div className="bg-[#121218] border border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex justify-between items-center text-slate-500 text-xs uppercase font-bold tracking-wider">
            <span>Recovery Ready</span>
            <Heart className="w-4 h-4 text-pink-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-white italic">{recoveryScore}</span>
            <span className="text-xs text-slate-500 font-mono font-bold">/100</span>
          </div>
          <p className="text-[10px] text-lime-400 mt-1">Excellent sleep reported</p>
        </div>
      </div>

      {/* TWO-COLUMN GRID: WORKOUT HERO & MOTIVATIONAL PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-split">
        {/* Left Side: Active Workout Day Target (Big Block) */}
        <div className="lg:col-span-8 bg-[#181820] border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl pointer-events-none group-hover:bg-lime-400/10 transition-all duration-300" />
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="bg-lime-400/10 text-lime-400 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-lime-400/20 flex items-center gap-1.5 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                Selected Strategy Base
              </span>
              <span className="text-slate-500 text-xs font-mono">
                {activeProgram ? activeProgram.title : "Calculating FitForge Split..."}
              </span>
            </div>

            <div className="pt-2">
              <h3 className="text-3xl font-black text-white leading-none mb-1 tracking-tight">
                {currentDay ? currentDay.dayName : "Personalized Full Body Circuit"}
              </h3>
              <p className="text-slate-400 max-w-md text-sm">
                Targeting physical dimensions based on {profile.environment} setup & available equipment ({profile.equipment.length} items registered).
              </p>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black">Estimated Duration</p>
                <p className="text-lg font-extrabold text-white">{profile.duration} <span className="text-xs text-slate-500 font-normal">mins</span></p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black">Exercises Count</p>
                <p className="text-lg font-extrabold text-white">{currentDay?.exercises.length || 4} <span className="text-xs text-slate-500 font-normal">elements</span></p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black">Pacing Focus</p>
                <p className="text-lg font-extrabold text-lime-400">Hypertrophy RPE 8</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={() => onNavigate("workout")}
              className="w-full sm:w-auto bg-lime-400 text-[#0a0a0c] font-black tracking-wider text-xs uppercase px-8 py-4 rounded-xl hover:scale-103 active:scale-97 transition-all cursor-pointer shadow-lg shadow-lime-400/20"
            >
              LAUNCH SESSION
            </button>
            <button 
              onClick={() => onNavigate("exerciseLibrary")}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase px-6 py-4 rounded-xl border border-slate-800 transition-colors cursor-pointer"
            >
              EXPLORE TECHNIQUE LIBRARY
            </button>
          </div>
        </div>

        {/* Right Side: Recharts Consistency / Active Burn Area Chart */}
        <div className="lg:col-span-4 bg-[#121218] border border-slate-800 rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-4 h-4 text-lime-400" /> Metric Force Trend
            </h4>
            <p className="text-xs text-slate-500 mb-4">Tracking caloric burn over consecutive log attempts.</p>
          </div>

          <div className="h-36 w-full my-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statHistory} margin={{ top: 5, right: 3, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBurn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a3e635" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a3e635" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} />
                <YAxis stroke="#475569" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "10px" }}
                  labelStyle={{ color: "#94a3b8", fontSize: "11px", fontWeight: "bold" }}
                  itemStyle={{ color: "#a3e635", fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="burn" stroke="#a3e635" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBurn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Micro gamified incentive footer */}
          <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[11px] text-slate-400">
            <span>Weekly Target Leveling</span>
            <span className="text-lime-400 font-extrabold uppercase tracking-wide cursor-pointer flex items-center gap-0.5 hover:underline" onClick={() => onNavigate("challenges")}>
              {weeklyXp} XP EARNED THIS WEEK <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* METABOLIC COUPLING ADVICE & COMMUNITY BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6">
        {/* Quick Nutrition compliance view */}
        <div className="md:col-span-7 bg-[#121218] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Dynamic Nutrition Coupling</h4>
            <span className="text-[10px] text-lime-400 underline cursor-pointer" onClick={() => onNavigate("nutrition")}>Custom Planner</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            To fuel your <span className="text-white font-bold">{profile.goal}</span> program, keep your meals high in clean sources.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900/60 p-2.5 rounded-xl text-center border border-slate-800">
              <span className="block text-[9px] uppercase text-slate-500 font-bold">Protein Cap</span>
              <span className="text-sm font-black text-rose-400 font-mono">{Math.round(profile.weight * 2)}g</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl text-center border border-slate-800">
              <span className="block text-[9px] uppercase text-slate-500 font-bold">Target Calories</span>
              <span className="text-sm font-black text-amber-400 font-mono">{profile.goal.includes("Lose") ? "1,800" : "2,500"}</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl text-center border border-slate-800">
              <span className="block text-[9px] uppercase text-slate-500 font-bold">Daily Hydration</span>
              <span className="text-sm font-black text-cyan-400 font-mono">2.8L</span>
            </div>
          </div>
        </div>

        {/* Motivational Prompt Spark */}
        <div className="md:col-span-5 bg-gradient-to-tr from-[#121218] to-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-lime-400/10 border border-lime-400/20 flex flex-shrink-0 items-center justify-center text-lime-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Forge Motivation Engine</span>
            <p className="text-xs text-slate-300 mt-1 italic">
              "Continuous improvement is better than delayed perfection. Complete an initial workout to fire up your Forge level today!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
