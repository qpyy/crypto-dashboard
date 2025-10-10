import { useState, useRef, useEffect } from "react";
import type { FC } from "react";
import styles from "./CustomSelect.module.css";

type Option = {
  value: string;
  label: string;
};

type Size = "sm" | "md" | "lg";

type Props = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  size?: Size;
  fullWidth?: boolean;
};

const CustomSelect: FC<Props> = ({ value, options, onChange, size = "md", fullWidth = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  return (
    <div
      className={`${styles.wrapper} ${styles[size]} ${fullWidth ? styles.fullWidth : ""}`}
      ref={ref}
    >
      <div className={styles.selected} onClick={toggleOpen}>
        {selectedLabel}
        <span className={`${styles.arrow} ${isOpen ? styles.open : ""}`} />
      </div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {options.map((opt) => (
          <li key={opt.value} className={styles.option} onClick={() => handleSelect(opt.value)}>
            {opt.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomSelect;
