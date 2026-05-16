import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Doc } from '@/convex/_generated/dataModel';

export type User = Doc<'users'>;

type UserStoreState = {
  user: User | null;
  isHydrated: boolean;
};

type UserStoreActions = {
  setUser: (user: User) => void;
  patchUser: (partial: Partial<Pick<User, 'firstName' | 'lastName' | 'bio'>>) => void;
  resetUser: () => void;
  setHydrated: () => void;
};

export const useUserStore = create<UserStoreState & UserStoreActions>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,
      setUser(user) {
        set({ user });
      },
      patchUser(partial) {
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        }));
      },
      resetUser() {
        set({ user: null });
      },
      setHydrated() {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'altar-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ user }) => ({ user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
