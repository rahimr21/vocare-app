import React from "react";
import { View, Text } from "react-native";

interface StatusBadgeProps {
  label: string;
  variant?: "active" | "completed" | "pending";
}

const variants = {
  active: { bg: "bg-blue-100", text: "text-blue-700" },
  completed: { bg: "bg-primary/15", text: "text-primary" },
  pending: { bg: "bg-amber-100", text: "text-amber-700" },
};

export default function StatusBadge({
  label,
  variant = "active",
}: StatusBadgeProps) {
  const style = variants[variant];
  return (
    <View className={`px-3 py-1 rounded-full ${style.bg}`}>
      <Text className={`text-xs font-work-sans-semibold ${style.text}`}>
        {label}
      </Text>
    </View>
  );
}
