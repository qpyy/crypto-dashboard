import { useState } from "react";
import { Link } from "react-router-dom";

import Menu from "../../../assets/icons/Menu.svg";
import { assetNames, ASSETS } from "../../../constants/assets";
import { selectPrices, useMarket } from "../../../store/market/useMarket";
import ResetButton from "../../ResetButton/ResetButton";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const prices = useMarket(selectPrices);
  const [open, setOpen] = useState(false);

  const topAssets = ASSETS.filter((id) => prices[id] !== undefined).slice(0, 5);

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.open : ""}`}
        onClick={() => setOpen(false)}
      />

      <div className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <div className={styles.stats}>
          <h4>Актуальные цены</h4>
          {topAssets.length === 0 ? (
            <p>Нет данных</p>
          ) : (
            topAssets.map((id) => (
              <div key={id} className={styles.row}>
                <span>{assetNames[id] || id}</span>
                <span>${(prices[id] || 0).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>

        <div className={styles.links}>
          <ul>
            <li>
              <Link to="/">Рынок</Link>
            </li>
            <li>
              <Link to="/portfolio">Портфель</Link>
            </li>
            <li>
              <Link to="/statistics">Статистика</Link>
            </li>
          </ul>
        </div>

        <div className={styles.bottom}>
          <ResetButton />
        </div>
      </div>

      {!open && (
        <button className={styles.toggleButton} onClick={() => setOpen(true)}>
          <img src={Menu} alt="Menu" />
        </button>
      )}
    </>
  );
}
