import React, { useState } from "react";
import clsx from "clsx";
import styles from "./TextInput.module.css";
import type { TextInputProps, TextInputVarientType } from "./TextInput.types";
import { Icons } from "@/assets/icons";
import { Button } from "../button/Button";

export type { TextInputVarientType, TextInputProps };

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      helperText,
      error,
      iconLeft,
      iconRight,
      variant = "outline",
      size = "medium",
      width = "300px",
      height = "40px",
      radius = "md",
      block,
      loading,
      disabled,
      className,
      style,
      id,
      color,
      tooltip,
      ariaLabel,
      responsive,
      textType,
      setResult,
      label,
      placeholder,
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [enterText, setEnterText] = useState("");
    const isDisabled = disabled || loading;

    const label_ = rest.required ? `${label} *` : label;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isDisabled) return;
      setEnterText(e.target.value);
      setResult?.(e.target.value);
    };

    const isPassword = textType === "password";
    const inputType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : textType;

    const cssVariable = {
      "--width": width,
      "--height": height,
    };

    return (
      <div
        className={clsx(styles.wrapper, block && styles.block, className)}
        style={{ ...style, ...cssVariable }}
        data-responsive={responsive || undefined}
      >
        {label_ && enterText.length > 0 && (
          <p className={styles.label}>{label_}</p>
        )}
        <div
          className={clsx(
            styles.inputContainer,
            styles[variant],
            styles[size],
            styles[`radius-${radius}`],
            error && styles.error,
            isDisabled && styles.disabled,
          )}
          style={
            color
              ? ({ "--input-color": color } as React.CSSProperties)
              : undefined
          }
        >
          {iconLeft && <span className={styles.icon}>{iconLeft}</span>}

          <input
            ref={ref}
            id={id}
            className={styles.input}
            type={inputType}
            disabled={isDisabled}
            aria-label={ariaLabel}
            aria-invalid={!!error}
            aria-busy={loading}
            title={tooltip}
            onChange={handleChange}
            placeholder={label_}
            {...rest}
          />

          {loading && <span className={styles.spinner} />}

          {!loading && isPassword ? (
            <Button
              variant="ghost"
              size="small"
              onClick={() => setShowPassword((prev) => !prev)}
              iconOnly
              iconLeft={showPassword ? Icons["eyeCrossIcon"] : Icons["eyeIcon"]}
              type="button"
            />
          ) : (
            !loading &&
            iconRight && <span className={styles.icon}>{iconRight}</span>
          )}
        </div>

        {(helperText || error) && (
          <span className={clsx(styles.helperText, error && styles.errorText)}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
