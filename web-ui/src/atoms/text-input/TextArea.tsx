"use client";

import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type FocusEvent,
} from "react";
import styles from "./TextArea.module.css";

export type TextAreaProps = {
  label?: string;
  value?: string;
  setResult: (value: string) => void;
  color?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  maxTextAreaHeight?: number;
  setIsFieldValid?: (isValid: boolean) => void;
  showCharacterCount?: boolean;
  showWordCount?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  width?: string;
  showLabelAlways?: boolean;
  backendError?: string;
  required?: boolean;
};

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  setResult,
  color,
  placeholder = "Enter text here...",
  minLength,
  maxLength,
  maxTextAreaHeight = 200,
  setIsFieldValid = () => {},
  showCharacterCount = false,
  showWordCount = false,
  disabled = false,
  style = {},
  width = "300px",
  backendError = "",
  required = false,
}) => {
  const [inputValue, setInputValue] = useState<string>(value || "");
  const [error, setError] = useState<string>("");

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Handle backend errors
  useEffect(() => {
    if (backendError) {
      setError(backendError);
      setIsFieldValid(false);
    }
  }, [backendError, setIsFieldValid]);

  // Auto-resize logic
  useEffect(() => {
    const el = textAreaRef.current;
    if (!el) return;

    el.style.height = "auto";
    const currentHeight = el.scrollHeight;

    if (currentHeight < maxTextAreaHeight) {
      el.style.height = `${currentHeight + 5}px`;
      el.style.overflowY = "hidden";
    } else {
      el.style.height = `${maxTextAreaHeight}px`;
      el.style.overflowY = "auto";
    }
  }, [inputValue, maxTextAreaHeight]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;

    // Clear backend error on user input
    if (backendError) {
      setError("");
      setIsFieldValid(true);
    }

    if (minLength && val.length < minLength) {
      setError(`Minimum length is ${minLength} characters.`);
      setInputValue(val);
    } else if (maxLength && val.length > maxLength) {
      setError(`Maximum length is ${maxLength} characters.`);
    } else {
      setError("");
      setInputValue(val);
    }
  };

  const getWordCount = (text: string): number => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const handleOnBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    setResult(inputValue);

    if (inputValue.length === maxLength || error === "") {
      setIsFieldValid(true);
    } else {
      setIsFieldValid(false);
    }
  };

  const cssVariable: React.CSSProperties = {
    ["--color" as any]: color || "var(--color-primary)",
    ["--width" as any]: width,
  };

  return (
    <div
      className={styles.textAreaContainer}
      style={{ ...style, ...cssVariable }}
    >
      {label && inputValue != "" && (
        <p className={styles.label}>{`${label} ${required ? " *" : ""}`}</p>
      )}
      <textarea
        id={label}
        value={inputValue}
        onChange={handleChange}
        placeholder={`${placeholder} ${required ? " *" : ""}`}
        disabled={disabled}
        className={styles.textArea}
        ref={textAreaRef}
        onBlur={handleOnBlur}
      />

      <div className={styles.errorInfo}>
        {error ? <div className={styles.errorMessage}>{error}</div> : <div />}

        <div className={styles.information}>
          {showCharacterCount && (
            <span className={styles.count}>
              Char: {inputValue.length}
              {maxLength ? `/${maxLength}` : ""}
            </span>
          )}

          {showCharacterCount && showWordCount && (
            <span className={styles.count} style={{ fontWeight: 800 }}>
              {" | "}
            </span>
          )}

          {showWordCount && (
            <span className={styles.count}>
              Word: {getWordCount(inputValue)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
