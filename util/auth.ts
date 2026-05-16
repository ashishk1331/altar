import { GoogleSignin } from '@react-native-google-signin/google-signin';

let configured = false;

export function configureGoogleSignIn() {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
    // Needed so signInSilently() can refresh an expired idToken without prompting.
    offlineAccess: true,
  });
  configured = true;
}

export type GoogleProfile = {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  picture: string;
};

export type GoogleSignInResult = {
  profile: GoogleProfile;
  idToken: string;
};

function toProfile(user: {
  email: string;
  name?: string | null;
  givenName?: string | null;
  familyName?: string | null;
  photo?: string | null;
}): GoogleProfile {
  return {
    email: user.email,
    name: user.name ?? user.email,
    firstName: user.givenName ?? '',
    lastName: user.familyName ?? '',
    picture: user.photo ?? '',
  };
}

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  configureGoogleSignIn();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const result = await GoogleSignin.signIn();

  if (result.type !== 'success') {
    throw new Error('Sign-in cancelled');
  }
  if (!result.data.idToken) {
    throw new Error('Google did not return an ID token. Check webClientId configuration.');
  }

  return {
    profile: toProfile(result.data.user),
    idToken: result.data.idToken,
  };
}

export async function signInSilentlyWithGoogle(): Promise<GoogleSignInResult | null> {
  configureGoogleSignIn();
  try {
    const result = await GoogleSignin.signInSilently();
    if (result.type !== 'success' || !result.data.idToken) return null;
    return {
      profile: toProfile(result.data.user),
      idToken: result.data.idToken,
    };
  } catch {
    return null;
  }
}

export async function signOutGoogle() {
  try {
    await GoogleSignin.signOut();
  } catch {
    // user may not have been signed in yet; ignore
  }
}
