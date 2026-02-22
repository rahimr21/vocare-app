import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface CategoryChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function CategoryChip({
  label,
  selected,
  onPress,
}: CategoryChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`px-4 py-2 rounded-full mr-2 mb-2 ${
        selected ? "bg-primary" : "bg-gray-100"
      }`}
    >
      <Text
        className={`font-work-sans-medium text-sm ${
          selected ? "text-white" : "text-gray-600"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
