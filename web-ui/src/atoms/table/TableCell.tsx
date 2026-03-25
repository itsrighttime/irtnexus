import type { TableColumn } from "./table.type";

interface Props<T> {
  row: T;
  column: TableColumn<T>;
  onClick?: (row: T, column: TableColumn<T>) => void;
}

export function TableCell<T>({ row, column, onClick }: Props<T>) {
  const content = column.render
    ? column.render(row)
    : (row[column.key as keyof T] as React.ReactNode);

  return <td onClick={() => onClick?.(row, column)}>{content}</td>;
}
