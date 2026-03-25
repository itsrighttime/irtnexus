import styles from "./Table.module.css";
import { Pagination } from "./Pagination";
import { ColumnSelector } from "./ColumnSelector";
import type { TableColumn } from "./table.type";
import { TextInput } from "../text-input/TextInput";

interface Props<T> {
  columns: TableColumn<T>[];
  visibleColumns: TableColumn<T>[];
  onColumnToggle: (key: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch?: (query: string) => void;
}

export function TableControls<T>({
  columns,
  visibleColumns,
  onColumnToggle,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
}: Props<T>) {
  return (
    <div className={styles.controls}>
      <TextInput
        placeholder="Search..."
        onChange={(value) => {
          onSearch?.(value);
        }}
      />

      <ColumnSelector<T>
        columns={columns}
        visibleColumns={visibleColumns}
        onToggle={onColumnToggle}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
