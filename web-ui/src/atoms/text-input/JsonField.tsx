"use client";

import { useEffect, useState } from "react";
import { TextArea } from "./TextArea";
import styles from "./JsonField.module.css";
import { getCommonCssVariables } from "./getCommonCssVariables";
import { Button } from "../button/Button";

export type JsonFieldProps = {
  label?: string;
  setResult: (json: string) => void;
  setIsFieldValid: (isValid: boolean) => void;
  color?: string;
  hideOnSave?: boolean;
  showCharacterCount?: boolean;
  showWordCount?: boolean;
  width?: string;
  isBorder?: boolean;
  backendError?: string;
  value?: string;
  required?: boolean;
};

export const JsonField: React.FC<JsonFieldProps> = ({
  label,
  setResult,
  setIsFieldValid,
  color,
  hideOnSave = false,
  showCharacterCount = false,
  showWordCount = false,
  width = "300px",
  isBorder = false,
  backendError = "",
  value = "",
  required = false,
}) => {
  // Initialize only once to avoid re-sync loops
  const [jsonInput, setJsonInput] = useState<string>(value);
  const [error, setError] = useState<string>("");
  const [onSave, setOnSave] = useState<boolean>(true);
  const [formattedJson, setFormattedJson] = useState<string>("");

  const handleValidateJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);

      setError("");
      setIsFieldValid(true);

      const prettyJson = JSON.stringify(parsedJson, null, 2);

      setFormattedJson(prettyJson);
      setJsonInput(prettyJson);

      // emit final result here (instead of useEffect)
      setResult(prettyJson);

      if (hideOnSave) setOnSave(false);
    } catch (err) {
      console.error("Invalid JSON format:", err);

      setError("Invalid JSON format");
      setFormattedJson("");
      setIsFieldValid(false);
      setOnSave(true);
    }
  };

  const cssVariable: React.CSSProperties = {
    ...(getCommonCssVariables(isBorder, color, width) as React.CSSProperties),
    width,
  };

  return (
    <div className={styles.jsonField} style={cssVariable}>
      {onSave ? (
        <>
          <div className={styles.textInput}>
            <TextArea
              color={color}
              label={label}
              value={jsonInput}
              setResult={setJsonInput}
              placeholder="Write JSON here..."
              showCharacterCount={showCharacterCount}
              showWordCount={showWordCount}
              backendError={backendError}
              width="100%"
              required={required}
            />
          </div>

          <div className={styles.errBtn}>
            {error ? <div className={styles.error}>{error}</div> : <div />}

            <div className={styles.btn}>
              <Button
                color={color}
                variant="secondary"
                size="small"
                onClick={handleValidateJson}
                width="150px"
                type="button"
              >
                Validate & Save
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.onDataSave}>Data saved Successfully</div>
      )}
    </div>
  );
};
