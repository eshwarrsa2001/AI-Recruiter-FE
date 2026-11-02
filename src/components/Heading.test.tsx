import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Heading } from "./Heading";

describe("Heading", () => {
  test("renders a page title", () => {
    render(<Heading>Account</Heading>);
    expect(screen.getByRole("heading", { level: 1, name: "Account" })).toBeInTheDocument();
  });

  test("renders a section title", () => {
    render(<Heading level={2}>Sign in</Heading>);
    expect(screen.getByRole("heading", { level: 2, name: "Sign in" })).toBeInTheDocument();
  });

  test("highlights an accent phrase", () => {
    render(<Heading accent="AI Recruiter">Sign in to</Heading>);
    expect(screen.getByRole("heading", { name: "Sign in to AI Recruiter" })).toBeInTheDocument();
  });
});
