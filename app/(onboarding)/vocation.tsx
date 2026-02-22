import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ONBOARDING_STEPS_TOTAL } from "@/constants/onboarding";
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

const MIN_LENGTH = 10;
const MAX_LENGTH = 500;

export default function VocationScreen() {
  const [vocation, setVocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const stepIndex = 6;
  const valid = vocation.trim().length >= MIN_LENGTH;

  useEffect(() => {
    (async () => {
      const stored = await getItem<DeepOnboardingData>(KEYS.ONBOARDING_DEEP);
      if (stored?.vocation) setVocation(stored.vocation);
      setReady(true);
    })();
  }, []);

  const handleFinish = async () => {
    if (!valid) {
      Alert.alert(
        "Add a bit more",
        `Please write at least ${MIN_LENGTH} characters.`
      );
      return;
    }
    setLoading(true);
    const stored = await getItem<DeepOnboardingData>(KEYS.ONBOARDING_DEEP);
    const merged: DeepOnboardingData = {
      ...defaultDeep,
      ...stored,
      vocation: vocation.trim(),
    };
    await setItem(KEYS.ONBOARDING_DEEP, merged);
    setLoading(false);
    router.push("/(onboarding)/tree");
  };

  if (!ready) return null;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg-light"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <View className="h-1 bg-gray-200">
        <View
          className="h-full bg-primary rounded-full"
          style={{ width: `${((stepIndex + 1) / ONBOARDING_STEPS_TOTAL) * 100}%` }}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 pt-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="self-start mb-6"
          >
            <Text className="font-work-sans-medium text-primary">Back</Text>
          </TouchableOpacity>

          <Text className="font-playfair-bold text-2xl text-gray-900 mb-2">
            Describe a moment you felt truly useful.
          </Text>
          <Text className="font-work-sans text-gray-500 text-base mb-6 leading-6">
            A few sentences from your life.
          </Text>

          <TextInput
            value={vocation}
            onChangeText={(t) =>
              setVocation(t.length <= MAX_LENGTH ? t : t.slice(0, MAX_LENGTH))
            }
            placeholder="e.g. When I helped a friend through a hard conversation, I felt like my presence actually mattered..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            className="font-work-sans text-base text-gray-900 bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 min-h-[160px]"
            style={{
              minHeight: 160,
            }}
          />
          <Text className="font-work-sans text-xs text-gray-400 mt-1 text-right">
            {vocation.length}/{MAX_LENGTH} · min {MIN_LENGTH} characters
          </Text>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-bg-light px-6 pb-10 pt-4 border-t border-gray-100">
        <Button
          title="Finish"
          onPress={handleFinish}
          loading={loading}
          disabled={!valid}
          size="lg"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
