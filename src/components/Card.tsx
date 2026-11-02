import type { ReactNode } from "react";
import styles from "./Card.module.css";

type CardProps = {
  children: ReactNode;
  wide?: boolean;
};

export function Card({ children, wide = false }: CardProps) {
  const className = wide ? `${styles.card} ${styles.wide}` : styles.card;
  return <section className={className}>{children}</section>;
}
