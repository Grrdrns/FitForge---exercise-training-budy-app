import React, { useState, useEffect } from "react";
import { Exercise } from "../types";
import { Dumbbell, Sparkles, HelpCircle, Activity, Info } from "lucide-react";

export function getExerciseThumbnail(exId: string, name: string): string {
  const idClean = exId.toLowerCase();
  const nameClean = name.toLowerCase();

  if (idClean.includes("push_up") || nameClean.includes("push-up") || nameClean.includes("pushup")) {
    return "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&auto=format&fit=crop&q=80";
  }
  if (idClean.includes("squat") || nameClean.includes("squat")) {
    return "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=150&auto=format&fit=crop&q=80";
  }
  if (idClean.includes("bench_press") || nameClean.includes("bench press") || nameClean.includes("press")) {
    return "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=80";
  }
  if (idClean.includes("shoulder_press") || nameClean.includes("shoulder press")) {
    return "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=150&auto=format&fit=crop&q=80";
  }
  if (idClean.includes("row") || nameClean.includes("row")) {
    return "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=150&auto=format&fit=crop&q=80";
  }
  if (idClean.includes("glute_bridge") || nameClean.includes("bridge") || nameClean.includes("hip thrust")) {
    return "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=150&auto=format&fit=crop&q=80";
  }
  if (idClean.includes("plank") || nameClean.includes("plank")) {
    return "https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=150&auto=format&fit=crop&q=80";
  }
  if (idClean.includes("bird_dog") || nameClean.includes("bird dog")) {
    return "https://images.unsplash.com/photo-1607962837359-5e7e89f8664e?w=150&auto=format&fit=crop&q=80";
  }
  if (idClean.includes("marching") || idClean.includes("jacks") || nameClean.includes("cardio") || nameClean.includes("march") || nameClean.includes("jump")) {
    return "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=150&auto=format&fit=crop&q=80";
  }

  // Default fallback
  return "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=80";
}

interface ExerciseMotionVisualizerProps {
  exercise: Exercise;
}

export default function ExerciseMotionVisualizer({ exercise }: ExerciseMotionVisualizerProps) {
  const [viewMode, setViewMode] = useState<"photo" | "simulator">("simulator");
  const [animationPhase, setAnimationPhase] = useState<"start" | "contract">("start");
  const [seconds, setSeconds] = useState(0);

  // Auto loop the eccentric and concentric phases every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev === "start" ? "contract" : "start"));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Simple ticking counter for stopwatch feel
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev + 1) % 6);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getMediaConfig = (exId: string, name: string) => {
    const idClean = exId.toLowerCase();
    const nameClean = name.toLowerCase();

    if (idClean.includes("push_up") || nameClean.includes("push-up") || nameClean.includes("pushup")) {
      return {
        photoUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
        type: "pushup",
        targetMuscle: "Pectoralis Major (Chest)",
        cue: "Lower chest to 2 inches off floor. Do not sag hips."
      };
    }
    if (idClean.includes("squat") || nameClean.includes("squat")) {
      return {
        photoUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
        type: "squat",
        targetMuscle: "Quadriceps & Gluteus Maximus",
        cue: "Drive knees outward. Sit back until hips pass below parallel."
      };
    }
    if (idClean.includes("bench_press") || nameClean.includes("bench press") || nameClean.includes("press")) {
      return {
        photoUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
        type: "bench_press",
        targetMuscle: "Sternal Pectoralis & Anterior Deltoid",
        cue: "Keep shoulders retracted back and flat on the pad."
      };
    }
    if (idClean.includes("shoulder_press") || nameClean.includes("shoulder press")) {
      return {
        photoUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
        type: "shoulder_press",
        targetMuscle: "Anterior Deltoids & Triceps Brachii",
        cue: "Press straight up directly over your crown. Lock core."
      };
    }
    if (idClean.includes("row") || nameClean.includes("row")) {
      return {
        photoUrl: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=600&auto=format&fit=crop&q=80",
        type: "row",
        targetMuscle: "Latissimus Dorsi & Rhomboids",
        cue: "Pull elbow up and back towards your outer hip pocket."
      };
    }
    if (idClean.includes("glute_bridge") || nameClean.includes("bridge") || nameClean.includes("hip thrust")) {
      return {
        photoUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
        type: "bridge",
        targetMuscle: "Gluteus Maximus & Hamstrings",
        cue: "Drive through your heels. Squeeze glutes fully at apex."
      };
    }
    if (idClean.includes("plank") || nameClean.includes("plank")) {
      return {
        photoUrl: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=600&auto=format&fit=crop&q=80",
        type: "plank",
        targetMuscle: "Rectus Abdominis & Transverse Abdominis",
        cue: "Create a rigid straight line. Brace abs like taking a punch."
      };
    }
    if (idClean.includes("bird_dog") || nameClean.includes("bird dog")) {
      return {
        photoUrl: "https://images.unsplash.com/photo-1607962837359-5e7e89f8664e?w=600&auto=format&fit=crop&q=80",
        type: "bird_dog",
        targetMuscle: "Erector Spinae & Core Stabilizers",
        cue: "Extend leg and arm straight out level, not flying up high."
      };
    }
    if (idClean.includes("marching") || idClean.includes("jacks") || nameClean.includes("cardio") || nameClean.includes("march") || nameClean.includes("jump")) {
      return {
        photoUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&auto=format&fit=crop&q=80",
        type: "cardio",
        targetMuscle: "Cardiorespiratory / Full-Body Endocrine Focus",
        cue: "Keep your chest high and land light as air on your landing toes."
      };
    }

    // Default Fallback
    return {
      photoUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      type: "default",
      targetMuscle: "Active Muscle Recruitment Matrix",
      cue: "Move under solid skeletal control. Flex and extend slowly."
    };
  };

  const media = getMediaConfig(exercise.id, exercise.name);

  return (
    <div className="space-y-3" id={`exercise-visualizer-${exercise.id}`}>
      {/* Selector tab switches */}
      <div className="flex justify-between items-center bg-slate-950 p-1 rounded-xl border border-slate-900 text-[10px] font-black uppercase text-center">
        <button
          onClick={() => setViewMode("simulator")}
          className={`flex-1 py-1.5 px-2 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
            viewMode === "simulator" ? "bg-[#181820] text-lime-400 font-extrabold border border-slate-800" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Activity className="w-3 h-3 text-lime-400" />
          Joint Motion Simulator
        </button>
        <button
          onClick={() => setViewMode("photo")}
          className={`flex-1 py-1.5 px-2 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
            viewMode === "photo" ? "bg-[#181820] text-lime-400 font-extrabold border border-slate-800" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Dumbbell className="w-3 h-3 text-lime-400" />
          Pro Athlete Model
        </button>
      </div>

      {/* Main Visual Box */}
      <div className="relative bg-slate-950 rounded-2xl h-56 border border-slate-900 overflow-hidden flex items-center justify-center select-none">
        
        {/* Dynamic status badges in top row */}
        <div className="absolute top-2.5 left-2.5 z-20 flex gap-2">
          <span className="text-[8.5px] bg-black/65 border border-lime-400/20 py-0.5 px-2.5 rounded-full font-bold text-lime-400 uppercase tracking-wider flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${animationPhase === "start" ? "bg-cyan-400 animate-pulse" : "bg-lime-400"}`} />
            {animationPhase === "start" ? "Phase 1: Eccentric" : "Phase 2: Concentric"}
          </span>
        </div>

        <div className="absolute top-2.5 right-2.5 z-20">
          <span className="text-[8.5px] bg-black/65 text-slate-400 font-mono tracking-wider py-0.5 px-2 rounded-md border border-slate-800">
            LOAD: {animationPhase === "start" ? "0.0s SEC" : "2.5s SEC"}
          </span>
        </div>

        {/* View Mode 1: Real Photo with interactive target pointers overlaid */}
        {viewMode === "photo" ? (
          <div className="w-full h-full relative group">
            <img 
              src={media.photoUrl} 
              alt={exercise.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60 group-hover:scale-103 transition-transform duration-700"
            />
            {/* Dark gradient mapping overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

            {/* Pulsing joint anchor overlays based on active state */}
            {media.type === "pushup" && (
              <>
                {/* Elbow dot */}
                <div 
                  className={`absolute left-[45%] rounded-full border border-lime-400 flex items-center justify-center text-[8px] bg-black/80 font-mono text-lime-400 px-1 py-0.5 transition-all duration-1000 ${
                    animationPhase === "start" ? "top-[50%] scale-100" : "top-[55%] scale-110"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-ping mr-1" />
                  Elbow (45°)
                </div>
                {/* Chest dot */}
                <div className="absolute top-[40%] left-[30%] rounded-full border border-rose-500/30 bg-rose-500/10 h-10 w-10 animate-pulse flex items-center justify-center">
                  <span className="text-[7.5px] font-black text-rose-400 uppercase">Target</span>
                </div>
              </>
            )}

            {media.type === "squat" && (
              <>
                {/* Knee pointer */}
                <div 
                  className={`absolute left-[48%] rounded-full border border-lime-400 flex items-center justify-center text-[8px] bg-black/80 font-mono text-lime-400 px-1 py-0.5 transition-all duration-1000 ${
                    animationPhase === "start" ? "top-[40%] scale-100" : "top-[52%] scale-110"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-ping mr-1" />
                  Hip Crease
                </div>
                {/* Quads pointer */}
                <div className="absolute top-[55%] left-[35%] rounded-full border border-rose-500/30 bg-rose-500/10 h-10 w-10 animate-pulse flex items-center justify-center">
                  <span className="text-[7.5px] font-black text-rose-400 uppercase">TENSION</span>
                </div>
              </>
            )}

            {media.type === "bench_press" && (
              <>
                {/* Shoulder focus */}
                <div className="absolute top-[35%] left-[40%] rounded-full border border-cyan-400 flex items-center justify-center text-[8px] bg-black/85 font-mono text-cyan-400 px-1.5 py-0.5">
                  Retracted Scapula
                </div>
                {/* Weights motion path */}
                <div 
                  className={`absolute left-[54%] rounded-full border border-lime-400 flex items-center justify-center text-[8px] bg-black/85 font-mono text-lime-400 px-1 py-0.5 transition-all duration-1000 ${
                    animationPhase === "start" ? "top-[15%] scale-115" : "top-[32%] scale-85"
                  }`}
                >
                  {animationPhase === "start" ? "Peak Lock" : "Lowering"}
                </div>
              </>
            )}

            {/* Default anchor highlights */}
            {media.type !== "pushup" && media.type !== "squat" && media.type !== "bench_press" && (
              <div className="absolute bottom-5 left-5 z-10">
                <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-md block">
                  📍 Posture Stabilized • Core Fully Clenched
                </span>
              </div>
            )}
          </div>
        ) : (
          // View Mode 2: Highly intuitive glowing joint animation simulator!
          <div className="w-full h-full relative bg-slate-950 flex items-center justify-center p-4">
            
            {/* Embedded Grid background to mimic specialized coaching diagnostic lab */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />

            {/* Skeletal Vector Render based on Exercise type */}
            <div className="w-full h-full max-w-[280px] flex items-center justify-center relative">
              {media.type === "pushup" && (
                <svg viewBox="0 0 200 120" className="w-full h-full">
                  {/* Floor line */}
                  <line x1="10" y1="100" x2="190" y2="100" stroke="#1e293b" strokeWidth="2" strokeDasharray="3,3" />
                  
                  {/* Feet anchor constant */}
                  <circle cx="30" cy="98" r="4.5" fill="#64748b" />
                  <text x="15" y="115" className="text-[8px] fill-slate-500 font-mono">FEET</text>

                  {/* Body Bar dynamically pivots near feet based on height/position */}
                  {/* Phase start: diagonal up. Phase contract: body lowered parallel */}
                  {animationPhase === "start" ? (
                    <>
                      {/* Torso/Body trunk line */}
                      <line x1="30" y1="98" x2="140" y2="45" stroke="#f43f5e" strokeWidth="4.5" strokeLinecap="round" className="transition-all duration-1000" />
                      {/* Shoulder point */}
                      <circle cx="140" cy="45" r="5" fill="#ec4899" className="transition-all duration-1000" />
                      <text x="145" y="42" className="text-[8px] fill-rose-400 font-mono">SHOULDER</text>
                      {/* Head block */}
                      <circle cx="158" cy="36" r="6" fill="#f43f5e" className="transition-all duration-1000" />
                      {/* Arm support going down to floor */}
                      <line x1="140" y1="45" x2="125" y2="72" stroke="#a3e635" strokeWidth="3" className="transition-all duration-1000" />
                      <line x1="125" y1="72" x2="120" y2="100" stroke="#a3e635" strokeWidth="3" className="transition-all duration-1000" />
                      {/* Elbow link */}
                      <circle cx="125" cy="72" r="3.5" fill="#a3e635" className="transition-all duration-1000" />
                    </>
                  ) : (
                    <>
                      {/* Torso/Body trunk line lowered closer to floor */}
                      <line x1="30" y1="98" x2="140" y2="78" stroke="#a3e635" strokeWidth="4.5" strokeLinecap="round" className="transition-all duration-1000" />
                      {/* Shoulder point */}
                      <circle cx="140" cy="78" r="5" fill="#a3e635" className="transition-all duration-1000" />
                      <text x="145" y="75" className="text-[8px] fill-lime-400 font-mono">DEEP FLEX</text>
                      {/* Head block */}
                      <circle cx="158" cy="69" r="6" fill="#a3e635" className="transition-all duration-1000" />
                      {/* Arm support compressed */}
                      <line x1="140" y1="78" x2="110" y2="88" stroke="#ca8a04" strokeWidth="3" className="transition-all duration-1000" />
                      <line x1="110" y1="88" x2="115" y2="100" stroke="#ca8a04" strokeWidth="3" className="transition-all duration-1000" />
                      {/* Elbow link pressed far */}
                      <circle cx="110" cy="88" r="3.5" fill="#eab308" className="transition-all duration-1000" />
                    </>
                  )}
                  {/* Hand floor anchor */}
                  <circle cx="118" cy="100" r="4" fill="#38bdf8" />
                  <text x="110" y="112" className="text-[8px] fill-sky-400 font-mono">HAND</text>
                </svg>
              )}

              {media.type === "squat" && (
                <svg viewBox="0 0 200 120" className="w-full h-full">
                  {/* Floor line */}
                  <line x1="10" y1="110" x2="190" y2="110" stroke="#1e293b" strokeWidth="2" strokeDasharray="3,3" />
                  {/* Feet anchor constant */}
                  <circle cx="100" cy="110" r="5" fill="#38bdf8" />
                  <text x="90" y="122" className="text-[8px] fill-sky-400 font-mono text-center">STANCE</text>

                  {animationPhase === "start" ? (
                    <>
                      {/* Stand erect position */}
                      <line x1="100" y1="110" x2="100" y2="78" stroke="#38bdf8" strokeWidth="3.5" /> {/* Shin */}
                      <circle cx="100" cy="78" r="4" fill="#38bdf8" /> {/* Knee */}
                      <line x1="100" y1="78" x2="100" y2="45" stroke="#f43f5e" strokeWidth="4" /> {/* Femur/Thigh */}
                      <circle cx="100" cy="45" r="4.5" fill="#f43f5e" /> {/* Hip joint */}
                      <line x1="100" y1="45" x2="100" y2="18" stroke="#f59e0b" strokeWidth="4" /> {/* Torso */}
                      <circle cx="100" cy="10" r="5.5" fill="#f59e0b" /> {/* Head */}
                    </>
                  ) : (
                    <>
                      {/* Squat crouched position */}
                      <line x1="100" y1="110" x2="114" y2="84" stroke="#a3e635" strokeWidth="3.5" className="transition-all duration-1000" /> {/* Shin bent forward */}
                      <circle cx="114" cy="84" r="4" fill="#a3e635" className="transition-all duration-1000" /> {/* Knee bent */}
                      {/* Femur/Thigh going back horizontally */}
                      <line x1="114" y1="84" x2="72" y2="85" stroke="#f43f5e" strokeWidth="4" className="transition-all duration-1000" /> 
                      <circle cx="72" cy="85" r="4.5" fill="#f43f5e" className="transition-all duration-1000" /> {/* Hip below knee line! */}
                      <text x="35" y="88" className="text-[8px] fill-rose-450 font-mono">HIP DEPTH</text>
                      {/* Torso straight but angled forward */}
                      <line x1="72" y1="85" x2="88" y2="52" stroke="#a3e635" strokeWidth="4" className="transition-all duration-1000" /> 
                      <circle cx="88" cy="46" r="5.5" fill="#a3e635" className="transition-all duration-1000" /> {/* Head */}
                    </>
                  )}
                </svg>
              )}

              {/* Default or generic animated barbell curl model */}
              {media.type !== "pushup" && media.type !== "squat" && (
                <svg viewBox="0 0 200 120" className="w-full h-full">
                  <circle cx="100" cy="40" r="6.5" fill="#38bdf8" /> {/* Head */}
                  <line x1="100" y1="47" x2="100" y2="85" stroke="#64748b" strokeWidth="4" /> {/* Spine */}
                  <circle cx="100" cy="85" r="4" fill="#64748b" /> {/* Hip */}

                  {/* Shoulder pivot anchor */}
                  <circle cx="85" cy="50" r="3.5" fill="#eab308" />

                  {animationPhase === "start" ? (
                    <>
                      {/* Lowered arm holding weight */}
                      <line x1="85" y1="50" x2="85" y2="82" stroke="#ca8a04" strokeWidth="3" />
                      {/* Hand holding dumbbell */}
                      <circle cx="85" cy="82" r="4" fill="#f43f5e" />
                      <line x1="72" y1="82" x2="98" y2="82" stroke="#f43f5e" strokeWidth="2.5" />
                    </>
                  ) : (
                    <>
                      {/* Curled upward arm towards shoulder */}
                      <line x1="85" y1="50" x2="72" y2="60" stroke="#a3e635" strokeWidth="35" className="transition-all duration-1000" />
                      {/* High hand holding dumbbell */}
                      <circle cx="72" cy="60" r="4" fill="#a3e635" className="transition-all duration-1000" />
                      <line x1="60" y1="60" x2="84" y2="60" stroke="#38bdf8" strokeWidth="2.5" className="transition-all duration-1000" />
                    </>
                  )}
                </svg>
              )}
            </div>
            
            {/* Hologram aesthetic lines */}
            <div className="absolute inset-x-0 bottom-3 text-center">
              <span className="text-[7.5px] font-mono tracking-widest text-[#a3e635] uppercase bg-[#181820] border border-lime-400/20 py-0.5 px-2 rounded">
                🤖 DIAGNOSTIC ACTIVE WAVE MODEL LOGGED
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Under-visual Cue explanation bar */}
      <div className="bg-slate-950 p-2 text-[10px] rounded-xl border border-slate-900/60 leading-tight space-y-1">
        <div className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
          <span className="font-extrabold text-white text-[10px]">COACH TARGET CUE:</span>
        </div>
        <p className="text-slate-400 italic">
          "{media.cue}"
        </p>
      </div>
    </div>
  );
}
