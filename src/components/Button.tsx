import styles from "./Button.module.css";

type ButtonProps = {
  children: string;
  type?: "button" | "submit";
  disabled?: boolean;
  block?: boolean;
  onClick?: () => void;
};

export function Button({
  children,
  type = "button",
  disabled = false,
  block = false,
  onClick,
}: ButtonProps) {
  const className = block ? `${styles.button} ${styles.block}` : styles.button;
  return (
    <button className={className} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
