import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { theme } from "@/constants/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      Alert.alert("Sign In Failed", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-bg-light"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-20 pb-8">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="bg-primary/10 rounded-full p-4 mb-4">
              <MaterialCommunityIcons name="fire" size={40} color={theme.primary} />
            </View>
            <Text className="font-playfair-bold text-4xl text-gray-900">
              Vocare
            </Text>
            <Text className="font-work-sans text-gray-500 text-base mt-2">
              Discover your purpose through service
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4 mb-8">
            <TextInput
              icon="email-outline"
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <View className="h-3" />
            <TextInput
              icon="lock-outline"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          {/* Button */}
          <Button
            title="Begin the Journey"
            onPress={handleLogin}
            loading={loading}
            size="lg"
          />

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="font-work-sans text-gray-500">
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text className="font-work-sans-semibold text-primary">
                  Create Account
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
