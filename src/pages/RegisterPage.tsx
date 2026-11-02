import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { FieldRow } from "../components/FieldRow";
import { FileField } from "../components/FileField";
import { FormMessage } from "../components/FormMessage";
import { Heading } from "../components/Heading";
import { PageCanvas } from "../components/PageCanvas";
import { Pill } from "../components/Pill";
import { SiteHeader } from "../components/SiteHeader";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { TextField } from "../components/TextField";
import { registerCandidate } from "../services/authApi";
import { messageFor } from "../services/authErrors";
import { readToken, saveToken } from "../services/session";

const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];
const RESUME_MAX_BYTES = 5 * 1024 * 1024;

type ResumeFile = {
  name: string;
  size: number;
};

function resumeExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot < 0) {
    return "";
  }
  return name.slice(dot).toLowerCase();
}

export function resumeMessage(file: ResumeFile): string {
  if (file.size === 0) {
    return "Choose a resume.";
  }
  if (!RESUME_EXTENSIONS.includes(resumeExtension(file.name))) {
    return "Resume must be a PDF or Word file.";
  }
  if (file.size > RESUME_MAX_BYTES) {
    return "Resume must be 5 MB or smaller.";
  }
  return "";
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (readToken() !== null) {
    return <Navigate to="/account" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fullName.trim() === "") {
      setMessage("Enter your full name.");
      return;
    }
    if (email.trim() === "") {
      setMessage("Enter your email.");
      return;
    }
    if (password === "") {
      setMessage("Enter your password.");
      return;
    }
    if (phone.trim() === "") {
      setMessage("Enter your phone.");
      return;
    }
    if (resume === null) {
      setMessage("Choose a resume.");
      return;
    }
    const problem = resumeMessage(resume);
    if (problem !== "") {
      setMessage(problem);
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const session = await registerCandidate({
        fullName,
        email,
        password,
        phone,
        resume,
      });
      saveToken(session.token);
      navigate("/account", { replace: true });
    } catch (error: unknown) {
      setMessage(messageFor(error));
      setSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <PageCanvas>
        <Pill>Candidate</Pill>
        <Heading>Register</Heading>
        <Text>Candidate account and resume</Text>
        <Card wide>
          <form onSubmit={handleSubmit}>
            <Stack>
              <FieldRow>
                <TextField
                  id="full-name"
                  label="Full name"
                  value={fullName}
                  autoComplete="name"
                  onChange={setFullName}
                />
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  autoComplete="username"
                  onChange={setEmail}
                />
              </FieldRow>
              <FieldRow>
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  autoComplete="new-password"
                  onChange={setPassword}
                />
                <TextField
                  id="phone"
                  label="Phone"
                  type="tel"
                  value={phone}
                  autoComplete="tel"
                  onChange={setPhone}
                />
              </FieldRow>
              <FileField
                id="resume"
                label="Resume"
                accept=".pdf,.doc,.docx"
                onChange={setResume}
              />
              <FormMessage message={message} />
              <FieldRow>
                <Button type="submit" block disabled={submitting}>
                  {submitting ? "Registering…" : "Register"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  block
                  disabled={submitting}
                  onClick={() => navigate("/login")}
                >
                  Cancel
                </Button>
              </FieldRow>
              <Button type="button" variant="text" onClick={() => navigate("/login")}>
                Sign in
              </Button>
            </Stack>
          </form>
        </Card>
      </PageCanvas>
    </>
  );
}
