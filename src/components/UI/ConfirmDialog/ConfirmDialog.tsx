import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

import Button from "../Button/Button";
import styles from "./ConfirmDialog.module.css";

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
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
        return;
      }

      if (e.key !== "Tab") return;

      const currentFocusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
      );
      if (!currentFocusable || currentFocusable.length === 0) return;

      const first = currentFocusable[0];
      const last = currentFocusable[currentFocusable.length - 1];
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

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  return createPortal(
    <div className={styles.root}>
      <button
        className={styles.overlay}
        type="button"
        aria-label="Close dialog"
        onClick={onCancel}
      />
      <div
        className={styles.dialog}
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
    document.body,
  );
}
