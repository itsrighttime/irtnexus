import type{ ReactNode, CSSProperties } from "react";
import styles from "./IconError.module.css";

interface IconErrorProps {
  icon: ReactNode;
  message: string; // fixed typo from 'messgae'
  height?: string;
  width?: string;
  size?: number; // in rem units
}

export const IconError = ({
  icon,
  message,
  height = "100%",
  width = "100%",
  size = 2,
}: IconErrorProps) => {
  const cssVariable: CSSProperties = {
    "--iconSize": `${size}rem`,
    "--height": height,
    "--width": width,
  } as CSSProperties;

  return (
    <div className={styles.container} style={cssVariable}>
      {/* <IconButton icon={icon} size={size} /> */}
      <div className={styles.icon}>{icon}</div>
      <p>{message}</p>
    </div>
  );
};
