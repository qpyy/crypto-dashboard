import type { Operation } from "../../../types";
import OperationItem from "../OperationItem/OperationItem";
import styles from "./OperationsList.module.css";

interface Props {
  operations: Operation[];
}

export default function OperationsList({ operations }: Props) {
  if (operations.length === 0) {
    return <p className={styles.empty}>Пока нет операций</p>;
  }

  return (
    <ul className={styles.list}>
      {operations
        .slice()
        .reverse()
        .map((op) => (
          <OperationItem key={op.operationId} op={op} />
        ))}
    </ul>
  );
}
