import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { useMission } from "@/context/MissionContext";
import { theme } from "@/constants/theme";

const gradientColors = [theme.primary, "#3d5a4c", "#2d4035"] as const;

const springConfig = { damping: 14, stiffness: 120 };

export default function MissionReflectionScreen() {
  const { recordReflection } = useMission();
  const router = useRouter();
  const questionOpacity = useSharedValue(0);
  const yesScale = useSharedValue(0.8);
  const noScale = useSharedValue(0.8);

  useEffect(() => {
    questionOpacity.value = withTiming(1, { duration: 400 });
    yesScale.value = withDelay(200, withSpring(1, springConfig));
    noScale.value = withDelay(350, withSpring(1, springConfig));
  }, []);

  const questionStyle = useAnimatedStyle(() => ({
    opacity: questionOpacity.value,
  }));
  const yesStyle = useAnimatedStyle(() => ({
    transform: [{ scale: yesScale.value }],
  }));
  const noStyle = useAnimatedStyle(() => ({
    transform: [{ scale: noScale.value }],
  }));

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
      colors={[...gradientColors]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 justify-center items-center px-6">
        {/* Question - fades in */}
        <Animated.View style={[questionStyle, { alignItems: "center", marginBottom: 48 }]}>
          <Text className="font-work-sans-bold text-3xl text-white text-center leading-10 mb-4">
            Did doing this{"\n"}make you feel
          </Text>
          <Text className="font-work-sans-bold text-4xl text-white text-center" style={{ textShadowColor: "rgba(0,0,0,0.2)", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
            alive?
          </Text>
        </Animated.View>

        {/* Yes / No - light cards so they stand out on green */}
        <View className="flex-row justify-center items-center mb-10" style={{ gap: 24 }}>
          <Animated.View style={yesStyle}>
            <TouchableOpacity
              onPress={() => handleResponse(true)}
              activeOpacity={0.85}
              className="items-center"
            >
              <View style={[styles.optionCircle, styles.optionYes]}>
                <Text className="font-work-sans-bold text-2xl" style={{ color: "#2d4035" }}>YES</Text>
              </View>
              <Text className="font-work-sans text-white/80 text-xs mt-3">
                Consolation
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={noStyle}>
            <TouchableOpacity
              onPress={() => handleResponse(false)}
              activeOpacity={0.85}
              className="items-center"
            >
              <View style={[styles.optionCircle, styles.optionNo]}>
                <Text className="font-work-sans-bold text-2xl" style={{ color: "#4a5568" }}>NO</Text>
              </View>
              <Text className="font-work-sans text-white/80 text-xs mt-3">
                Desolation
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View entering={FadeIn.delay(500)}>
          <TouchableOpacity onPress={handleSkip}>
            <Text className="font-work-sans text-white/60 text-sm">
              Skip Reflection
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  optionCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  optionYes: {
    backgroundColor: "#faf8f5",
    borderColor: "#c9a227",
    shadowColor: "#000",
  },
  optionNo: {
    backgroundColor: "#f0eeeb",
    borderColor: "rgba(255,255,255,0.6)",
    shadowColor: "#000",
  },
});
