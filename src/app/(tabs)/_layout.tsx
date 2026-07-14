import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top + 20 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#e53935",
          tabBarInactiveTintColor: "#888",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "List",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="favourite"
          options={{
            title: "Favourite",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "Map",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={"map"} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: "Camera",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={"camera"} color={color} size={size} />
            ),
            lazy: true,
          }}
        />
      </Tabs>
    </View>
  );
}
