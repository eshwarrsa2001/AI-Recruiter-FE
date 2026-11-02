import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { FieldRow } from "./FieldRow";

describe("FieldRow", () => {
  test("places fields side by side", () => {
    render(
      <FieldRow>
        <label>
          Full name
          <input />
        </label>
        <label>
          Email
          <input />
        </label>
      </FieldRow>,
    );
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });
});
