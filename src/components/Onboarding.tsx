import React, { useState } from "react";
import { motion } from "motion/react";
import { UserProfile, FitnessGoal, ExperienceLevel, WorkoutEnvironment, Equipment } from "../types";
import { Dumbbell, ArrowRight, Sparkles, Trophy, Activity, Check } from "lucide-react";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(25);
  const [sex, setSex] = useState("Unspecified");
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(70);
  
  const [goal, setGoal] = useState<FitnessGoal>(FitnessGoal.GENERAL_FITNESS);
  const [level, setLevel] = useState<ExperienceLevel>(ExperienceLevel.BEGINNER);
  const [environment, setEnvironment] = useState<WorkoutEnvironment>(WorkoutEnvironment.HOME);
  const [selectedGear, setSelectedGear] = useState<Equipment[]>([Equipment.NO_EQUIPMENT]);
  const [frequency, setFrequency] = useState<number>(3);
  const [duration, setDuration] = useState<number>(30);

  const toggleEquipment = (equip: Equipment) => {
    if (equip === Equipment.NO_EQUIPMENT) {
      setSelectedGear([Equipment.NO_EQUIPMENT]);
      return;
    }
    
    let updated = selectedGear.filter(g => g !== Equipment.NO_EQUIPMENT);
    if (updated.includes(equip)) {
      updated = updated.filter(g => g !== equip);
      if (updated.length === 0) updated.push(Equipment.NO_EQUIPMENT);
    } else {
      updated.push(equip);
    }
    setSelectedGear(updated);
  };

  const handleNextSubmit = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Complete
      const completedProfile: UserProfile = {
        name: name.trim() || "Elite Athlete",
        age,
        sex,
        height,
        weight,
        goal,
        experienceLevel: level,
        environment,
        equipment: selectedGear,
        frequency,
        duration,
        isOnboarded: true,
        xp: 100, // starting gift XP
        level: 1
      };
      onComplete(completedProfile);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col justify-center items-center bg-radial from-slate-900 to-black text-slate-100">
      <div className="absolute top-6 left-6 flex items-center space-x-2">
        <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-xl shadow-lg ring-1 ring-amber-400/30">
          <Dumbbell className="w-6 h-6 text-black" />
        </div>
        <div>
          <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">FITFORGE AI</span>
          <span className="text-[9px] block text-slate-500 font-mono tracking-widest">COACH SYSTEM v2.5</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Step Indicators */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex-1 flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-semibold border transition-all ${
                step === num 
                  ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]" 
                  : step > num ? "bg-emerald-500 text-black border-emerald-400" : "bg-slate-900 text-slate-500 border-slate-800"
              }`}>
                {step > num ? <Check className="w-4 h-4" /> : num}
              </div>
              {num < 4 && (
                <div className={`h-[2px] flex-1 mx-2 rounded-full ${step > num ? "bg-emerald-500" : "bg-slate-800"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Details */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-sans text-amber-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Welcome to FitForge AI
              </h2>
              <p className="text-xs text-slate-400">Let's create your bio-signature so our AI engines can mold your ideal training calendar.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">My Call Sign / Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Spartan Warrior" 
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Age (years)</label>
                  <input 
                    type="number" 
                    value={age} 
                    onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 0))} 
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Biological Sex</label>
                  <select 
                    value={sex} 
                    onChange={(e) => setSex(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Unspecified">Prefer Not to Say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Height (cm)</label>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(Math.max(20, parseInt(e.target.value) || 0))} 
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(Math.max(5, parseInt(e.target.value) || 0))} 
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-sans text-amber-400 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Defining Your Objective
              </h2>
              <p className="text-xs text-slate-400">Each objective changes the metabolic multiplier & targeted workout programs catalogued.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Primary Fitness Goal</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(FitnessGoal).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`py-3 px-4 rounded-xl border text-left transition-all relative ${
                        goal === g 
                          ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]" 
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-xs font-semibold block">{g}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Experience Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(ExperienceLevel).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`py-3 px-2 rounded-xl border text-center transition-all ${
                        level === l 
                          ? "bg-amber-500/10 border-amber-500 text-amber-400" 
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-xs font-semibold">{l}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-sans text-amber-400 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" /> Equipment & Environment
              </h2>
              <p className="text-xs text-slate-400">Choose where you work out and multi-select any equipment available.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Workout Environment</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(WorkoutEnvironment).map((env) => (
                    <button
                      key={env}
                      onClick={() => setEnvironment(env)}
                      className={`py-3 px-2 rounded-xl border text-center transition-all ${
                        environment === env 
                          ? "bg-amber-500/10 border-amber-500 text-amber-400" 
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-xs font-semibold">{env}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Available Equipment (Multi-select)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(Equipment).map((equip) => {
                    const active = selectedGear.includes(equip);
                    return (
                      <button
                        key={equip}
                        onClick={() => toggleEquipment(equip)}
                        className={`py-2.5 px-3 rounded-xl border text-left transition-all ${
                          active 
                            ? "bg-amber-500/10 border-amber-500 text-amber-400" 
                            : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span className="text-xs font-semibold block leading-tight">{equip}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-sans text-amber-400 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-amber-500" /> Duration & Frequency
              </h2>
              <p className="text-xs text-slate-400">Fine-tune training volume per week and desired average session length.</p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Weekly Training Frequency</label>
                  <span className="text-sm font-mono text-amber-400 font-bold">{frequency} Days Weekly</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="6" 
                  step="1" 
                  value={frequency} 
                  onChange={(e) => setFrequency(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-900 rounded-lg cursor-pointer h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>2 Days (Light)</span>
                  <span>4 Days (Balanced)</span>
                  <span>6 Days (Intense)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Workout Session Duration</label>
                  <span className="text-sm font-mono text-amber-400 font-bold">{duration} Minutes</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setDuration(mins)}
                      className={`py-3 rounded-xl border text-center transition-all ${
                        duration === mins 
                          ? "bg-amber-500/10 border-amber-500 text-amber-400" 
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-xs font-semibold">{mins}m</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Controls */}
        <div className="mt-8 pt-4 border-t border-slate-900 flex justify-between items-center">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors py-2 px-3"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNextSubmit}
            disabled={step === 1 && !name.trim()}
            className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-bold font-sans text-sm tracking-wide shadow-md transition-all ${
              step === 1 && !name.trim()
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-900"
                : "bg-gradient-to-r from-amber-500 to-rose-500 text-black border border-amber-400/25 hover:brightness-110 active:scale-95 cursor-pointer"
            }`}
          >
            <span>{step === 4 ? "FORGE PLAN" : "CONTINUE"}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
