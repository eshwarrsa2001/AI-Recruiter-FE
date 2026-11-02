import styles from "./TextField.module.css";

type TextFieldProps = {
  id: string;
  label: string;
  type?: "email" | "password" | "text" | "tel";
  value: string;
  autoComplete: string;
  onChange: (value: string) => void;
};

export function TextField({
  id,
  label,
  type = "text",
  value,
  autoComplete,
  onChange,
}: TextFieldProps) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
