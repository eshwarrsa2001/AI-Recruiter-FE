import type { ReactNode } from "react";
import styles from "./PageCanvas.module.css";

type PageCanvasProps = {
  children: ReactNode;
};

export function PageCanvas({ children }: PageCanvasProps) {
  return <main className={styles.canvas}>{children}</main>;
}
