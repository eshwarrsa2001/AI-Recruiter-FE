import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Card } from "./Card";
import styles from "./Card.module.css";

describe("Card", () => {
  test("renders its content", () => {
    render(
      <Card>
        <p>Sign in</p>
      </Card>,
    );
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  test("uses the wider card for a longer form", () => {
    render(
      <Card wide>
        <p>Register</p>
      </Card>,
    );
    expect(screen.getByText("Register").parentElement).toHaveClass(styles.card, styles.wide);
  });
});
