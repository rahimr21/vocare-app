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
import { fetchHungerFeedWithMeta } from "@/lib/hungerFeed";
import { HungerNeedWithMeta } from "@/types";
import Card from "@/components/ui/Card";

export default function NeedsScreen() {
  const [needs, setNeeds] = useState<HungerNeedWithMeta[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const loadNeeds = () => {
    setError(null);
    setNeeds(null);
    (async () => {
      try {
        const list = await fetchHungerFeedWithMeta(user?.id);
        setNeeds(list);
      } catch (e) {
        setNeeds([]);
        setError(e instanceof Error ? e.message : "Failed to load needs");
      }
    })();
  };

  useEffect(() => {
    loadNeeds();
  }, [user?.id]);

  return (
    <SafeAreaView className="flex-1 bg-bg-light">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-4 pb-4">
          <Text className="font-work-sans-bold text-2xl text-gray-900 mb-1">
            Community Needs
          </Text>
          <Text className="font-work-sans text-gray-500 text-sm mb-6 leading-5">
            Real needs from your campus. Tap one to see details and offer help.
          </Text>

          {needs === null ? (
            <Card className="mb-4">
              <View className="items-center py-8">
                <ActivityIndicator size="small" color="#22C55E" />
                <Text className="font-work-sans text-sm text-gray-500 mt-3">
                  Loading needs...
                </Text>
              </View>
            </Card>
          ) : error ? (
            <Card className="mb-4">
              <Text className="font-work-sans text-sm text-gray-600 text-center mb-4">
                {error}
              </Text>
              <TouchableOpacity
                onPress={loadNeeds}
                className="bg-primary rounded-xl py-3 items-center"
              >
                <Text className="font-work-sans-semibold text-sm text-white">
                  Retry
                </Text>
              </TouchableOpacity>
            </Card>
          ) : needs.length === 0 ? (
            <Card className="mb-4">
              <Text className="font-work-sans text-sm text-gray-600 text-center mb-4">
                No needs yet — submit one from the Report tab.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/report")}
                className="bg-primary rounded-xl py-3 items-center"
              >
                <Text className="font-work-sans-semibold text-sm text-white">
                  Go to Report
                </Text>
              </TouchableOpacity>
            </Card>
          ) : (
            <View className="mb-4">
              {needs.map((need) => {
                const countLabel =
                  need.people_needed != null
                    ? `${need.acceptance_count} of ${need.people_needed} accepted`
                    : `${need.acceptance_count} accepted`;
                return (
                  <TouchableOpacity
                    key={need.id}
                    onPress={() => router.push(`/need/${need.id}`)}
                    activeOpacity={0.8}
                    className="mb-3"
                  >
                    <Card>
                      <Text className="font-work-sans text-gray-900 text-sm leading-5">
                        {need.description}
                      </Text>
                      <View className="flex-row items-center mt-3 flex-wrap">
                        <MaterialCommunityIcons
                          name="map-marker-outline"
                          size={14}
                          color="#6B7280"
                        />
                        <Text className="font-work-sans text-xs text-gray-500 ml-1 mr-3">
                          {need.location}
                        </Text>
                        <View className="bg-gray-100 rounded px-2 py-0.5">
                          <Text className="font-work-sans text-xs text-gray-600 capitalize">
                            {need.category}
                          </Text>
                        </View>
                      </View>
                      <Text className="font-work-sans text-xs text-gray-400 mt-2">
                        Submitted by {need.creator_display_name ?? "Someone"} · {countLabel}
                      </Text>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
