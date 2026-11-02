import type { ReactNode } from "react";
import { BrandMark } from "./BrandMark";
import styles from "./SiteHeader.module.css";

type SiteHeaderProps = {
  children?: ReactNode;
};

export function SiteHeader({ children }: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <BrandMark />
      {children}
    </header>
  );
}
