import React, { useEffect, useRef, useState } from "react";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useMission } from "@/context/MissionContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { useAuth } from "@/context/AuthContext";
import { MoodType } from "@/types";
import TreeAnimation from "@/components/ui/TreeAnimation";
import { getNeedById } from "@/lib/hungerFeed";

const MIN_ANIMATION_MS = 3000;

export default function MissionLoadingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mood?: string; customMoodText?: string; needId?: string }>();
  const { generateMission, pendingCustomMoodText, setPendingCustomMoodText } = useMission();
  const { profile } = useUserProfile();
  const { user } = useAuth();

  const [animationDone, setAnimationDone] = useState(false);
  const [missionDone, setMissionDone] = useState(false);
  const navigated = useRef(false);

  useEffect(() => {
    const mood = (params.mood || "content") as MoodType;
    const drivers = profile?.gladnessDrivers || [];
    const fromParams = params.customMoodText;
    const customMoodText =
      pendingCustomMoodText ??
      (typeof fromParams === "string" ? fromParams : Array.isArray(fromParams) ? fromParams[0] : undefined);
    const needId = typeof params.needId === "string" ? params.needId : Array.isArray(params.needId) ? params.needId[0] : undefined;

    const run = async () => {
      let needs: { id: string; description: string; location: string; category: "service" | "organization" | "support" }[] = [];
      if (needId) {
        const need = await getNeedById(needId, user?.id);
        if (need) needs = [{ id: need.id, description: need.description, location: need.location, category: need.category }];
      }
      try {
        await generateMission(mood, drivers, customMoodText, needs.length ? needs : undefined);
      } finally {
        setMissionDone(true);
        setPendingCustomMoodText(null);
      }
    };
    run().catch(() => setMissionDone(true));
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
