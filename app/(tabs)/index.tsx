import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { useMission } from "@/context/MissionContext";
import { MOODS } from "@/constants/moods";
import { MoodType, HungerNeedWithMeta } from "@/types";
import MoodButton from "@/components/ui/MoodButton";
import Card from "@/components/ui/Card";
import { theme } from "@/constants/theme";
import { fetchMyAcceptedNeeds } from "@/lib/hungerFeed";

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [customMoodText, setCustomMoodText] = useState("");
  const [myAcceptedNeeds, setMyAcceptedNeeds] = useState<HungerNeedWithMeta[]>([]);
  const [loadingNeeds, setLoadingNeeds] = useState(true);
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { currentMission, missionHistory, setPendingCustomMoodText } = useMission();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) {
      setMyAcceptedNeeds([]);
      setLoadingNeeds(false);
      return;
    }
    setLoadingNeeds(true);
    fetchMyAcceptedNeeds(user.id)
      .then(setMyAcceptedNeeds)
      .catch(() => setMyAcceptedNeeds([]))
      .finally(() => setLoadingNeeds(false));
  }, [user?.id]);

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

  const handleMoodSelect = (mood: MoodType) => {
    if (mood === "other") {
      setSelectedMood("other");
      return;
    }
    setSelectedMood(mood);
    const taskChoiceMoods: MoodType[] = ["energized", "bored", "content"];
    if (taskChoiceMoods.includes(mood)) {
      router.push({
        pathname: "/mission/choose-task",
        params: { mood },
      });
    } else {
      router.push({
        pathname: "/mission/loading",
        params: { mood },
      });
    }
  };

  const handleOtherMoodSubmit = () => {
    if (!customMoodText.trim()) return;
    setPendingCustomMoodText(customMoodText.trim());
    router.push({
      pathname: "/mission/loading",
      params: { mood: "other" },
    });
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
                        color={theme.primary}
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
            <Text className="font-work-sans-bold text-lg text-gray-900 text-center mb-1">
              How is your spirit today?
            </Text>
            <Text className="font-work-sans text-sm text-gray-500 text-center mb-5">
              Your mood helps us craft your mission
            </Text>

            <View>
              <View className="flex-row mb-1">
                {MOODS.slice(0, 3).map((mood) => (
                  <MoodButton
                    key={mood.id}
                    mood={mood}
                    selected={selectedMood === mood.id}
                    onPress={() => handleMoodSelect(mood.id)}
                  />
                ))}
              </View>
              <View className="flex-row">
                {MOODS.slice(3, 5).map((mood) => (
                  <MoodButton
                    key={mood.id}
                    mood={mood}
                    selected={selectedMood === mood.id}
                    onPress={() => handleMoodSelect(mood.id)}
                  />
                ))}
              </View>
              {selectedMood === "other" && (
                <View className="mt-3">
                  <TextInput
                    value={customMoodText}
                    onChangeText={setCustomMoodText}
                    placeholder="How are you feeling?"
                    placeholderTextColor="#9CA3AF"
                    className="font-work-sans text-sm text-gray-900 bg-white border border-gray-200 rounded-xl px-4 py-3"
                    maxLength={100}
                  />
                  <TouchableOpacity
                    onPress={handleOtherMoodSubmit}
                    disabled={!customMoodText.trim()}
                    className={`mt-2 rounded-xl py-3 items-center ${
                      customMoodText.trim() ? "bg-primary" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-work-sans-semibold text-sm ${
                        customMoodText.trim() ? "text-white" : "text-gray-400"
                      }`}
                    >
                      Generate Mission
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Card>

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

          {/* Tasks for others */}
          <Text className="font-work-sans-semibold text-lg text-gray-900 mb-3 mt-6">
            Tasks for others
          </Text>
          <Card className="mb-6">
            {loadingNeeds ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            ) : myAcceptedNeeds.length === 0 ? (
              <Text className="font-work-sans text-sm text-gray-500 text-center py-3">
                No tasks for others yet — accept a need on the Community tab.
              </Text>
            ) : (
              <View>
                {myAcceptedNeeds.map((need) => {
                  const isDone = need.status === "filled";
                  return (
                    <TouchableOpacity
                      key={need.id}
                      onPress={() => router.push(`/need/${need.id}`)}
                      className="py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <Text
                        className="font-work-sans text-sm text-gray-900"
                        numberOfLines={2}
                      >
                        {need.description}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <View
                          className={`rounded-full px-2 py-0.5 ${
                            isDone ? "bg-gray-200" : "bg-primary/15"
                          }`}
                        >
                          <Text
                            className={`font-work-sans text-xs ${
                              isDone ? "text-gray-600" : "text-primary"
                            }`}
                          >
                            {isDone ? "Done" : "In progress"}
                          </Text>
                        </View>
                        {need.location ? (
                          <Text
                            className="font-work-sans text-xs text-gray-400 ml-2"
                            numberOfLines={1}
                          >
                            {need.location}
                          </Text>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
