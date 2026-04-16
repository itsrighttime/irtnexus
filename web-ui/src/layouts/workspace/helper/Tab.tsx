"use client";

import React, { useState, useRef } from "react";
import styles from "../css/Navigator.module.css";
import { workspaceKeys } from "./workspaceKeys.js";
import type { DropdownItem } from "./types.js";
import { useDynamicContent } from "../context/index.js";
import { useOutsideClick } from "@/hooks/useOutsideClick.js";
import { IconButton } from "@/atoms/button/IconButton.js";
import { Button, DropdownSimple } from "@/atoms/index.js";
// import { DropdownSimpleValue } from "./DropdownSimpleValue.js";

interface TabProps {
  tabRef?:
    | ((el: HTMLDivElement | null) => void)
    | React.RefObject<HTMLDivElement>;
  mykey: string;
  value: string;
  icon?: React.ComponentType | React.FC | null;
  onClick?: (value: string) => void;
  color?: string;
  dropdown?: DropdownItem[] | null;
  extra?: { total?: number };
}

export const Tab: React.FC<TabProps> = ({
  tabRef,
  mykey,
  value,
  icon,
  onClick,
  color,
  dropdown,
  extra,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [dropdownValue, setDropdownValue] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { getValue } = useDynamicContent();

  useOutsideClick(dropdownRef, () => setShowDropdown(false));

  const activeTabKey = getValue(workspaceKeys.tabClickedKey);

  if (!onClick) {
    console.warn(
      `You have not passed the onClick for tab "${value}" (key: ${mykey}). Kindly pass onClick.`,
    );
  }

  const isSelected = dropdown?.length
    ? dropdown.some((item) => item.key === activeTabKey)
    : mykey === activeTabKey;

  const isSpecial =
    mykey === workspaceKeys.workspaceName ||
    mykey === workspaceKeys.toggleFullscreen;

  const iconBtnClass = `${styles.iconBtn} ${isSelected ? styles.isSelected : ""}`;
  const plainBtnClass = `${styles.plainBtn} ${isSpecial ? styles.isSpecial : ""} ${
    isSelected ? styles.isSelected : ""
  }`;

  const handleClick = () => {
    if (dropdown?.length) {
      setShowDropdown((prev) => !prev);
    } else if (!isSelected) {
      onClick?.(mykey);
    }
  };

  const handleDropdownSelect = (selectedKey: any) => {
    if (selectedKey !== dropdownValue) {
      onClick?.(selectedKey);
      setDropdownValue(selectedKey);
    }
    setShowDropdown(false);
  };

  const cssVariable: React.CSSProperties & Record<string, string> = {
    "--colorSpecial":
      extra?.total === 0
        ? color || "var(--color-primary)"
        : "var(--color-error)",
    "--colorSpecialBg": "",
  };

  return (
    <div
      className={styles.tabWithDropdown}
      ref={(el) => {
        dropdownRef.current = el;
        if (typeof tabRef === "function") tabRef(el);
        else if (tabRef)
          (tabRef as React.RefObject<HTMLDivElement | null>).current = el;
      }}
      style={cssVariable}
    >
      {mykey === workspaceKeys.notification ? (
        <div className={iconBtnClass}>
          <div className={styles.notification} onClick={handleClick}>
            <p>{extra?.total}</p>
            <IconButton
              icon={icon as any}
              label={value}
              color={color}
              size={1.2}
            />
          </div>
        </div>
      ) : icon ? (
        <div className={iconBtnClass}>
          <IconButton
            icon={icon as any}
            label={value}
            color={mykey === workspaceKeys.toggleFullscreen ? "#ff5969" : color}
            size={1.2}
            onClick={handleClick}
          />
        </div>
      ) : (
        <div className={plainBtnClass}>
          <Button onClick={handleClick} variant="tertiary" color={color}>
            {value}
          </Button>
        </div>
      )}

      {showDropdown && dropdown && dropdown.length > 0 && (
        <DropdownSimple items={dropdown} onSelect={handleDropdownSelect} />
      )}
    </div>
  );
};
