import { Dropdown } from "../slection/Dropdown";
import type { TableColumn } from "./table.type";

interface Props<T> {
  columns: TableColumn<T>[];
  visibleColumns: TableColumn<T>[];
  onToggle: (key: string) => void;
}

export function ColumnSelector<T>({
  columns,
  visibleColumns,
  onToggle,
}: Props<T>) {
  // all column keys as string[]
  const allKeys = columns.map((col) => String(col.key));

  // visible column keys
  const selectedKeys = visibleColumns
    .filter((col) => col.visible !== false)
    .map((col) => String(col.key));

  const handleChange = (selected: string[]) => {
    // toggle based on difference
    allKeys.forEach((key) => {
      const isSelected = selected.includes(key);
      const isCurrentlyVisible = selectedKeys.includes(key);

      if (isSelected !== isCurrentlyVisible) {
        onToggle(key);
      }
    });
  };

  return (
    <Dropdown
      options={allKeys}
      value={selectedKeys}
      multiple
      placeholder="Select columns"
      setResult={handleChange}
    />
  );
}
