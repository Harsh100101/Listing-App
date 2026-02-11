// Development-only logging utility
// In production builds, these logs are stripped out automatically
export const devLog = __DEV__ ? console.log : () => {};
export const devWarn = __DEV__ ? console.warn : () => {};
export const devError = __DEV__ ? console.error : () => {};

// Use these instead of console.log/warn/error:
// devLog("message") - only logs in development
// devWarn("warning") - only warns in development
// devError("error") - only errors in development
