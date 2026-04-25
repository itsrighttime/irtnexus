import styles from "./Table.module.css";
import { Pagination } from "./Pagination";
import { ColumnSelector } from "./ColumnSelector";
import type { TableColumn } from "./table.type";
import { TextInput } from "../text-input/TextInput";
import { useState, useRef } from "react";
import { Popover } from "../over/Popover";
import { IconButton } from "../button/IconButton";
import { Icons } from "@/assets/icons";

interface Props<T> {
  columns: TableColumn<T>[];
  visibleColumns: TableColumn<T>[];
  onColumnToggle: (key: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch?: (query: string) => void;

  showSearch?: boolean;
  showColumnSelector?: boolean;
  showPagination?: boolean;
}

export function TableControls<T>({
  columns,
  visibleColumns,
  onColumnToggle,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  showSearch,
  showColumnSelector,
  showPagination,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.controls}>
      {/* Desktop Layout */}
      <div className={styles.desktopControls}>
        {showSearch && (
          <TextInput
            placeholder="Search..."
            setResult={(value) => onSearch?.(value)}
            width="200px"
          />
        )}

        {showColumnSelector && (
          <ColumnSelector<T>
            columns={columns}
            visibleColumns={visibleColumns}
            onToggle={onColumnToggle}
          />
        )}

        {showPagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>

      {/* Mobile / Small Container */}
      <div className={styles.mobileControls} ref={buttonRef}>
        <IconButton
          icon={!open ? Icons.linesIcon : Icons.crossIcon}
          onClick={() => setOpen((prev) => !prev)}
          size={2}
        />

        <Popover
          anchorRef={buttonRef as any}
          isOpen={open}
          onClose={() => setOpen(false)}
        >
          <div className={styles.mobileMenu}>
            {showSearch && (
              <TextInput
                placeholder="Search..."
                setResult={(value) => onSearch?.(value)}
                width="100%"
              />
            )}

            {showColumnSelector && (
              <ColumnSelector<T>
                columns={columns}
                visibleColumns={visibleColumns}
                onToggle={onColumnToggle}
              />
            )}

            {showPagination && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            )}
          </div>
        </Popover>
      </div>
    </div>
  );
}
