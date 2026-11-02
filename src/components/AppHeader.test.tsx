import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { AppHeader } from "./AppHeader";

describe("AppHeader", () => {
  test("shows the account email and signs out", () => {
    const onSignOut = vi.fn();
    render(<AppHeader email="ta@example.com" signingOut={false} onSignOut={onSignOut} />);
    expect(screen.getByText("ta@example.com")).toBeInTheDocument();
    screen.getByRole("button", { name: "Sign out" }).click();
    expect(onSignOut).toHaveBeenCalledOnce();
  });

  test("disables sign out while it is in progress", () => {
    render(<AppHeader email="ta@example.com" signingOut onSignOut={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Signing out…" })).toBeDisabled();
  });
});
