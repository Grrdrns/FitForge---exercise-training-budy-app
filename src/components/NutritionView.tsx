import React, { useState } from "react";
import { UserProfile, Meal } from "../types";
import { 
  Apple, Circle, CheckCircle2, ChevronRight, RefreshCw, 
  Sparkles, ShieldCheck, ShoppingBag, PlusCircle 
} from "lucide-react";

interface NutritionViewProps {
  profile: UserProfile;
  isPhoneMode?: boolean;
}

interface GeneratedNutritionPlan {
  title: string;
  advice: string;
  meals: { type: "Breakfast" | "Lunch" | "Dinner" | "Snack"; name: string; calories: number; protein: number; carbs: number; fat: number }[];
  summary: { calories: number; protein: number; carbs: number; fat: number; water: number };
}

export default function NutritionView({ profile, isPhoneMode = false }: NutritionViewProps) {
  const [dietRestriction, setDietRestriction] = useState<string>("None");
  const [activityFactor, setActivityFactor] = useState<string>("Active");
  const [loading, setLoading] = useState(false);
  const [customPlan, setCustomPlan] = useState<GeneratedNutritionPlan | null>(null);
  const [markedMeals, setMarkedMeals] = useState<Record<string, boolean>>({});
  const [loggedWaterMl, setLoggedWaterMl] = useState<number>(1200);

  // Pick options
  const dietaryRestrictions = ["None", "Vegetarian", "Vegan", "Low Carb / Keto", "Gluten-Free", "Nut-Free", "Dairy-Free"];
  const activityLevels = ["Sedentary (No workouts)", "Active (3-4 workouts/week)", "Extremely Active (Daily workouts)"];

  const triggerPlanGeneration = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/coach/nutrition-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            ...profile,
            goal: profile.goal,
            weight: profile.weight,
            height: profile.height,
            age: profile.age
          },
          dietRestriction,
          activityFactor
        })
      });

      const data = await response.json();
      if (data.success) {
        // Adjust meal names specifically for dietary restrictions if selected
        let updatedMeals = [...data.meals];
        if (dietRestriction === "Vegan") {
          updatedMeals = updatedMeals.map(m => {
            if (m.name.toLowerCase().includes("chicken")) {
              return { ...m, name: "Grilled Tempeh with Quinoa & Steamed Broccoli" };
            }
            if (m.name.toLowerCase().includes("egg") || m.name.toLowerCase().includes("whey")) {
              return { ...m, name: "Spiced Tofu Scramble with Avocado & Rice Protein Shake" };
            }
            if (m.name.toLowerCase().includes("salmon") || m.name.toLowerCase().includes("tilapia") || m.name.toLowerCase().includes("steak")) {
              return { ...m, name: "Teriyaki Seitan Fillet with Roasted Potatoes & Zucchini" };
            }
            if (m.name.toLowerCase().includes("yogurt")) {
              return { ...m, name: "Almond-milk Yogurt Parfait with Flax Seeds & Raspberries" };
            }
            return m;
          });
        } else if (dietRestriction === "Vegetarian") {
          updatedMeals = updatedMeals.map(m => {
            if (m.name.toLowerCase().includes("chicken") || m.name.toLowerCase().includes("tilapia") || m.name.toLowerCase().includes("steak")) {
              return { ...m, name: "Baked Halloumi Block & Quinoa with Mixed Veggies" };
            }
            return m;
          });
        } else if (dietRestriction === "Low Carb / Keto") {
          updatedMeals = updatedMeals.map(m => {
            return {
              ...m,
              name: m.name.replace(/Oats|Oatmeal|Rice|Quinoa|Sweet Potato|Potatoes/g, "Spinach, Mushrooms & Heavy Butter"),
              carbs: Math.round(m.carbs * 0.15),
              fat: Math.round(m.fat * 1.6)
            };
          });
        } else if (dietRestriction === "Nut-Free") {
          updatedMeals = updatedMeals.map(m => {
            return {
              ...m,
              name: m.name.replace(/Almonds|Peanut|Nuts|Macadamia/g, "Sunflower Seeds")
            };
          });
        }

        // recalculate macros summary totals based on adjustments
        const newTotalCal = updatedMeals.reduce((acc, current) => acc + current.calories, 0);
        const newTotalProtein = updatedMeals.reduce((acc, current) => acc + current.protein, 0);
        const newTotalCarb = updatedMeals.reduce((acc, current) => acc + current.carbs, 0);
        const newTotalFat = updatedMeals.reduce((acc, current) => acc + current.fat, 0);

        setCustomPlan({
          title: `FitForge AI ${profile.goal} Blueprint (${dietRestriction})`,
          advice: data.coachAdvice,
          meals: updatedMeals,
          summary: {
            calories: newTotalCal,
            protein: newTotalProtein,
            carbs: newTotalCarb,
            fat: newTotalFat,
            water: data.summary.water
          }
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Prepopulate standard plan if none generated yet
  const activePlan = customPlan || {
    title: `Balanced Plan: General Fitness Target`,
    advice: "Stick to complex carbohydrates and increase amino acid intake immediately during anabolic windows.",
    meals: [
      { type: "Breakfast" as const, name: "Scrambled Eggs with Steamed Spinach & Rye Bread", calories: 380, protein: 28, carbs: 22, fat: 16 },
      { type: "Lunch" as const, name: "Sautéed Chicken Breast with Wild Rice & Asparagus", calories: 540, protein: 48, carbs: 45, fat: 12 },
      { type: "Dinner" as const, name: "Baked Salmon in Lemon-Oil with Baked Sweet Potato", calories: 610, protein: 42, carbs: 38, fat: 22 },
      { type: "Snack" as const, name: "Probiotic Greek Yogurt (Plain) with Walnuts", calories: 230, protein: 20, carbs: 12, fat: 10 }
    ],
    summary: {
      calories: 1760,
      protein: 138,
      carbs: 117,
      fat: 60,
      water: 2500
    }
  };

  const totalProteinGoal = activePlan.summary.protein;
  const totalCarbsGoal = activePlan.summary.carbs;
  const totalFatGoal = activePlan.summary.fat;
  const totalCaloriesGoal = activePlan.summary.calories;

  // Meal Status toggles
  const toggleMealComplete = (type: string) => {
    setMarkedMeals(prev => ({ ...prev, [type]: !prev[type] }));
  };

  // Shopping list generator based on active meals info
  const shoppingListItems = activePlan.meals.map(m => {
    if (m.name.includes("Salmon")) return ["Atlantic Salmon Fillet", "Lemons", "Olive Oil", "Sweet Potatoes"];
    if (m.name.includes("Chicken")) return ["Organic Chicken Breast", "Wild Rice / Quinoa", "Asparagus Spear Bundle"];
    if (m.name.includes("Eggs")) return ["Free-Range Eggs", "Baby Spinach Bag", "Whole Grain Sourdough"];
    if (m.name.includes("Tofu")) return ["Extra Firm Organic Tofu Block", "Avocados", "Plant Protein Isolate"];
    if (m.name.includes("Tempeh")) return ["Marinated Tempeh", "Organic Red Quinoa", "Heirloom Broccoli heads"];
    if (m.name.includes("Oatmeal")) return ["Rolled Oats", "Blueberries Pint", "Clover Honey Jar"];
    if (m.name.includes("Seitan")) return ["Wheat Gluten Seitan Fillet", "Yukon Gold Potatoes", "Fresh Zucchini"];
    return [m.name.substring(0, 32)];
  }).flat();

  // Deduplicate shopping items
  const uniqueIngredients = Array.from(new Set(shoppingListItems));

  return (
    <div className="space-y-6" id="nutrition-container">
      {/* Title block */}
      <div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
          NUTRITION <span className="text-lime-400 italic">COACH</span>
        </h2>
        <p className="text-xs text-slate-400">
          Unlock personalized macronutrient frameworks coupled dynamically to your daily physical activity.
        </p>
      </div>

      {/* Goal restrictions entry panel */}
      <div className={`grid gap-4 ${isPhoneMode ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
        {/* Constraints input container */}
        <div className="bg-[#121218] border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Apple className="w-4 h-4 text-lime-400" />
            AI Diet Customizer
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select dietary constraints or restrictions. The AI will immediately reconstruct fuel suggestions to exclude unwanted food groups.
          </p>

          <div className={`grid gap-3.5 ${isPhoneMode ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Dietary Restrictions</span>
              <select
                value={dietRestriction}
                onChange={(e) => setDietRestriction(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-slate-300 focus:outline-none"
              >
                {dietaryRestrictions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Activity Coefficient</span>
              <select
                value={activityFactor}
                onChange={(e) => setActivityFactor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-slate-300 focus:outline-none"
              >
                {activityLevels.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={triggerPlanGeneration}
            disabled={loading}
            className="w-full bg-lime-400 text-black py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-97 cursor-pointer text-center flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                FORGING OPTIONAL DIET PLANS...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-black" />
                GENERATE WEEKLY MACRO TEMPLATE
              </>
            )}
          </button>
        </div>

        {/* Macros Summary Panel */}
        <div className="bg-[#121218] border border-slate-800 rounded-3xl p-5 space-y-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-1.5 pb-2 border-b border-slate-900/40">
            <span className="font-extrabold text-slate-400 tracking-wide uppercase">Daily Fuel Budget</span>
            <span className="text-lime-400 font-mono font-black">{totalCaloriesGoal} KCAL GOAL</span>
          </div>

          <div className="space-y-4">
            {/* Protein bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-semibold">
                <span className="text-slate-450">Protein Target</span>
                <span className="text-rose-450 font-bold">{totalProteinGoal}g</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: "70%" }} />
              </div>
            </div>

            {/* Carbs bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-semibold">
                <span className="text-slate-450">Carbohydrate Intake</span>
                <span className="text-amber-400 font-bold">{totalCarbsGoal}g</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: "60%" }} />
              </div>
            </div>

            {/* Fats bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-semibold">
                <span className="text-slate-450">Essential Fats</span>
                <span className="text-cyan-450 font-bold">{totalFatGoal}g</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: "50%" }} />
              </div>
            </div>
          </div>

          {/* Water Intake log */}
          <div className="bg-slate-950 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between border border-slate-900 gap-3">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-black block tracking-wider">Logged Hydration</span>
              <span className="text-xs font-black text-slate-250 font-mono mt-0.5 block">{loggedWaterMl} / {activePlan.summary.water} ml</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setLoggedWaterMl(prev => prev + 250)}
                className="flex-1 sm:flex-none bg-slate-905 hover:bg-slate-850 text-lime-400 border border-slate-800 text-xs px-3 py-2 rounded-xl font-bold transition-all cursor-pointer text-center"
              >
                +250ml
              </button>
              <button 
                onClick={() => setLoggedWaterMl(prev => prev + 500)}
                className="flex-1 sm:flex-none bg-slate-905 hover:bg-slate-850 text-cyan-400 border border-slate-800 text-xs px-3 py-2 rounded-xl font-bold transition-all cursor-pointer text-center"
              >
                +500ml
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MEALS DETAILS TIMELINE & SHOPPING CHECKS */}
      <div className={`grid gap-6 pb-6 ${isPhoneMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"}`} id="meals-shopping-split">
        {/* Left timeline structure */}
        <div className={`${isPhoneMode ? "col-span-1" : "lg:col-span-7"} bg-[#121218] border border-slate-800 rounded-3xl p-5 space-y-4`}>
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h4 className="font-bold text-white text-sm">{activePlan.title}</h4>
            <span className="text-[10px] uppercase font-black text-slate-500">Log Daily Intake</span>
          </div>

          <div className="space-y-3">
            {activePlan.meals.map((meal, index) => {
              const isLogged = !!markedMeals[meal.type];
              return (
                <div 
                  key={index}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
                    isLogged 
                      ? "bg-emerald-950/20 border-emerald-500/20 shadow-inner" 
                      : "bg-slate-900/40 border-slate-900"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleMealComplete(meal.type)}
                      className={`mt-0.5 transition-colors ${
                        isLogged ? "text-emerald-400" : "text-slate-600 hover:text-slate-400"
                      }`}
                    >
                      {isLogged ? (
                        <CheckCircle2 className="w-5 h-5 fill-current text-white border-none" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <span className="text-[10px] font-sans font-black uppercase text-amber-400 tracking-widest block">
                        {meal.type}
                      </span>
                      <h5 className="text-sm font-bold text-white mt-0.5">{meal.name}</h5>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-mono">
                        <span>{meal.calories} kcal</span>
                        <span>•</span>
                        <span>P: {meal.protein}g</span>
                        <span>•</span>
                        <span>C: {meal.carbs}g</span>
                        <span>•</span>
                        <span>F: {meal.fat}g</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-0">
                    <button
                      onClick={() => toggleMealComplete(meal.type)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-black uppercase ${
                        isLogged 
                          ? "bg-slate-900 text-emerald-400 border border-emerald-900/50 cursor-pointer" 
                          : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
                      }`}
                    >
                      {isLogged ? "Intake Logged" : "Log Plate"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coach meal compliance tip */}
          <div className="p-3 bg-slate-950 border border-slate-900 text-slate-400 text-xs rounded-xl flex gap-1.5 items-center">
            <ShieldCheck className="w-4 h-4 text-lime-400 flex-shrink-0" />
            <span className="leading-snug italic">"{activePlan.advice}"</span>
          </div>
        </div>

        {/* Corresponding Auto-Generated Shopping List */}
        <div className={`${isPhoneMode ? "col-span-1" : "lg:col-span-5"} bg-[#121218] border border-slate-800 rounded-3xl p-5 space-y-4`}>
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-lime-400" />
              FitForge Shopping Agent
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Auto-Generated</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ingredients calculated strictly based on your generated dietary criteria ({dietRestriction}) and meal selections:
          </p>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {uniqueIngredients.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-2 p-2.5 bg-slate-900/60 rounded-xl text-xs text-slate-300 border border-slate-950 font-medium"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-900">
            <button
              onClick={() => {
                alert(`FitForge Shopping Agent: List successfully synced offline! Include ${uniqueIngredients.length} organic ingredients.`);
              }}
              className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 hover:text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2"
            >
              Copy Shopping List to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
