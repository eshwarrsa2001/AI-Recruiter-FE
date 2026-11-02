import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { fetchAccount, logout } from "../services/authApi";
import { AuthRequestError } from "../services/authErrors";
import { saveToken } from "../services/session";
import { AccountPage } from "./AccountPage";

vi.mock("../services/authApi", () => ({
  fetchAccount: vi.fn(),
  logout: vi.fn(),
}));

beforeEach(() => {
  sessionStorage.clear();
  vi.mocked(fetchAccount).mockReset();
  vi.mocked(logout).mockReset();
});

function renderAccount() {
  return render(
    <MemoryRouter initialEntries={["/account"]}>
      <Routes>
        <Route path="/account" element={<AccountPage />} />
        <Route path="/login" element={<p>Sign-in screen</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AccountPage", () => {
  test("sends a signed-out visitor to sign in", async () => {
    renderAccount();
    expect(await screen.findByText("Sign-in screen")).toBeInTheDocument();
    expect(fetchAccount).not.toHaveBeenCalled();
  });

  test("shows the email, role, and role summary", async () => {
    saveToken("issued-token");
    vi.mocked(fetchAccount).mockResolvedValue({
      email: "admin@example.com",
      role: "TA Admin",
    });
    renderAccount();
    expect(screen.getByText("Loading your account…")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "admin@example.com" })).toBeInTheDocument();
    expect(screen.getByText("TA Admin")).toBeInTheDocument();
    expect(screen.getByText(/Administers talent acquisition/)).toBeInTheDocument();
  });

  test("hides the summary for a role this screen does not describe", async () => {
    saveToken("issued-token");
    vi.mocked(fetchAccount).mockResolvedValue({
      email: "auditor@example.com",
      role: "Auditor",
    });
    renderAccount();
    expect(await screen.findByText("Auditor")).toBeInTheDocument();
    expect(screen.queryByText(/talent acquisition/i)).not.toBeInTheDocument();
  });

  test("returns to sign in when the account cannot be loaded", async () => {
    saveToken("issued-token");
    vi.mocked(fetchAccount).mockRejectedValue(new AuthRequestError("Invalid token."));
    renderAccount();
    expect(await screen.findByText("Sign-in screen")).toBeInTheDocument();
    expect(sessionStorage.getItem("ai-recruiter.token")).toBeNull();
  });

  test("ignores an account response that arrives after leaving the page", async () => {
    saveToken("issued-token");
    let resolveAccount: (account: { email: string; role: string }) => void = () => undefined;
    vi.mocked(fetchAccount).mockReturnValue(
      new Promise((resolve) => {
        resolveAccount = resolve;
      }),
    );
    const view = renderAccount();
    view.unmount();
    resolveAccount({ email: "ta@example.com", role: "TA" });
    await Promise.resolve();
    expect(screen.queryByRole("heading", { name: "ta@example.com" })).not.toBeInTheDocument();
  });

  test("ignores an account failure that arrives after leaving the page", async () => {
    saveToken("issued-token");
    let rejectAccount: (error: Error) => void = () => undefined;
    vi.mocked(fetchAccount).mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectAccount = reject;
      }),
    );
    const view = renderAccount();
    view.unmount();
    rejectAccount(new AuthRequestError("Invalid token."));
    await Promise.resolve();
    expect(sessionStorage.getItem("ai-recruiter.token")).toBe("issued-token");
  });

  test("signs out and returns to the sign-in screen", async () => {
    saveToken("issued-token");
    vi.mocked(fetchAccount).mockResolvedValue({ email: "ta@example.com", role: "TA" });
    vi.mocked(logout).mockResolvedValue(undefined);
    renderAccount();
    fireEvent.click(await screen.findByRole("button", { name: "Sign out" }));
    expect(await screen.findByText("Sign-in screen")).toBeInTheDocument();
    expect(sessionStorage.getItem("ai-recruiter.token")).toBeNull();
  });

  test("still leaves when sign-out is rejected", async () => {
    saveToken("issued-token");
    vi.mocked(fetchAccount).mockResolvedValue({ email: "ta@example.com", role: "TA" });
    vi.mocked(logout).mockRejectedValue(new TypeError("offline"));
    renderAccount();
    fireEvent.click(await screen.findByRole("button", { name: "Sign out" }));
    expect(await screen.findByText("Sign-in screen")).toBeInTheDocument();
    expect(sessionStorage.getItem("ai-recruiter.token")).toBeNull();
  });
});
