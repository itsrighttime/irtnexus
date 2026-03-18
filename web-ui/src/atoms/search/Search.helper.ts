// Types
export interface Suggestion {
  code: string | number;
  name: string;
}

// Filter suggestions
export const filterSuggestions = (
  suggestions: Suggestion[],
  value: string,
): Suggestion[] => {
  return suggestions
    .filter((suggestion) =>
      suggestion.name.toLowerCase().includes(value.toLowerCase()),
    )
    .map((suggestion) => ({
      code: suggestion.code,
      name: suggestion.name,
    }));
};

// Handle keyboard navigation
export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  showSuggestions: boolean,
  filteredSuggestions: Suggestion[],
  handleSuggestionClick: (suggestion: Suggestion) => void,
  highlightedIndex: number,
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>,
): void => {
  if (!showSuggestions) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    setHighlightedIndex((prev) => {
      const nextIndex = Math.min(prev + 1, filteredSuggestions.length - 1);

      if (nextIndex !== prev) {
        document
          .getElementById(`suggestion-${nextIndex}`)
          ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }

      return nextIndex;
    });
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    setHighlightedIndex((prev) => {
      const nextIndex = Math.max(prev - 1, 0);

      if (nextIndex !== prev) {
        document
          .getElementById(`suggestion-${nextIndex}`)
          ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }

      return nextIndex;
    });
  } else if (e.key === "Enter") {
    e.preventDefault();

    if (highlightedIndex >= 0) {
      handleSuggestionClick(filteredSuggestions[highlightedIndex]);
    }
  }
};

// Handle click outside
export const handleClickOutside = (
  searchBoxRef: React.RefObject<HTMLDivElement | null>,
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  return (event: MouseEvent): void => {
    if (
      searchBoxRef.current &&
      !searchBoxRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  };
};
