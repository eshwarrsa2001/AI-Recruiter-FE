import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  test("shows the brand and the actions passed in", () => {
    render(
      <SiteHeader>
        <button type="button">Sign out</button>
      </SiteHeader>,
    );
    expect(screen.getByText("Recruiter")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });

  test("shows the brand when no actions are passed", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
