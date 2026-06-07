import React, { useState } from "react";
import { UserProfile, WorkoutProgram, WorkoutDay, Exercise } from "../types";
import { 
  Dumbbell, CheckCircle2, Circle, Clock, Flame, Play,
  ChevronDown, ChevronUp, RefreshCw, Sparkles, AlertCircle, Info, ArrowUpRight
} from "lucide-react";
import ExerciseMotionVisualizer, { getExerciseThumbnail } from "./ExerciseMotionVisualizer";

interface WorkoutViewProps {
  profile: UserProfile;
  activeProgram: WorkoutProgram | null;
  activeDayIndex: number;
  exercisesList: Exercise[];
  onCompleteWorkout: (caloriesBurned: number, logDetails: string) => void;
  onModifyProgramDifficulty: (scale: "increase" | "decrease") => void;
  onSwitchDay: (index: number) => void;
  isPhoneMode?: boolean;
}

export default function WorkoutView({
  profile,
  activeProgram,
  activeDayIndex,
  exercisesList,
  onCompleteWorkout,
  onModifyProgramDifficulty,
  onSwitchDay,
  isPhoneMode = false
}: WorkoutViewProps) {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [exerciseStatus, setExerciseStatus] = useState<Record<string, boolean>>({});
  const [weightLogs, setWeightLogs] = useState<Record<string, number>>({});
  const [userRpe, setUserRpe] = useState<number>(7); // RPE scale 1-10
  const [workoutStarted, setWorkoutStarted] = useState<boolean>(false);
  const [aiAdapting, setAiAdapting] = useState<boolean>(false);
  const [adaptiveFeedback, setAdaptiveFeedback] = useState<string>("");

  const program = activeProgram;
  const currentDay = program?.weeks[0]?.days[activeDayIndex] || null;

  const toggleExercise = (exerciseId: string) => {
    setExerciseStatus(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const handleWeightChange = (exerciseId: string, val: number) => {
    setWeightLogs(prev => ({
      ...prev,
      [exerciseId]: val
    }));
  };

  const allCompleted = currentDay?.exercises.every(e => exerciseStatus[e.exerciseId]) || false;
  const totalCompletedCount = currentDay?.exercises.filter(e => exerciseStatus[e.exerciseId]).length || 0;

  const handleFinish = () => {
    // Standard calc: ~80 kcal per exercise, adjusted slightly by user input RPE & workout duration
    const baseKcal = (currentDay?.exercises.length || 4) * 85;
    const intensityMultiplier = 1 + (userRpe - 6) * 0.1;
    const finalKcal = Math.round(baseKcal * intensityMultiplier);
    
    const logDetails = `Intensity RPE: ${userRpe}/10. Completed ${totalCompletedCount} of ${currentDay?.exercises.length || 0} exercises.`;
    
    onCompleteWorkout(finalKcal, logDetails);
    
    // reset status
    setExerciseStatus({});
    setWeightLogs({});
    setWorkoutStarted(false);
  };

  const triggerAdaptiveEvaluation = () => {
    setAiAdapting(true);
    setAdaptiveFeedback("");
    
    setTimeout(() => {
      setAiAdapting(false);
      if (userRpe >= 9) {
        onModifyProgramDifficulty("decrease");
        setAdaptiveFeedback("⚠️ AI Adaptive Engine: RPE is logged as extremely high. We have automatically scaled down the dumbbell & volume goals for next week by -12% to facilitate proper central nervous system recovery.");
      } else if (userRpe <= 5) {
        onModifyProgramDifficulty("increase");
        setAdaptiveFeedback("🔥 AI Adaptive Engine: RPE is logged as light (below 6). Dynamic progressive overload triggered! We have boosted sets and targets by +15% for next week to ensure maximum muscle building velocity.");
      } else {
        setAdaptiveFeedback("✨ AI Adaptive Engine: Pacing is optimal! Dynamic overload is in symmetry. Keeping program progression steady at current levels.");
      }
    }, 1200);
  };

  return (
    <div className="space-y-6" id="workout-view-container">
      {/* Page Title & Pacing */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            FORGE <span className="text-lime-400 italic">TRACKER</span>
          </h2>
          <p className="text-xs text-slate-400">
            Activate physical training schedules under dynamic AI guidance. Complete exercises to earn level XP.
          </p>
        </div>

        {/* Day selection tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-900 overflow-x-auto">
          {program?.weeks[0]?.days.map((day, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSwitchDay(idx);
                setExerciseStatus({});
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeDayIndex === idx
                  ? "bg-lime-400 text-black shadow-md shadow-lime-400/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Day {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {program ? (
        <div className={`grid gap-6 ${isPhoneMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"}`}>
          {/* Main Workout Panel */}
          <div className={`${isPhoneMode ? "col-span-1" : "lg:col-span-8"} space-y-4`}>
            <div className="bg-[#121218] border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                <div>
                  <span className="text-[10px] bg-lime-400/15 text-lime-400 px-2.5 py-1 rounded-full font-mono text-xs uppercase font-extrabold border border-lime-400/20">
                    {program.title}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2 font-serif italic">
                    {currentDay?.dayName || "Active Routine Day"}
                  </h3>
                </div>

                {!workoutStarted ? (
                  <button
                    onClick={() => setWorkoutStarted(true)}
                    className="bg-lime-400 hover:bg-lime-300 text-black font-black text-xs uppercase py-2.5 px-5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Start Gym
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">Logging Active</span>
                  </div>
                )}
              </div>

              {/* Exercises List */}
              <div className="space-y-3 pt-2">
                {currentDay?.exercises.map((item, idx) => {
                  const refExercise = exercisesList.find(e => e.id === item.exerciseId);
                  const isCompleted = !!exerciseStatus[item.exerciseId];
                  const isSelected = selectedExerciseId === item.exerciseId;

                  if (!refExercise) return null;

                  return (
                    <div 
                      key={idx}
                      className={`border rounded-2xl transition-all overflow-hidden ${
                        isSelected 
                          ? "bg-slate-950 border-slate-700 shadow-md" 
                          : "bg-slate-900/50 border-slate-900 hover:border-slate-800"
                      }`}
                    >
                      {/* Exercise Header Line */}
                      <div 
                        onClick={() => setSelectedExerciseId(isSelected ? null : item.exerciseId)}
                        className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-900/40 transition-all group duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (workoutStarted) {
                                toggleExercise(item.exerciseId);
                              }
                            }}
                            disabled={!workoutStarted}
                            className={`p-1 rounded-full transition-colors ${
                              !workoutStarted 
                                ? "text-slate-700 cursor-not-allowed text-xs" 
                                : isCompleted 
                                  ? "text-emerald-400 hover:text-emerald-300" 
                                  : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 fill-current text-emerald-400 text-black border-none" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          {/* Exercise Thumbnail Preview Card */}
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 flex items-center justify-center">
                            <img 
                              src={getExerciseThumbnail(refExercise.id, refExercise.name)} 
                              alt={refExercise.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                            <span className="absolute bottom-1 right-1 text-[7px] text-lime-400 font-bold tracking-widest bg-slate-950/90 px-1 py-0.5 rounded uppercase border border-slate-900">
                              GUIDE
                            </span>
                          </div>

                          <div>
                            <p className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                              {refExercise.name}
                              <span className="text-[9px] bg-lime-450/15 text-lime-400 border border-lime-450/30 py-0.5 px-2 rounded-full font-bold uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                                <Info className="w-2.5 h-2.5 text-lime-400" />
                                {isSelected ? "Hide Guide" : "See form"}
                              </span>
                            </p>
                            <span className="text-xs text-slate-400 font-mono">
                              {item.sets} Sets &times; {item.reps}
                            </span>
                          </div>
                        </div>

                        {/* Weight input logger */}
                        {workoutStarted && (
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="number" 
                              placeholder="Weight" 
                              value={weightLogs[item.exerciseId] || ""}
                              onChange={(e) => handleWeightChange(item.exerciseId, parseFloat(e.target.value) || 0)}
                              className="w-16 bg-slate-950 border border-slate-850 rounded-lg text-center font-mono py-1 text-xs text-lime-400 focus:outline-none"
                            />
                            <span className="text-[10px] text-slate-500 uppercase font-bold">kg</span>
                          </div>
                        )}
                      </div>

                      {/* Expandable How-To & mistakes details to teach correct form */}
                      {isSelected && (
                        <div className="bg-slate-950/60 p-4 border-t border-slate-900 text-xs text-slate-300">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Visual Simulator Column */}
                            <div>
                              <span className="text-[10px] text-lime-400 uppercase font-black tracking-widest block mb-2">Live Guide & Form Simulator</span>
                              <ExerciseMotionVisualizer exercise={refExercise} />
                            </div>

                            {/* Informational Guidelines Column */}
                            <div className="space-y-3.5">
                              <div>
                                <span className="text-[10px] text-lime-400 uppercase font-black tracking-widest block mb-1">Target Area</span>
                                <span className="text-slate-400 text-xs">{refExercise.targetMuscle.join(", ")}</span>
                              </div>
                              
                              <div>
                                <span className="text-[10px] text-lime-400 uppercase font-black tracking-widest block mb-1">Execution Steps</span>
                                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                                  {refExercise.instructions.map((stepStr, sIdx) => (
                                    <li key={sIdx} className="leading-relaxed">{stepStr}</li>
                                  ))}
                                </ol>
                              </div>

                              <div>
                                <span className="text-[10px] text-orange-400 uppercase font-black tracking-widest block mb-1">Common Pitfalls to Avoid</span>
                                <ul className="list-disc list-inside space-y-1 text-slate-400">
                                  {refExercise.commonMistakes.map((mistake, mIdx) => (
                                    <li key={mIdx}>{mistake}</li>
                                  ))}
                                </ul>
                              </div>

                              {refExercise.alternatives && refExercise.alternatives.length > 0 && (
                                <div>
                                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Alternative Movements</span>
                                  <div className="flex flex-wrap gap-1">
                                    {refExercise.alternatives.map((alt, aIdx) => (
                                      <span key={aIdx} className="bg-slate-900 rounded px-2 py-0.5 text-slate-400 text-[10px]">
                                        {alt}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Complete workout button triggers */}
              {workoutStarted && (
                <div className="pt-4 border-t border-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    Completion Status: <span className="text-white font-bold">{totalCompletedCount}</span> of <span className="text-white font-bold">{currentDay?.exercises.length || 0}</span> exercises checked.
                  </div>

                  <button
                    onClick={handleFinish}
                    className="bg-lime-400 text-black py-3 px-6 rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-97 cursor-pointer text-center"
                  >
                    SUBMIT COMPLETED ROUTINE
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI Adaptive Feedback Side Control Panel */}
          <div className={`${isPhoneMode ? "col-span-1" : "lg:col-span-4"} space-y-4`}>
            <div className="bg-[#121218] border border-slate-800 rounded-3xl p-5 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-lime-400" /> AI Pacing & Adaptive Load
              </h4>
              <p className="text-xs text-slate-400">
                FitForge evaluates your perceived exertion rating (RPE) to adapt sets, weights, and muscle targets dynamically for your next week.
              </p>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">
                  How painful/hard was this session? (RPE)
                </label>
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1 font-mono">
                  <span>RPE 1-5 (Light)</span>
                  <span className="text-lime-400 font-bold">{userRpe}/10</span>
                  <span>RPE 9-10 (Extreme)</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="1" 
                  value={userRpe}
                  onChange={(e) => setUserRpe(parseInt(e.target.value))}
                  className="w-full accent-lime-400 bg-slate-950 h-1.5 rounded cursor-pointer"
                />
              </div>

              <button
                onClick={triggerAdaptiveEvaluation}
                disabled={aiAdapting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-850 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                {aiAdapting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-lime-400" />
                    Analyzing Fatigue Logs...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                    Evaluate Recovery Factor
                  </>
                )}
              </button>

              {adaptiveFeedback && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-300">
                  {adaptiveFeedback}
                </div>
              )}
            </div>

            {/* General Coach Tips box */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex gap-3 text-xs">
              <AlertCircle className="w-5 h-5 text-lime-400 flex-shrink-0" />
              <div>
                <span className="font-extrabold text-white block">Form Correction Reminder</span>
                <p className="text-slate-400 mt-1">
                  Remember: Keep your core anchored. Lift under control (2s eccentric, 1s concentric contraction phases) for maximum hypertrophic remodeling.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#121218] border border-slate-800 rounded-2xl p-8 text-center">
          <p className="text-slate-400 text-sm">Please launch onboarding to load workout recommendations.</p>
        </div>
      )}
    </div>
  );
}
