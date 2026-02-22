import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import {
  getNeedById,
  acceptNeed,
  undoAccept,
  markNeedFilled,
} from "@/lib/hungerFeed";
import { HungerNeedWithMeta } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function NeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [need, setNeed] = useState<HungerNeedWithMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadNeed = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getNeedById(id, user?.id ?? undefined);
      setNeed(data);
    } catch {
      setNeed(null);
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    loadNeed();
  }, [loadNeed]);

  const handleAccept = async () => {
    if (!user?.id || !need) return;
    setActionLoading(true);
    try {
      await acceptNeed(need.id, user.id);
      await loadNeed();
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "Could not accept");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUndoAccept = async () => {
    if (!user?.id || !need) return;
    setActionLoading(true);
    try {
      await undoAccept(need.id, user.id);
      await loadNeed();
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "Could not undo");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkFilled = async () => {
    if (!user?.id || !need) return;
    setActionLoading(true);
    try {
      await markNeedFilled(need.id, user.id);
      await loadNeed();
    } catch (e) {
      Alert.alert(
        "Error",
        e instanceof Error ? e.message : "Could not mark as filled"
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-bg-light">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#135bec" />
          <Text className="font-work-sans text-gray-500 mt-3">
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!need) {
    return (
      <SafeAreaView className="flex-1 bg-bg-light">
        <View className="px-6 pt-4">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="font-work-sans text-gray-500">
            This need could not be found or is no longer available.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCreator = user?.id && need.user_id === user.id;
  const cap = need.people_needed ?? null;
  const countText =
    cap != null
      ? `${need.acceptance_count} of ${cap} people have accepted`
      : `${need.acceptance_count} accepted`;

  return (
    <SafeAreaView className="flex-1 bg-bg-light" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-4">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>

          {isCreator && (
            <View className="bg-primary/10 rounded-xl py-2 px-3 mb-4">
              <Text className="font-work-sans-semibold text-primary text-sm">
                Your need
              </Text>
            </View>
          )}

          <Card className="mb-4">
            <Text className="font-work-sans text-gray-900 text-base leading-6">
              {need.description}
            </Text>
            <View className="flex-row items-center mt-3">
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={16}
                color="#6B7280"
              />
              <Text className="font-work-sans text-sm text-gray-600 ml-2">
                {need.location || "No location"}
              </Text>
            </View>
            <View className="bg-gray-100 rounded-lg px-2 py-1 mt-2 self-start">
              <Text className="font-work-sans text-xs text-gray-600 capitalize">
                {need.category}
              </Text>
            </View>
          </Card>

          <Text className="font-work-sans text-sm text-gray-500 mb-1">
            Submitted by {need.creator_display_name ?? "Someone"}
          </Text>
          <Text className="font-work-sans text-sm text-gray-500 mb-6">
            {countText}
          </Text>

          {!isCreator && (
            <>
              {need.current_user_accepted ? (
                <View className="mb-4">
                  <View className="bg-primary/10 rounded-xl py-3 px-4 mb-2">
                    <Text className="font-work-sans-semibold text-primary text-center">
                      You've accepted this need
                    </Text>
                  </View>
                  <Button
                    title="Undo acceptance"
                    variant="outline"
                    size="md"
                    onPress={handleUndoAccept}
                    disabled={actionLoading}
                    loading={actionLoading}
                  />
                </View>
              ) : (
                <Button
                  title="Accept this need"
                  size="lg"
                  onPress={handleAccept}
                  disabled={actionLoading}
                  loading={actionLoading}
                />
              )}
            </>
          )}

          {isCreator && need.status === "open" && (
            <Button
              title="Mark as filled"
              variant="secondary"
              size="lg"
              onPress={handleMarkFilled}
              disabled={actionLoading}
              loading={actionLoading}
            />
          )}

          {isCreator && need.status === "filled" && (
            <View className="bg-gray-100 rounded-xl py-3 px-4">
              <Text className="font-work-sans text-gray-600 text-center">
                This need has been marked as filled.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
