import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { login } from "../services/authApi";
import { saveToken } from "../services/session";
import { LoginPage, redirectMessage } from "./LoginPage";

vi.mock("../services/authApi", () => ({
  login: vi.fn(),
}));

beforeEach(() => {
  sessionStorage.clear();
  vi.mocked(login).mockReset();
});

function renderLogin(state: unknown = null) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/login", state }]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<p>Register screen</p>} />
        <Route path="/account" element={<p>Account screen</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("redirectMessage", () => {
  test("reads a string message from navigation state", () => {
    expect(redirectMessage({ message: "Invalid token." })).toBe("Invalid token.");
  });

  test("ignores state that does not carry a string message", () => {
    expect(redirectMessage(null)).toBe("");
    expect(redirectMessage("nope")).toBe("");
    expect(redirectMessage({ message: 12 })).toBe("");
    expect(redirectMessage({})).toBe("");
  });
});

describe("LoginPage", () => {
  test("asks for an email before calling the API", () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your email.");
    expect(login).not.toHaveBeenCalled();
  });

  test("asks for a password when the email is present", () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ta@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your password.");
    expect(login).not.toHaveBeenCalled();
  });

  test("stores the token and opens the account after a successful sign-in", async () => {
    vi.mocked(login).mockResolvedValue({
      token: "issued-token",
      email: "ta@example.com",
      role: "TA",
    });
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ta@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByRole("button", { name: "Signing in…" })).toBeDisabled();
    expect(await screen.findByText("Account screen")).toBeInTheDocument();
    expect(sessionStorage.getItem("ai-recruiter.token")).toBe("issued-token");
  });

  test("shows the error from a rejected sign-in", async () => {
    vi.mocked(login).mockRejectedValue(new TypeError("offline"));
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "  ta@example.com  " } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("The server could not be reached.");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
  });

  test("shows a message carried from another screen", () => {
    renderLogin({ message: "Invalid token." });
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid token.");
  });

  test("opens the account when a token is already stored", () => {
    saveToken("issued-token");
    renderLogin();
    expect(screen.getByText("Account screen")).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  test("opens registration without signing in", () => {
    renderLogin();
    expect(screen.getByText("Register as a Candidate")).toBeInTheDocument();
    expect(screen.queryByText("Talent acquisition")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByText("Register screen")).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });
});
