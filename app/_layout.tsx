import React from 'react';
import { Slot, SplashScreen, router } from 'expo-router';
import { ConvexProviderWithAuth } from 'convex/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SessionProvider, useSession } from '@/wrapper/SessionWrapper';
import { configureGoogleSignIn } from '@/util/auth';
import { useAuthForConvex, useAuthStore } from '@/util/authStore';
import { convex } from '@/util/convex';

SplashScreen.preventAutoHideAsync();

function Bootstrap({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useSession();
  const isAuthReady = useAuthStore((s) => s.isReady);

  React.useEffect(() => {
    configureGoogleSignIn();
  }, []);

  React.useEffect(() => {
    // Wait for both Zustand hydration and the silent-sign-in attempt to finish
    // before navigating or hiding the splash, so authed screens never mount
    // before Convex has a valid token.
    if (!isHydrated || !isAuthReady) return;
    if (user) {
      router.replace('/home');
    }
    SplashScreen.hideAsync();
  }, [isHydrated, isAuthReady, user]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useAuthForConvex}>
      <SessionProvider>
        <SafeAreaProvider>
          <Bootstrap>
            <Slot />
          </Bootstrap>
        </SafeAreaProvider>
      </SessionProvider>
    </ConvexProviderWithAuth>
  );
}
