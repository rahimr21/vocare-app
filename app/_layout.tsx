import "../global.css";
import "@/lib/nativewind-interop";
import React, { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from "@expo-google-fonts/work-sans";
import {
  Merriweather_400Regular,
  Merriweather_700Bold,
} from "@expo-google-fonts/merriweather";
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_700Bold_Italic,
} from "@expo-google-fonts/playfair-display";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { UserProfileProvider, useUserProfile } from "@/context/UserProfileContext";
import { MissionProvider } from "@/context/MissionContext";
import { log } from "@/lib/logger";

SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup =
      segments[0] === "(auth)" ||
      segments[0] === "login" ||
      segments[0] === "signup";
    const inOnboardingGroup =
      segments[0] === "(onboarding)" ||
      segments[0] === "welcome" ||
      segments[0] === "gladness";

    log("AuthGate", "effect run", {
      segments: segments as string[],
      segment0: segments[0],
      authLoading,
      profileLoading,
      hasUser: !!user,
      userId: user?.id ?? null,
      onboardingComplete: profile?.onboardingComplete ?? null,
      inAuthGroup,
      inOnboardingGroup,
    });

    if (authLoading || profileLoading) return;

    if (!user) {
      // Not signed in → go to login
      if (!inAuthGroup) {
        log("AuthGate", "redirect", { to: "/(auth)/login" });
        router.replace("/(auth)/login");
      }
    } else if (!profile?.onboardingComplete) {
      // Signed in but hasn't onboarded
      if (!inOnboardingGroup) {
        log("AuthGate", "redirect", { to: "/(onboarding)/welcome" });
        router.replace("/(onboarding)/welcome");
      }
    } else {
      // Signed in and onboarded → go to main app
      if (inAuthGroup || inOnboardingGroup) {
        log("AuthGate", "redirect", { to: "/(tabs)" });
        router.replace("/(tabs)");
      }
    }
  }, [user, profile?.onboardingComplete, authLoading, profileLoading, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
    Merriweather_400Regular,
    Merriweather_700Bold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_700Bold_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <UserProfileProvider>
        <MissionProvider>
          <AuthGate>
            <StatusBar style="auto" />
            <Slot />
          </AuthGate>
        </MissionProvider>
      </UserProfileProvider>
    </AuthProvider>
  );
}
