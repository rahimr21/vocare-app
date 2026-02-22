import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "./ThemeColors";

export default function SettingsScreen({ navigation }) {
  const handleRealign = () => {
    const stackNav = navigation.getParent();
    if (stackNav?.reset) {
      stackNav.reset({ index: 0, routes: [{ name: "Onboarding" }] });
    } else {
      navigation.navigate("Onboarding");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity
          style={styles.realignButton}
          onPress={handleRealign}
          activeOpacity={0.8}
        >
          <Text style={styles.realignButtonText}>
            Re-align Your Purpose (Edit Answers)
          </Text>
        </TouchableOpacity>
        <Text style={styles.hint}>
          You'll go through onboarding again, then see the tree animation before
          returning to Home.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.textDark,
    marginBottom: 24,
  },
  realignButton: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  realignButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.cardBg,
  },
  hint: {
    fontSize: 13,
    color: theme.textLight,
    marginTop: 16,
    lineHeight: 20,
  },
});
