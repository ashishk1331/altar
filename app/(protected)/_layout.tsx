import React from "react";
import { Slot } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, AppState, Platform, AppStateStatus } from "react-native";
import { focusManager } from "@tanstack/react-query";
import "react-native-url-polyfill/auto";
import { Colors } from "@/constants/Colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function AppLayout() {
  const insets = useSafeAreaInsets();

  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          backgroundColor: Colors.light.background,
        }}
      >
        <Slot />
      </View>
    </QueryClientProvider>
  );
}
