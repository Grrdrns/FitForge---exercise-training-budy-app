import React from "react";
import { UserProfile, UserChallenge } from "../types";
import { 
  Trophy, Shield, Zap, Award, Sparkles, CheckCircle2, 
  ChevronRight, Circle, Play, RefreshCw, Star 
} from "lucide-react";
import { AchievementBadge } from "../data";

interface ChallengesViewProps {
  profile: UserProfile;
  challenges: UserChallenge[];
  onCompleteChallenge: (challengeId: string, xpReward: number) => void;
  achievements: AchievementBadge[];
  onClaimAchievement: (achId: string, xpReward: number) => void;
}

export default function ChallengesView({
  profile,
  challenges,
  onCompleteChallenge,
  achievements,
  onClaimAchievement
}: ChallengesViewProps) {
  return (
    <div className="space-y-6" id="challenges-view-container">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            FORGE <span className="text-lime-400 italic">CHALLENGES</span>
          </h2>
          <p className="text-xs text-slate-400">
            Fulfill athletic objectives, accumulate XP modifiers, and secure custom level status titles.
          </p>
        </div>

        {/* Current profile level stats summary tab */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400 font-serif italic text-lg font-black">
            L{profile.level}
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-black block">Status Level Title</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {profile.level >= 100 ? "👑 Elite Olympian" : profile.level >= 50 ? "⚡ master champion" : profile.level >= 15 ? "🔥 Advanced Contender" : "🌱 Beginner Athlete"}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        {/* Left Side: Weekly Objectives and Milestone challenges - col-span-7 */}
        <div className="lg:col-span-7 bg-[#121218] border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-lime-400" /> Active Weekly Metrics
            </h3>
            <span className="text-[9px] text-lime-400 font-mono">Resets in 2 days</span>
          </div>

          <div className="space-y-3">
            {challenges.map((challenge) => {
              const capProgress = Math.min(100, Math.round((challenge.current / challenge.target) * 100));
              return (
                <div 
                  key={challenge.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                    challenge.completed 
                      ? "bg-slate-950/40 border-lime-500/20 hover:border-lime-500/35" 
                      : "bg-slate-900/40 border-slate-900 hover:border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        {challenge.title}
                        {challenge.completed && (
                          <span className="text-[9px] bg-lime-400/10 text-lime-400 px-2 rounded-full py-0.5">COMPLETE</span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">{challenge.description}</p>
                    </div>

                    <span className="text-lime-400 font-mono font-bold text-xs">+{challenge.xpReward} XP</span>
                  </div>

                  {/* Progress Line graph slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Progress</span>
                      <span>{challenge.current} / {challenge.target}</span>
                    </div>

                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          challenge.completed ? "bg-lime-400" : "bg-lime-600/60"
                        }`}
                        style={{ width: `${capProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Complete mock action for presentation */}
                  {!challenge.completed && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => onCompleteChallenge(challenge.id, challenge.xpReward)}
                        className="bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 hover:text-white font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider cursor-pointer"
                      >
                        Mock Complete Session Progress
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Five distinct achievement badges and level forecasting - col-span-5 */}
        <div className="lg:col-span-5 bg-[#121218] border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-lime-400" /> Professional Badges Matrix
            </h3>
            <span className="text-[9px] text-slate-500 font-mono">Durable collection</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Acquire these historical medals as proof of physical consistency. Claiming unlocked badges triggers substantial XP bursts.
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {achievements.map((ach) => (
              <div 
                key={ach.id}
                className={`flex justify-between items-center p-3 rounded-2xl border transition-all ${
                  ach.unlocked 
                    ? "bg-slate-950 border-slate-800 hover:border-slate-700" 
                    : "bg-slate-900/10 border-slate-950 opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    ach.unlocked 
                      ? "bg-lime-400/10 text-lime-400 border border-lime-400/20" 
                      : "bg-slate-950 text-slate-650 border border-slate-900"
                  }`}>
                    {ach.iconName === "Zap" ? (
                      <Zap className="w-4.5 h-4.5" />
                    ) : ach.iconName === "Shield" ? (
                      <Shield className="w-4.5 h-4.5" />
                    ) : ach.iconName === "Eye" ? (
                      <Star className="w-4.5 h-4.5 text-lime-400" />
                    ) : (
                      <Trophy className="w-4.5 h-4.5" />
                    )}
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {ach.title}
                      {ach.unlocked && <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />}
                    </h5>
                    <p className="text-[10px] text-slate-400">{ach.description}</p>
                  </div>
                </div>

                {ach.unlocked ? (
                  <button 
                    onClick={() => {
                      onClaimAchievement(ach.id, ach.xpReward);
                      alert(`Awesome! Claimed ${ach.xpReward} XP for unlocking "${ach.title}" badge.`);
                    }}
                    className="text-[9px] text-lime-400 bg-lime-400/5 hover:bg-lime-400/10 border border-lime-400/15 py-1 px-2.5 rounded font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Claim +{ach.xpReward} XP
                  </button>
                ) : (
                  <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider mr-2">Locked</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
