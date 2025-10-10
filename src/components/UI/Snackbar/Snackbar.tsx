import { useEffect } from "react";
import type { SnackbarItem } from "../../../types/snackbar";
import styles from "./Snackbar.module.css";

interface SnackbarProps {
  item: SnackbarItem;
  onClose: (id: string) => void;
}

export default function Snackbar({ item, onClose }: SnackbarProps) {
  const { id, message, type, duration = 5000 } = item;

  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div className={`${styles.snackbar} ${styles[type]}`}>
      <span>{message}</span>
    </div>
  );
}
