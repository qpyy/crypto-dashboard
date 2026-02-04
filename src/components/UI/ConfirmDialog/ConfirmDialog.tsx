import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./ConfirmDialog.module.css";
import Button from "../Button/Button";

type ConfirmDialogProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const messageId = useId();

  useEffect(() => {
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onCancel();
      return;
    }

    if (e.key !== "Tab") return;

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    );
    if (!focusable || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
      return;
    }

    if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={onCancel} onKeyDown={handleKeyDown} tabIndex={-1}>
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={messageId}
        ref={dialogRef}
      >
        <p className={styles.message} id={messageId}>
          {message}
        </p>
        <div className={styles.buttons}>
          <Button variant="secondary" size="md" onClick={onCancel}>
            Отмена
          </Button>
          <Button variant="danger" size="md" onClick={onConfirm}>
            Подтвердить
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
