import { useState, useRef, useEffect, useId, type KeyboardEvent } from "react";
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
  ariaLabel?: string;
};

const CustomSelect: FC<Props> = ({
  value,
  options,
  onChange,
  size = "md",
  fullWidth = false,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
      return;
    }

    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!options.length) return;

      const currentIndex = options.findIndex((opt) => opt.value === value);
      const delta = e.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (currentIndex + delta + options.length) % options.length;
      onChange(options[nextIndex].value);
      setIsOpen(true);
    }
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
      <div
        className={styles.selected}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
      >
        {selectedLabel}
        <span className={`${styles.arrow} ${isOpen ? styles.open : ""}`} />
      </div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`} id={listId} role="listbox">
        {options.map((opt) => (
          <li
            key={opt.value}
            className={styles.option}
            onClick={() => handleSelect(opt.value)}
            role="option"
            aria-selected={opt.value === value}
          >
            {opt.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomSelect;
