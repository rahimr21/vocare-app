import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import { ONBOARDING_STEPS_TOTAL } from "@/constants/onboarding";
import { getItem, setItem, KEYS } from "@/lib/storage";
import type { DeepOnboardingData } from "@/types";
import Button from "@/components/ui/Button";
import { theme } from "@/constants/theme";

const defaultDeep: DeepOnboardingData = {
  personalityTraits: [],
  physicalLimitations: [],
  rechargeActivities: [],
  hunger: null,
  resistance: 50,
  vocation: "",
};

function resistanceLabel(value: number): string {
  if (value < 33) return "Closer to fear";
  if (value < 67) return "In between";
  return "Closer to exhaustion";
}

export default function ResistanceScreen() {
  const [value, setValue] = useState(50);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const stepIndex = 5;

  useEffect(() => {
    (async () => {
      const stored = await getItem<DeepOnboardingData>(KEYS.ONBOARDING_DEEP);
      if (stored?.resistance != null) setValue(stored.resistance);
      setReady(true);
    })();
  }, []);

  const handleContinue = async () => {
    setLoading(true);
    const stored = await getItem<DeepOnboardingData>(KEYS.ONBOARDING_DEEP);
    const merged: DeepOnboardingData = {
      ...defaultDeep,
      ...stored,
      resistance: value,
    };
    await setItem(KEYS.ONBOARDING_DEEP, merged);
    setLoading(false);
    router.push("/(onboarding)/vocation");
  };

  if (!ready) return null;

  return (
    <View className="flex-1 bg-bg-light">
      <View className="h-1 bg-gray-200">
        <View
          className="h-full bg-primary rounded-full"
          style={{ width: `${((stepIndex + 1) / ONBOARDING_STEPS_TOTAL) * 100}%` }}
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
            What stops you?
          </Text>
          <Text className="font-work-sans text-gray-500 text-base mb-8 leading-6">
            Slide between fear and exhaustion.
          </Text>

          <View className="px-2">
            <View className="flex-row justify-between mb-2">
              <Text className="font-work-sans text-xs text-gray-500">Fear</Text>
              <Text className="font-work-sans text-xs text-gray-500">
                Exhaustion
              </Text>
            </View>
            <Slider
              minimumValue={0}
              maximumValue={100}
              value={value}
              onValueChange={setValue}
              minimumTrackTintColor={theme.primary}
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor={theme.primary}
              style={{ width: "100%", height: 40 }}
            />
            <Text className="font-work-sans text-sm text-gray-600 text-center mt-4">
              {resistanceLabel(value)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-bg-light px-6 pb-10 pt-4 border-t border-gray-100">
        <Button
          title="Continue"
          onPress={handleContinue}
          loading={loading}
          size="lg"
        />
      </View>
    </View>
  );
}
