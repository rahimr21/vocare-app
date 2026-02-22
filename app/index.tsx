import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function SplashIndex() {
  const { loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // AuthGate in _layout.tsx handles routing
      // This is just the visual splash while loading
    }
  }, [loading]);

  return (
    <View className="flex-1 bg-bg-dark items-center justify-center">
      <MaterialCommunityIcons name="fire" size={64} color="#D4AF37" />
      <Text className="font-playfair-bold text-4xl text-white mt-4">
        Vocare
      </Text>
      <Text className="font-work-sans text-white/60 text-sm mt-2">
        Discover Your Purpose
      </Text>
      {loading && (
        <ActivityIndicator color="#D4AF37" size="small" style={{ marginTop: 32 }} />
      )}
    </View>
  );
}
