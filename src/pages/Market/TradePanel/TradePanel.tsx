import { useState } from "react";
import Button from "../../../components/UI/Button/Button";
import { usePortfolio } from "../../../store/portfolio/usePortfolio";
import { useMarket, selectPrice, selectSelectedAsset } from "../../../store/market/useMarket";
import { assetNames } from "../../../constants/assets";
import type { PositionSide } from "../../../types";
import styles from "./TradePanel.module.css";

export default function TradePanel() {
  const selectedAsset = useMarket(selectSelectedAsset);
  const price = useMarket(selectPrice(selectedAsset));
  const { portfolio, buy, sell } = usePortfolio();
  const [side, setSide] = useState<PositionSide>("long");
  const [amount, setAmount] = useState(0.0);
  const step = 0.0001;

  const position = portfolio.find((a) => a.id === selectedAsset);
  const longAmount = Math.max(position?.amount ?? 0, 0);
  const shortAmount = Math.max(-(position?.amount ?? 0), 0);
  const maxCloseAmount = side === "long" ? longAmount : shortAmount;
  const assetName = assetNames[selectedAsset] || selectedAsset;

  const decrement = () => setAmount((prev) => Math.max(Math.round((prev - step) * 1e5) / 1e5, 0));
  const increment = () => setAmount((prev) => Math.round((prev + step) * 1e5) / 1e5);

  const handleChange = (value: string) => {
    const num = Math.max(Number(value), 0);
    setAmount(Math.round(num * 1e5) / 1e5);
  };

  const handleBuy = () => {
    if (!selectedAsset || price <= 0 || amount <= 0) return;
    buy(selectedAsset, assetName, price, amount, side);
  };

  const handleSell = () => {
    if (!selectedAsset || amount <= 0) return;
    sell(selectedAsset, assetName, price, amount, side);
  };

  const handleSellAll = () => {
    if (!selectedAsset || maxCloseAmount <= 0) return;
    if (side === "long") {
      sell(selectedAsset, assetName, price, maxCloseAmount, side);
      return;
    }
    buy(selectedAsset, assetName, price, maxCloseAmount, side);
  };

  const disableOpen = price <= 0 || amount <= 0;
  const disableClose = price <= 0 || amount <= 0 || amount > maxCloseAmount;
  const buyLabel = side === "short" ? "Покрыть" : "Купить";
  const sellLabel = side === "short" ? "Шорт" : "Продать";
  const closeAllLabel = side === "short" ? "Покрыть всё" : "Продать всё";

  return (
    <div className={styles.panel}>
      <div className={styles.modeToggle} role="tablist" aria-label="Режим позиции">
        <button
          type="button"
          className={`${styles.modeButton} ${side === "long" ? styles.modeActive : ""}`}
          onClick={() => setSide("long")}
          aria-pressed={side === "long"}
        >
          Лонг
        </button>
        <button
          type="button"
          className={`${styles.modeButton} ${side === "short" ? styles.modeActive : ""}`}
          onClick={() => setSide("short")}
          aria-pressed={side === "short"}
        >
          Шорт
        </button>
      </div>

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
          disabled={side === "short" ? disableClose : disableOpen}
        >
          {buyLabel}
        </Button>
        <Button
          variant="danger"
          size="md"
          onClick={handleSell}
          disabled={side === "short" ? disableOpen : disableClose}
        >
          {sellLabel}
        </Button>
      </div>

      <div className={styles.sellAllWrapper}>
        <Button
          fullWidth
          variant="warning"
          size="md"
          onClick={handleSellAll}
          disabled={maxCloseAmount <= 0 || price <= 0}
        >
          {closeAllLabel}
        </Button>
      </div>
    </div>
  );
}
