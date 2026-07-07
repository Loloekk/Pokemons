import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            statusBarStyle: "dark",
            statusBarAnimation: "fade",
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="pokemon/[name]"
            options={{
              presentation: "card",
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
