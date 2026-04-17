"use client";

import { useRef, useState, type ReactNode, type JSX } from "react";
import { DropdownSimple, Popover, type DropdownItem } from "@/atoms";

type TabDropdownProps = {
  trigger: ReactNode;
  items: DropdownItem[];
  onSelect?: (key: string | number) => void;
};

export const TabDropdown = ({
  trigger,
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
      <div
        ref={anchorRef}
        onClick={handleToggle}
        style={{ display: "inline-block" }}
      >
        {trigger}
      </div>

      <Popover anchorRef={anchorRef} isOpen={isOpen} onClose={handleClose}>
        <DropdownSimple items={items} onSelect={handleSelect} isOpen={isOpen} />
      </Popover>
    </>
  );
};
