import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./CustomInput.module.css";

interface CustomInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, error, type = "text", onChange, className, ...props }, ref) => {
    return (
      <div className={clsx(styles.wrapper, className)}>
        {label && <label className={styles.label}>{label}</label>}

        <input
          ref={ref}
          type={type}
          className={clsx(styles.input, { [styles.error]: !!error })}
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
