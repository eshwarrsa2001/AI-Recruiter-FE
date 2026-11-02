import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { PageCanvas } from "./PageCanvas";

describe("PageCanvas", () => {
  test("renders its content in the page main", () => {
    render(
      <PageCanvas>
        <p>Welcome</p>
      </PageCanvas>,
    );
    expect(screen.getByRole("main")).toHaveTextContent("Welcome");
  });
});
