import React, { useState } from "react";
import { UserProfile } from "../types";
import { 
  TrendingUp, Calendar, Heart, Award, ArrowUpRight, 
  ChevronRight, Sparkles, Scale, Info 
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, BarChart, Bar, CartesianGrid, Legend 
} from "recharts";

interface ProgressViewProps {
  profile: UserProfile;
  onChangeWeight: (newWeight: number) => void;
}

export default function ProgressView({ profile, onChangeWeight }: ProgressViewProps) {
  // Local states for new logs
  const [loggedWeight, setLoggedWeight] = useState<string>("");
  const [loggedBodyFat, setLoggedBodyFat] = useState<string>("15");
  const [loggedWaist, setLoggedWaist] = useState<string>("81");
  const [visualLogSuccess, setVisualLogSuccess] = useState<string>("");

  // History states for dynamic interactive graphs
  const [weightHistory, setWeightHistory] = useState([
    { date: "May 10", weight: profile.weight + 2.5, bodyFat: 17 },
    { date: "May 15", weight: profile.weight + 2.0, bodyFat: 16.5 },
    { date: "May 20", weight: profile.weight + 1.5, bodyFat: 16 },
    { date: "May 25", weight: profile.weight + 0.8, bodyFat: 15.6 },
    { date: "May 30", weight: profile.weight + 0.3, bodyFat: 15.2 },
    { date: "Jun 05", weight: profile.weight, bodyFat: 15.0 },
  ]);

  const [strengthHistory, setStrengthHistory] = useState([
    { exercise: "Push-Up Max reps", limit: 25 },
    { exercise: "Dumbbell Press (kg)", limit: 22 },
    { exercise: "Glute Bridges (reps)", limit: 30 },
    { exercise: "Dumbbell Row (kg)", limit: 18 },
    { exercise: "Bodyweight Squat reps", limit: 35 },
  ]);

  const handleLogProgress = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(loggedWeight);
    if (!parsedWeight || isNaN(parsedWeight)) {
      alert("Please specify a valid numeric weight.");
      return;
    }

    // Update weight in profile
    onChangeWeight(parsedWeight);

    // Append to graph list
    const todayLabel = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    setWeightHistory(prev => [
      ...prev,
      { date: todayLabel, weight: parsedWeight, bodyFat: parseFloat(loggedBodyFat) || 15 }
    ]);

    setVisualLogSuccess(`✅ Metrics captured successfully for ${todayLabel}! New weight: ${parsedWeight} kg.`);
    setLoggedWeight("");

    setTimeout(() => setVisualLogSuccess(""), 4000);
  };

  return (
    <div className="space-y-6" id="progress-container">
      {/* Title Block */}
      <div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
          ANALYTICS <span className="text-lime-400 italic">METRICS</span>
        </h2>
        <p className="text-xs text-slate-400">
          Track body mass index, composite muscle density profiles, and target trajectory points.
        </p>
      </div>

      {/* Grid of Interactive Input and Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input box to capture morning metrics - col-span-4 */}
        <div className="lg:col-span-4 bg-[#121218] border border-slate-800 rounded-3xl p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5 pb-2 border-b border-slate-900">
              <Scale className="w-4 h-4 text-lime-400" /> Log Morning Metrics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log metrics weekly at identical times. Keep your scales clean so our adaptation algorithm is pinpoint accurate.
            </p>

            <form onSubmit={handleLogProgress} className="space-y-3 pt-1">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase font-black mb-1">Morning Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder={`e.g. ${profile.weight} kg`}
                  value={loggedWeight}
                  onChange={(e) => setLoggedWeight(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-slate-100 placeholder:text-slate-650 focus:outline-none focus:ring-1 focus:ring-lime-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase font-black mb-1">Body Fat % (est)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 15.5%"
                    value={loggedBodyFat}
                    onChange={(e) => setLoggedBodyFat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase font-black mb-1">Waist line (cm)</label>
                  <input
                    type="number"
                    placeholder="e.g. 81"
                    value={loggedWaist}
                    onChange={(e) => setLoggedWaist(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-lime-400 hover:bg-lime-300 text-black py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                COMMIT BIOMETRICS
              </button>
            </form>

            {visualLogSuccess && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-400 rounded-xl leading-relaxed">
                {visualLogSuccess}
              </div>
            )}
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-900 text-[11px] text-slate-500 flex gap-2 pt-2.5">
            <Info className="w-4 h-4 text-lime-400 flex-shrink-0" />
            <span>AI Predictive forecasts require at least 3 logged weight points over 10 days to unlock body-recomposition trajectories accurately.</span>
          </div>
        </div>

        {/* RECHARTS PLOTS: Weight Trend Area - col-span-8 */}
        <div className="lg:col-span-8 bg-[#121218] border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wide">COMPREHENSIVE PROGRESS METER</span>
            <span className="text-lime-400 font-mono text-[10px] uppercase font-bold flex items-center gap-1">
              <span className="h-1 text-xs font-black">•</span> TRAJECTORY TREND LINE
            </span>
          </div>

          {/* Interactive chart wrapper */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}
                  labelStyle={{ color: "#94a3b8", fontSize: "11px", fontWeight: "bold" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />
                <Area name="Total Weight (kg)" type="monotone" dataKey="weight" stroke="#84cc16" strokeWidth={3} fillOpacity={1} fill="url(#weightGrad)" />
                <Area name="Fat Percentage (%)" type="monotone" dataKey="bodyFat" stroke="#f43f5e" strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* LOWER ROW: STRENGTH METRICS BAR GRAPH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        <div className="bg-[#121218] border border-slate-800 rounded-3xl p-5 space-y-4">
          <div>
            <h4 className="font-bold text-white text-sm">Strength Limit Indicators</h4>
            <p className="text-xs text-slate-500">Peak performance loads logged in the active training engine.</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strengthHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="exercise" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }} />
                <Bar name="Reps / Resistance Max" dataKey="limit" fill="#a3e635" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Static body recomposition logs and goals */}
        <div className="bg-[#121218] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] text-lime-400 font-bold uppercase tracking-wide">FITFORGE METABOLICS SYSTEM</span>
            <h4 className="text-lg font-bold text-white">Anabolic State Summary</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Active calorie expenditure reflects a steady increase in daily non-exercise thermal activity. Continuing with your frequency of {profile.frequency} days weekly protects structural skeletal proteins while melting visceral storage.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-950 p-2 text-center rounded-xl border border-slate-900">
              <span className="block text-[8px] uppercase text-slate-500 font-bold">Base BMR</span>
              <span className="text-xs font-mono font-bold text-white">1,620 kcal</span>
            </div>
            <div className="bg-slate-950 p-2 text-center rounded-xl border border-slate-900">
              <span className="block text-[8px] uppercase text-slate-500 font-bold">Total Burn</span>
              <span className="text-xs font-mono font-bold text-lime-400">+2,250 kcal</span>
            </div>
            <div className="bg-slate-950 p-2 text-center rounded-xl border border-slate-900">
              <span className="block text-[8px] uppercase text-slate-500 font-bold">Goal State</span>
              <span className="text-xs font-bold text-white leading-tight">Anabolic</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[11px] text-slate-400">
            <span>Adaptive Progression Status</span>
            <span className="text-lime-400 font-extrabold uppercase flex items-center gap-1">
              B+ ACTIVE SCORE <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
