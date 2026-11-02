import styles from "./Button.module.css";

type ButtonProps = {
  children: string;
  type?: "button" | "submit";
  disabled?: boolean;
  block?: boolean;
  variant?: "solid" | "outline" | "text";
  onClick?: () => void;
};

export function Button({
  children,
  type = "button",
  disabled = false,
  block = false,
  variant = "solid",
  onClick,
}: ButtonProps) {
  const appearances = {
    solid: styles.button,
    outline: styles.outline,
    text: styles.text,
  };
  const appearance = appearances[variant];
  const className = block && variant !== "text" ? `${appearance} ${styles.block}` : appearance;
  return (
    <button className={className} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
