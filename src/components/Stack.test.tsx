import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Stack } from "./Stack";

describe("Stack", () => {
  test("renders its children", () => {
    render(
      <Stack>
        <p>Email</p>
      </Stack>,
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
  });
});
