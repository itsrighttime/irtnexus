import React, { useState } from "react";
import clsx from "clsx";
import styles from "./TextInput.module.css";
import type { TextInputProps } from "./TextInput.types";
import { Icons } from "@/assets";
import { Button } from "../button/Button";

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      helperText,
      error,
      iconLeft,
      iconRight,
      variant = "outline",
      size = "medium",
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
      type,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isDisabled = disabled || loading;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isDisabled) return;
      onChange?.(e);
    };

    const isPassword = type === "password";
    const inputType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : "text";

    return (
      <div
        className={clsx(styles.wrapper, block && styles.block, className)}
        style={style}
        data-responsive={responsive || undefined}
      >
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
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
