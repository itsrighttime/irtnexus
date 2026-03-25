"use client";

import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import styles from "./Dropdown.module.css";
import { Icons } from "@/assets";
import { useSmartPosition } from "@/hooks";
import { IconButton } from "../button/IconButton";
import { Button } from "../button/Button";

const { arrowDownIcon, arrowUpIcon } = Icons;

type DropdownProps = {
  options?: string[];
  multiple?: boolean;
  placeholder?: string;
  label?: string;
  setResult: (selected: string[]) => void;
  color?: string;
  value?: string[];
  addNew?: boolean;
  setAddedOptions?: (options: string[]) => void;
  width?: string;
  required?: boolean;
};

type SmartPosition = {
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
};

export const Dropdown: React.FC<DropdownProps> = ({
  options = [],
  multiple = false,
  placeholder = "Select...",
  setResult,
  color,
  value = [],
  addNew = false,
  setAddedOptions,
  width = "300px",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [allOptions, setAllOptions] = useState<string[]>(options);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newOption, setNewOption] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const position = useSmartPosition(dropdownRef) as SmartPosition;

  useEffect(() => {
    if (value.length > 0 && selectedOptions.length === 0) {
      setSelectedOptions(value);
    }
  }, [value, selectedOptions.length]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const handleClickOutside = (event: MouseEvent | globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside as any);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any);
    };
  }, []);

  const handleSelectOption = (option: string) => {
    const updatedSelections = multiple
      ? selectedOptions.includes(option)
        ? selectedOptions.filter((item) => item !== option)
        : [...selectedOptions, option]
      : [option];

    setSelectedOptions(updatedSelections);
    setResult(updatedSelections);

    if (!multiple) setIsOpen(false);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setSearchTerm(search);

    setFilteredOptions(
      allOptions.filter((opt) =>
        opt.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  };

  const handleAddOption = () => {
    const trimmed = newOption.trim();

    if (trimmed && !allOptions.includes(trimmed)) {
      const updated = [...allOptions, trimmed];
      setAllOptions(updated);
      setFilteredOptions(updated);
      setAddedOptions?.(updated);
      setNewOption("");
      setSearchTerm("");
    }
  };

  const handleClearSelection = () => {
    setSelectedOptions([]);
    setResult([]);
  };

  const handleHeaderClick = () => setIsOpen((prev) => !prev);

  const cssVariable: React.CSSProperties = {
    ["--color" as any]: color || "var(--colorCyan)",
    ["--width" as any]: width,
  };

  return (
    <div
      className={styles.dropdown}
      ref={dropdownRef}
      tabIndex={0}
      style={cssVariable}
    >
      <div
        className={`${styles.dropdownHeader} ${isOpen ? styles.open : ""}`}
        onClick={handleHeaderClick}
      >
        {selectedOptions.length ? (
          <span>{selectedOptions.join(", ")}</span>
        ) : (
          <span style={{ color: "var(--colorGray4)" }}>{placeholder}</span>
        )}

        <IconButton
          icon={isOpen ? arrowUpIcon : arrowDownIcon}
          label={isOpen ? "Close Dropdown" : "Open Dropdown"}
          color={color}
        />
      </div>

      {isOpen && (
        <div
          className={`${styles.dropdownMenu} ${
            position.vertical === "top" ? styles.dropTop : styles.dropBottom
          } ${
            position.horizontal === "left"
              ? styles.alignLeft
              : styles.alignRight
          }`}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search..."
            className={styles.searchInput}
          />

          <div className={styles.dropdownOptions}>
            <ul className={styles.optionList}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option}
                    className={`${styles.optionItem} ${
                      selectedOptions.includes(option) ? styles.selected : ""
                    }`}
                    onClick={() => handleSelectOption(option)}
                  >
                    {option}
                  </li>
                ))
              ) : (
                <li className={styles.optionItem}>No Options Available</li>
              )}
            </ul>

            {addNew && (
              <div className={styles.addNewOption}>
                <input
                  type="text"
                  value={newOption}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewOption(e.target.value)
                  }
                  placeholder="Add new option"
                />
                <Button
                  onClick={handleAddOption}
                  color={color}
                  variant="secondary"
                >
                  Add
                </Button>
              </div>
            )}

            {selectedOptions.length > 0 && (
              <div className={styles.buttons}>
                <Button
                  onClick={handleClearSelection}
                  width="90%"
                  color={color}
                  variant="secondary"
                >
                  Clear Selection
                </Button>
                <Button onClick={handleHeaderClick} width="90%" color={color}>
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
