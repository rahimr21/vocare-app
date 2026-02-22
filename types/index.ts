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

/** Need with creator info, people needed, status, and acceptance data for list/detail UI */
export interface HungerNeedWithMeta extends HungerNeed {
  user_id: string | null;
  creator_display_name: string | null;
  people_needed: number | null;
  status?: "open" | "filled" | "cancelled";
  acceptance_count: number;
  current_user_accepted: boolean;
}

export interface NeedAcceptance {
  id: string;
  need_id: string;
  user_id: string;
  created_at: string;
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

export interface TreeLeaf {
  id: string;
  missionId: string;
  x: number;
  y: number;
  leafState: "vibrant" | "faded"; // vibrant = felt alive, faded = desolation
  label: string;
}
