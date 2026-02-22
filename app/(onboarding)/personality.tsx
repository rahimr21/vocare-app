import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { PERSONALITY_OPTIONS, ONBOARDING_STEPS_TOTAL } from "@/constants/onboarding";
import { getItem, setItem, KEYS } from "@/lib/storage";
import type { DeepOnboardingData } from "@/types";
import Button from "@/components/ui/Button";

const defaultDeep: DeepOnboardingData = {
  personalityTraits: [],
  physicalLimitations: [],
  rechargeActivities: [],
  hunger: null,
  resistance: 50,
  vocation: "",
};

export default function PersonalityScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const stepIndex = 1;

  useEffect(() => {
    (async () => {
      const stored = await getItem<DeepOnboardingData>(KEYS.ONBOARDING_DEEP);
      if (stored?.personalityTraits?.length) {
        setSelected(stored.personalityTraits);
      }
      setReady(true);
    })();
  }, []);

  const toggleTrait = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    if (selected.length < 2) {
      Alert.alert("Select More", "Please select at least 2 traits.");
      return;
    }
    if (selected.length > 3) {
      Alert.alert("Too Many", "Please select at most 3 traits.");
      return;
    }
    setLoading(true);
    const stored = await getItem<DeepOnboardingData>(KEYS.ONBOARDING_DEEP);
    const merged: DeepOnboardingData = {
      ...defaultDeep,
      ...stored,
      personalityTraits: selected,
    };
    await setItem(KEYS.ONBOARDING_DEEP, merged);
    setLoading(false);
    router.push("/(onboarding)/physical");
  };

  if (!ready) return null;

  return (
    <View className="flex-1 bg-bg-light">
      <View className="h-1 bg-gray-200">
        <View
          className="h-full bg-primary rounded-full"
          style={{
            width: `${((stepIndex + 1) / ONBOARDING_STEPS_TOTAL) * 100}%`,
          }}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="self-start mb-6"
          >
            <Text className="font-work-sans-medium text-primary">Back</Text>
          </TouchableOpacity>

          <Text className="font-playfair-bold text-2xl text-gray-900 mb-2">
            How would your closest friend describe you?
          </Text>
          <Text className="font-work-sans text-gray-500 text-base mb-8 leading-6">
            Select 2–3 traits that feel most like you.
          </Text>

          <View className="flex-row flex-wrap">
            {PERSONALITY_OPTIONS.map((option) => {
              const isSelected = selected.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => toggleTrait(option.id)}
                  activeOpacity={0.7}
                  className={`px-5 py-3 rounded-full mr-2 mb-3 ${
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
                  <Text
                    className={`font-work-sans-medium text-sm ${
                      isSelected ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text className="font-work-sans text-sm text-gray-400 mt-4 text-center">
            {selected.length} selected · Choose 2–3
          </Text>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-bg-light px-6 pb-10 pt-4 border-t border-gray-100">
        <Button
          title="Continue"
          onPress={handleContinue}
          loading={loading}
          disabled={selected.length < 2 || selected.length > 3}
          size="lg"
        />
      </View>
    </View>
  );
}
