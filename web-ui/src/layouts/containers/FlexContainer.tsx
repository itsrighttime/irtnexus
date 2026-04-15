"use client";

import type { ReactNode, CSSProperties, Ref, JSX } from "react";
import styles from "./Container.module.css";
import type { Align, Direction, Justify, Wrap } from "./types/index";
import { toCSSValue } from "./helper/toCSSValue";

/** ------------------ TYPES ------------------ */

type FlexContainerProps = {
  children: ReactNode;
  direction?: Direction;
  justify?: Justify;
  align?: Align;
  wrap?: Wrap;
  gap?: string | number;
  className?: string;
  style?: CSSProperties;
  flexRef?: Ref<HTMLDivElement>;
};

/** ------------------ COMPONENT ------------------ */

export const FlexContainer = ({
  children,
  direction = "row",
  justify = "start",
  align = "stretch",
  wrap = "wrap",
  gap = "8px",
  className = "",
  style = {},
  flexRef = null,
}: FlexContainerProps): JSX.Element => {
  const cssVariables: CSSProperties = {
    "--flex-direction": toCSSValue("direction", direction),
    "--flex-justify": toCSSValue("justify", justify),
    "--flex-align": toCSSValue("align", align),
    "--flex-wrap": toCSSValue("wrap", wrap),
    "--flex-gap": typeof gap === "number" ? `${gap}px` : gap,
  } as CSSProperties;

  return (
    <div
      ref={flexRef}
      className={`${styles.flexContainer} ${className}`}
      style={{ ...cssVariables, ...style }}
    >
      {children}
    </div>
  );
};
