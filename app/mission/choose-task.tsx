import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MoodType } from "@/types";
import { fetchHungerFeed } from "@/lib/hungerFeed";
import { HungerNeed } from "@/types";
import Card from "@/components/ui/Card";
import { theme } from "@/constants/theme";

const MOOD_LABELS: Record<string, string> = {
  energized: "You're energized!",
  bored: "You're feeling bored — here's something you could do.",
  content: "You're in a good place — want to help out?",
};

export default function ChooseTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mood: string }>();
  const mood = (params.mood || "content") as MoodType;
  const [needs, setNeeds] = useState<HungerNeed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHungerFeed()
      .then(setNeeds)
      .catch(() => setNeeds([]))
      .finally(() => setLoading(false));
  }, []);

  const handlePickNeed = (need: HungerNeed) => {
    router.replace({
      pathname: "/mission/loading",
      params: { mood, needId: need.id },
    });
  };

  const handleGenerateMission = () => {
    router.replace({
      pathname: "/mission/loading",
      params: { mood },
    });
  };

  const displayNeeds = needs.slice(0, 5);
  const hasNeeds = displayNeeds.length > 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-bg-light">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="font-work-sans-bold text-xl text-gray-900 mb-1">
            {MOOD_LABELS[mood] ?? `You're feeling ${mood}`}
          </Text>
          <Text className="font-work-sans text-sm text-gray-500 mb-6">
            {hasNeeds
              ? "Pick a task to help with, or we can generate a personal mission for you."
              : "No community tasks right now — we'll generate a personal mission for you."}
          </Text>

          {loading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : hasNeeds ? (
            <View className="mb-6">
              {displayNeeds.map((need) => (
                <TouchableOpacity
                  key={need.id}
                  onPress={() => handlePickNeed(need)}
                  activeOpacity={0.7}
                >
                  <Card className="mb-3 border border-gray-100">
                    <View className="flex-row items-start">
                      <View className="bg-primary/10 rounded-full p-2 mr-3 mt-0.5">
                        <MaterialCommunityIcons
                          name="hand-heart"
                          size={18}
                          color={theme.primary}
                        />
                      </View>
                      <View className="flex-1">
                        <Text
                          className="font-work-sans-medium text-gray-900 text-sm"
                          numberOfLines={2}
                        >
                          {need.description}
                        </Text>
                        {need.location ? (
                          <Text
                            className="font-work-sans text-xs text-gray-500 mt-1"
                            numberOfLines={1}
                          >
                            {need.location}
                          </Text>
                        ) : null}
                      </View>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={20}
                        color="#9CA3AF"
                      />
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <TouchableOpacity
            onPress={handleGenerateMission}
            className="rounded-xl py-4 items-center"
            style={{ backgroundColor: theme.primary }}
          >
            <Text className="font-work-sans-semibold text-base text-white">
              {hasNeeds ? "Or generate a personal mission for me" : "Generate a mission for me"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
