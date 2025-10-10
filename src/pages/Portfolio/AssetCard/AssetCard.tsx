import type { FC } from "react";
import { getAssetIcon } from "../../../helpers/icons";
import { formatCurrency } from "../../../helpers/format";
import cardStyles from "./AssetCard.module.css";

type Props = {
  id: string;
  name: string;
  icon?: string;
  amount: number;
  avgPrice: number;
  currentValue: number;
  profit: number;
};

const AssetCard: FC<Props> = ({ id, name, amount, avgPrice, currentValue, profit }) => {
  const icon = getAssetIcon(id);

  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.cardHeader}>
        {icon && <img src={icon} alt={name} className={cardStyles.icon} />}
        <span className={cardStyles.assetName}>{name}</span>
      </div>

      <div className={cardStyles.cardDetails}>
        <span>
          Количество: <b>{amount}</b> шт. (средняя цена: {formatCurrency(avgPrice)})
        </span>

        <span>
          Текущая стоимость: <b>{formatCurrency(currentValue)}</b>{" "}
          <span className={profit >= 0 ? cardStyles.profit : cardStyles.loss}>
            ({profit >= 0 ? "+" : ""}
            {formatCurrency(profit)})
          </span>
        </span>
      </div>
    </div>
  );
};

export default AssetCard;
