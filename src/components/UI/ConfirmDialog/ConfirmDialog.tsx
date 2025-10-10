import { createPortal } from "react-dom";
import styles from "./ConfirmDialog.module.css";
import Button from "../Button/Button";

type ConfirmDialogProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  return createPortal(
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <p className={styles.message}>{message}</p>
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
