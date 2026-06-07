import React, { useState, useMemo } from "react";
import { Exercise, Equipment, ExperienceLevel } from "../types";
import { Search, Dumbbell, Sparkles, Filter, ChevronRight } from "lucide-react";
import ExerciseMotionVisualizer from "./ExerciseMotionVisualizer";

interface ExerciseLibraryViewProps {
  exercisesList: Exercise[];
}

export default function ExerciseLibraryView({ exercisesList }: ExerciseLibraryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("All");
  const [selectedEquip, setSelectedEquip] = useState<string>("All");
  const [selectedDiff, setSelectedDiff] = useState<string>("All");
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  // All core options
  const muscles = ["All", "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Quads", "Hamstrings", "Glutes", "Core", "Cardio"];
  const equipmentOptions = ["All", "No Equipment", "Resistance Bands", "Dumbbells", "Kettlebells", "Full Home Gym", "Commercial Gym"];
  const diffs = ["All", "Beginner", "Intermediate", "Expert"];

  // Filter computation
  const filteredList = useMemo(() => {
    return exercisesList.filter(exercise => {
      const matchSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exercise.targetMuscle.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchMuscle = selectedMuscle === "All" || exercise.targetMuscle.includes(selectedMuscle);
      
      const matchEquip = selectedEquip === "All" || exercise.equipmentNeeded.some(e => e === selectedEquip);
      
      const matchDiff = selectedDiff === "All" || exercise.difficulty === selectedDiff;

      return matchSearch && matchMuscle && matchEquip && matchDiff;
    });
  }, [exercisesList, searchTerm, selectedMuscle, selectedEquip, selectedDiff]);

  return (
    <div className="space-y-6" id="exercise-library-container">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
          FITFORGE <span className="text-lime-400 italic">ALBUM</span>
        </h2>
        <p className="text-xs text-slate-400">
          Browse through {exercisesList.length}+ technical movements configured inside the FitForge biomechanics matrix.
        </p>
      </div>

      {/* Grid of Search Tools */}
      <div className="bg-[#121218] border border-slate-800 rounded-3xl p-5 space-y-4">
        {/* Search header bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search exercises by name, muscular systems (e.g., chest, glutes)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-lime-400"
          />
        </div>

        {/* Triple filter lines */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Muscle Focus selector */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block min-h-[24px] sm:min-h-[32px] flex items-end leading-tight">
              Muscular System Target
            </span>
            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-lime-400"
            >
              {muscles.map(m => (
                <option key={m} value={m}>{m === "All" ? "All Targets" : `${m} Focus`}</option>
              ))}
            </select>
          </div>

          {/* Equipment selector */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block min-h-[24px] sm:min-h-[32px] flex items-end leading-tight">
              Equipment Config
            </span>
            <select
              value={selectedEquip}
              onChange={(e) => setSelectedEquip(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-lime-400"
            >
              {equipmentOptions.map(e => (
                <option key={e} value={e}>{e === "All" ? "All Equipment" : e}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block min-h-[24px] sm:min-h-[32px] flex items-end leading-tight">
              Athlete Level Threshold
            </span>
            <select
              value={selectedDiff}
              onChange={(e) => setSelectedDiff(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-lime-400"
            >
              {diffs.map(d => (
                <option key={d} value={d}>{d === "All" ? "All Levels" : `${d} Level`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main split display list vs detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        {/* Exercises list column - max-h-none on mobile, scrollable on lg screens */}
        <div className="lg:col-span-5 bg-[#121218] border border-slate-800 rounded-3xl p-4 lg:max-h-[600px] lg:overflow-y-auto space-y-2">
          <div className="flex justify-between items-center px-2 py-1 border-b border-slate-900 pb-2">
            <span className="text-xs text-slate-400 font-bold">{filteredList.length} movements loaded</span>
            <span className="text-[10px] text-lime-400 font-mono">Dynamic filtering live</span>
          </div>

          {filteredList.map((exercise) => {
            const isActive = activeExercise?.id === exercise.id;
            return (
              <div key={exercise.id} className="space-y-2">
                <button
                  onClick={() => {
                    if (isActive) {
                      setActiveExercise(null);
                    } else {
                      setActiveExercise(exercise);
                    }
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isActive
                      ? "bg-lime-400/5 border-lime-400 text-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.05)]"
                      : "bg-slate-900/40 border-slate-900 text-slate-300 hover:border-slate-800 hover:bg-slate-900/80"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold leading-snug">{exercise.name}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="bg-slate-950 px-1.5 py-0.5 rounded text-[9px] text-slate-400">
                        {exercise.targetMuscle.join(", ")}
                      </span>
                      <span className="text-[9px] text-slate-500 uppercase">
                        {exercise.difficulty}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${isActive ? "rotate-90 text-lime-400" : ""}`} />
                </button>

                {/* Inline expanding context specifically for smaller/mobile viewports */}
                {isActive && (
                  <div className="block lg:hidden bg-slate-950 border border-slate-900 p-4 rounded-2xl space-y-4">
                    <div className="flex justify-between items-start pb-3 border-b border-slate-900">
                      <div>
                        <div className="flex flex-wrap gap-1">
                          {exercise.targetMuscle.map(m => (
                            <span key={m} className="bg-lime-400/10 text-lime-400 font-bold border border-lime-400/20 px-2 py-0.5 rounded text-[9px]">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-slate-500 uppercase font-black block">Equipment</span>
                        <span className="text-[10px] text-slate-300 font-semibold">{exercise.equipmentNeeded.join(", ")}</span>
                      </div>
                    </div>

                    {/* Live joint motion simulator */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-lime-400 uppercase font-black tracking-widest block">Interactive Biomechanics Demo</span>
                      <ExerciseMotionVisualizer exercise={exercise} />
                    </div>

                    {/* Steps Instructions */}
                    <div className="space-y-2">
                      <h4 className="text-[10.5px] uppercase font-black text-slate-400 tracking-wider">How to perform</h4>
                      <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
                        {exercise.instructions.map((stepStr, idx) => (
                          <li key={idx}>
                            {stepStr}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Common mistakes */}
                    <div className="p-3 bg-red-950/20 border border-red-500/10 rounded-xl space-y-1">
                      <h4 className="text-[10.5px] uppercase font-black text-red-400 tracking-wider flex items-center gap-1 animate-pulse">
                        <Sparkles className="w-3 h-3 text-orange-400" /> Common Mistakes
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-450">
                        {exercise.commonMistakes.map((mistake, idx) => (
                          <li key={idx}>{mistake}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Alternatives */}
                    {exercise.alternatives && exercise.alternatives.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Alternatives</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {exercise.alternatives.map((alt, idx) => (
                            <span key={idx} className="bg-slate-900 border border-slate-850 px-2 py-1 rounded-lg text-[10px] text-slate-300">
                              {alt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredList.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-xs">
              No matching exercise variants logged inside this metric focus. Let's adjust parameters.
            </div>
          )}
        </div>

        {/* Workout Technique detailed board - hidden on mobile, visible on lg screens */}
        <div className="hidden lg:block lg:col-span-7">
          {activeExercise ? (
            <div className="bg-[#121218] border border-slate-800 rounded-3xl p-6 space-y-6 select-none">
              <div className="flex justify-between items-start pb-4 border-b border-slate-900">
                <div>
                  <h3 className="text-xl font-bold text-white">{activeExercise.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {activeExercise.targetMuscle.map(m => (
                      <span key={m} className="bg-lime-400/10 text-lime-400 font-bold border border-lime-400/20 px-2.5 py-0.5 rounded text-[10px]">
                        {m} Focus Area
                      </span>
                    ))}
                    <span className="bg-slate-900 text-slate-400 px-2.5 py-0.5 rounded text-[10px]">
                      {activeExercise.difficulty} Threshold
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-black block">Requires Equipment</span>
                  <span className="text-xs text-slate-300 font-semibold">{activeExercise.equipmentNeeded.join(", ")}</span>
                </div>
              </div>

              {/* Live joint motion simulator guided visualization */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-lime-400 uppercase font-black tracking-widest block">Interactive Live Biomechanics Demo</span>
                <ExerciseMotionVisualizer exercise={activeExercise} />
              </div>

              {/* Steps Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-black text-slate-400 tracking-wider">How to perform with proper alignment</h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                  {activeExercise.instructions.map((stepStr, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {stepStr}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Common mistakes */}
              <div className="p-4 bg-red-950/20 border border-red-500/10 rounded-2xl space-y-2">
                <h4 className="text-xs uppercase font-black text-red-400 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Common Execution Mistakes
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                  {activeExercise.commonMistakes.map((mistake, idx) => (
                    <li key={idx}>{mistake}</li>
                  ))}
                </ul>
              </div>

              {/* Alternatives */}
              {activeExercise.alternatives && activeExercise.alternatives.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-black text-slate-400 tracking-wider">Alternative/Substitute Exercises</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeExercise.alternatives.map((alt, idx) => (
                      <span key={idx} className="bg-slate-900 px-3 py-1.5 rounded-xl text-xs text-slate-300 border border-slate-850 font-medium">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#121218] border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3 min-h-[400px]">
              <Dumbbell className="w-12 h-12 text-slate-600" />
              <p className="text-slate-400 text-sm">Select an exercise on the left to review instructions, common biomechanical mistakes, and live targets.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
