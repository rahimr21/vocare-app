import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Mission } from "@/types";

interface ScrollCardProps {
  mission: Mission;
}

export default function ScrollCard({ mission }: ScrollCardProps) {
  return (
    <View
      className="bg-parchment rounded-2xl p-6 mx-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.2)",
      }}
    >
      {/* Decorative top ornament */}
      <View className="items-center mb-4">
        <MaterialCommunityIcons
          name="fleur-de-lis"
          size={24}
          color="#D4AF37"
        />
      </View>

      {/* Title */}
      <Text className="font-work-sans-bold text-xl text-gray-900 text-center mb-3">
        {mission.title}
      </Text>

      {/* Divider */}
      <View className="h-px bg-gold/30 mx-8 mb-4" />

      {/* Description */}
      <Text className="font-work-sans text-base text-gray-700 text-center leading-7 mb-4">
        {mission.description}
      </Text>

      {/* Details row */}
      <View className="flex-row justify-center items-center space-x-4">
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={16}
            color="#6B7280"
          />
          <Text className="font-work-sans text-sm text-gray-500 ml-1">
            {mission.location}
          </Text>
        </View>
        <Text className="text-gray-300 mx-2">|</Text>
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color="#6B7280"
          />
          <Text className="font-work-sans text-sm text-gray-500 ml-1">
            ~{mission.estimatedMinutes} min
          </Text>
        </View>
      </View>
    </View>
  );
}
