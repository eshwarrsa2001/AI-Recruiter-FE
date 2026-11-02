import styles from "./Text.module.css";

type TextProps = {
  children: string;
};

export function Text({ children }: TextProps) {
  return <p className={styles.text}>{children}</p>;
}
