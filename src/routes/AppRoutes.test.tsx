import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { fetchAccount } from "../services/authApi";
import { saveToken } from "../services/session";
import { AppRoutes } from "./AppRoutes";

vi.mock("../services/authApi", () => ({
  fetchAccount: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  registerCandidate: vi.fn(),
}));

beforeEach(() => {
  sessionStorage.clear();
  vi.mocked(fetchAccount).mockReset();
});

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe("AppRoutes", () => {
  test("opens sign in from the root when nobody is signed in", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
  });

  test("opens the account from the root when a token is stored", async () => {
    saveToken("issued-token");
    vi.mocked(fetchAccount).mockResolvedValue({ email: "ta@example.com", role: "TA" });
    renderAt("/");
    expect(await screen.findByRole("heading", { name: "ta@example.com" })).toBeInTheDocument();
  });

  test("registers the login and account screens", () => {
    renderAt("/login");
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
  });

  test("opens candidate registration", () => {
    renderAt("/register");
    expect(screen.getByRole("heading", { name: "Register" })).toBeInTheDocument();
  });
});
