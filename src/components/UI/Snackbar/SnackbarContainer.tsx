import { useSnackbar } from "../../../store/snackbar/snackbar";
import Snackbar from "./Snackbar";

export default function SnackbarContainer() {
  const { queue, removeSnackbar } = useSnackbar();

  return (
    <>
      {queue.map((item) => (
        <Snackbar key={item.id} item={item} onClose={removeSnackbar} />
      ))}
    </>
  );
}
