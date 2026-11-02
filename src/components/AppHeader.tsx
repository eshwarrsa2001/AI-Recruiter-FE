import { Button } from "./Button";
import { SiteHeader } from "./SiteHeader";
import styles from "./AppHeader.module.css";

type AppHeaderProps = {
  email: string;
  onSignOut: () => void;
  signingOut: boolean;
};

export function AppHeader({ email, onSignOut, signingOut }: AppHeaderProps) {
  return (
    <SiteHeader>
      <div className={styles.actions}>
        <p className={styles.email}>{email}</p>
        <Button type="button" disabled={signingOut} onClick={onSignOut}>
          {signingOut ? "Signing out…" : "Sign out"}
        </Button>
      </div>
    </SiteHeader>
  );
}
