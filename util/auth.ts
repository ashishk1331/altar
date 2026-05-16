import { GoogleSignin } from '@react-native-google-signin/google-signin';

let configured = false;

export function configureGoogleSignIn() {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
    offlineAccess: false,
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

export async function signInWithGoogle(): Promise<GoogleProfile> {
  configureGoogleSignIn();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const result = await GoogleSignin.signIn();

  if (result.type !== 'success') {
    throw new Error('Sign-in cancelled');
  }

  const u = result.data.user;
  return {
    email: u.email,
    name: u.name ?? u.email,
    firstName: u.givenName ?? '',
    lastName: u.familyName ?? '',
    picture: u.photo ?? '',
  };
}

export async function signOutGoogle() {
  try {
    await GoogleSignin.signOut();
  } catch {
    // user may not have been signed in yet; ignore
  }
}
