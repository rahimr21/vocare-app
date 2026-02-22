# Debugging auth / white screen after sign-up

Dev-only logs were added so we can see what happens after account creation. They only run in development (`__DEV__`).

## How to capture logs on iOS

1. Start the app: `npx expo start`
2. Open the app in Expo Go on your iPhone (scan QR code).
3. In the **same terminal** where Metro is running, watch the output. All auth-related logs are prefixed with `[Vocare]`.
4. Create a new account (or sign up with a test email).
5. When the white screen appears, **copy the full terminal output** from the moment you tapped "Create Account" (or "Sign Up") until a few seconds after the white screen. Include all lines that contain `[Vocare]`.

## What to share

Paste the copied terminal output (the `[Vocare]` lines and any errors above/below them) when you ask for a fix. That will show:

- **Auth** – When sign-up completes, whether a session exists, and any auth state changes.
- **Profile** – When the profile loads, whether it was from storage, and when `updateDisplayName` runs.
- **AuthGate** – On every run: current route segments, loading flags, user/profile state, and whether it redirected (and to where).
- **Welcome** – Whether the onboarding welcome screen ever mounted (if you see "Welcome | screen mounted", the screen did render).
- **SignUp** – After sign-up returns and after `updateDisplayName` finishes.

## Filtering in terminal

To see only Vocare logs while testing, you can filter the Metro output, for example:

- macOS: `npx expo start 2>&1 | grep Vocare`
- Or run normally and search for "Vocare" in the scrollback after reproducing the issue.

## Turning logs off

Logs are in `lib/logger.ts` and only run when `__DEV__` is true (development builds and Expo Go). They do not run in production builds.
