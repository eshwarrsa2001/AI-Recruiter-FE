import type { ReactNode } from "react";
import styles from "./Heading.module.css";

type HeadingProps = {
  children: ReactNode;
  level?: 1 | 2;
  accent?: string;
};

export function Heading({ children, level = 1, accent }: HeadingProps) {
  const className = `${styles.heading} ${level === 1 ? styles.level1 : styles.level2}`;
  const content = (
    <>
      {children}
      {accent === undefined ? null : (
        <>
          {" "}
          <span className={styles.accent}>{accent}</span>
        </>
      )}
    </>
  );
  if (level === 2) {
    return <h2 className={className}>{content}</h2>;
  }
  return <h1 className={className}>{content}</h1>;
}
