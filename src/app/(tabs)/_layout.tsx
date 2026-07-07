import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "List" }} />
      <Tabs.Screen name="favourite" options={{ title: "Favourite" }} />
    </Tabs>
  );
}
