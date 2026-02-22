import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMission } from "@/context/MissionContext";
import ScrollCard from "@/components/mission/ScrollCard";
import Button from "@/components/ui/Button";

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
      colors={["#166534", "#14532D", "#052e16"]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center px-2">
          {/* Top text */}
          <Text className="font-work-sans text-white/50 text-sm text-center uppercase tracking-widest mb-4">
            Your Mission
          </Text>
          <Text className="font-work-sans-bold text-2xl text-white text-center mb-4">
            A Call Has Arrived
          </Text>

          {/* Personal note */}
          {currentMission.personalNote ? (
            <Text className="font-work-sans text-white/70 text-sm text-center italic mb-6 px-4 leading-5">
              {currentMission.personalNote}
            </Text>
          ) : null}

          {/* Parchment scroll card */}
          <ScrollCard mission={currentMission} />

          {/* Actions */}
          <View className="px-6 mt-8">
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
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
