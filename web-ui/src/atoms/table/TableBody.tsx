import type { TableColumn, TableAction } from "./table.type";
import { TableRow } from "./TableRow";

interface Props<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowActions?: TableAction<T>[];
  onCellClick?: (row: T, column: TableColumn<T>) => void;
}

export function TableBody<T>({
  columns,
  data,
  rowActions,
  onCellClick,
}: Props<T>) {
  return (
    <tbody>
      {data.map((row, index) => (
        <TableRow<T>
          key={index}
          row={row}
          columns={columns}
          rowActions={rowActions}
          onCellClick={onCellClick}
        />
      ))}
    </tbody>
  );
}
