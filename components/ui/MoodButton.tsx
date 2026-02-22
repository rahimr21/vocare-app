import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Mood } from "@/types";

interface MoodButtonProps {
  mood: Mood;
  selected: boolean;
  onPress: () => void;
}

export default function MoodButton({ mood, selected, onPress }: MoodButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-1 items-center justify-center rounded-2xl p-4 m-1.5 ${
        selected ? "border-2" : "border border-gray-200"
      }`}
      style={{
        backgroundColor: selected ? mood.bgColor : "#FFFFFF",
        borderColor: selected ? mood.color : "#E5E7EB",
      }}
    >
      <View
        className="items-center justify-center rounded-full mb-2"
        style={{
          width: 48,
          height: 48,
          backgroundColor: mood.bgColor,
        }}
      >
        <MaterialCommunityIcons
          name={mood.icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={24}
          color={mood.color}
        />
      </View>
      <Text
        className="font-work-sans-medium text-sm text-gray-700"
        style={selected ? { color: mood.color } : undefined}
      >
        {mood.label}
      </Text>
    </TouchableOpacity>
  );
}
