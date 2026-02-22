import React, { createContext, useContext, useEffect, useState } from "react";
import { Mission, MoodType, HungerNeed } from "@/types";
import { generateMission as generateMissionFromAI } from "@/lib/openai";
import { getItem, setItem, KEYS } from "@/lib/storage";
import { useAuth } from "./AuthContext";

interface MissionContextType {
  currentMission: Mission | null;
  missionHistory: Mission[];
  loading: boolean;
  generating: boolean;
  pendingCustomMoodText: string | null;
  setPendingCustomMoodText: (text: string | null) => void;
  generateMission: (
    mood: MoodType,
    gladnessDrivers: string[],
    customMoodText?: string,
    needs?: HungerNeed[]
  ) => Promise<Mission>;
  acceptMission: () => Promise<void>;
  completeMission: () => Promise<void>;
  recordReflection: (feltAlive: boolean) => Promise<void>;
  skipMission: () => Promise<void>;
}

const MissionContext = createContext<MissionContextType>({
  currentMission: null,
  missionHistory: [],
  loading: true,
  generating: false,
  pendingCustomMoodText: null,
  setPendingCustomMoodText: () => {},
  generateMission: async () => ({} as Mission),
  acceptMission: async () => {},
  completeMission: async () => {},
  recordReflection: async () => {},
  skipMission: async () => {},
});

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [missionHistory, setMissionHistory] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [pendingCustomMoodText, setPendingCustomMoodText] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadMissions();
    } else {
      setCurrentMission(null);
      setMissionHistory([]);
      setLoading(false);
    }
  }, [user?.id]);

  const loadMissions = async () => {
    const stored = await getItem<Mission[]>(KEYS.MISSIONS);
    if (stored) {
      const active = stored.find(
        (m) => m.status === "active" || m.status === "pending"
      );
      const completed = stored.filter(
        (m) => m.status === "completed" || m.status === "skipped"
      );
      setCurrentMission(active || null);
      setMissionHistory(completed);
    }
    setLoading(false);
  };

  const saveMissions = async (
    current: Mission | null,
    history: Mission[]
  ) => {
    const all = current ? [current, ...history] : history;
    await setItem(KEYS.MISSIONS, all);
  };

  const generateMission = async (
    mood: MoodType,
    gladnessDrivers: string[],
    customMoodText?: string,
    needs?: HungerNeed[]
  ): Promise<Mission> => {
    setGenerating(true);
    try {
      const mission = await generateMissionFromAI(
        mood,
        gladnessDrivers,
        needs ?? [],
        customMoodText
      );
      setCurrentMission(mission);
      await saveMissions(mission, missionHistory);
      return mission;
    } finally {
      setGenerating(false);
    }
  };

  const acceptMission = async () => {
    if (!currentMission) return;
    const updated = { ...currentMission, status: "active" as const };
    setCurrentMission(updated);
    await saveMissions(updated, missionHistory);
  };

  const completeMission = async () => {
    if (!currentMission) return;
    const updated = {
      ...currentMission,
      status: "completed" as const,
      completedAt: new Date().toISOString(),
    };
    setCurrentMission(updated);
    await saveMissions(updated, missionHistory);
  };

  const recordReflection = async (feltAlive: boolean) => {
    if (!currentMission) return;
    const updated = { ...currentMission, feltAlive };
    const newHistory = [updated, ...missionHistory];
    setMissionHistory(newHistory);
    setCurrentMission(null);
    await saveMissions(null, newHistory);
  };

  const skipMission = async () => {
    if (!currentMission) return;
    const updated = { ...currentMission, status: "skipped" as const };
    const newHistory = [updated, ...missionHistory];
    setMissionHistory(newHistory);
    setCurrentMission(null);
    await saveMissions(null, newHistory);
  };

  return (
    <MissionContext.Provider
      value={{
        currentMission,
        missionHistory,
        loading,
        generating,
        pendingCustomMoodText,
        setPendingCustomMoodText,
        generateMission,
        acceptMission,
        completeMission,
        recordReflection,
        skipMission,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export const useMission = () => useContext(MissionContext);
