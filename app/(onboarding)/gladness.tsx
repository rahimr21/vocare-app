import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUserProfile } from "@/context/UserProfileContext";
import { GLADNESS_DRIVERS } from "@/constants/gladnessDrivers";
import Button from "@/components/ui/Button";

export default function GladnessScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { updateGladnessDrivers, completeOnboarding } = useUserProfile();
  const router = useRouter();

  const toggleDriver = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    if (selected.length < 2) {
      Alert.alert("Select More", "Please select at least 2 energy drivers");
      return;
    }
    setLoading(true);
    await updateGladnessDrivers(selected);
    await completeOnboarding();
    setLoading(false);
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-bg-light">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-16">
          {/* Step indicator */}
          <View className="flex-row items-center mb-8">
            <View className="flex-row flex-1">
              <View className="h-1.5 flex-1 bg-primary rounded-full mr-1" />
              <View className="h-1.5 flex-1 bg-primary rounded-full ml-1" />
            </View>
          </View>

          {/* Header */}
          <Text className="font-playfair-bold text-2xl text-gray-900 mb-2">
            What Gives You Energy?
          </Text>
          <Text className="font-work-sans text-gray-500 text-base mb-8 leading-6">
            Select the activities that make you come alive. We'll use these to
            craft missions that connect your gifts to the world's needs.
          </Text>

          {/* Driver chips */}
          <View className="flex-row flex-wrap">
            {GLADNESS_DRIVERS.map((driver) => {
              const isSelected = selected.includes(driver.id);
              return (
                <TouchableOpacity
                  key={driver.id}
                  onPress={() => toggleDriver(driver.id)}
                  activeOpacity={0.7}
                  className={`flex-row items-center px-4 py-3 rounded-2xl mr-2 mb-3 ${
                    isSelected
                      ? "bg-primary"
                      : "bg-white border border-gray-200"
                  }`}
                  style={
                    !isSelected
                      ? {
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.05,
                          shadowRadius: 3,
                          elevation: 1,
                        }
                      : undefined
                  }
                >
                  <MaterialCommunityIcons
                    name={
                      driver.icon as keyof typeof MaterialCommunityIcons.glyphMap
                    }
                    size={18}
                    color={isSelected ? "#FFFFFF" : "#135bec"}
                  />
                  <Text
                    className={`font-work-sans-medium text-sm ml-2 ${
                      isSelected ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {driver.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected count */}
          <Text className="font-work-sans text-sm text-gray-400 mt-4 text-center">
            {selected.length} selected · Choose at least 2
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-bg-light px-6 pb-10 pt-4 border-t border-gray-100">
        <Button
          title="Discover My Path"
          onPress={handleContinue}
          loading={loading}
          disabled={selected.length < 2}
          size="lg"
        />
      </View>
    </View>
  );
}
