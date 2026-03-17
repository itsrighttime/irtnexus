"use client";

import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import { SecondaryLoading } from "./SecondaryLoading";
import styles from "./Loading.module.css";

// Define loader prop type
interface LoaderProps {
  color?: string;
}

// Lazy-loaded components with typing
const CubesLoader = lazy<React.ComponentType<LoaderProps>>(() =>
  import("./LoadingStyle").then((module) => ({
    default: module.CubesLoader,
  })),
);

const FoldingLoader = lazy<React.ComponentType<LoaderProps>>(() =>
  import("./LoadingStyle").then((module) => ({
    default: module.FoldingLoader,
  })),
);

const BounceLoader = lazy<React.ComponentType<LoaderProps>>(() =>
  import("./LoadingStyle").then((module) => ({
    default: module.BounceLoader,
  })),
);

const PulseLoader = lazy<React.ComponentType<LoaderProps>>(() =>
  import("./LoadingStyle").then((module) => ({
    default: module.PulseLoader,
  })),
);

const LoadingChat = lazy<React.ComponentType<LoaderProps>>(() =>
  import("./LoadingChat").then((module) => ({
    default: module.LoadingChat,
  })),
);

// Types for props
type LoaderType =
  | "CubesLoader"
  | "FoldingLoader"
  | "BounceLoader"
  | "PulseLoader"
  | "LoadingChat";

type DisplayType = "top" | "center";
type PositionType = "relative" | "absolute";

interface LoadingProps {
  type?: LoaderType;
  display?: DisplayType;
  position?: PositionType;
  windowHeight?: string;
  windowWidth?: string;
  color?: string;
  showText?: boolean;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  type = "CubesLoader",
  display = "top",
  position = "relative",
  windowHeight = "100%",
  windowWidth = "100%",
  color,
  showText = false,
  text = "Loading",
}) => {
  const [loadingText, setLoadingText] = useState<string>("");

  useEffect(() => {
    const dots = ["", ".", "..", "..."];
    let index = 0;

    const intervalId = setInterval(() => {
      setLoadingText(dots[index]);
      index = (index + 1) % dots.length;
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  let LoaderComponent: React.ReactNode;

  switch (type) {
    case "CubesLoader":
      LoaderComponent = <CubesLoader color={color} />;
      break;
    case "FoldingLoader":
      LoaderComponent = <FoldingLoader color={color} />;
      break;
    case "BounceLoader":
      LoaderComponent = <BounceLoader color={color} />;
      break;
    case "PulseLoader":
      LoaderComponent = <PulseLoader color={color} />;
      break;
    case "LoadingChat":
      LoaderComponent = <LoadingChat color={color} />;
      break;
    default:
      LoaderComponent = <CubesLoader color={color} />;
  }

  const loadingStyle =
    display === "top" ? `${styles.loading} ${styles.top}` : styles.loading;

  const positionStyle: CSSProperties =
    display === "top" && position === "relative"
      ? { position: "relative" }
      : { position: "absolute" };

  const cssVariables: CSSProperties = {
    ["--color" as any]: color || "var(--color-primary)",
  };

  return (
    <div
      style={{
        height: windowHeight,
        width: windowWidth,
        ...positionStyle,
        ...cssVariables,
      }}
      className={loadingStyle}
    >
      <Suspense fallback={<SecondaryLoading />}>
        {LoaderComponent}
        {showText && (
          <div className={styles.loadingTextWrapper}>
            <p className={styles.text}>{text}</p>
            <p className={styles.loadingText}>{loadingText}</p>
          </div>
        )}
      </Suspense>
    </div>
  );
};
