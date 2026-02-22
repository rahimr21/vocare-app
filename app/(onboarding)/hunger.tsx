import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { HUNGER_OPTIONS, ONBOARDING_STEPS_TOTAL } from "@/constants/onboarding";
import { getItem, setItem, KEYS } from "@/lib/storage";
import type { DeepOnboardingData } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const defaultDeep: DeepOnboardingData = {
  personalityTraits: [],
  physicalLimitations: [],
  rechargeActivities: [],
  hunger: null,
  resistance: 50,
  vocation: "",
};

export default function HungerScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const stepIndex = 4;

  useEffect(() => {
    (async () => {
      const stored = await getItem<DeepOnboardingData>(KEYS.ONBOARDING_DEEP);
      if (stored?.hunger) setSelected(stored.hunger);
      setReady(true);
    })();
  }, []);

  const handleContinue = async () => {
    if (selected == null) return;
    setLoading(true);
    const stored = await getItem<DeepOnboardingData>(KEYS.ONBOARDING_DEEP);
    const merged: DeepOnboardingData = {
      ...defaultDeep,
      ...stored,
      hunger: selected,
    };
    await setItem(KEYS.ONBOARDING_DEEP, merged);
    setLoading(false);
    router.push("/(onboarding)/resistance");
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
            What problem in the world breaks your heart?
          </Text>
          <Text className="font-work-sans text-gray-500 text-base mb-8 leading-6">
            Choose one that moves you most.
          </Text>

          <View>
            {HUNGER_OPTIONS.map((opt) => {
              const isSelected = selected === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setSelected(opt.id)}
                  activeOpacity={0.8}
                  className="mb-3"
                >
                  <Card
                    className={`border-2 ${
                      isSelected ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-work-sans-semibold text-base ${
                        isSelected ? "text-primary" : "text-gray-800"
                      }`}
                    >
                      {opt.label}
                    </Text>
                    <Text className="font-work-sans text-sm text-gray-500 mt-1">
                      {opt.description}
                    </Text>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-bg-light px-6 pb-10 pt-4 border-t border-gray-100">
        <Button
          title="Continue"
          onPress={handleContinue}
          loading={loading}
          disabled={selected == null}
          size="lg"
        />
      </View>
    </View>
  );
}
