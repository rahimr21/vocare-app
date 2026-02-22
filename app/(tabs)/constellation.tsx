import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMission } from "@/context/MissionContext";
import { Mission } from "@/types";
import ConstellationMap from "@/components/mission/ConstellationMap";
import Card from "@/components/ui/Card";

export default function ConstellationScreen() {
  const { missionHistory } = useMission();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const completedMissions = missionHistory.filter(
    (m) => m.status === "completed"
  );
  const consolations = completedMissions.filter((m) => m.feltAlive === true);
  const desolations = completedMissions.filter((m) => m.feltAlive === false);

  return (
    <LinearGradient
      colors={["#101622", "#0d1b2e", "#080e18"]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pt-4">
            {/* Header */}
            <Text className="font-playfair-bold text-2xl text-white mb-1">
              Purpose Constellation
            </Text>
            <Text className="font-work-sans text-white/50 text-sm mb-6">
              Your journey mapped in stars
            </Text>

            {/* Star map */}
            <View className="items-center mb-6">
              <ConstellationMap
                missions={completedMissions}
                onStarPress={setSelectedMission}
              />
            </View>

            {/* Stats row */}
            <View className="flex-row space-x-3 mb-6">
              <View className="flex-1 bg-white/5 rounded-2xl p-4 mr-1.5">
                <Text className="font-work-sans-bold text-2xl text-gold">
                  {consolations.length}
                </Text>
                <Text className="font-work-sans text-white/50 text-xs">
                  Consolations
                </Text>
              </View>
              <View className="flex-1 bg-white/5 rounded-2xl p-4 mx-0.5">
                <Text className="font-work-sans-bold text-2xl text-white/60">
                  {desolations.length}
                </Text>
                <Text className="font-work-sans text-white/50 text-xs">
                  Desolations
                </Text>
              </View>
              <View className="flex-1 bg-white/5 rounded-2xl p-4 ml-1.5">
                <Text className="font-work-sans-bold text-2xl text-white">
                  {completedMissions.length}
                </Text>
                <Text className="font-work-sans text-white/50 text-xs">
                  Total
                </Text>
              </View>
            </View>

            {/* Legend */}
            <View className="flex-row items-center justify-center space-x-6 mb-4">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-gold mr-2" />
                <Text className="font-work-sans text-white/60 text-xs">
                  Felt Alive
                </Text>
              </View>
              <View className="w-4" />
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-gray-500 mr-2" />
                <Text className="font-work-sans text-white/60 text-xs">
                  Desolation
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Star detail modal */}
      <Modal
        visible={!!selectedMission}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMission(null)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/60"
          onPress={() => setSelectedMission(null)}
        >
          <Pressable onPress={() => {}}>
            <View className="bg-bg-dark rounded-t-3xl px-6 pt-6 pb-10">
              {/* Handle bar */}
              <View className="w-10 h-1 bg-white/20 rounded-full self-center mb-4" />

              {selectedMission && (
                <>
                  <View className="flex-row items-center mb-3">
                    <MaterialCommunityIcons
                      name={
                        selectedMission.feltAlive
                          ? "star-four-points"
                          : "star-four-points-outline"
                      }
                      size={20}
                      color={
                        selectedMission.feltAlive ? "#D4AF37" : "#6B7280"
                      }
                    />
                    <Text className="font-work-sans-semibold text-white ml-2">
                      {selectedMission.title}
                    </Text>
                  </View>
                  <Text className="font-work-sans text-white/60 text-sm leading-5 mb-3">
                    {selectedMission.description}
                  </Text>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={14}
                      color="#9CA3AF"
                    />
                    <Text className="font-work-sans text-white/40 text-xs ml-1">
                      {selectedMission.location}
                    </Text>
                    <Text className="text-white/20 mx-2">·</Text>
                    <Text className="font-work-sans text-white/40 text-xs">
                      {selectedMission.feltAlive
                        ? "Felt Alive"
                        : "Desolation"}
                    </Text>
                  </View>
                </>
              )}

              <TouchableOpacity
                onPress={() => setSelectedMission(null)}
                className="mt-5 py-3 bg-white/10 rounded-xl items-center"
              >
                <Text className="font-work-sans-medium text-white text-sm">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}
