import styles from "../css/Icon.module.css";
import { MyEssentials } from "#widgets";

const { Tooltip } = MyEssentials;

export const IconButton = ({
  svg, // plain SVG string or JSX
  size = 24,
  color = "currentColor",
  onClick,
  className = "",
  title = "",
  disabled = false,
  tooltipDelay = 500,
}) => {
  const isClickable = !!onClick && !disabled;

  return (
    <Tooltip
      content={title}
      delay={tooltipDelay}
      color="#fff"
      backgroundColor={color}
    >
      <span
        className={`${styles.iconWrapper} ${className}`}
        style={{
          ["--icon-size"]: `${size}px`,
          ["--icon-color"]: color,
          cursor: isClickable ? "pointer" : "default",
          opacity: disabled ? 0.5 : 1,
        }}
        onClick={isClickable ? onClick : undefined}
        role={isClickable ? "button" : "img"}
        aria-label={title}
      >
        <span className={styles.icon}> {svg} </span>
      </span>
    </Tooltip>
  );
};
