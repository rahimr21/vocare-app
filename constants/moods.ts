import { Mood } from "@/types";

export const MOODS: Mood[] = [
  {
    id: "anxious",
    label: "Anxious",
    icon: "weather-cloudy",
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.1)",
  },
  {
    id: "bored",
    label: "Bored",
    icon: "weather-fog",
    color: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.1)",
  },
  {
    id: "energized",
    label: "Energized",
    icon: "fire",
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
  },
  {
    id: "content",
    label: "Content",
    icon: "white-balance-sunny",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.1)",
  },
];
