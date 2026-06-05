import React, { useState } from "react";
import { UserProfile, CommunityMember } from "../types";
import { Users, UserPlus, Flame, Play, MessageSquare, Compass, Send, CheckCircle2 } from "lucide-react";

interface CommunityViewProps {
  profile: UserProfile;
  members: CommunityMember[];
  onToggleFriend: (memberId: string) => void;
}

export default function CommunityView({
  profile,
  members,
  onToggleFriend
}: CommunityViewProps) {
  const [feedPosts, setFeedPosts] = useState([
    { id: 1, name: "Marcus Fletcher", level: 62, text: "Just completed a 1h metabolic conditioning loop! Legs are absolute jello. Who is hitting the cardio trails tonight?", likes: 14, commented: false },
    { id: 2, name: "Sarah 'Lift' Jenkins", level: 42, text: "New PB on Dumbbell Row! Scale adaptation triggered +12% weight raise today from Coach Forge AI.", likes: 8, commented: false }
  ]);
  const [newStatus, setNewStatus] = useState("");
  const [loggedPost, setLoggedPost] = useState(false);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus.trim()) return;

    setFeedPosts(prev => [
      {
        id: prev.length + 1,
        name: profile.name,
        level: profile.level,
        text: newStatus,
        likes: 1,
        commented: false
      },
      ...prev
    ]);
    setNewStatus("");
    setLoggedPost(true);
    setTimeout(() => setLoggedPost(false), 2500);
  };

  const handleLike = (id: number) => {
    setFeedPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6" id="community-container">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
          LIVE <span className="text-lime-400 italic">LEADERBOARDS</span>
        </h2>
        <p className="text-xs text-slate-400">
          Foster competition, compare weekly XP totals, and share physical progression metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        {/* Left Side: Weekly Active XP Leaderboards - col-span-5 */}
        <div className="lg:col-span-5 bg-[#121218] border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              <Users className="w-4 h-4 text-lime-400" /> Weekly XP Leaderboard
            </h3>
            <span className="text-[10px] text-lime-400 font-mono">Global live</span>
          </div>

          <div className="space-y-2.5">
            {/* The Active user listed explicitly at current week position */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-lime-400 text-black border border-lime-400/30">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black">#3</span>
                <div>
                  <h4 className="font-extrabold text-xs leading-none">{profile.name} (You)</h4>
                  <span className="text-[9px] font-bold uppercase tracking-wider block mt-1 text-black/70">Level {profile.level} Contender</span>
                </div>
              </div>
              <span className="font-mono text-xs font-black">{profile.xp} XP</span>
            </div>

            {/* Loop simulated global members */}
            {members.map((member, index) => {
              const displayPlace = index + 1 >= 3 ? index + 2 : index + 1;
              return (
                <div 
                  key={member.id}
                  className="flex justify-between items-center p-3 rounded-2xl bg-slate-950/80 border border-slate-900 hover:border-slate-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-500 font-bold">#{displayPlace}</span>
                    <div>
                      <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5 leading-none">
                        {member.name}
                        {member.isFriend && (
                          <span className="h-1 w-1 rounded-full bg-lime-400" title="Mutual connection" />
                        )}
                      </h4>
                      <span className="text-[9px] text-slate-500 block mt-1">{member.recentActivity}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-450 font-bold">{member.xpOnWeeklyLeaderboard} <span className="text-[9px] text-slate-600">XP</span></span>
                    
                    <button
                      onClick={() => onToggleFriend(member.id)}
                      className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        member.isFriend 
                          ? "border-lime-500/10 hover:border-lime-400/20 text-lime-400" 
                          : "border-slate-800 hover:border-slate-700 text-slate-500 hover:text-white"
                      }`}
                      title={member.isFriend ? "Friend added" : "Add Friend"}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Simulated feed posts for progress sharing - col-span-7 */}
        <div className="lg:col-span-7 bg-[#121218] border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-lime-400" /> Community Progression Feed
            </h3>
            <span className="text-[9px] text-slate-500">2 posts in loop</span>
          </div>

          {/* Form to submit status */}
          <form onSubmit={handlePost} className="bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-3">
            <textarea
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              placeholder="Share your daily cardio workout milestones, body composition target adjustments or dumbbell Overloads..."
              rows={2}
              className="w-full bg-transparent border-none text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none font-sans"
            />

            <div className="flex justify-between items-center pt-2 border-t border-slate-900/60">
              <span className="text-[9px] text-slate-500 uppercase font-mono font-bold">Draft as @{profile.name.toLowerCase()}</span>
              
              <button
                type="submit"
                className="bg-lime-400 hover:bg-lime-300 text-black text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3 h-3 text-black" /> POST STATUS
              </button>
            </div>
          </form>

          {loggedPost && (
            <div className="p-2.5 bg-[#121218] border border-lime-400/20 text-xs text-lime-400 rounded-xl">
              🎯 Post successfully broadcasted to live FitForge boards! Added +10 XP for community compliance.
            </div>
          )}

          {/* Feed List loop */}
          <div className="space-y-3">
            {feedPosts.map((post) => (
              <div key={post.id} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-xs font-extrabold text-white">{post.name}</h5>
                    <span className="text-[9px] text-lime-400 uppercase font-bold tracking-wider block">Level {post.level} Athlete</span>
                  </div>
                  <span className="text-[9px] text-slate-600 font-mono">Just Now</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">{post.text}</p>

                <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono pt-1.5">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1 text-slate-450 hover:text-rose-400 cursor-pointer transition-colors"
                  >
                    <Flame className="w-4 h-4 text-orange-500 fill-current" /> {post.likes} Likes
                  </button>
                  <button className="flex items-center gap-1 text-slate-450 hover:text-slate-300">
                    <MessageSquare className="w-3.5 h-3.5" /> Comments (0)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
