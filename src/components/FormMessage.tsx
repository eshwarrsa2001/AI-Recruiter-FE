import styles from "./FormMessage.module.css";

type FormMessageProps = {
  message: string;
};

export function FormMessage({ message }: FormMessageProps) {
  if (message === "") {
    return null;
  }
  return (
    <p className={styles.message} role="alert">
      {message}
    </p>
  );
}
