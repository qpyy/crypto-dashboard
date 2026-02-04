import { forwardRef, useId, type InputHTMLAttributes } from "react";
import styles from "./CustomInput.module.css";

interface CustomInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, error, type = "text", onChange, className, ...props }, ref) => {
    const internalId = useId();
    const inputId = props.id ?? internalId;

    return (
      <div className={[styles.wrapper, className ?? ""].filter(Boolean).join(" ")}>
        {label && (
          <label className={styles.label} htmlFor={inputId}>
            {label}
          </label>
        )}

        <input
          ref={ref}
          type={type}
          id={inputId}
          className={[styles.input, error ? styles.error : ""].filter(Boolean).join(" ")}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        />

        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";
export default CustomInput;
