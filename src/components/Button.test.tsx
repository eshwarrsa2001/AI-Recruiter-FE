import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Button } from "./Button";
import styles from "./Button.module.css";

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

  test("renders an outline action that stays a pill", () => {
    const onClick = vi.fn();
    render(
      <Button variant="outline" block onClick={onClick}>
        Cancel
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Cancel" });
    button.click();
    expect(onClick).toHaveBeenCalledOnce();
    expect(button).toHaveClass(styles.outline, styles.block);
    expect(button).not.toHaveClass(styles.button);
  });

  test("renders a text action without the solid pill", () => {
    const onClick = vi.fn();
    render(
      <Button variant="text" block onClick={onClick}>
        Register
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Register" });
    button.click();
    expect(onClick).toHaveBeenCalledOnce();
    expect(button).toHaveClass(styles.text);
    expect(button).not.toHaveClass(styles.button);
    expect(button).not.toHaveClass(styles.block);
  });

  test("calls the click handler", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Sign out</Button>);
    screen.getByRole("button", { name: "Sign out" }).click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
