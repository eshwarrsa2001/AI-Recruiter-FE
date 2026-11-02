import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { FormMessage } from "./FormMessage";

describe("FormMessage", () => {
  test("renders nothing when the message is empty", () => {
    const { container } = render(<FormMessage message="" />);
    expect(container).toBeEmptyDOMElement();
  });

  test("renders the message as an alert", () => {
    render(<FormMessage message="Enter your email." />);
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your email.");
  });
});
