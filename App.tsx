import {
    JosefinSans_400Regular,
    JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback } from "react";
import { View } from "react-native";
import TodoScreen from "./app/TodoScreen";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Josefin-Regular": JosefinSans_400Regular,
    "Josefin-Bold": JosefinSans_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ConvexProvider client={convex}>
        <TodoScreen />
      </ConvexProvider>
    </View>
  );
}
