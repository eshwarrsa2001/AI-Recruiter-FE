import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { FormMessage } from "../components/FormMessage";
import { Heading } from "../components/Heading";
import { PageCanvas } from "../components/PageCanvas";
import { Pill } from "../components/Pill";
import { SiteHeader } from "../components/SiteHeader";
import { Stack } from "../components/Stack";
import { TextField } from "../components/TextField";
import { login } from "../services/authApi";
import { messageFor } from "../services/authErrors";
import { readToken, saveToken } from "../services/session";

export function redirectMessage(state: unknown): string {
  if (typeof state !== "object" || state === null || !("message" in state)) {
    return "";
  }
  if (typeof state.message !== "string") {
    return "";
  }
  return state.message;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(redirectMessage(location.state));
  const [submitting, setSubmitting] = useState(false);

  if (readToken() !== null) {
    return <Navigate to="/account" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim() === "") {
      setMessage("Enter your email.");
      return;
    }
    if (password === "") {
      setMessage("Enter your password.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const session = await login(email, password);
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
        <Pill>Talent acquisition</Pill>
        <Heading accent="AI Recruiter">Sign in to</Heading>
        <Card>
          <form onSubmit={handleSubmit}>
            <Stack>
              <Heading level={2}>Sign in</Heading>
              <TextField
                id="email"
                label="Email"
                type="email"
                value={email}
                autoComplete="username"
                onChange={setEmail}
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={setPassword}
              />
              <FormMessage message={message} />
              <Button type="submit" block disabled={submitting}>
                {submitting ? "Signing in…" : "Sign in"}
              </Button>
            </Stack>
          </form>
        </Card>
      </PageCanvas>
    </>
  );
}
