import React from "react";
import { View, Text, Alert } from "react-native";
import { useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { profile, resetProfile } = useUserProfile();
  const router = useRouter();

  const handleRealign = () => {
    Alert.alert(
      "Re-align Your Purpose",
      "This will take you through the onboarding questions again so we can better understand you.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Let's Go",
          onPress: async () => {
            await resetProfile();
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-bg-light">
        <View className="px-6 pt-4">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <Button
              title="Back"
              variant="outline"
              size="sm"
              onPress={() => router.back()}
            />
          </View>

          <Text className="font-work-sans-bold text-2xl text-gray-900 mb-6">
            Settings
          </Text>

          {/* Account info */}
          <Card className="mb-4">
            <View className="flex-row items-center mb-4">
              <View className="bg-primary/10 rounded-full p-3 mr-4">
                <MaterialCommunityIcons
                  name="account"
                  size={24}
                  color="#22C55E"
                />
              </View>
              <View className="flex-1">
                <Text className="font-work-sans-semibold text-lg text-gray-900">
                  {profile?.displayName || "Pilgrim"}
                </Text>
                <Text className="font-work-sans text-sm text-gray-500">
                  {user?.email}
                </Text>
              </View>
            </View>

            {/* Gladness drivers */}
            {profile?.gladnessDrivers && profile.gladnessDrivers.length > 0 && (
              <View>
                <Text className="font-work-sans text-xs text-gray-400 uppercase tracking-wide mb-2">
                  Energy Drivers
                </Text>
                <View className="flex-row flex-wrap">
                  {profile.gladnessDrivers.map((d) => (
                    <View
                      key={d}
                      className="bg-primary/10 rounded-full px-3 py-1 mr-2 mb-1"
                    >
                      <Text className="font-work-sans text-xs text-primary">
                        {d.replace(/-/g, " ")}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Card>

          {/* Re-align purpose */}
          <Button
            title="Re-align Your Purpose"
            variant="primary"
            onPress={handleRealign}
            size="md"
          />

          <View className="h-3" />

          {/* Sign out */}
          <Button
            title="Sign Out"
            variant="danger"
            onPress={handleSignOut}
            size="md"
          />
        </View>
      </SafeAreaView>
    </>
  );
}
