import { useSnackbar } from "../../../store/snackbar/snackbar";
import Snackbar from "./Snackbar";
import styles from "./Snackbar.module.css";

export default function SnackbarContainer() {
  const { queue, removeSnackbar } = useSnackbar();

  return (
    <div className={styles.stack} role="status" aria-live="polite">
      {queue.map((item) => (
        <Snackbar key={item.id} item={item} onClose={removeSnackbar} />
      ))}
    </div>
  );
}
