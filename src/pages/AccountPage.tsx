import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { Card } from "../components/Card";
import { Heading } from "../components/Heading";
import { PageCanvas } from "../components/PageCanvas";
import { Pill } from "../components/Pill";
import { RoleBadge } from "../components/RoleBadge";
import { SiteHeader } from "../components/SiteHeader";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { fetchAccount, logout, type Account } from "../services/authApi";
import { messageFor } from "../services/authErrors";
import { roleSummary } from "../services/roles";
import { clearToken, readToken } from "../services/session";

export function AccountPage() {
  const navigate = useNavigate();
  const token = readToken();
  const [account, setAccount] = useState<Account | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (token === null) {
      navigate("/login", { replace: true });
      return;
    }
    let cancelled = false;
    fetchAccount(token).then(
      (value) => {
        if (!cancelled) {
          setAccount(value);
        }
      },
      (error: unknown) => {
        if (cancelled) {
          return;
        }
        clearToken();
        navigate("/login", { replace: true, state: { message: messageFor(error) } });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [navigate, token]);

  if (token === null) {
    return null;
  }
  const activeToken = token;

  if (account === null) {
    return (
      <>
        <SiteHeader />
        <PageCanvas>
          <Text>Loading your account…</Text>
        </PageCanvas>
      </>
    );
  }

  async function handleSignOut() {
    setSigningOut(true);
    let failure = "";
    try {
      await logout(activeToken);
    } catch (error: unknown) {
      failure = messageFor(error);
    }
    clearToken();
    navigate("/login", {
      replace: true,
      state: failure === "" ? null : { message: failure },
    });
  }

  const summary = roleSummary(account.role);

  return (
    <>
      <AppHeader
        email={account.email}
        signingOut={signingOut}
        onSignOut={() => void handleSignOut()}
      />
      <PageCanvas>
        <Card>
          <Stack>
            <Pill>Signed in as</Pill>
            <Heading>{account.email}</Heading>
            <RoleBadge role={account.role} />
            {summary === null ? null : <Text>{summary}</Text>}
          </Stack>
        </Card>
      </PageCanvas>
    </>
  );
}
