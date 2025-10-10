import type { Operation } from "../../../types";
import { getAssetIcon } from "../../../helpers/icons";
import styles from "./OperationItem.module.css";

interface Props {
  op: Operation;
}

export default function OperationItem({ op }: Props) {
  const icon = getAssetIcon(op.id);

  return (
    <li className={styles.item}>
      <div className={styles.top}>
        <div className={styles.nameWrapper}>
          {icon && <img src={icon} alt={op.name} className={styles.icon} />}
          <div className={styles.name}>{op.name}</div>
        </div>

        <div className={styles.meta}>
          <span className={`${styles.type} ${op.type === "buy" ? styles.buy : styles.sell}`}>
            {op.type === "buy" ? "Куплено" : "Продано"}
          </span>
          <span className={styles.date}>{new Date(op.date).toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.left}>
          <div className={styles.price}>${op.price.toFixed(2)}</div>
          <div className={styles.amount}>×&nbsp;{op.amount}</div>
        </div>
        <div className={styles.total}>${op.total.toFixed(2)}</div>
      </div>
    </li>
  );
}
