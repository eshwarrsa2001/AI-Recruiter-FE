import styles from "./RoleBadge.module.css";

type RoleBadgeProps = {
  role: string;
};

export function RoleBadge({ role }: RoleBadgeProps) {
  return <span className={styles.badge}>{role}</span>;
}
