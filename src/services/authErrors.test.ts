import { describe, expect, test } from "vitest";
import { AuthRequestError, messageFor } from "./authErrors";

describe("messageFor", () => {
  test("returns the request error text", () => {
    expect(messageFor(new AuthRequestError("Invalid email or password."))).toBe(
      "Invalid email or password.",
    );
  });

  test("explains a network failure", () => {
    expect(messageFor(new TypeError("failed"))).toBe("The server could not be reached.");
  });

  test("explains an unreadable response", () => {
    expect(messageFor(new SyntaxError("bad json"))).toBe("The response could not be read.");
  });

  test("uses a generic message for anything else", () => {
    expect(messageFor(new Error("boom"))).toBe("Something went wrong.");
  });
});
