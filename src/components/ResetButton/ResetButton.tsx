import { useState } from "react";
import Button from "../UI/Button/Button";
import ConfirmDialog from "../UI/ConfirmDialog/ConfirmDialog";
import { usePortfolio } from "../../store/portfolio/usePortfolio";
import { useMarket } from "../../store/market/useMarket";

export default function ResetButton() {
  const [isOpen, setIsOpen] = useState(false);
  const resetPortfolio = usePortfolio((state) => state.reset);
  const setPrices = useMarket((state) => state.setPrice);
  const setSelectedAsset = useMarket((state) => state.setSelectedAsset);

  const handleReset = () => {
    resetPortfolio();

    Object.keys(useMarket.getState().prices).forEach((id) => setPrices(id, 0));

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
