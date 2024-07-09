import { supabase } from "./supabase";

export async function createUser(email: string, password: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }
  return {
    ok: true,
  };
}

export async function loginUser(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }
  return {
    ok: true,
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }
  return {
    ok: true,
  };
}

export async function getUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return {
      ok: true,
      user,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err.message,
    };
  }
}

export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  } else if (!session) {
    return {
      ok: false,
      message: "No active session exists.",
    };
  }
  return {
    ok: true,
    session,
  };
}
