import { supabase } from "@/util/supabase";
import { Session } from "@supabase/supabase-js";
import React from "react";

type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
};

const AuthContext = React.createContext<AuthContextType>({
  session: null,
  isLoading: false,
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

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading: false,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
