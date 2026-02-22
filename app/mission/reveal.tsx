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
      colors={["#101622", "#1a2332", "#0f1925"]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center px-2">
          {/* Top text */}
          <Text className="font-work-sans text-white/50 text-sm text-center uppercase tracking-widest mb-4">
            Your Mission
          </Text>
          <Text className="font-playfair-bold text-2xl text-white text-center mb-8">
            A Call Has Arrived
          </Text>

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
