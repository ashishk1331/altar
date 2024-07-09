import { Slot, SplashScreen, router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { getSession } from "@/util/auth";
import { SessionProvider } from "@/wrapper/SessionWrapper";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  React.useEffect(() => {
    async function isThereAnActiveSession() {
      const { ok } = await getSession();
      if (ok) {
        router.replace("/home");
      }
      SplashScreen.hideAsync();
    }

    isThereAnActiveSession();
  }, []);

  return (
    <SessionProvider>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </SessionProvider>
  );
}
