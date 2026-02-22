/**
 * Dev-only logger for debugging auth/onboarding flow.
 * All messages are prefixed with [Vocare] so you can filter in Metro: "Vocare"
 * Only runs when __DEV__ is true.
 */
const PREFIX = "[Vocare]";

export function log(tag: string, message: string, data?: Record<string, unknown>) {
  if (!__DEV__) return;
  const payload = data ? ` ${JSON.stringify(data)}` : "";
  console.log(`${PREFIX} ${tag} | ${message}${payload}`);
}

export function warn(tag: string, message: string, data?: Record<string, unknown>) {
  if (!__DEV__) return;
  const payload = data ? ` ${JSON.stringify(data)}` : "";
  console.warn(`${PREFIX} ${tag} | ${message}${payload}`);
}
