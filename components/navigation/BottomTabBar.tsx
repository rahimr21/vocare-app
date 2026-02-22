import React from "react";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TAB_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  index: "home",
  growth: "tree",
  report: "hand-heart",
};

const TAB_LABELS: Record<string, string> = {
  index: "Home",
  growth: "Growth",
  report: "Report",
};

export default function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0">
      <BlurView
        intensity={80}
        tint="light"
        className="flex-row justify-around items-center pt-2 pb-6 px-4"
        style={{
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.05)",
          ...(Platform.OS === "android" && {
            backgroundColor: "rgba(255,255,255,0.95)",
          }),
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const iconName = TAB_ICONS[route.name] || "circle";
          const label = TAB_LABELS[route.name] || route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              className="items-center justify-center flex-1 py-1"
            >
              <View
                className={`items-center justify-center rounded-full p-2 ${
                  isFocused ? "bg-primary/10" : ""
                }`}
              >
                <MaterialCommunityIcons
                  name={iconName}
                  size={24}
                  color={isFocused ? "#135bec" : "#9CA3AF"}
                />
              </View>
              <Text
                className={`text-xs mt-0.5 ${
                  isFocused
                    ? "text-primary font-work-sans-semibold"
                    : "text-gray-400 font-work-sans"
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}
