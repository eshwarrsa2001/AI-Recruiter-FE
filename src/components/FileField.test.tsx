import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { FileField } from "./FileField";

describe("FileField", () => {
  test("reports the selected file", () => {
    const onChange = vi.fn();
    render(<FileField id="resume" label="Resume" accept=".pdf,.doc,.docx" onChange={onChange} />);
    const input = screen.getByLabelText("Resume");
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAttribute("accept", ".pdf,.doc,.docx");
    const file = new File(["%PDF-1.4"], "ada.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onChange).toHaveBeenCalledWith(file);
  });

  test("reports an empty selection", () => {
    const onChange = vi.fn();
    render(<FileField id="resume" label="Resume" accept=".pdf" onChange={onChange} />);
    const input = screen.getByLabelText("Resume");
    fireEvent.change(input, { target: { files: [] } });
    fireEvent.change(input, { target: { files: null } });
    expect(onChange).toHaveBeenNthCalledWith(1, null);
    expect(onChange).toHaveBeenNthCalledWith(2, null);
  });
});
