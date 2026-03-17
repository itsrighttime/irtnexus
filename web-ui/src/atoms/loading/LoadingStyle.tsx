"use client";

import React, { type CSSProperties } from "react";
import styles from "./LoadingStyle.module.css";

// Shared props interface
interface LoaderProps {
  color?: string;
}

// Optional cleaner CSS variable typing
type CSSVars = CSSProperties & {
  "--color"?: string;
};

/**
 * CubesLoader Component
 */
export const CubesLoader: React.FC<LoaderProps> = ({ color }) => {
  const cssVariables: CSSVars = {
    "--color": color || "var(--color-primary)",
  };

  return (
    <div className={styles.cubes} style={cssVariables}>
      <div className={`${styles.skCube} ${styles.skCube1}`} />
      <div className={`${styles.skCube} ${styles.skCube2}`} />
      <div className={`${styles.skCube} ${styles.skCube3}`} />
      <div className={`${styles.skCube} ${styles.skCube4}`} />
      <div className={`${styles.skCube} ${styles.skCube5}`} />
      <div className={`${styles.skCube} ${styles.skCube6}`} />
      <div className={`${styles.skCube} ${styles.skCube7}`} />
      <div className={`${styles.skCube} ${styles.skCube8}`} />
      <div className={`${styles.skCube} ${styles.skCube9}`} />
    </div>
  );
};

/**
 * FoldingLoader Component
 */
export const FoldingLoader: React.FC<LoaderProps> = ({ color }) => {
  const cssVariables: CSSVars = {
    "--color": color || "var(--color-primary)",
  };

  return (
    <div className={styles.folding} style={cssVariables}>
      <div className={`${styles.skCube} ${styles.skCube1}`} />
      <div className={`${styles.skCube} ${styles.skCube2}`} />
      <div className={`${styles.skCube} ${styles.skCube4}`} />
      <div className={`${styles.skCube} ${styles.skCube3}`} />
    </div>
  );
};

/**
 * BounceLoader Component
 */
export const BounceLoader: React.FC<LoaderProps> = ({ color }) => {
  const cssVariables: CSSVars = {
    "--color": color || "var(--color-primary)",
  };

  return (
    <div className={styles.bounce} style={cssVariables}>
      <div className={styles.bounce1} />
      <div className={styles.bounce2} />
      <div className={styles.bounce3} />
    </div>
  );
};

/**
 * PulseLoader Component
 */
export const PulseLoader: React.FC<LoaderProps> = ({ color }) => {
  const cssVariables: CSSVars = {
    "--color": color || "var(--color-primary)",
  };

  return (
    <div className={styles.pulse} style={cssVariables}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 100"
        className={styles.svg}
      >
        <polyline
          fill="none"
          strokeWidth="3"
          className={styles.polyline}
          points="2.4,58.7 70.8,58.7 76.1,46.2 81.1,58.7 89.9,58.7 93.8,66.5 102.8,22.7 110.6,78.7 115.3,58.7 126.4,58.7 134.4,54.7 142.4,58.7 197.8,58.7"
        />
      </svg>
    </div>
  );
};
