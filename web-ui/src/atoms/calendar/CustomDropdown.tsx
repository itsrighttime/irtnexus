"use client";

import React, { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import styles from "./CustomDropdown.module.css";
import type { CustomDropdownProps } from "./Calendar.types";


export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  color,
  specialStyle = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAbove, setIsAbove] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (dropdownRect.bottom + 150 > windowHeight) {
        setIsAbove(true);
      } else {
        setIsAbove(false);
      }
    }

    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const cssVariable: CSSProperties = {
    "--color": color || "var(--colorCyan)",
  } as CSSProperties;

  return (
    <div
      className={styles.dropdown}
      ref={dropdownRef}
      style={{ ...specialStyle, ...cssVariable }}
    >
      <div className={styles.dropdownSelected} onClick={toggleDropdown}>
        {value}
      </div>
      {isOpen && (
        <div
          className={`${styles.dropdownOptions} ${isAbove ? styles.above : ""}`}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={styles.dropdownOption}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
