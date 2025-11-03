import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";

const convexUrl =
  process.env.EXPO_PUBLIC_CONVEX_URL ||
  "https://cool-meadowlark-411.convex.cloud";

const convex = new ConvexReactClient(convexUrl);

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ConvexProvider>
  );
}
