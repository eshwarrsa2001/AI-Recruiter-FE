import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  test("renders a submit button that can be disabled", () => {
    render(
      <Button type="submit" disabled>
        Sign in
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Sign in" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toBeDisabled();
  });

  test("renders a full-width button", () => {
    render(<Button block>Sign in</Button>);
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  test("calls the click handler", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Sign out</Button>);
    screen.getByRole("button", { name: "Sign out" }).click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
