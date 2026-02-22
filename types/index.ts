export type MoodType = "anxious" | "bored" | "energized" | "content";

export interface Mood {
  id: MoodType;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface GladnessDriver {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  location: string;
  estimatedMinutes: number;
  mood: MoodType;
  gladnessDrivers: string[];
  status: "pending" | "active" | "completed" | "skipped";
  feltAlive: boolean | null;
  createdAt: string;
  completedAt: string | null;
}

export interface HungerNeed {
  id: string;
  description: string;
  location: string;
  category: "service" | "organization" | "support";
}

export interface UserProfile {
  gladnessDrivers: string[];
  onboardingComplete: boolean;
  displayName: string;
}

export interface JournalEntry {
  id: string;
  missionId: string;
  content: string;
  wordCount: number;
  timeOfDay: string;
  createdAt: string;
}

export interface SubmittedNeed {
  id: string;
  description: string;
  location: string;
  category: "service" | "organization" | "support";
  createdAt: string;
}

export interface ConstellationStar {
  id: string;
  missionId: string;
  x: number;
  y: number;
  brightness: number; // 1.0 = consolation (felt alive), 0.4 = desolation
  label: string;
}
