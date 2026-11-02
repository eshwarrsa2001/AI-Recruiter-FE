import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { RoleBadge } from "./RoleBadge";

describe("RoleBadge", () => {
  test("shows the role name", () => {
    render(<RoleBadge role="TA Admin" />);
    expect(screen.getByText("TA Admin")).toBeInTheDocument();
  });
});
