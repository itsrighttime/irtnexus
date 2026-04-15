"use client";

import React, { useState, useEffect, useRef, type CSSProperties } from "react";
import styles from "./SearchBox.module.css";
import { Icons } from "@/assets/icons";
import {
  filterSuggestions,
  handleKeyDown,
  handleClickOutside,
  type Suggestion,
} from "./Search.helper";
import { Button } from "../button/Button";

const { searchIcon } = Icons;

interface SearchBoxProps {
  suggestions: Suggestion[];
  setResult: (value: string | number) => void;
  color?: string;
  placeholder?: string;
  width?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  suggestions,
  setResult,
  color,
  placeholder = "Search...",
  width = "300px",
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>(
    [],
  );
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length >= 3) {
      const filtered = filterSuggestions(suggestions, value);
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
      setHighlightedIndex(0);
    } else {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleInputFocus = () => {
    if (inputValue.length >= 3) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInputValue(suggestion.name);
    setResult(suggestion.code);
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOutsideClick = handleClickOutside(
      searchBoxRef,
      setShowSuggestions,
    );

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleIconClick = () => {
    inputRef.current?.focus();

    const filtered = filterSuggestions(suggestions, inputValue);

    if (filtered.length > 0) {
      setShowSuggestions(true);
      setHighlightedIndex(0);
    } else {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const cssVariable: CSSProperties = {
    "--color": color || "var(--color-primary)",
    "--width": width,
  } as CSSProperties;

  return (
    <div ref={searchBoxRef} className={styles.searchBox} style={cssVariable}>
      <div className={styles.nameIcon}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          onKeyDown={(e) =>
            handleKeyDown(
              e,
              showSuggestions,
              filteredSuggestions,
              handleSuggestionClick,
              highlightedIndex,
              setHighlightedIndex,
            )
          }
          placeholder={placeholder}
          className={styles.input}
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-activedescendant={
            highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
          }
        />

        <div
          className={styles.search}
          onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
        >
          <Button
            iconLeft={searchIcon}
            onClick={handleIconClick}
            tooltip="Search"
            iconOnly
            color={color}
            variant="ghost"
            size="small"
          />
        </div>
      </div>

      {showSuggestions && (
        <ul
          id="suggestions-list"
          className={styles.suggestionsList}
          role="listbox"
        >
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion.code}
                id={`suggestion-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`${styles.suggestionItem} ${
                  index === highlightedIndex ? styles.highlighted : ""
                }`}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                {suggestion.name}
              </li>
            ))
          ) : inputValue.length >= 3 ? (
            <li className={styles.suggestionItem}>No suggestions</li>
          ) : null}
        </ul>
      )}
    </div>
  );
};
