import React, { useState, useEffect } from "react";
import { UserProfile, WorkoutProgram, WorkoutDay, Exercise, CommunityMember, UserChallenge, ChatMessage } from "./types";
import { 
  getGeneratedExercises, generateWorkoutPrograms, BASE_EXERCISES, 
  KEY_CHALLENGES, LIVE_COMMUNITY_MEMBERS, INITIAL_ACHIEVEMENTS, AchievementBadge 
} from "./data";

// Views
import Onboarding from "./components/Onboarding";
import DashboardView from "./components/DashboardView";
import WorkoutView from "./components/WorkoutView";
import ExerciseLibraryView from "./components/ExerciseLibraryView";
import NutritionView from "./components/NutritionView";
import ProgressView from "./components/ProgressView";
import AICoachView from "./components/AICoachView";
import FormAnalyzerView from "./components/FormAnalyzerView";
import ChallengesView from "./components/ChallengesView";
import CommunityView from "./components/CommunityView";
import AdminDashboard from "./components/AdminDashboard";

// Icons
import { 
  Smartphone, Monitor, Bot, Trophy, Apple, Dumbbell, 
  TrendingUp, Compass, Settings, ShieldAlert, Award, Grid, Menu, X, User 
} from "lucide-react";

export default function App() {
  // Mobile frame wrapper state: users can view as a real iOS/Android mock or full-width Web App
  const [viewMode, setViewMode] = useState<"phone" | "web">("phone");
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Forge",
    age: 26,
    sex: "Male",
    height: 180,
    weight: 78,
    goal: "Build Muscle" as any,
    experienceLevel: "Intermediate" as any,
    environment: "Home" as any,
    equipment: ["Dumbbells", "Resistance Bands"] as any,
    frequency: 3,
    duration: 45,
    isOnboarded: false, // forces onboarding
    xp: 320,
    level: 2
  });

  // Main UI Tab active
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [exercisePool] = useState<Exercise[]>(getGeneratedExercises());
  const [workoutPrograms, setWorkoutPrograms] = useState<WorkoutProgram[]>([]);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [completedLogsCount, setCompletedLogsCount] = useState<number>(3);
  const [weeklyXp, setWeeklyXp] = useState<number>(240);
  
  // Custom states for interactive boards
  const [challenges, setChallenges] = useState<UserChallenge[]>(KEY_CHALLENGES);
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>(LIVE_COMMUNITY_MEMBERS);
  const [achievements, setAchievements] = useState<AchievementBadge[]>(() => {
    // Return with first badge unlocked by default
    return INITIAL_ACHIEVEMENTS;
  });

  // Chat message logs
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: "1", sender: "ai", text: `Greetings Warrior! I am Coach Forge, your private AI fitness assistant. I have mapped out your musculoskeletal density targets. Let's tackle today's dumbbell curls. How can I help you?`, timestamp: new Date().toLocaleTimeString() }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Generate customized programs when profile is loaded or modified
  useEffect(() => {
    if (profile.isOnboarded) {
      const generated = generateWorkoutPrograms(profile.goal, profile.experienceLevel, profile.equipment);
      setWorkoutPrograms(generated);
    }
  }, [profile.isOnboarded, profile.goal, profile.experienceLevel, profile.equipment]);

  const activeProgram = workoutPrograms[0] || null;

  // Onboarding Complete callback
  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    // Switch default view back to phone for maximum aesthetic
    setViewMode("phone");
  };

  // Claim achievement reward
  const handleClaimAchievement = (achId: string, xpReward: number) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === achId) return { ...a, unlocked: true };
      return a;
    }));
    setProfile(prev => ({
      ...prev,
      xp: prev.xp + xpReward,
      level: Math.floor((prev.xp + xpReward) / 1000) + 1
    }));
    setWeeklyXp(prev => prev + xpReward);
  };

  // Handle manual or automatic XP updates
  const handleEarnXp = (amount: number) => {
    setProfile(prev => {
      const newXp = prev.xp + amount;
      const calculatedLevel = Math.floor(newXp / 1000) + 1;
      return {
        ...prev,
        xp: newXp,
        level: calculatedLevel
      };
    });
    setWeeklyXp(prev => prev + amount);
  };

  // Log active workout completion
  const handleWorkoutCompletion = (caloriesBurned: number, logDetails: string) => {
    const earnedXp = 450;
    handleEarnXp(earnedXp);
    setCompletedLogsCount(prev => prev + 1);
    
    // Unlock "Ironclad Will" badge if logged is now 4+
    if (completedLogsCount + 1 >= 4) {
      setAchievements(prev => prev.map(a => {
        if (a.id === "ach_2") return { ...a, unlocked: true };
        return a;
      }));
    }

    // Toggle Chal_1 complete
    setChallenges(prev => prev.map(c => {
      if (c.id === "chall_1") {
        return { ...c, current: 1, completed: true };
      }
      return c;
    }));

    alert(`🎉 Workout logged successfully!\n- Consumed effort: +${caloriesBurned} kcal burned\n- Rewards: +${earnedXp} FitForge system XP modifiers\n\nAI Engine: High protein protein targets mapped to your Nutrition Coach page.`);
    setActiveTab("dashboard");
  };

  // Complete a user challenge
  const handleCompleteChallenge = (challengeId: string, xpReward: number) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId) {
        return { ...c, current: c.target, completed: true };
      }
      return c;
    }));
    handleEarnXp(xpReward);
  };

  // Add/remove connections
  const handleToggleFriend = (memberId: string) => {
    setCommunityMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return { ...m, isFriend: !m.isFriend };
      }
      return m;
    }));
  };

  // AI chat routing
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: String(chatHistory.length + 1),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: chatHistory,
          profile
        })
      });

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: String(chatHistory.length + 2),
        sender: "ai",
        text: data.text,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  // If not onboarded yet, enforce onboarding beautifully
  if (!profile.isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Active view dispatcher
  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView 
            profile={profile} 
            activeProgram={activeProgram}
            activeDayIndex={activeDayIndex}
            onNavigate={(tab) => setActiveTab(tab)}
            completedLogsCount={completedLogsCount}
            weeklyXp={weeklyXp}
          />
        );
      case "workout":
        return (
          <WorkoutView
            profile={profile}
            activeProgram={activeProgram}
            activeDayIndex={activeDayIndex}
            exercisesList={exercisePool}
            onCompleteWorkout={handleWorkoutCompletion}
            onModifyProgramDifficulty={(scale) => {
              console.log(`Adapting active difficulties to: ${scale}`);
            }}
            onSwitchDay={(idx) => setActiveDayIndex(idx)}
          />
        );
      case "exerciseLibrary":
        return <ExerciseLibraryView exercisesList={exercisePool} />;
      case "nutrition":
        return <NutritionView profile={profile} />;
      case "progress":
        return (
          <ProgressView 
            profile={profile} 
            onChangeWeight={(newW) => setProfile(prev => ({ ...prev, weight: newW }))} 
          />
        );
      case "aiCoach":
        return (
          <AICoachView
            profile={profile}
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            loadingMessage={chatLoading}
          />
        );
      case "formVision":
        return <FormAnalyzerView onEarnXp={handleEarnXp} />;
      case "challenges":
        return (
          <ChallengesView
            profile={profile}
            challenges={challenges}
            onCompleteChallenge={handleCompleteChallenge}
            achievements={achievements}
            onClaimAchievement={handleClaimAchievement}
          />
        );
      case "community":
        return (
          <CommunityView
            profile={profile}
            members={communityMembers}
            onToggleFriend={handleToggleFriend}
          />
        );
      case "admin":
        return (
          <AdminDashboard
            profile={profile}
            onChangeProfile={(updated) => setProfile(updated)}
            exercisesCount={exercisePool.length}
          />
        );
      default:
        return <div className="text-slate-400 py-12 text-center">Selecting Forge metrics...</div>;
    }
  };

  // Nav categories list
  const tabsList = [
    { id: "dashboard", label: "Dashboard", icon: Grid },
    { id: "workout", label: "Workouts", icon: Dumbbell },
    { id: "exerciseLibrary", label: "Exercise Wiki", icon: Compass },
    { id: "nutrition", label: "AI Nutrition", icon: Apple },
    { id: "progress", label: "Analytics", icon: TrendingUp },
    { id: "aiCoach", label: "AI Coach", icon: Bot },
    { id: "formVision", label: "AI Vision Form", icon: Award },
    { id: "challenges", label: "Challenges", icon: Trophy },
    { id: "community", label: "Leaderboard", icon: User },
    { id: "admin", label: "Admin Panel", icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col justify-between select-none">
      
      {/* Universal Head HUD / Header */}
      <header className="bg-[#0b0b0e] border-b border-slate-900/60 sticky top-0 z-40 px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-lime-500 to-lime-600 rounded-lg">
              <Dumbbell className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-extrabold uppercase font-sans tracking-tight text-white text-md">FITFORGE <span className="text-lime-400 italic">AI</span></span>
              <span className="text-[9px] text-slate-500 font-mono block">Intelligent Personal Coach</span>
            </div>
          </div>

          {/* Quick toggle device frame view mode requested by User: Make it a mobile app */}
          <div className="flex items-center gap-1.5 bg-[#121217] p-1 rounded-xl border border-slate-850">
            <button
              onClick={() => setViewMode("phone")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "phone" ? "bg-lime-450 text-black font-bold" : "text-slate-450 hover:text-white"
              }`}
              title="iOS/Android Smartphone Look"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("web")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "web" ? "bg-lime-450 text-black font-bold" : "text-slate-450 hover:text-white"
              }`}
              title="Full Width Web View"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-6 px-4">
        {viewMode === "phone" ? (
          /* Phone Shell Frame Representation to deliver "please make it a mobile app" */
          <div className="flex justify-center items-center py-4">
            <div className="w-[385px] h-[780px] bg-[#0c0c10] border-[10px] border-[#1d1d23] rounded-[45px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between ring-1 ring-white/10">
              
              {/* iPhone Notch Speaker details */}
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
                <div className="w-32 bg-[#1d1d23] h-4 rounded-b-2xl flex items-center justify-center">
                  <div className="w-8 h-1 bg-black/60 rounded-full" />
                </div>
              </div>

              {/* Scrollable Mobile Body */}
              <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4 space-y-4">
                {renderActiveView()}
              </div>

              {/* Standard Smartphone dense Bottom Bar Navigation with touch targets */}
              <nav className="bg-[#121218] border-t border-slate-900 pb-2.5 pt-2 px-1 flex justify-around items-center text-[9px] text-slate-500 sticky bottom-0 z-40 rounded-b-[35px]">
                {tabsList.slice(0, 5).map((tb) => {
                  const Icon = tb.icon;
                  const active = activeTab === tb.id;
                  return (
                    <button
                      key={tb.id}
                      onClick={() => setActiveTab(tb.id)}
                      className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                        active ? "text-lime-400" : "hover:text-slate-350"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-semibold text-[8px] transform scale-90">{tb.label}</span>
                    </button>
                  );
                })}
                <button
                  onClick={() => setActiveTab("aiCoach")}
                  className={`flex flex-col items-center gap-1 cursor-pointer ${
                    activeTab === "aiCoach" ? "text-lime-400" : "hover:text-slate-350"
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  <span className="font-semibold text-[8px] transform scale-90">Coach</span>
                </button>
              </nav>
            </div>
          </div>
        ) : (
          /* Desktop / iPad Responsive side-rail Web Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Desktop Side Navigation Rail - col-span-3 */}
            <aside className="lg:col-span-3 bg-[#111116] border border-slate-900/60 rounded-3xl p-4 h-fit sticky top-24">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-900 flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-400 to-lime-500 flex items-center justify-center font-black text-[#070709]">
                  {profile.name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">{profile.name}</h4>
                  <span className="text-[10px] text-slate-400 block font-mono">Lvl {profile.level} Contender</span>
                </div>
              </div>

              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest pl-2 block mb-3">Athletic Workspace Hub</span>

              <nav className="space-y-1">
                {tabsList.map((tb) => {
                  const Icon = tb.icon;
                  const active = activeTab === tb.id;
                  return (
                    <button
                      key={tb.id}
                      onClick={() => setActiveTab(tb.id)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center gap-3 transition-colors cursor-pointer ${
                        active 
                          ? "bg-lime-400 text-black" 
                          : "text-slate-450 hover:text-white hover:bg-slate-950/60"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tb.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Desktop content container - col-span-9 */}
            <div className="lg:col-span-9">
              {renderActiveView()}
            </div>
          </div>
        )}
      </main>

      {/* Footer details */}
      <footer className="bg-[#0b0b0e] border-t border-slate-900/40 py-4 px-4 text-center text-[10px] text-slate-650 font-mono">
        &copy; 2026 FITFORGE AI. DeepMind Antigravity Engine synchronized securely.
      </footer>
    </div>
  );
}
