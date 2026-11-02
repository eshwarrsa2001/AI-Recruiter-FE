const TOKEN_KEY = "ai-recruiter.token";

export function readToken(): string | null {
  const value = sessionStorage.getItem(TOKEN_KEY);
  if (value === null || value.trim() === "") {
    return null;
  }
  return value;
}

export function saveToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}
