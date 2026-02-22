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
import { useUserProfile } from "@/context/UserProfileContext";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { log } from "@/lib/logger";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { updateDisplayName } = useUserProfile();

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await signUp(email.trim(), password, name.trim());
    log("SignUp", "signUp returned", { error: error ?? null });
    if (!error) {
      log("SignUp", "calling updateDisplayName");
      await updateDisplayName(name.trim());
      log("SignUp", "updateDisplayName done");
    }
    setLoading(false);
    if (error) {
      Alert.alert("Sign Up Failed", error);
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
              <MaterialCommunityIcons name="fire" size={40} color="#22C55E" />
            </View>
            <Text className="font-playfair-bold text-3xl text-gray-900">
              Create Account
            </Text>
            <Text className="font-work-sans text-gray-500 text-base mt-2">
              Begin your journey of purpose
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4 mb-8">
            <TextInput
              icon="account-outline"
              placeholder="Full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
            />
            <View className="h-3" />
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
              placeholder="Password (min 6 characters)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          {/* Button */}
          <Button
            title="Create Account"
            onPress={handleSignUp}
            loading={loading}
            size="lg"
          />

          {/* Sign In Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="font-work-sans text-gray-500">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="font-work-sans-semibold text-primary">
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
