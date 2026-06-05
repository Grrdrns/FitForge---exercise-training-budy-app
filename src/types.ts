export interface UserProfile {
  name: string;
  age: number;
  sex: string;
  height: number; // in cm
  weight: number; // in kg
  goal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  environment: WorkoutEnvironment;
  equipment: Equipment[];
  frequency: number; // days per week
  duration: number; // minutes per session
  isOnboarded: boolean;
  xp: number;
  level: number;
}

export enum FitnessGoal {
  LOSE_WEIGHT = "Lose Weight",
  BUILD_MUSCLE = "Build Muscle",
  BODY_RECOMP = "Body Recomposition",
  INCREASE_STRENGTH = "Increase Strength",
  IMPROVE_ENDURANCE = "Improve Endurance",
  GENERAL_FITNESS = "General Fitness"
}

export enum ExperienceLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  EXPERT = "Expert"
}

export enum WorkoutEnvironment {
  HOME = "Home",
  GYM = "Gym",
  HYBRID = "Hybrid"
}

export enum Equipment {
  NO_EQUIPMENT = "No Equipment",
  RESISTANCE_BANDS = "Resistance Bands",
  DUMBBELLS = "Dumbbells",
  KETTLEBELLS = "Kettlebells",
  FULL_HOME_GYM = "Full Home Gym",
  COMMERCIAL_GYM = "Commercial Gym"
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string[];
  difficulty: ExperienceLevel;
  equipmentNeeded: Equipment[];
  instructions: string[];
  commonMistakes: string[];
  videoDemoUrl?: string;
  imageDemoClassName?: string; // Tailwind class representing an animated icon/shape color
  alternatives: string[];
}

export interface WorkoutDay {
  dayName: string;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: string;
    completed?: boolean;
    weightUsed?: number; // optional tracking
  }[];
}

export interface WorkoutProgram {
  id: string;
  title: string;
  description: string;
  goal: FitnessGoal;
  difficulty: ExperienceLevel;
  weeks: {
    weekNumber: number;
    days: WorkoutDay[];
  }[];
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO Date YYYY-MM-DD
  programId?: string;
  dayName: string;
  completedExercisesCount: number;
  totalExercisesCount: number;
  caloriesBurned: number;
  durationMinutes: number;
  feedback?: string; // e.g. "Too hard", "Good", "Easy"
}

export interface Meal {
  id: string;
  name: string;
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  protein: number; // in g
  carbs: number; // in g
  fat: number; // in g
}

export interface NutritionLog {
  date: string; // YYYY-MM-DD
  meals: Meal[];
  waterIntakeMl: number;
  waterGoalMl: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface FormAnalysisFeedback {
  score: number;
  exerciseName: string;
  postureScore: number;
  mistakes: string[];
  corrections: string[];
}

export interface RecoveryMetrics {
  sleepHours: number;
  hydrationMl: number;
  mobilityDone: boolean;
  score: number; // 0-100
  feedback: string;
}

export interface UserChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number; // percentage
  target: number;
  current: number;
  completed: boolean;
}

export interface CommunityMember {
  id: string;
  name: string;
  level: number;
  xpOnWeeklyLeaderboard: number;
  recentActivity: string;
  isFriend: boolean;
}
