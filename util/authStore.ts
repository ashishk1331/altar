import React from 'react';
import { create } from 'zustand';

import { signInSilentlyWithGoogle } from '@/util/auth';

type AuthStoreState = {
  idToken: string | null;
  isReady: boolean;
};

type AuthStoreActions = {
  setIdToken: (idToken: string | null) => void;
  setReady: () => void;
};

export const useAuthStore = create<AuthStoreState & AuthStoreActions>((set) => ({
  idToken: null,
  isReady: false,
  setIdToken: (idToken) => set({ idToken }),
  setReady: () => set({ isReady: true }),
}));

export function useAuthForConvex() {
  const idToken = useAuthStore((s) => s.idToken);
  const isReady = useAuthStore((s) => s.isReady);

  const fetchAccessToken = React.useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (!forceRefreshToken) {
        const current = useAuthStore.getState().idToken;
        if (current) return current;
      }
      const refreshed = await signInSilentlyWithGoogle();
      if (!refreshed) return null;
      useAuthStore.getState().setIdToken(refreshed.idToken);
      return refreshed.idToken;
    },
    []
  );

  return React.useMemo(
    () => ({
      isLoading: !isReady,
      isAuthenticated: !!idToken,
      fetchAccessToken,
    }),
    [isReady, idToken, fetchAccessToken]
  );
}
