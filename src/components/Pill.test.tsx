import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Pill } from "./Pill";

describe("Pill", () => {
  test("shows its label", () => {
    render(<Pill>Talent acquisition</Pill>);
    expect(screen.getByText("Talent acquisition")).toBeInTheDocument();
  });
});
