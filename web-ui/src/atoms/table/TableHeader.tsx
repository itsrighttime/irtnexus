import type { TableColumn } from "./table.type";

interface Props<T> {
  columns: TableColumn<T>[];
}

export function TableHeader<T>({ columns }: Props<T>) {
  return (
    <thead>
      <tr>
        {columns
          .filter((col) => col.visible !== false)
          .map((col) => (
            <th key={String(col.key)}>{col.title}</th>
          ))}
        <th>Actions</th>
      </tr>
    </thead>
  );
}
