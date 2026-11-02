import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { App } from "./App";

beforeEach(() => {
  sessionStorage.clear();
  window.history.pushState({}, "", "/");
});

describe("App", () => {
  test("shows sign in at the root when nobody is signed in", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
  });
});
