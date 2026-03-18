import React from "react";
import clsx from "clsx";
import styles from "./Button.module.css";
import type { ButtonProps, ButtonComponent } from "./Button.types";

const ButtonBase = <C extends React.ElementType = "button">(
  {
    as,
    children,
    variant = "primary",
    size = "medium",
    radius = "md",
    iconLeft,
    iconRight,
    iconOnly,
    block,
    loading,
    disabled,
    className,
    style,
    id,
    color = "var(--color-primary)",
    tooltip,
    ariaLabel,
    responsive,
    onClick,
    ...rest
  }: ButtonProps<C>,
  ref?: React.Ref<any>,
) => {
  const Component = as || "button";

  const isDisabled = disabled || loading;

  const handleClick = (e: React.MouseEvent) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const iconSize =
    size === "large"
      ? "var(--font-size-lg)"
      : size === "medium"
        ? "var(--font-size-md)"
        : "var(--font-size-sm)";

  return (
    <Component
      ref={ref}
      id={id}
      style={
        {
          ...style,
          "--icon-size": iconSize,
          "--button-color": color,
        } as React.CSSProperties
      }
      title={tooltip}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      aria-busy={loading}
      data-responsive={responsive || undefined}
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        styles[`radius-${radius}`],
        block && styles.block,
        iconOnly && styles.iconOnly,
        isDisabled && styles.disabled,
        className,
      )}
      disabled={Component === "button" ? isDisabled : undefined}
      onClick={handleClick}
      {...rest}
    >
      {loading && <span className={styles.spinner} />}

      {!loading && iconLeft && <span className={styles.icon}>{iconLeft}</span>}

      {!iconOnly && <span className={styles.label}>{children}</span>}

      {!loading && iconRight && (
        <span className={styles.icon}>{iconRight}</span>
      )}
    </Component>
  );
};

const ForwardedButton = React.forwardRef(ButtonBase);

ForwardedButton.displayName = "Button";

export const Button = ForwardedButton as ButtonComponent;
