"use client";

import { useRef, useState } from "react";
import type { JSX } from "react";

import { TabText } from "./TabText";
import { TabIcon } from "./TabIcon";
import { DropdownSimple, Popover, type DropdownItem } from "@/atoms";

type TabDropdownProps = {
  type: "text" | "icon";
  text?: string;
  icon?: any;
  label?: string;

  items: DropdownItem[];
  onSelect?: (key: string | number) => void;
};

export const TabDropdown = ({
  type,
  text,
  icon,
  label,
  items,
  onSelect,
}: TabDropdownProps): JSX.Element => {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleClose = () => setIsOpen(false);

  const handleSelect = (key: string | number) => {
    onSelect?.(key);
    handleClose();
  };

  return (
    <>
      <div ref={anchorRef} style={{ display: "inline-block" }}>
        {type === "text" ? (
          <TabText text={text || ""} onClick={handleToggle} />
        ) : (
          <TabIcon icon={icon} onClick={handleToggle} label={label} />
        )}
      </div>

      <Popover anchorRef={anchorRef} isOpen={isOpen} onClose={handleClose}>
        <DropdownSimple items={items} onSelect={handleSelect} />
      </Popover>
    </>
  );
};
