import React from 'react';
import { Slot, SplashScreen, router } from 'expo-router';
import { ConvexProvider } from 'convex/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SessionProvider, useSession } from '@/wrapper/SessionWrapper';
import { configureGoogleSignIn } from '@/util/auth';
import { convex } from '@/util/convex';

SplashScreen.preventAutoHideAsync();

function Bootstrap({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useSession();

  React.useEffect(() => {
    configureGoogleSignIn();
  }, []);

  React.useEffect(() => {
    if (!isHydrated) return;
    if (user) {
      router.replace('/home');
    }
    SplashScreen.hideAsync();
  }, [isHydrated, user]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <SessionProvider>
        <SafeAreaProvider>
          <Bootstrap>
            <Slot />
          </Bootstrap>
        </SafeAreaProvider>
      </SessionProvider>
    </ConvexProvider>
  );
}
