import { beforeEach, describe, expect, test } from "vitest";
import { clearToken, readToken, saveToken } from "./session";

beforeEach(() => {
  sessionStorage.clear();
});

describe("session", () => {
  test("returns null when no token is stored", () => {
    expect(readToken()).toBeNull();
  });

  test("returns null when the stored token is blank", () => {
    sessionStorage.setItem("ai-recruiter.token", "   ");
    expect(readToken()).toBeNull();
  });

  test("saves and clears a token", () => {
    saveToken("issued-token");
    expect(readToken()).toBe("issued-token");
    clearToken();
    expect(readToken()).toBeNull();
  });
});
