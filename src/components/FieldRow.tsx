import type { ReactNode } from "react";
import styles from "./FieldRow.module.css";

type FieldRowProps = {
  children: ReactNode;
};

export function FieldRow({ children }: FieldRowProps) {
  return <div className={styles.row}>{children}</div>;
}
