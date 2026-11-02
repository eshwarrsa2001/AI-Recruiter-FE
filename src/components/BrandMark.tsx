import styles from "./BrandMark.module.css";

export function BrandMark() {
  return (
    <p className={styles.mark}>
      AI <span className={styles.accent}>Recruiter</span>
    </p>
  );
}
