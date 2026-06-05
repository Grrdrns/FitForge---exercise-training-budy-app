import React, { useState } from "react";
import { UserProfile, Exercise } from "../types";
import { Database, ShieldAlert, Sparkles, User, Dumbbell, Calendar, Heart, ShieldCheck } from "lucide-react";

interface AdminDashboardProps {
  profile: UserProfile;
  onChangeProfile: (updated: UserProfile) => void;
  exercisesCount: number;
}

export default function AdminDashboard({
  profile,
  onChangeProfile,
  exercisesCount
}: AdminDashboardProps) {
  const [targetName, setTargetName] = useState(profile.name);
  const [targetLevel, setTargetLevel] = useState(profile.level);
  const [targetXp, setTargetXp] = useState(profile.xp);
  const [successLogs, setSuccessLogs] = useState("");

  const handleUpdateUserOverride = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeProfile({
      ...profile,
      name: targetName,
      level: Number(targetLevel) || 1,
      xp: Number(targetXp) || 0
    });
    setSuccessLogs("✅ Admin Force Parameter Override Saved! Gamified properties synced successfully.");
    setTimeout(() => setSuccessLogs(""), 3500);
  };

  const [subscriptionsMock, setSubscriptionsMock] = useState([
    { email: "gerardo.aranasjr@gmail.com", tier: "Premium Pro AI", status: "Active Premium", joinDate: "2026-06-05" },
    { email: "sarah.jenkins@gmail.com", tier: "Free Base Tier", status: "Basic", joinDate: "2026-05-12" },
  ]);

  const handleLevelUpToElite = () => {
    onChangeProfile({
      ...profile,
      level: 100,
      xp: 99000
    });
    setTargetLevel(100);
    setTargetXp(99000);
    setSuccessLogs("👑 Level Override: Level 100 Elite Status achieved! You are now an Elite Olympian.");
    setTimeout(() => setSuccessLogs(""), 3500);
  };

  return (
    <div className="space-y-6" id="admin-dashboard-container">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-black text-rose-500 uppercase tracking-tight">
          SYSTEM <span className="text-white italic">ADMINISTRATOR</span>
        </h2>
        <p className="text-xs text-slate-400">
          Admin portal of the FitForge AI network core. Force payload configuration & verify user profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        {/* Left Form: Override profile parameters - col-span-7 */}
        <div className="lg:col-span-7 bg-[#121218] border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono text-rose-400">
              <ShieldAlert className="w-4 h-4" /> Global Force Modifiers Override
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Dev Sandbox</span>
          </div>

          <form onSubmit={handleUpdateUserOverride} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-black block">Athletic Identity Name</span>
                <input
                  type="text"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-black block">Set Level Override</span>
                <input
                  type="number"
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-black block">Set XP Accumulation</span>
                <input
                  type="number"
                  value={targetXp}
                  onChange={(e) => setTargetXp(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider py-2.5 px-5 rounded-xl cursor-pointer"
              >
                SAVE OVERRIDES
              </button>
              
              <button
                type="button"
                onClick={handleLevelUpToElite}
                className="bg-lime-400 text-black text-xs font-black uppercase tracking-wider py-2.5 px-5 rounded-xl cursor-pointer"
              >
                FORCE LEVEL 100 ELITE STATUS
              </button>
            </div>
          </form>

          {successLogs && (
            <div className="p-3 bg-rose-950/20 border border-rose-500/15 text-xs text-rose-450 rounded-xl leading-relaxed">
              {successLogs}
            </div>
          )}

          {/* Quick Stats overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-950">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-center">
              <span className="block text-[8px] uppercase text-slate-500 font-bold">Exercises Pool</span>
              <span className="text-sm font-black text-white font-mono">{exercisesCount}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-center">
              <span className="block text-[8px] uppercase text-slate-500 font-bold">Programs Template</span>
              <span className="text-sm font-black text-white font-mono">50+ Splits</span>
            </div>
            <div className="p-3 bg-[#121218] rounded-xl border border-rose-900/10 text-center">
              <span className="block text-[8px] uppercase text-rose-500 font-bold">Server Cache</span>
              <span className="text-sm font-black text-rose-400 font-mono">200 OK</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-center">
              <span className="block text-[8px] uppercase text-slate-500 font-bold">Active Socket</span>
              <span className="text-sm font-black text-lime-400 font-mono">3000 List</span>
            </div>
          </div>
        </div>

        {/* Right Info: subscription management - col-span-5 */}
        <div className="lg:col-span-5 bg-[#121218] border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Database className="w-4 h-4 text-rose-400" /> Active System Subscriptions
            </h3>
            <span className="text-[10px] text-lime-400 uppercase font-bold">Premium DB</span>
          </div>

          <div className="space-y-2">
            {subscriptionsMock.map((sub, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-900 text-xs text-slate-350 space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>{sub.email}</span>
                  <span className="text-lime-400">{sub.tier}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Joined: {sub.joinDate}</span>
                  <span className="uppercase text-[9px] bg-slate-900 px-1.5 rounded border border-slate-800 text-slate-400">{sub.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
