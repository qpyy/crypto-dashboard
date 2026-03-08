import { useState } from "react";

import Button from "../../../components/UI/Button/Button";
import { assetNames } from "../../../constants/assets";
import { selectPrice, selectSelectedAsset, useMarket } from "../../../store/market/useMarket";
import { usePortfolio } from "../../../store/portfolio/usePortfolio";
import type { PositionSide } from "../../../types";
import styles from "./TradePanel.module.css";

export default function TradePanel() {
  const selectedAsset = useMarket(selectSelectedAsset);
  const price = useMarket(selectPrice(selectedAsset));
  const { portfolio, buy, sell } = usePortfolio();
  const [side, setSide] = useState<PositionSide>("long");
  const [amount, setAmount] = useState(0.0);
  const step = 0.0001;
  const roundAmount = (value: number) => Math.round(value * 1e5) / 1e5;

  const position = portfolio.find((a) => a.id === selectedAsset);
  const longAmount = Math.max(position?.amount ?? 0, 0);
  const shortAmount = Math.max(-(position?.amount ?? 0), 0);
  const maxCloseAmount = side === "long" ? longAmount : shortAmount;
  const assetName = assetNames[selectedAsset] || selectedAsset;

  const decrement = () => setAmount((prev) => Math.max(roundAmount(prev - step), 0));
  const increment = () => setAmount((prev) => roundAmount(prev + step));

  const handleChange = (value: string) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      setAmount(0);
      return;
    }
    setAmount(Math.max(roundAmount(parsed), 0));
  };

  const handleBuy = () => {
    if (
      !selectedAsset ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isFinite(amount) ||
      amount <= 0
    )
      return;
    buy(selectedAsset, assetName, price, amount, side);
  };

  const handleSell = () => {
    if (
      !selectedAsset ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isFinite(amount) ||
      amount <= 0
    )
      return;
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

  const isPriceValid = Number.isFinite(price) && price > 0;
  const isAmountValid = Number.isFinite(amount) && amount > 0;
  const disableOpen = !isPriceValid || !isAmountValid;
  const disableClose = !isPriceValid || !isAmountValid || amount > maxCloseAmount;
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
          value={(Number.isFinite(amount) ? amount : 0).toFixed(4)}
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
