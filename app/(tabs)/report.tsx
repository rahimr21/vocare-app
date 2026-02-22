import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput as RNTextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import CategoryChip from "@/components/ui/CategoryChip";

const CATEGORIES = [
  { id: "service" as const, label: "Service" },
  { id: "organization" as const, label: "Organization" },
  { id: "support" as const, label: "Support" },
];

export default function ReportScreen() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<
    "service" | "organization" | "support" | null
  >(null);
  const [peopleNeededUnlimited, setPeopleNeededUnlimited] = useState(false);
  const [peopleNeeded, setPeopleNeeded] = useState("1");
  const [loading, setLoading] = useState(false);

  const creatorDisplayName =
    profile?.displayName ||
    user?.user_metadata?.display_name ||
    "Someone";

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Required", "Please describe the need");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Required", "Please add a location");
      return;
    }
    if (!category) {
      Alert.alert("Required", "Please select a category");
      return;
    }
    if (!user?.id) {
      Alert.alert("Sign in required", "Please sign in to submit a need.");
      return;
    }
    const num = peopleNeededUnlimited
      ? null
      : Math.max(1, parseInt(peopleNeeded, 10) || 1);

    setLoading(true);
    const { error } = await supabase.from("hunger_feed").insert({
      user_id: user.id,
      description: description.trim(),
      location: location.trim(),
      category,
      people_needed: num,
      creator_display_name: creatorDisplayName,
    });

    setLoading(false);
    if (error) {
      Alert.alert("Submission failed", error.message);
      return;
    }
    setDescription("");
    setLocation("");
    setCategory(null);
    setPeopleNeeded("1");
    setPeopleNeededUnlimited(false);
    Alert.alert(
      "Need Submitted",
      "Thank you for offering this need to the community. It will help match students with meaningful missions."
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-light">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 220 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-4">
            {/* Buechner Quote */}
            <View className="bg-primary/5 rounded-2xl p-5 mb-6">
              <MaterialCommunityIcons
                name="format-quote-open"
                size={24}
                color="#22C55E"
                style={{ opacity: 0.4, marginBottom: 4 }}
              />
              <Text className="font-work-sans text-sm text-gray-600 italic leading-5">
                "The place God calls you to is the place where your deep
                gladness and the world's deep hunger meet."
              </Text>
              <Text className="font-work-sans text-xs text-gray-400 mt-2">
                — Frederick Buechner
              </Text>
            </View>

            {/* Header */}
            <Text className="font-work-sans-bold text-2xl text-gray-900 mb-1">
              Submit a Need
            </Text>
            <Text className="font-work-sans text-gray-500 text-sm mb-6 leading-5">
              Share a need you've noticed on campus. This helps Vocare match
              students with meaningful missions.
            </Text>

            {/* Description */}
            <Text className="font-work-sans-medium text-sm text-gray-600 mb-1.5">
              What's the need?
            </Text>
            <View className="bg-stone-100 rounded-xl p-4 mb-1">
              <RNTextInput
                className="font-work-sans text-base text-gray-900 min-h-[100px]"
                placeholder="Describe the need you've observed..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={(text) =>
                  text.length <= 300 && setDescription(text)
                }
                multiline
                textAlignVertical="top"
              />
            </View>
            <Text className="font-work-sans text-xs text-gray-400 text-right mb-5">
              {description.length}/300
            </Text>

            {/* Location */}
            <TextInput
              icon="map-marker-outline"
              label="Location"
              placeholder="Where is this need? (e.g., O'Neill Library)"
              value={location}
              onChangeText={setLocation}
            />

            {/* Category */}
            <Text className="font-work-sans-medium text-sm text-gray-600 mt-5 mb-2">
              Category
            </Text>
            <View className="flex-row flex-wrap">
              {CATEGORIES.map((cat) => (
                <CategoryChip
                  key={cat.id}
                  label={cat.label}
                  selected={category === cat.id}
                  onPress={() => setCategory(cat.id)}
                />
              ))}
            </View>

            {/* How many people needed */}
            <Text className="font-work-sans-medium text-sm text-gray-600 mt-5 mb-2">
              How many people do you need?
            </Text>
            <View className="flex-row items-center flex-wrap gap-3">
              <RNTextInput
                className="bg-stone-100 rounded-xl px-4 py-3 font-work-sans text-base text-gray-900 w-20"
                placeholder="1"
                placeholderTextColor="#9CA3AF"
                value={peopleNeededUnlimited ? "" : peopleNeeded}
                onChangeText={(t) => {
                  const n = t.replace(/\D/g, "");
                  if (n.length <= 3) setPeopleNeeded(n || "1");
                }}
                keyboardType="number-pad"
                editable={!peopleNeededUnlimited}
              />
              <TouchableOpacity
                onPress={() => setPeopleNeededUnlimited(!peopleNeededUnlimited)}
                className="flex-row items-center"
              >
                <View
                  className={`w-5 h-5 rounded border-2 mr-2 ${
                    peopleNeededUnlimited ? "bg-primary border-primary" : "border-gray-300"
                  }`}
                >
                  {peopleNeededUnlimited && (
                    <MaterialCommunityIcons
                      name="check"
                      size={14}
                      color="#fff"
                      style={{ position: "absolute", left: 2, top: 1 }}
                    />
                  )}
                </View>
                <Text className="font-work-sans text-gray-700">
                  As many as possible
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View className="absolute bottom-0 left-0 right-0 bg-bg-light px-6 pb-10 pt-4 border-t border-gray-100">
          <Button
            title="Offer this Need"
            onPress={handleSubmit}
            loading={loading}
            disabled={!description.trim() || !location.trim() || !category}
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
