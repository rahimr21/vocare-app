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
import GrowthTree from "@/components/mission/GrowthTree";

export default function GrowthScreen() {
  const { missionHistory } = useMission();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const completedMissions = missionHistory.filter(
    (m) => m.status === "completed"
  );
  const consolations = completedMissions.filter((m) => m.feltAlive === true);
  const desolations = completedMissions.filter((m) => m.feltAlive === false);

  return (
    <LinearGradient
      colors={["#f0f4e8", "#e8eed8", "#dde5cd"]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pt-4">
            {/* Header */}
            <Text className="font-playfair-bold text-2xl text-[#2d2418] mb-1">
              Growth Tree
            </Text>
            <Text className="font-work-sans text-[#5a4a3a]/80 text-sm mb-6">
              Watch your purpose take root
            </Text>

            {/* Tree visualization */}
            <View className="items-center mb-6">
              <GrowthTree
                missions={completedMissions}
                onLeafPress={setSelectedMission}
              />
            </View>

            {/* Stats row */}
            <View className="flex-row space-x-3 mb-6">
              <View
                className="flex-1 rounded-2xl p-4 mr-1.5"
                style={{ backgroundColor: "rgba(76, 175, 80, 0.1)" }}
              >
                <Text className="font-work-sans-bold text-2xl text-[#2e7d32]">
                  {consolations.length}
                </Text>
                <Text className="font-work-sans text-[#5a4a3a]/80 text-xs">
                  Consolations
                </Text>
              </View>
              <View
                className="flex-1 rounded-2xl p-4 mx-0.5"
                style={{ backgroundColor: "rgba(184, 149, 106, 0.15)" }}
              >
                <Text className="font-work-sans-bold text-2xl text-[#8b6914]">
                  {desolations.length}
                </Text>
                <Text className="font-work-sans text-[#5a4a3a]/80 text-xs">
                  Desolations
                </Text>
              </View>
              <View
                className="flex-1 rounded-2xl p-4 ml-1.5"
                style={{ backgroundColor: "rgba(93, 117, 54, 0.12)" }}
              >
                <Text className="font-work-sans-bold text-2xl text-[#2d2418]">
                  {completedMissions.length}
                </Text>
                <Text className="font-work-sans text-[#5a4a3a]/80 text-xs">
                  Total
                </Text>
              </View>
            </View>

            {/* Legend */}
            <View className="flex-row items-center justify-center space-x-6 mb-4">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="leaf"
                  size={18}
                  color="#4CAF50"
                  style={{ marginRight: 8 }}
                />
                <Text className="font-work-sans text-[#5a4a3a]/90 text-xs">
                  Felt Alive
                </Text>
              </View>
              <View className="w-4" />
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="leaf"
                  size={18}
                  color="#B8956A"
                  style={{ marginRight: 8 }}
                />
                <Text className="font-work-sans text-[#5a4a3a]/90 text-xs">
                  Desolation
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Leaf detail modal */}
      <Modal
        visible={!!selectedMission}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMission(null)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => setSelectedMission(null)}
        >
          <Pressable onPress={() => {}}>
            <View
              className="rounded-t-3xl px-6 pt-6 pb-10"
              style={{ backgroundColor: "#f5f0e8" }}
            >
              {/* Handle bar */}
              <View className="w-10 h-1 bg-[#5a4a3a]/30 rounded-full self-center mb-4" />

              {selectedMission && (
                <>
                  <View className="flex-row items-center mb-3">
                    <MaterialCommunityIcons
                      name="leaf"
                      size={20}
                      color={
                        selectedMission.feltAlive ? "#4CAF50" : "#B8956A"
                      }
                    />
                    <Text className="font-work-sans-semibold text-[#2d2418] ml-2">
                      {selectedMission.title}
                    </Text>
                  </View>
                  <Text className="font-work-sans text-[#5a4a3a]/90 text-sm leading-5 mb-3">
                    {selectedMission.description}
                  </Text>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={14}
                      color="#5a4a3a"
                    />
                    <Text className="font-work-sans text-[#5a4a3a]/70 text-xs ml-1">
                      {selectedMission.location}
                    </Text>
                    <Text className="text-[#5a4a3a]/40 mx-2">·</Text>
                    <Text className="font-work-sans text-[#5a4a3a]/70 text-xs">
                      {selectedMission.feltAlive
                        ? "Felt Alive"
                        : "Desolation"}
                    </Text>
                  </View>
                </>
              )}

              <TouchableOpacity
                onPress={() => setSelectedMission(null)}
                className="mt-5 py-3 rounded-xl items-center"
                style={{ backgroundColor: "rgba(93, 117, 54, 0.15)" }}
              >
                <Text className="font-work-sans-medium text-[#2d2418] text-sm">
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
