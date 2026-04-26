"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import styles from "./Dropdown.module.css";
import { Icons } from "@/assets/icons";
import { IconButton } from "../button/IconButton";
import { Button } from "../button/Button";
import { Popover } from "../over/Popover";
import { getFittedText } from "./helper/getFittedText";
import { DynamicPopover } from "../over/DynamicPopOver";

const { arrowDownIcon, arrowUpIcon } = Icons;

export type DropdownProps = {
  options: string[];
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
  const [isOpen, setIsOpen] = useState(false);
  const [allOptions, setAllOptions] = useState(options);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newOption, setNewOption] = useState("");
  const [displayText, setDisplayText] = useState("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const latestPlacementRef = useRef<"top" | "bottom">("bottom");

  // Sync external value
  useEffect(() => {
    if (value.length > 0 && selectedOptions.length === 0) {
      setSelectedOptions(value);
    }
  }, [value, selectedOptions.length]);

  useEffect(() => {
    if (!containerRef || !containerRef.current) return;

    const updateText = () => {
      if (!containerRef || !containerRef.current) return;
      const width = containerRef.current.offsetWidth - 80; // adjust for badge + icon
      const text = getFittedText(selectedOptions, width, containerRef as any);
      setDisplayText(text);
    };

    updateText();

    window.addEventListener("resize", updateText);
    return () => window.removeEventListener("resize", updateText);
  }, [selectedOptions]);

  // Handle select
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

  // Search filter
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setSearchTerm(search);

    setFilteredOptions(
      allOptions.filter((opt) =>
        opt.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  };

  // Add new option
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

  // Clear selection
  const handleClearSelection = () => {
    setSelectedOptions([]);
    setResult([]);
  };

  const handleHeaderClick = () => {
    setIsOpen((prev) => !prev);
  };

  const cssVariable: React.CSSProperties = {
    ["--color" as any]: color || "var(--color-primary)",
    ["--width" as any]: width,
  };

  return (
    <div
      className={styles.dropdown}
      ref={dropdownRef}
      tabIndex={0}
      style={cssVariable}
    >
      {/* Header */}
      <div
        ref={containerRef}
        className={`
          ${styles.dropdownHeader} 
          ${isOpen ? styles.open : ""} 
          ${latestPlacementRef.current === "top" ? styles.openUp : styles.openDown}`}
        onClick={handleHeaderClick}
      >
        {selectedOptions.length ? (
          <div className={styles.selectedContainer}>
            <span className={styles.countBox}>{selectedOptions.length}</span>

            <span className={styles.previewText}>{displayText}</span>
          </div>
        ) : (
          <span style={{ color: "var(--color-gray4)" }}>{placeholder}</span>
        )}

        <IconButton
          icon={isOpen ? arrowUpIcon : arrowDownIcon}
          label={isOpen ? "Close Dropdown" : "Open Dropdown"}
          color={color}
        />
      </div>

      {/* Popover Dropdown */}
      <DynamicPopover
        anchorRef={dropdownRef as any}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        {({ placement }) => {
          if (latestPlacementRef.current !== placement) {
            latestPlacementRef.current = placement;
          }

          return (
            <div
              className={`${styles.dropdownMenu} ${
                placement === "top" ? styles.openUp : styles.openDown
              }`}
              style={cssVariable}
            >
              {/* Search */}
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search..."
                className={styles.searchInput}
              />

              <div className={styles.dropdownOptions}>
                {multiple && (
                  <>
                    <div className={styles.selectedHeader}>
                      Selected Options
                    </div>
                    {selectedOptions.length > 0 ? (
                      <ul className={styles.optionList}>
                        {selectedOptions.map((option) => (
                          <li
                            key={option}
                            className={`${styles.optionItem} ${styles.selected}`}
                            onClick={() => handleSelectOption(option)} // optional: allow deselect
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className={styles.emptyState}>Nothing selected</div>
                    )}
                  </>
                )}

                {multiple && (
                  <div className={styles.selectedHeader}>All Options</div>
                )}
                <ul className={styles.optionList}>
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <li
                        key={option}
                        className={`${styles.optionItem} ${
                          selectedOptions.includes(option)
                            ? styles.selected
                            : ""
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
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add new option"
                    />
                    <Button
                      onClick={handleAddOption}
                      color={color}
                      variant="secondary"
                      type="button"
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
                      size="small"
                      type="button"
                    >
                      Clear Selection
                    </Button>
                    <Button
                      onClick={() => setIsOpen(false)}
                      width="90%"
                      size="small"
                      color={color}
                      type="button"
                    >
                      Done
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </DynamicPopover>
    </div>
  );
};
