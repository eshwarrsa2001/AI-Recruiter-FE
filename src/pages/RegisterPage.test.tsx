import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { registerCandidate } from "../services/authApi";
import { AuthRequestError } from "../services/authErrors";
import { saveToken } from "../services/session";
import { RegisterPage, resumeMessage } from "./RegisterPage";

vi.mock("../services/authApi", () => ({
  registerCandidate: vi.fn(),
}));

beforeEach(() => {
  sessionStorage.clear();
  vi.mocked(registerCandidate).mockReset();
});

function renderRegister() {
  return render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<p>Account screen</p>} />
        <Route path="/login" element={<p>Sign-in screen</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

function fillRegistration(file: File | null = new File(["%PDF-1.4"], "ada.pdf", { type: "application/pdf" })) {
  fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Ada Lovelace" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Correct-horse-battery-9" } });
  fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "+1 555 0100" } });
  if (file !== null) {
    fireEvent.change(screen.getByLabelText("Resume"), { target: { files: [file] } });
  }
}

describe("resumeMessage", () => {
  test("accepts pdf and word files inside the size limit", () => {
    expect(resumeMessage({ name: "ada.pdf", size: 12 })).toBe("");
    expect(resumeMessage({ name: "ada.doc", size: 12 })).toBe("");
    expect(resumeMessage({ name: "Ada.DOCX", size: 5 * 1024 * 1024 })).toBe("");
  });

  test("rejects an empty file, the wrong type, a missing extension, and a file over 5 MB", () => {
    expect(resumeMessage({ name: "ada.pdf", size: 0 })).toBe("Choose a resume.");
    expect(resumeMessage({ name: "notes.txt", size: 12 })).toBe("Resume must be a PDF or Word file.");
    expect(resumeMessage({ name: "resume", size: 12 })).toBe("Resume must be a PDF or Word file.");
    expect(resumeMessage({ name: "ada.pdf", size: 5 * 1024 * 1024 + 1 })).toBe(
      "Resume must be 5 MB or smaller.",
    );
  });
});

describe("RegisterPage", () => {
  test("asks for a full name before calling the API", () => {
    renderRegister();
    expect(screen.getByText("Candidate account and resume")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your full name.");
    expect(registerCandidate).not.toHaveBeenCalled();
  });

  test("asks for an email when the name is present", () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your full name.");
    fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Ada Lovelace" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your email.");
  });

  test("asks for a password when the email is present", () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Ada Lovelace" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your email.");
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your password.");
  });

  test("asks for a phone when the password is present", () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Ada Lovelace" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your phone.");
  });

  test("asks for a resume when the phone is present", () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Ada Lovelace" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your phone.");
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "+1 555 0100" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Choose a resume.");
  });

  test("rejects an empty resume and a file that is not pdf or word", () => {
    renderRegister();
    fillRegistration(new File([], "ada.pdf", { type: "application/pdf" }));
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Choose a resume.");
    fillRegistration(new File(["notes"], "notes.txt", { type: "text/plain" }));
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Resume must be a PDF or Word file.");
    expect(registerCandidate).not.toHaveBeenCalled();
  });

  test("stores the token and opens the account after registration", async () => {
    vi.mocked(registerCandidate).mockResolvedValue({
      token: "issued-token",
      email: "ada@example.com",
      role: "Candidate",
    });
    renderRegister();
    fillRegistration();
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("button", { name: "Registering…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(await screen.findByText("Account screen")).toBeInTheDocument();
    expect(registerCandidate).toHaveBeenCalledWith({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      password: "Correct-horse-battery-9",
      phone: "+1 555 0100",
      resume: expect.any(File),
    });
    expect(sessionStorage.getItem("ai-recruiter.token")).toBe("issued-token");
  });

  test("shows the error from a rejected registration", async () => {
    vi.mocked(registerCandidate).mockRejectedValue(
      new AuthRequestError("An account for ada@example.com already exists."),
    );
    renderRegister();
    fillRegistration();
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "An account for ada@example.com already exists.",
    );
    expect(screen.getByRole("button", { name: "Register" })).toBeEnabled();
  });

  test("shows a network failure", async () => {
    vi.mocked(registerCandidate).mockRejectedValue(new TypeError("offline"));
    renderRegister();
    fillRegistration();
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("The server could not be reached.");
  });

  test("cancels registration and returns to sign in", () => {
    renderRegister();
    fillRegistration();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByText("Sign-in screen")).toBeInTheDocument();
    expect(registerCandidate).not.toHaveBeenCalled();
  });

  test("opens sign in from the register screen", () => {
    renderRegister();
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByText("Sign-in screen")).toBeInTheDocument();
    expect(registerCandidate).not.toHaveBeenCalled();
  });

  test("opens the account when a token is already stored", () => {
    saveToken("issued-token");
    renderRegister();
    expect(screen.getByText("Account screen")).toBeInTheDocument();
    expect(registerCandidate).not.toHaveBeenCalled();
  });
});
