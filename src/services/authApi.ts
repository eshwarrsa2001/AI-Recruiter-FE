import { AuthRequestError } from "./authErrors";

export type Account = {
  email: string;
  role: string;
};

export type LoginResult = Account & {
  token: string;
};

const JSON_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function failureMessage(body: unknown): string {
  if (isRecord(body) && typeof body.detail === "string" && body.detail !== "") {
    return body.detail;
  }
  if (!isRecord(body)) {
    return "The request was rejected.";
  }
  const messages: string[] = [];
  for (const value of Object.values(body)) {
    if (!Array.isArray(value)) {
      continue;
    }
    for (const item of value) {
      if (typeof item === "string" && item !== "") {
        messages.push(item);
      }
    }
  }
  if (messages.length === 0) {
    return "The request was rejected.";
  }
  return messages.join(" ");
}

function requireRecord(body: unknown): Record<string, unknown> {
  if (!isRecord(body)) {
    throw new AuthRequestError("The response could not be read.");
  }
  return body;
}

function readAccountFields(body: Record<string, unknown>): Account {
  if (typeof body.email !== "string" || body.email === "") {
    throw new AuthRequestError("The response could not be read.");
  }
  if (typeof body.role !== "string" || body.role === "") {
    throw new AuthRequestError("The response could not be read.");
  }
  return { email: body.email, role: body.role };
}

function readLoginResult(body: unknown): LoginResult {
  const record = requireRecord(body);
  const account = readAccountFields(record);
  if (typeof record.token !== "string" || record.token === "") {
    throw new AuthRequestError("The response could not be read.");
  }
  return { ...account, token: record.token };
}

async function readBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new AuthRequestError("The response could not be read.");
    }
    throw error;
  }
}

async function requestJson(path: string, init: RequestInit): Promise<unknown> {
  const response = await fetch(path, init);
  if (response.status === 204) {
    return null;
  }
  const body = await readBody(response);
  if (!response.ok) {
    throw new AuthRequestError(failureMessage(body));
  }
  return body;
}

export async function registerCandidate(registration: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  resume: File;
}): Promise<LoginResult> {
  const body = new FormData();
  body.set("full_name", registration.fullName);
  body.set("email", registration.email);
  body.set("password", registration.password);
  body.set("phone", registration.phone);
  body.set("resume", registration.resume);
  const responseBody = await requestJson("/api/v1/candidates/register/", {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  });
  return readLoginResult(responseBody);
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const body = await requestJson("/api/v1/auth/login/", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, password }),
  });
  return readLoginResult(body);
}

export async function fetchAccount(token: string): Promise<Account> {
  const body = await requestJson("/api/v1/auth/account/", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return readAccountFields(requireRecord(body));
}

export async function logout(token: string): Promise<void> {
  await requestJson("/api/v1/auth/logout/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
