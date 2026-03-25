import type { TableColumn, TableAction } from "./table.type";
import { TableCell } from "./TableCell";
import { ActionColumn } from "./ActionColumn";

interface Props<T> {
  row: T;
  columns: TableColumn<T>[];
  rowActions?: TableAction<T>[];
  onCellClick?: (row: T, column: TableColumn<T>) => void;
}

export function TableRow<T>({
  row,
  columns,
  rowActions,
  onCellClick,
}: Props<T>) {
  return (
    <tr>
      {columns
        .filter((col) => col.visible !== false)
        .map((col) => (
          <TableCell<T>
            key={String(col.key)}
            row={row}
            column={col}
            onClick={onCellClick}
          />
        ))}

      <ActionColumn<T> row={row} actions={rowActions} />
    </tr>
  );
}
