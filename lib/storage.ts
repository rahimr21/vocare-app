import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  USER_PROFILE: "vocare:user_profile",
  MISSIONS: "vocare:missions",
  SUBMITTED_NEEDS: "vocare:submitted_needs",
  JOURNAL_ENTRIES: "vocare:journal_entries",
  ONBOARDING_DEEP: "vocare:onboarding_deep",
} as const;

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("AsyncStorage setItem error:", error);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("AsyncStorage removeItem error:", error);
  }
}

export { KEYS };
