import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { useMission } from "@/context/MissionContext";
import { fetchHungerFeed } from "@/lib/hungerFeed";
import { MOODS } from "@/constants/moods";
import { HungerNeed, MoodType } from "@/types";
import MoodButton from "@/components/ui/MoodButton";
import Card from "@/components/ui/Card";

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [hungerFeed, setHungerFeed] = useState<HungerNeed[] | null>(null);
  const [feedError, setFeedError] = useState<string | null>(null);
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { currentMission, missionHistory, generating, generateMission } = useMission();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setFeedError(null);
      try {
        const needs = await fetchHungerFeed();
        if (!cancelled) setHungerFeed(needs);
      } catch (e) {
        if (!cancelled) {
          setHungerFeed([]);
          setFeedError(e instanceof Error ? e.message : "Failed to load needs");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const displayName =
    profile?.displayName ||
    user?.user_metadata?.display_name ||
    "Pilgrim";

  const handleMoodSelect = async (mood: MoodType) => {
    setSelectedMood(mood);
    if (profile?.gladnessDrivers) {
      await generateMission(mood, profile.gladnessDrivers);
      router.push("/mission/reveal");
    }
  };

  const handleResumeMission = () => {
    if (currentMission?.status === "pending") {
      router.push("/mission/reveal");
    } else if (currentMission?.status === "active") {
      router.push("/mission/active");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-light">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="font-work-sans text-gray-500 text-sm">
                {greeting()}
              </Text>
              <Text className="font-work-sans-bold text-2xl text-gray-900">
                {displayName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              className="bg-white rounded-full p-2"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <MaterialCommunityIcons
                name="cog-outline"
                size={22}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Active mission card */}
          {currentMission &&
            (currentMission.status === "active" ||
              currentMission.status === "pending") && (
              <TouchableOpacity onPress={handleResumeMission}>
                <Card className="mb-6 border border-primary/20">
                  <View className="flex-row items-center">
                    <View className="bg-primary/10 rounded-full p-2 mr-3">
                      <MaterialCommunityIcons
                        name="compass-outline"
                        size={20}
                        color="#135bec"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="font-work-sans-semibold text-sm text-primary">
                        {currentMission.status === "active"
                          ? "Mission In Progress"
                          : "Mission Waiting"}
                      </Text>
                      <Text className="font-work-sans text-gray-600 text-sm">
                        {currentMission.title}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color="#9CA3AF"
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            )}

          {/* Mood check-in */}
          <Card className="mb-6">
            <Text className="font-playfair-bold text-lg text-gray-900 text-center mb-1">
              How is your spirit today?
            </Text>
            <Text className="font-work-sans text-sm text-gray-500 text-center mb-5">
              Your mood helps us craft your mission
            </Text>

            {generating ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#135bec" />
                <Text className="font-work-sans text-sm text-gray-500 mt-3">
                  Crafting your mission...
                </Text>
              </View>
            ) : (
              <View>
                <View className="flex-row mb-1">
                  {MOODS.slice(0, 2).map((mood) => (
                    <MoodButton
                      key={mood.id}
                      mood={mood}
                      selected={selectedMood === mood.id}
                      onPress={() => handleMoodSelect(mood.id)}
                    />
                  ))}
                </View>
                <View className="flex-row">
                  {MOODS.slice(2, 4).map((mood) => (
                    <MoodButton
                      key={mood.id}
                      mood={mood}
                      selected={selectedMood === mood.id}
                      onPress={() => handleMoodSelect(mood.id)}
                    />
                  ))}
                </View>
              </View>
            )}
          </Card>

          {/* Community needs feed */}
          <Text className="font-work-sans-semibold text-lg text-gray-900 mb-3">
            Community Needs
          </Text>
          {hungerFeed === null ? (
            <Card className="mb-6">
              <View className="items-center py-6">
                <ActivityIndicator size="small" color="#135bec" />
                <Text className="font-work-sans text-sm text-gray-500 mt-2">
                  Loading needs...
                </Text>
              </View>
            </Card>
          ) : feedError ? (
            <Card className="mb-6">
              <Text className="font-work-sans text-sm text-gray-500 text-center">
                {feedError}
              </Text>
            </Card>
          ) : hungerFeed.length === 0 ? (
            <Card className="mb-6">
              <Text className="font-work-sans text-sm text-gray-500 text-center">
                No needs yet — submit one from the Report tab.
              </Text>
            </Card>
          ) : (
            <View className="mb-6">
              {hungerFeed.slice(0, 5).map((need) => (
                <Card key={need.id} className="mb-3">
                  <Text className="font-work-sans text-gray-900 text-sm">
                    {need.description}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={14}
                      color="#6B7280"
                    />
                    <Text className="font-work-sans text-xs text-gray-500 ml-1">
                      {need.location}
                    </Text>
                    <View className="bg-gray-100 rounded px-2 py-0.5 ml-2">
                      <Text className="font-work-sans text-xs text-gray-600 capitalize">
                        {need.category}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}

          {/* Quick stats */}
          <Text className="font-work-sans-semibold text-lg text-gray-900 mb-3">
            Your Journey
          </Text>
          <View className="flex-row space-x-3">
            <Card className="flex-1 mr-1.5">
              <Text className="font-work-sans-bold text-2xl text-primary">
                {currentMission ? "1" : "0"}
              </Text>
              <Text className="font-work-sans text-xs text-gray-500">
                Active Mission
              </Text>
            </Card>
            <Card className="flex-1 ml-1.5">
              <Text className="font-work-sans-bold text-2xl text-gold">
                {missionHistory.filter((m) => m.status === "completed").length}
              </Text>
              <Text className="font-work-sans text-xs text-gray-500">
                Completed
              </Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
