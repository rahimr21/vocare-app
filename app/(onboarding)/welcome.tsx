import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "@/components/ui/Button";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#101622", "#1a2332", "#0f1925"]}
      className="flex-1"
    >
      <View className="flex-1 px-6 justify-center items-center">
        {/* Icon */}
        <View className="bg-white/10 rounded-full p-6 mb-8">
          <MaterialCommunityIcons
            name="weather-night"
            size={56}
            color="#D4AF37"
          />
        </View>

        {/* Title */}
        <Text className="font-playfair-bold text-3xl text-white text-center mb-3">
          Build Better Habits
        </Text>
        <Text className="font-work-sans text-white/70 text-base text-center leading-6 px-4 mb-2">
          Through Purpose & Service
        </Text>

        {/* Description */}
        <Text className="font-work-sans text-white/50 text-sm text-center leading-6 px-8 mb-12">
          Vocare connects your unique gifts with real campus needs, generating
          daily micro-missions that help you discover what makes you feel truly
          alive.
        </Text>

        {/* Feature highlights */}
        <View className="w-full mb-12 space-y-4">
          {[
            {
              icon: "compass-outline" as const,
              text: "Discover your energy drivers",
            },
            {
              icon: "lightning-bolt" as const,
              text: "Receive AI-powered micro-missions",
            },
            {
              icon: "star-four-points" as const,
              text: "Build your Purpose Constellation",
            },
          ].map((item, i) => (
            <View key={i} className="flex-row items-center px-4 mb-3">
              <View className="bg-gold/20 rounded-full p-2 mr-4">
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color="#D4AF37"
                />
              </View>
              <Text className="font-work-sans text-white/80 text-base flex-1">
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View className="w-full px-4">
          <Button
            title="Get Started"
            variant="gold"
            size="lg"
            onPress={() => router.push("/(onboarding)/gladness")}
          />
        </View>
      </View>
    </LinearGradient>
  );
}
