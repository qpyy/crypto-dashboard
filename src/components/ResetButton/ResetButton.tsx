import { useState } from "react";

import { useMarket } from "../../store/market/useMarket";
import { usePortfolio } from "../../store/portfolio/usePortfolio";
import Button from "../UI/Button/Button";
import ConfirmDialog from "../UI/ConfirmDialog/ConfirmDialog";

export default function ResetButton() {
  const [isOpen, setIsOpen] = useState(false);
  const resetPortfolio = usePortfolio((state) => state.reset);
  const setSelectedAsset = useMarket((state) => state.setSelectedAsset);

  const handleReset = () => {
    resetPortfolio();
    setSelectedAsset("bitcoin");

    setIsOpen(false);
  };

  return (
    <>
      <Button variant="danger" size="md" onClick={() => setIsOpen(true)}>
        Сбросить игру
      </Button>

      {isOpen && (
        <ConfirmDialog
          message="Вы точно хотите сбросить игру? Все данные будут потеряны."
          onConfirm={handleReset}
          onCancel={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
