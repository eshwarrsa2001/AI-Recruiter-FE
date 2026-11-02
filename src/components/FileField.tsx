import styles from "./FileField.module.css";

type FileFieldProps = {
  id: string;
  label: string;
  accept: string;
  onChange: (file: File | null) => void;
};

export function FileField({ id, label, accept, onChange }: FileFieldProps) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={(event) => {
          const selected = event.target.files;
          if (selected === null || selected.length === 0) {
            onChange(null);
            return;
          }
          onChange(selected[0]);
        }}
      />
    </label>
  );
}
