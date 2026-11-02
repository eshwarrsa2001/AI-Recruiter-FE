import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { TextField } from "./TextField";

describe("TextField", () => {
  test("reports the typed value", () => {
    const onChange = vi.fn();
    render(
      <TextField
        id="email"
        label="Email"
        type="email"
        value=""
        autoComplete="username"
        onChange={onChange}
      />,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("autocomplete", "username");
    fireEvent.change(input, { target: { value: "ta@example.com" } });
    expect(onChange).toHaveBeenCalledWith("ta@example.com");
  });

  test("uses a text input when no type is given", () => {
    render(
      <TextField
        id="note"
        label="Note"
        value="hello"
        autoComplete="off"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("Note")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Note")).toHaveValue("hello");
  });
});
