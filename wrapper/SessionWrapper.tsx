import React from 'react';
import { useConvex } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { type GoogleProfile, signInWithGoogle, signOutGoogle } from '@/util/auth';
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

  const [isLoading, setIsLoading] = React.useState(false);

  const signIn = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const profile: GoogleProfile = await signInWithGoogle();
      const upserted = (await convex.mutation(api.users.upsertUser, {
        email: profile.email,
        name: profile.name,
        firstName: profile.firstName,
        lastName: profile.lastName,
        picture: profile.picture,
      })) as User;
      setUser(upserted);
      return upserted;
    } finally {
      setIsLoading(false);
    }
  }, [convex, setUser]);

  const signOut = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await signOutGoogle();
      resetUser();
    } finally {
      setIsLoading(false);
    }
  }, [resetUser]);

  const value = React.useMemo(
    () => ({ user, isLoading, isHydrated, signIn, signOut }),
    [user, isLoading, isHydrated, signIn, signOut]
  );

  return <SessionContext.Provider value={value}>{props.children}</SessionContext.Provider>;
}
