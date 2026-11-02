import type { ReactNode } from "react";
import styles from "./Stack.module.css";

type StackProps = {
  children: ReactNode;
};

export function Stack({ children }: StackProps) {
  return <div className={styles.stack}>{children}</div>;
}
