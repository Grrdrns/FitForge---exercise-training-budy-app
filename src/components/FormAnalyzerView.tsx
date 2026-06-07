import React, { useState } from "react";
import { Sparkles, RefreshCw, Upload, Eye, EyeOff, AlertTriangle, ShieldCheck } from "lucide-react";

interface FormAnalyzerViewProps {
  onEarnXp: (amount: number) => void;
  isPhoneMode?: boolean;
}

interface FormFeedback {
  score: number;
  posturalStrengths: string[];
  mistakesDetected: string[];
  correctionsInstructions: string[];
}

export default function FormAnalyzerView({ onEarnXp, isPhoneMode = false }: FormAnalyzerViewProps) {
  const [exerciseName, setExerciseName] = useState("Standard Push-Up");
  const [observationNotes, setObservationNotes] = useState("My elbows felt flared out on sets 3.");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);
  const [simulatedVideoState, setSimulatedVideoState] = useState<"empty" | "uploaded" | "camera_live">("empty");

  const triggerFormUpload = () => {
    setSimulatedVideoState("uploaded");
  };

  const triggerLiveCamera = () => {
    setSimulatedVideoState("camera_live");
  };

  const handleRunEvaluation = async () => {
    if (simulatedVideoState === "empty") {
      alert("Please simulate an upload or click 'Simulate Camera Feed' first so the laboratory camera module receives frames.");
      return;
    }
    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/coach/analyze-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseName, observationNotes })
      });
      const data = await response.json();
      if (data.success) {
        setFeedback({
          score: data.score,
          posturalStrengths: data.posturalStrengths,
          mistakesDetected: data.mistakesDetected,
          correctionsInstructions: data.correctionsInstructions
        });
        
        // reward 50 XP for doing a posture analysis checks
        onEarnXp(120);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="form-analyzer-container">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
          AI FORM <span className="text-lime-400 italic">ANALYZER</span>
        </h2>
        <p className="text-xs text-slate-400">
          Upload video files or engage virtual lenses. Our computer-vision models evaluate skeletal anchors & track posture errors live.
        </p>
      </div>

      <div className={`grid gap-6 ${isPhoneMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"}`}>
        {/* Left Interactive Lens Controller */}
        <div className={`${isPhoneMode ? "col-span-1" : "lg:col-span-7"} bg-[#121218] border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5`}>
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">AI Computer-Vision Lab</h3>
            <span className="text-[10px] text-lime-400 font-mono">Frame Analysis Ready</span>
          </div>

          <div className={`grid gap-3 ${isPhoneMode ? "grid-cols-1" : "grid-cols-2"}`}>
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-black block">Motion Variant Target</span>
              <input 
                type="text" 
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="e.g. Standard Push-Up"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-black block">Joint Alignment Notes</span>
              <input 
                type="text" 
                value={observationNotes}
                onChange={(e) => setObservationNotes(e.target.value)}
                placeholder="How did your hip/knees feel under load?"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Video Simulator Area */}
          <div className="bg-slate-950 rounded-2xl p-6 h-56 flex flex-col items-center justify-center border border-slate-900 relative overflow-hidden text-center">
            {simulatedVideoState === "empty" ? (
              <div className="space-y-4">
                <Upload className="w-10 h-10 text-slate-600 mx-auto" />
                <div>
                  <p className="text-xs text-slate-350 font-bold">Simulate frame feed or media file uploads</p>
                  <p className="text-[10px] text-slate-500 mt-1">Accepts standard .mp4 motion sequences or camera device feeds</p>
                </div>
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={triggerFormUpload}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-300 font-bold text-[10px] py-1.5 px-3 rounded-lg uppercase tracking-wider cursor-pointer"
                  >
                    Load Video File
                  </button>
                  <button 
                    onClick={triggerLiveCamera}
                    className="bg-lime-400 text-black font-black text-[10px] py-1.5 px-3 rounded-lg uppercase tracking-wider cursor-pointer"
                  >
                    Simulate Camera Feed
                  </button>
                </div>
              </div>
            ) : simulatedVideoState === "uploaded" ? (
              <div className="space-y-2">
                <div className="absolute inset-0 bg-lime-400/5 animate-pulse" />
                <span className="text-[10px] bg-lime-400/10 text-lime-400 font-bold border border-lime-400/20 px-2 py-0.5 rounded uppercase">file: frame_sequence.mp4</span>
                <p className="text-xs text-white font-extrabold mt-2">Motion sequence captured successfully!</p>
                <button 
                  onClick={() => setSimulatedVideoState("empty")}
                  className="text-[9px] text-slate-500 underline uppercase hover:text-slate-300 block mx-auto mt-2 cursor-pointer"
                >
                  Clear stream
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="absolute inset-0 bg-lime-500/10 animate-ping duration-2000" />
                <div className="w-4 h-4 bg-lime-400 rounded-full animate-pulse mx-auto" />
                <p className="text-xs text-white font-black uppercase tracking-widest">LENS CAPTURING ONLINE</p>
                <p className="text-[10px] text-slate-400">Rendering skeletal coordinates mapped onto virtual limbs...</p>
                <button 
                  onClick={() => setSimulatedVideoState("empty")}
                  className="text-[9px] text-red-400 underline uppercase hover:text-red-350 block mx-auto mt-2 cursor-pointer"
                >
                  Deactivate Camera
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleRunEvaluation}
            disabled={loading}
            className="w-full bg-lime-400 text-black py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                RUNNING POSTURAL COMPARATIVE PATTERNS...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-black" />
                ANALYZE POSTURAL TECHNIQUE
              </>
            )}
          </button>
        </div>

        {/* Right Feedback Column */}
        <div className={isPhoneMode ? "col-span-1" : "lg:col-span-5"}>
          {feedback ? (
            <div className="bg-[#121218] border border-slate-800 rounded-3xl p-5 space-y-5 animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                <h4 className="font-bold text-white text-sm">Postural Technique Evaluation</h4>
                <div className="text-right">
                  <span className="block text-[8px] text-slate-500 uppercase font-bold">Accuracy Score</span>
                  <span className="text-lg font-black text-lime-400 italic font-mono">{feedback.score}%</span>
                </div>
              </div>

              {/* Strengths list */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-lime-400 uppercase font-black tracking-widest block">Postural Strengths Identified</span>
                <div className="space-y-1.5">
                  {feedback.posturalStrengths.map((str, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mistakes detected */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-orange-400 uppercase font-black tracking-widest block">Postural Flaws Detected</span>
                <div className="space-y-1.5">
                  {feedback.mistakesDetected.map((m, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-slate-300">
                      <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corrective steps */}
              <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-2xl border border-slate-900">
                <span className="text-[10px] text-white uppercase font-black tracking-widest block mb-1">AI Guided Corrections List</span>
                {feedback.correctionsInstructions.map((correction, idx) => (
                  <div key={idx} className="flex items-start gap-1 pb-1.5 text-xs text-slate-300 leading-relaxed font-sans">
                    <span className="text-lime-400 font-bold pr-1">{idx + 1}.</span>
                    <span>{correction}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-lime-400/5 rounded-xl border border-lime-400/25 text-center">
                <span className="text-[10px] text-lime-400 font-bold uppercase tracking-wider block">🏅 Gamification XP Unlocked!</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Doing custom form evaluations granted you +120 XP points on the leaderboards.</p>
              </div>
            </div>
          ) : (
            <div className="bg-[#121218] border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3 min-h-[400px]">
              <Eye className="w-12 h-12 text-slate-650" />
              <p className="text-slate-400 text-sm">Upload/capture dynamic movement sequence above, then hit 'Analyze Postural Technique' to map coordinates of joint bends.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
