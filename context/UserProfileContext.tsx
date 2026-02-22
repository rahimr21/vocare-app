import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types";
import { getItem, setItem, KEYS } from "@/lib/storage";
import { useAuth } from "./AuthContext";
import { log } from "@/lib/logger";

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateGladnessDrivers: (drivers: string[]) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  resetProfile: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  gladnessDrivers: [],
  onboardingComplete: false,
  displayName: "",
};

const UserProfileContext = createContext<UserProfileContextType>({
  profile: null,
  loading: true,
  updateGladnessDrivers: async () => {},
  completeOnboarding: async () => {},
  updateDisplayName: async () => {},
  resetProfile: async () => {},
});

export function UserProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    log("Profile", "user changed", { userId: user?.id ?? null, hasUser: !!user });
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user?.id]);

  const loadProfile = async () => {
    log("Profile", "loadProfile start");
    const stored = await getItem<UserProfile>(KEYS.USER_PROFILE);
    log("Profile", "loadProfile result", {
      hadStored: !!stored,
      onboardingComplete: stored?.onboardingComplete ?? defaultProfile.onboardingComplete,
    });
    if (stored) {
      setProfile(stored);
    } else {
      setProfile({ ...defaultProfile });
    }
    setLoading(false);
  };

  const saveProfile = async (updated: UserProfile) => {
    setProfile(updated);
    await setItem(KEYS.USER_PROFILE, updated);
  };

  const updateGladnessDrivers = async (drivers: string[]) => {
    const updated = { ...(profile || defaultProfile), gladnessDrivers: drivers };
    await saveProfile(updated);
  };

  const completeOnboarding = async () => {
    const updated = { ...(profile || defaultProfile), onboardingComplete: true };
    await saveProfile(updated);
  };

  const updateDisplayName = async (name: string) => {
    log("Profile", "updateDisplayName", { name, hadProfile: !!profile });
    const updated = { ...(profile || defaultProfile), displayName: name };
    await saveProfile(updated);
    log("Profile", "updateDisplayName done", { onboardingComplete: updated.onboardingComplete });
  };

  const resetProfile = async () => {
    await saveProfile({ ...defaultProfile });
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        loading,
        updateGladnessDrivers,
        completeOnboarding,
        updateDisplayName,
        resetProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export const useUserProfile = () => useContext(UserProfileContext);
