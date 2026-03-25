import React, { useState } from "react";
import type { TableProps, TableColumn } from "./table.type";
import styles from "./Table.module.css";
import { TableControls } from "./TableControls";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";

export function Table<T extends Record<string, any>>({
  columns,
  data,
  rowActions,
  onCellClick,
  pageSize = 10,
  onSearch,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] =
    useState<TableColumn<T>[]>(columns);

  const handleColumnToggle = (key: string) => {
    setVisibleColumns((cols) =>
      cols.map((col) =>
        col.key === key
          ? { ...col, visible: col.visible === false ? true : false }
          : col,
      ),
    );
  };

  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className={styles.tableWrapper}>
      <TableControls<T>
        columns={columns}
        visibleColumns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearch={onSearch}
      />

      <table className={styles.table}>
        <TableHeader<T> columns={visibleColumns} />
        <TableBody<T>
          columns={visibleColumns}
          data={paginatedData}
          rowActions={rowActions}
          onCellClick={onCellClick}
        />
      </table>
    </div>
  );
}
