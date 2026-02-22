import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { useUserProfile } from "@/context/UserProfileContext";
import { theme } from "@/constants/theme";
import TreeAnimation from "@/components/ui/TreeAnimation";

const SUCCESS_SHOW_MS = 2000;

export default function TreeScreen() {
  const [phase, setPhase] = useState<"growing" | "success">("growing");
  const router = useRouter();
  const { completeOnboarding } = useUserProfile();

  useEffect(() => {
    if (phase !== "success") return;
    const t = setTimeout(async () => {
      await completeOnboarding();
      router.replace("/(tabs)");
    }, SUCCESS_SHOW_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "growing") {
    return (
      <TreeAnimation
        message="Synthesizing your purpose..."
        duration={3500}
        onComplete={() => setPhase("success")}
      />
    );
  }

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(600)}>
      <View style={styles.checkWrap}>
        <Text style={styles.checkMark}>✓</Text>
      </View>
      <Text style={styles.readyTitle}>You are ready.</Text>
      <Text style={styles.readySubtitle}>
        Your vocation is taking root. Let's find where your gifts meet the
        world's needs.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  checkWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  checkMark: {
    fontSize: 36,
    color: theme.primary,
  },
  readyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.textDark,
    textAlign: "center",
    marginBottom: 8,
  },
  readySubtitle: {
    fontSize: 16,
    color: theme.textLight,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
});
