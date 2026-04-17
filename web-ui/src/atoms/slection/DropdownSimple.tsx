"use client";

import { useRef, type JSX } from "react";
import styles from "./DropdownSimple.module.css";
import { useSmartPosition } from "@/hooks";

export type DropdownItem = {
  key: string | number;
  route: string;
  value: string;
  box?: string[];
  description?: string;
};

type DropdownSimpleProps = {
  items: DropdownItem[];
  onSelect?: (key: string | number) => void;
  isOpen: boolean;
};

export const DropdownSimple: React.FC<DropdownSimpleProps> = ({
  items,
  onSelect,
  isOpen,
}): JSX.Element | null => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const position = useSmartPosition(dropdownRef, isOpen);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      style={{
        opacity: position.ready ? 1 : 0,
        pointerEvents: position.ready ? "auto" : "none",
      }}
      className={`${styles.dropdownMenu} ${
        position.vertical === "top" ? styles.dropTop : styles.dropBottom
      } ${
        position.horizontal === "left" ? styles.alignLeft : styles.alignRight
      }`}
    >
      {items.map((item) => (
        <div
          key={item.key}
          className={styles.dropdownItem}
          onClick={() => onSelect?.(item.key)}
        >
          <div className={styles.dropdownItemLabelBox}>
            <div className={styles.dropdownItemLabel}>{item.value}</div>

            {Array.isArray(item.box) &&
              item.box.map((b, i) =>
                b ? (
                  <span key={i} className={styles.boxValue}>
                    {b}
                  </span>
                ) : null,
              )}
          </div>

          {item.description && (
            <div className={styles.dropdownItemDescription}>
              {item.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
