import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Text } from "./Text";

describe("Text", () => {
  test("shows its copy", () => {
    render(<Text>Welcome back</Text>);
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });
});
