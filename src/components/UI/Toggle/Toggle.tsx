import styles from "./Toggle.module.css";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
  ariaLabel?: string;
}

export function Toggle({
  checked,
  onChange,
  className,
  onIcon,
  offIcon,
  ariaLabel,
}: ToggleProps) {
  return (
    <label className={`${styles.switch} ${className || ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={ariaLabel}
      />
      <span className={styles.slider}>
        <span className={styles.thumb}>{checked ? onIcon : offIcon}</span>
      </span>
    </label>
  );
}
