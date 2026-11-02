import { describe, expect, test } from "vitest";
import { roleSummary } from "./roles";

describe("roleSummary", () => {
  test("describes each recruitment role", () => {
    expect(roleSummary("TA Admin")).toMatch(/Administers talent acquisition/);
    expect(roleSummary("TA")).toMatch(/Runs talent acquisition/);
    expect(roleSummary("Interviewer")).toMatch(/Interviews candidates/);
    expect(roleSummary("Candidate")).toMatch(/Applies for roles/);
  });

  test("returns null for a role this screen does not describe", () => {
    expect(roleSummary("Auditor")).toBeNull();
  });
});
