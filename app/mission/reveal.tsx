import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useMission } from "@/context/MissionContext";
import ScrollCard from "@/components/mission/ScrollCard";
import Button from "@/components/ui/Button";
import { theme } from "@/constants/theme";

const gradientColors = [theme.primary, "#3d5a4c", "#2d4035"] as const;

export default function MissionRevealScreen() {
  const { currentMission, acceptMission, skipMission } = useMission();
  const router = useRouter();

  useEffect(() => {
    if (!currentMission) {
      router.replace("/(tabs)");
    }
  }, [currentMission]);

  if (!currentMission) {
    return null;
  }

  const handleAccept = async () => {
    await acceptMission();
    router.replace("/mission/active");
  };

  const handleSkip = async () => {
    await skipMission();
    router.replace("/(tabs)");
  };

  return (
    <LinearGradient
      colors={[...gradientColors]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 24, paddingHorizontal: 8 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top text */}
          <Animated.View entering={FadeIn.duration(400)}>
            <Text className="font-work-sans text-white/50 text-sm text-center uppercase tracking-widest mb-4">
              Your Mission
            </Text>
            <Text className="font-work-sans-bold text-2xl text-white text-center mb-4">
              A Call Has Arrived
            </Text>
          </Animated.View>

          {/* Personal note */}
          {currentMission.personalNote ? (
            <Animated.View entering={FadeIn.delay(150).duration(400)} className="mb-6 px-4">
              <Text className="font-work-sans text-white/70 text-sm text-center italic leading-5">
                {currentMission.personalNote}
              </Text>
            </Animated.View>
          ) : null}

          {/* Parchment scroll card - grows with content */}
          <Animated.View entering={FadeInDown.delay(250).duration(450)}>
            <ScrollCard mission={currentMission} />
          </Animated.View>

          {/* Actions */}
          <Animated.View entering={FadeIn.delay(400).duration(400)} className="px-6 mt-8">
            <Button
              title="ACCEPT THE CALL"
              variant="gold"
              size="lg"
              onPress={handleAccept}
            />
            <TouchableOpacity onPress={handleSkip} className="mt-4">
              <Text className="font-work-sans text-white/50 text-sm text-center">
                Save to discern later
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
