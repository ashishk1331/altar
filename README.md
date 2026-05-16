# Altar

An app to share poems in a distraction-free space. Shares the same Convex backend as the altar website, so users, posts, comments, bookmarks, likes, follows and notifications are unified across web and mobile.

## Setup

1. Copy `.env.example` to `.env` and fill in:
   - `EXPO_PUBLIC_CONVEX_URL` — the Convex deployment URL (same one the website uses).
   - `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` / `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` — OAuth client IDs from Google Cloud Console (configure an Android, iOS, and Web client; the Web client ID is the `webClientId` used by `@react-native-google-signin/google-signin`).
2. In `app.json`, replace `REPLACE_WITH_YOUR_IOS_REVERSED_CLIENT_ID` under the `@react-native-google-signin/google-signin` plugin with the reversed client ID from your iOS OAuth client (looks like `com.googleusercontent.apps.123-abc`).
3. Install deps: `bun install`.
4. Sync the latest Convex types from the website repo: copy `convex/_generated/` from `/path/to/altar-website` whenever the backend schema changes. The mobile app does not own the Convex schema.

## Run

```
bun expo start
```

## One-time data migration from Supabase

After Convex is configured and before cutting users over, run the migration script with service-role credentials:

```
SUPABASE_URL=...                  \
SUPABASE_SERVICE_ROLE_KEY=...     \
CONVEX_URL=https://<deployment>   \
bun add @supabase/supabase-js     \
bun run scripts/migrate-supabase-to-convex.ts
```

The script is idempotent and keys users by email so a Google sign-in with the same email reclaims that user's posts/bookmarks/comments. After cutover, remove the temporary `@supabase/supabase-js` dependency.

## Build on eas

[here](https://docs.expo.dev/build-reference/apk/)

## Build a local

1. npx expo run:android
2. cd android && ./gradlew assembleRelease

For Windows `cd android` and then run gradlew assembleRelease command , and find your signed apk under `android/app/build/outputs/apk/app-release.apk`, or `android/app/build/outputs/apk/release/app-release.apk`
