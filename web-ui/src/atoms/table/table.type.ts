import { type ReactNode } from "react";

export type TableColumn<T> = {
  key: keyof T | string;
  title: string;
  visible?: boolean;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
};

export type TableAction<T> = {
  label: string;
  onClick: (row: T) => void;
};

export type TableControlsConfig = {
  search?: boolean;
  columnSelector?: boolean;
  pagination?: boolean;
};

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowActions?: TableAction<T>[];
  onCellClick?: (row: T, column: TableColumn<T>) => void;
  pageSize?: number;
  onSearch?: (query: string) => void;
  controls?: TableControlsConfig;
}
