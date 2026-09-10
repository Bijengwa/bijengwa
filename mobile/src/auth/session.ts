let accessToken: string | null = null;

export function setSessionToken(token: string) {
  accessToken = token;
}

export function getSessionToken() {
  return accessToken;
}

export function clearSession() {
  accessToken = null;
}
