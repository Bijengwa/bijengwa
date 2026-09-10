export function authLog(message: string) {
  if (__DEV__) {
    console.log(`[AUTH] ${message}`);
  }
}
