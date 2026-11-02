import { beforeEach, describe, expect, test, vi } from "vitest";
import { failureMessage, fetchAccount, login, logout } from "./authApi";
import { AuthRequestError } from "./authErrors";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status });
}

describe("failureMessage", () => {
  test("uses a detail string", () => {
    expect(failureMessage({ detail: "Invalid email or password." })).toBe(
      "Invalid email or password.",
    );
  });

  test("joins field errors and skips values that are not text", () => {
    expect(
      failureMessage({
        email: ["Enter a valid email address."],
        password: [""],
        extra: "nope",
      }),
    ).toBe("Enter a valid email address.");
  });

  test("uses a generic rejection when the body has no usable message", () => {
    expect(failureMessage(null)).toBe("The request was rejected.");
    expect(failureMessage({ detail: "" })).toBe("The request was rejected.");
    expect(failureMessage({ email: [] })).toBe("The request was rejected.");
  });
});

describe("login", () => {
  test("posts credentials and returns the session", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, {
        token: "issued-token",
        email: "ta@example.com",
        role: "TA",
      }),
    );
    await expect(login("ta@example.com", "secret")).resolves.toEqual({
      token: "issued-token",
      email: "ta@example.com",
      role: "TA",
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/v1/auth/login/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "ta@example.com", password: "secret" }),
    });
  });

  test("raises the detail from a rejected login", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(401, { detail: "Invalid email or password." }));
    await expect(login("ta@example.com", "wrong")).rejects.toThrow(AuthRequestError);
    fetchMock.mockResolvedValueOnce(jsonResponse(401, { detail: "Invalid email or password." }));
    await expect(login("ta@example.com", "wrong")).rejects.toThrow("Invalid email or password.");
  });

  test("rejects a login body that is missing the token", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { email: "ta@example.com", role: "TA" }));
    await expect(login("ta@example.com", "secret")).rejects.toThrow(
      "The response could not be read.",
    );
  });

  test("rejects a login body that is missing the account", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { token: "issued-token", role: "" }));
    await expect(login("ta@example.com", "secret")).rejects.toThrow(
      "The response could not be read.",
    );
  });

  test("rejects a login body that is missing the role", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, { token: "issued-token", email: "ta@example.com", role: "" }),
    );
    await expect(login("ta@example.com", "secret")).rejects.toThrow(
      "The response could not be read.",
    );
  });

  test("rejects a login body that is not an object", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, "ok"));
    await expect(login("ta@example.com", "secret")).rejects.toThrow(
      "The response could not be read.",
    );
  });

  test("rejects a login response that is not json", async () => {
    fetchMock.mockResolvedValue(new Response("nope", { status: 200 }));
    await expect(login("ta@example.com", "secret")).rejects.toThrow(
      "The response could not be read.",
    );
  });

  test("rethrows a body read that is not a syntax error", async () => {
    const response = new Response("{}", { status: 200 });
    vi.spyOn(response, "json").mockRejectedValue(new TypeError("broken"));
    fetchMock.mockResolvedValue(response);
    await expect(login("ta@example.com", "secret")).rejects.toThrow(TypeError);
  });

  test("rejects when the network fails", async () => {
    fetchMock.mockRejectedValue(new TypeError("offline"));
    await expect(login("ta@example.com", "secret")).rejects.toThrow(TypeError);
  });
});

describe("fetchAccount", () => {
  test("sends the bearer token and returns the account", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, { email: "ta@example.com", role: "TA Admin" }),
    );
    await expect(fetchAccount("issued-token")).resolves.toEqual({
      email: "ta@example.com",
      role: "TA Admin",
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/v1/auth/account/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer issued-token",
      },
    });
  });

  test("rejects an account response with a blank email", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { email: "", role: "TA" }));
    await expect(fetchAccount("issued-token")).rejects.toThrow("The response could not be read.");
  });
});

describe("logout", () => {
  test("accepts an empty success response", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(logout("issued-token")).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith("/api/v1/auth/logout/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer issued-token",
      },
    });
  });

  test("raises when the token is rejected", async () => {
    fetchMock.mockResolvedValue(jsonResponse(401, { detail: "Invalid token." }));
    await expect(logout("issued-token")).rejects.toThrow("Invalid token.");
  });
});
