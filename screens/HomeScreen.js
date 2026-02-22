import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "./ThemeColors";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome</Text>
          <Text style={styles.name}>Pilgrim</Text>
        </View>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("FindPeople")}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="account-plus-outline"
            size={24}
            color={theme.textLight}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.missionCard}>
        <Text style={styles.missionLabel}>Daily Mission</Text>
        <Text style={styles.missionTitle}>
          Help the student looking for a tutor
        </Text>
        <Text style={styles.missionSubtitle}>
          A small step where your gifts meet a real need.
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: theme.textLight,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.textDark,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.cardBg,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  missionCard: {
    backgroundColor: theme.cardBg,
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  missionLabel: {
    fontSize: 12,
    color: theme.textLight,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.textDark,
  },
  missionSubtitle: {
    fontSize: 14,
    color: theme.textLight,
    marginTop: 8,
  },
});
