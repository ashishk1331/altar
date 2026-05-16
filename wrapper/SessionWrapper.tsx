import React from 'react';
import { useConvex } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { signInSilentlyWithGoogle, signInWithGoogle, signOutGoogle } from '@/util/auth';
import { useAuthStore } from '@/util/authStore';
import { type User, useUserStore } from '@/store/userStore';

type SessionContextType = {
  user: User | null;
  isLoading: boolean;
  isHydrated: boolean;
  signIn: () => Promise<User>;
  signOut: () => Promise<void>;
};

const SessionContext = React.createContext<SessionContextType | null>(null);

export function useSession() {
  const value = React.useContext(SessionContext);
  if (!value) {
    throw new Error('useSession must be used inside <SessionProvider />');
  }
  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const convex = useConvex();
  const user = useUserStore((s) => s.user);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const setUser = useUserStore((s) => s.setUser);
  const resetUser = useUserStore((s) => s.resetUser);
  const setIdToken = useAuthStore((s) => s.setIdToken);
  const setAuthReady = useAuthStore((s) => s.setReady);

  const [isLoading, setIsLoading] = React.useState(false);

  // On app start: if we have a persisted user, try to refresh the Google idToken
  // silently so Convex requests are authenticated. Mark auth as ready either way.
  React.useEffect(() => {
    if (!isHydrated) return;
    let cancelled = false;
    (async () => {
      if (user) {
        const refreshed = await signInSilentlyWithGoogle();
        if (!cancelled && refreshed) {
          setIdToken(refreshed.idToken);
        } else if (!cancelled) {
          // Silent sign-in failed — clear local session so user is sent back to login.
          resetUser();
        }
      }
      if (!cancelled) setAuthReady();
    })();
    return () => {
      cancelled = true;
    };
  }, [isHydrated, user, setIdToken, setAuthReady, resetUser]);

  const signIn = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const { idToken } = await signInWithGoogle();
      setIdToken(idToken);
      // Set auth on the Convex client synchronously — ConvexProviderWithAuth would
      // otherwise only pick up the new token after React re-renders, causing this
      // first mutation to go out unauthenticated.
      convex.setAuth(async () => useAuthStore.getState().idToken);
      const upserted = (await convex.mutation(api.users.upsertUser, {})) as User;
      setUser(upserted);
      return upserted;
    } catch (err) {
      setIdToken(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [convex, setIdToken, setUser]);

  const signOut = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await signOutGoogle();
      setIdToken(null);
      resetUser();
    } finally {
      setIsLoading(false);
    }
  }, [resetUser, setIdToken]);

  const value = React.useMemo(
    () => ({ user, isLoading, isHydrated, signIn, signOut }),
    [user, isLoading, isHydrated, signIn, signOut]
  );

  return <SessionContext.Provider value={value}>{props.children}</SessionContext.Provider>;
}
