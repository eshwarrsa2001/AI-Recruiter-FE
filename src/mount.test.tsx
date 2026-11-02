import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { mountApplication } from "./mount";

describe("mountApplication", () => {
  test("does nothing when the page has no root element", () => {
    expect(mountApplication(null)).toBeNull();
  });

  test("renders the application and can unmount it", async () => {
    document.body.innerHTML = '<div id="root"></div>';
    window.history.pushState({}, "", "/");
    sessionStorage.clear();
    const main = await import("./main");
    expect(await screen.findByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    main.applicationRoot?.unmount();
  });
});
