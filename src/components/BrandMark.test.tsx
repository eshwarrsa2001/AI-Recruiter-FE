import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { BrandMark } from "./BrandMark";

describe("BrandMark", () => {
  test("shows the product name", () => {
    render(<BrandMark />);
    expect(screen.getByText("AI")).toBeInTheDocument();
    expect(screen.getByText("Recruiter")).toBeInTheDocument();
  });
});
