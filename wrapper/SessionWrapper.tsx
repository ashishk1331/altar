import { getSession } from "@/util/auth";
import { Session } from "@supabase/supabase-js";
import React from "react";

type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
  resetSession: () => void;
};

const AuthContext = React.createContext<AuthContextType>({
  session: null,
  isLoading: false,
  resetSession: () => {},
});

export function useSession() {
  const value = React.useContext(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  async function validateSession() {
    try {
      setIsLoading(true);
      const { ok, ...rest } = await getSession();
      if (ok && rest.session) {
        setSession(rest.session);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error("Error validating session:", error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }

  const resetSession = () => validateSession();

  React.useEffect(() => {
    validateSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        resetSession,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
