import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMission } from "@/context/MissionContext";

export default function MissionReflectionScreen() {
  const { recordReflection } = useMission();
  const router = useRouter();

  const handleResponse = async (feltAlive: boolean) => {
    await recordReflection(feltAlive);
    router.replace("/(tabs)");
  };

  const handleSkip = async () => {
    await recordReflection(false);
    router.replace("/(tabs)");
  };

  return (
    <LinearGradient
      colors={["#0A2E76", "#0d1b3e", "#060f24"]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 justify-center items-center px-6">
        {/* Question */}
        <Text className="font-playfair-bold-italic text-3xl text-white text-center leading-10 mb-4">
          Did doing this{"\n"}make you feel
        </Text>
        <Text className="font-playfair-bold-italic text-4xl text-gold text-center mb-12">
          alive?
        </Text>

        {/* Yes / No circles */}
        <View className="flex-row justify-center items-center space-x-8 mb-10">
          <TouchableOpacity
            onPress={() => handleResponse(true)}
            activeOpacity={0.8}
            className="items-center"
          >
            <View
              className="w-28 h-28 rounded-full items-center justify-center border-2 border-gold"
              style={{ backgroundColor: "rgba(212, 175, 55, 0.15)" }}
            >
              <Text className="font-work-sans-bold text-2xl text-gold">
                YES
              </Text>
            </View>
            <Text className="font-work-sans text-white/50 text-xs mt-3">
              Consolation
            </Text>
          </TouchableOpacity>

          <View className="w-6" />

          <TouchableOpacity
            onPress={() => handleResponse(false)}
            activeOpacity={0.8}
            className="items-center"
          >
            <View
              className="w-28 h-28 rounded-full items-center justify-center border-2 border-white/30"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              <Text className="font-work-sans-bold text-2xl text-white/60">
                NO
              </Text>
            </View>
            <Text className="font-work-sans text-white/50 text-xs mt-3">
              Desolation
            </Text>
          </TouchableOpacity>
        </View>

        {/* Skip */}
        <TouchableOpacity onPress={handleSkip}>
          <Text className="font-work-sans text-white/40 text-sm">
            Skip Reflection
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}
