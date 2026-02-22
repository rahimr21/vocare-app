import { Tabs } from "expo-router";
import BottomTabBar from "@/components/navigation/BottomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="constellation" />
      <Tabs.Screen name="report" />
    </Tabs>
  );
}
