import React, { useEffect, useRef, useState } from "react";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useMission } from "@/context/MissionContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { MoodType } from "@/types";
import TreeAnimation from "@/components/ui/TreeAnimation";

const MIN_ANIMATION_MS = 3000;

export default function MissionLoadingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mood: string; customMoodText?: string }>();
  const { generateMission } = useMission();
  const { profile } = useUserProfile();

  const [animationDone, setAnimationDone] = useState(false);
  const [missionDone, setMissionDone] = useState(false);
  const navigated = useRef(false);

  useEffect(() => {
    const mood = (params.mood || "content") as MoodType;
    const drivers = profile?.gladnessDrivers || [];

    generateMission(mood, drivers, params.customMoodText).then(() => {
      setMissionDone(true);
    }).catch(() => {
      setMissionDone(true);
    });
  }, []);

  useEffect(() => {
    if (animationDone && missionDone && !navigated.current) {
      navigated.current = true;
      router.replace("/mission/reveal");
    }
  }, [animationDone, missionDone]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TreeAnimation
        message="Crafting your mission..."
        duration={MIN_ANIMATION_MS}
        onComplete={() => setAnimationDone(true)}
      />
    </>
  );
}
