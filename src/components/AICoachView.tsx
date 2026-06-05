import React, { useState, useRef, useEffect } from "react";
import { UserProfile, ChatMessage } from "../types";
import { 
  Send, Bot, User, Sparkles, RefreshCw, AlertTriangle, 
  HelpCircle, TrendingUp, Compass, ChevronRight 
} from "lucide-react";

interface AICoachViewProps {
  profile: UserProfile;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => void;
  loadingMessage: boolean;
}

export default function AICoachView({
  profile,
  chatHistory,
  onSendMessage,
  loadingMessage
}: AICoachViewProps) {
  const [inputText, setInputText] = useState("");
  const [showForecast, setShowForecast] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastReport, setForecastReport] = useState("");

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loadingMessage]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  // Quick suggestions
  const suggestions = [
    "I only have dumbbells",
    "I have knee pain",
    "I missed 3 workouts",
    "How do I build bigger arms?",
    "How much protein should I eat?",
    "Create a workout plan for fat loss"
  ];

  const handleSuggestionClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  const triggerForecast = async () => {
    setForecastLoading(true);
    setShowForecast(true);
    setForecastReport("");
    try {
      const response = await fetch("/api/coach/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile })
      });
      const data = await response.json();
      setForecastReport(data.forecast || "Unable to calculate projection. Please log more metrics.");
    } catch (err) {
      setForecastReport("Error fetching prediction models from server.");
    } finally {
      setForecastLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="coach-view-container">
      {/* Page header title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            FORGE <span className="text-lime-400 italic">COACH</span>
          </h2>
          <p className="text-xs text-slate-400">
            Communicate directly with the resident AI fitness advisor for technique scaling, injury adjustments, and metabolic queries.
          </p>
        </div>

        {/* Prediction triggers */}
        <button
          onClick={triggerForecast}
          disabled={forecastLoading}
          className="bg-lime-400 hover:bg-lime-300 text-black py-2.5 px-5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
        >
          {forecastLoading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-black" />
          )}
          FORECAST 12-WEEK TRANSFORMATION
        </button>
      </div>

      {/* Main chat interface grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        {/* Left Side: Dynamic Chat Window - col-span-8 */}
        <div className="lg:col-span-8 flex flex-col bg-[#121218] border border-slate-800 rounded-3xl h-[600px] overflow-hidden">
          {/* Active head bar */}
          <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/25 flex items-center justify-center text-lime-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-white uppercase tracking-wider">Coach Forge AI</span>
                <span className="text-[10px] text-lime-400 block font-mono">Expert Advisor • Active</span>
              </div>
            </div>

            <span className="text-[10px] text-slate-500 font-mono uppercase">UTC ONLINE</span>
          </div>

          {/* Message List area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${
                    isAi ? "float-left text-left mr-auto" : "flex-row-reverse float-right text-right ml-auto"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isAi ? "bg-lime-400/10 text-lime-400 border border-lime-400/20" : "bg-slate-800 text-slate-300"
                  }`}>
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className={`p-4 rounded-3xl text-xs sm:text-xs leading-relaxed space-y-2 ${
                    isAi 
                      ? "bg-slate-900 text-slate-300 rounded-tl-none border border-slate-850" 
                      : "bg-lime-400 text-black font-semibold rounded-tr-none"
                  }`}>
                    {/* Basic parsing for simple markdown headings in server output */}
                    <div className="whitespace-pre-wrap select-all font-sans">
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {loadingMessage && (
              <div className="flex gap-3 float-left">
                <div className="w-8 h-8 rounded-lg bg-lime-400/10 text-lime-400 border border-lime-400/25 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-900 border border-slate-850 p-4 rounded-3xl rounded-tl-none flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-lime-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-lime-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-lime-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            
            <div ref={chatBottomRef} />
          </div>

          {/* Quick recommendations click rail */}
          <div className="p-3 bg-slate-950/70 border-t border-slate-900/60 overflow-x-auto flex gap-1.5 whitespace-nowrap scrollbar-none">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(sug)}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-full text-[10px] font-bold cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Trigger Message Form */}
          <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Query Coach Forge. e.g. How do I correct wrist pain during planks?..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-850 text-xs sm:text-xs text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
            <button
              type="submit"
              className="bg-lime-400 hover:bg-lime-300 text-black px-4 py-2 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Side: Prediction outputs / weekly coaching report indicators - col-span-4 */}
        <div className="lg:col-span-4 space-y-4">
          {showForecast && (
            <div className="bg-[#121218] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5 pb-2 border-b border-slate-900">
                <TrendingUp className="w-4 h-4 text-lime-400" />
                12-Week Vision Projection
              </h3>

              {forecastLoading ? (
                <div className="flex flex-col items-center justify-center p-12 space-y-3">
                  <RefreshCw className="w-8 h-8 text-lime-400 animate-spin" />
                  <span className="text-xs text-slate-500 tracking-wider uppercase font-bold font-mono">Running regression...</span>
                </div>
              ) : (
                <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-3 whitespace-pre-wrap select-all">
                  {forecastReport}
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => setShowForecast(false)}
                  className="w-full bg-slate-950 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-lg border border-slate-900"
                >
                  Clear Vision Board
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Weekly Coaching evaluation card stats */}
          <div className="bg-[#121218] border border-slate-800 rounded-3xl p-5 space-y-4">
            <h4 className="font-bold text-white text-sm">Weekly Evaluation Reports</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Coach Forge reviews completed program weights and sets logs dynamically every Sunday to update resistance thresholds.
            </p>

            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-900">
                <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-black">
                  <span>Current Fatigue index</span>
                  <span className="text-lime-400 font-bold">Low (Ready)</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2">
                  <div className="bg-lime-400 h-1.5 rounded-full w-[25%]" />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-900">
                <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-black">
                  <span>Muscle Overload Factor</span>
                  <span className="text-amber-400 font-bold">+4.5% Overload</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2">
                  <div className="bg-amber-400 h-1.5 rounded-full w-[65%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
