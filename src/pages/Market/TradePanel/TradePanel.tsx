import { useState } from "react";
import Button from "../../../components/UI/Button/Button";
import { usePortfolio } from "../../../store/portfolio/usePortfolio";
import { useMarket, selectPrice, selectSelectedAsset } from "../../../store/market/useMarket";
import { assetNames } from "../../../constants/assets";
import styles from "./TradePanel.module.css";

export default function TradePanel() {
  const selectedAsset = useMarket(selectSelectedAsset);
  const price = useMarket(selectPrice(selectedAsset));
  const { portfolio, buy, sell } = usePortfolio();
  const [amount, setAmount] = useState(0.0);
  const step = 0.0001;

  const ownedAmount = portfolio.find((a) => a.id === selectedAsset)?.amount || 0;
  const assetName = assetNames[selectedAsset] || selectedAsset;

  const decrement = () => setAmount((prev) => Math.max(Math.round((prev - step) * 1e5) / 1e5, 0));
  const increment = () => setAmount((prev) => Math.round((prev + step) * 1e5) / 1e5);

  const handleChange = (value: string) => {
    const num = Math.max(Number(value), 0);
    setAmount(Math.round(num * 1e5) / 1e5);
  };

  const handleBuy = () => {
    if (!selectedAsset || price <= 0 || amount <= 0) return;
    buy(selectedAsset, assetName, price, amount);
  };

  const handleSell = () => {
    if (!selectedAsset || amount <= 0) return;
    sell(selectedAsset, price, amount);
  };

  const handleSellAll = () => {
    if (!selectedAsset || ownedAmount <= 0) return;
    sell(selectedAsset, price, ownedAmount);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.controls}>
        <button type="button" className={styles.adjust} onClick={decrement}>
          -
        </button>
        <input
          type="number"
          value={amount.toFixed(4)}
          min={0}
          step={step}
          onChange={(e) => handleChange(e.target.value)}
          className={styles.input}
        />
        <button type="button" className={styles.adjust} onClick={increment}>
          +
        </button>
      </div>

      <div className={styles.actionButtons}>
        <Button
          variant="primary"
          size="md"
          onClick={handleBuy}
          disabled={price <= 0 || amount <= 0}
        >
          Купить
        </Button>
        <Button
          variant="danger"
          size="md"
          onClick={handleSell}
          disabled={amount <= 0 || amount > ownedAmount}
        >
          Продать
        </Button>
      </div>

      <div className={styles.sellAllWrapper}>
        <Button
          fullWidth
          variant="warning"
          size="md"
          onClick={handleSellAll}
          disabled={ownedAmount <= 0}
        >
          Продать всё
        </Button>
      </div>
    </div>
  );
}
