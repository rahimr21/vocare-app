import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useMission } from "@/context/MissionContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import { theme } from "@/constants/theme";

export default function ActiveMissionScreen() {
  const { currentMission, completeMission } = useMission();
  const router = useRouter();

  useEffect(() => {
    if (!currentMission) {
      router.replace("/(tabs)");
    }
  }, [currentMission]);

  if (!currentMission) {
    return null;
  }

  const handleComplete = async () => {
    await completeMission();
    router.replace("/mission/reflection");
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-light">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-4">
          <Animated.View entering={FadeIn.duration(400)}>
            <View className="flex-row items-center mb-6">
              <StatusBadge label="In Progress" variant="active" />
            </View>
            <Text className="font-work-sans-bold text-2xl text-gray-900 mb-2">
              {currentMission.title}
            </Text>
            <Text className="font-work-sans text-gray-500 text-sm mb-6">
              Accepted just now
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Card className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="bg-primary/10 rounded-full p-2 mr-3">
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={20}
                  color={theme.primary}
                />
              </View>
              <View>
                <Text className="font-work-sans text-xs text-gray-400 uppercase">
                  Location
                </Text>
                <Text className="font-work-sans-medium text-base text-gray-800">
                  {currentMission.location}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="bg-primary/10 rounded-full p-2 mr-3">
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color={theme.primary}
                />
              </View>
              <View>
                <Text className="font-work-sans text-xs text-gray-400 uppercase">
                  Estimated Time
                </Text>
                <Text className="font-work-sans-medium text-base text-gray-800">
                  ~{currentMission.estimatedMinutes} minutes
                </Text>
              </View>
            </View>
          </Card>

          {/* Mission impact */}
          <Text className="font-work-sans-semibold text-lg text-gray-900 mb-2">
            Mission Impact
          </Text>
          <Text className="font-work-sans text-base text-gray-600 leading-6 mb-6">
            {currentMission.description}
          </Text>

          {/* Encouragement */}
          <Card variant="parchment" className="mb-6 border border-gold/20">
            <View className="flex-row items-start">
              <MaterialCommunityIcons
                name="lightbulb-outline"
                size={20}
                color={theme.primary}
                style={{ marginTop: 2, marginRight: 10 }}
              />
              <Text className="font-work-sans text-sm text-gray-600 flex-1 leading-5 italic">
                "The place God calls you to is the place where your deep
                gladness and the world's deep hunger meet."
              </Text>
            </View>
          </Card>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-bg-light px-6 pb-10 pt-4 border-t border-gray-100">
        <Button
          title="Complete Mission"
          onPress={handleComplete}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}
