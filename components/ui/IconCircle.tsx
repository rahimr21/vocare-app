import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface IconCircleProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  size?: number;
  color?: string;
  bgColor?: string;
}

export default function IconCircle({
  icon,
  size = 40,
  color = "#22C55E",
  bgColor = "rgba(34, 197, 94, 0.1)",
}: IconCircleProps) {
  return (
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
      }}
    >
      <MaterialCommunityIcons
        name={icon}
        size={size * 0.5}
        color={color}
      />
    </View>
  );
}
