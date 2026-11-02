import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  test("renders its content", () => {
    render(
      <Card>
        <p>Sign in</p>
      </Card>,
    );
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });
});
