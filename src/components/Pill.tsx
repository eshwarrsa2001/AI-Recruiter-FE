import styles from "./Pill.module.css";

type PillProps = {
  children: string;
};

export function Pill({ children }: PillProps) {
  return <p className={styles.pill}>{children}</p>;
}
