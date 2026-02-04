import { useState, useEffect } from "react";
import Button from "../../../components/UI/Button/Button";
import CustomInput from "../../../components/UI/CustomInput/CustomInput";
import CustomSelect from "../../../components/UI/CustomSelect/CustomSelect";
import { useDebounce } from "../../../hooks/useDebounce";
import { DEBOUNCE_DELAY, TYPE_OPTIONS } from "../../../constants/filter";
import { filterOperations } from "../../../helpers/filter";
import type { Operation } from "../../../types";
import styles from "./OperationsFilter.module.css";

interface Props {
  operations: Operation[];
  onFilterChange: (filtered: Operation[]) => void;
}

interface Filters {
  asset: string;
  type: "buy" | "sell" | "";
  dateFrom: string;
  dateTo: string;
}

export default function OperationsFilter({ operations, onFilterChange }: Props) {
  const [filters, setFilters] = useState<Filters>({
    asset: "",
    type: "",
    dateFrom: "",
    dateTo: "",
  });

  const debouncedAsset = useDebounce(filters.asset, DEBOUNCE_DELAY);

  const handleChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({ asset: "", type: "", dateFrom: "", dateTo: "" });
  };

  useEffect(() => {
    const filtered = filterOperations(operations, {
      ...filters,
      asset: debouncedAsset,
    });
    onFilterChange(filtered);
  }, [debouncedAsset, filters.type, filters.dateFrom, filters.dateTo, operations, onFilterChange]);

  return (
    <div className={styles.wrapper}>
      <CustomInput
        label="Фильтр по активу"
        type="text"
        placeholder="Введите название"
        value={filters.asset}
        onChange={(val) => handleChange("asset", val)}
      />

      <CustomSelect
        value={filters.type}
        options={TYPE_OPTIONS}
        onChange={(val) => handleChange("type", val)}
        ariaLabel="Тип операции"
      />

      <CustomInput
        label="Дата от:"
        type="date"
        value={filters.dateFrom}
        onChange={(val) => handleChange("dateFrom", val)}
      />

      <CustomInput
        label="Дата до:"
        type="date"
        value={filters.dateTo}
        onChange={(val) => handleChange("dateTo", val)}
      />

      <Button variant="primary" onClick={handleReset}>
        Сбросить
      </Button>
    </div>
  );
}
