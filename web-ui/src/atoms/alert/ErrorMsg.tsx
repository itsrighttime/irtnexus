"use client";

import React, { type CSSProperties } from "react";

interface ErrorMsgProps {
  /** The error message text to display */
  message: string;
  /** Whether the error text should be bold */
  bold?: boolean;
  /** Font size multiplier based on CSS variable `--size` */
  fontSize?: number;
  /** Text alignment of the message */
  textAlign?: "left" | "center" | "right" | "justify";
  /** CSS padding applied to the message container */
  padding?: string;
}

/**
 * ErrorMsg Component
 *
 * A reusable UI component for displaying error messages with
 * customizable styling such as font weight, size, alignment, and padding.
 */
export const ErrorMsg: React.FC<ErrorMsgProps> = ({
  message,
  bold = true,
  fontSize = 0.8,
  textAlign = "left",
  padding = "10px",
}) => {
  const styling: CSSProperties = {
    fontWeight: bold ? "var(--boldL2)" : 400,
    fontSize: `calc(var(--size) * ${fontSize})`,
    color: "var(--colorRed)",
    textAlign,
    padding,
    textWrap: "wrap" as any, // TypeScript doesn't recognize `textWrap`, forcing type here
  };

  return <p style={styling}>{message}</p>;
};
