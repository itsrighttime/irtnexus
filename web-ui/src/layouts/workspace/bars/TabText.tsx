import styles from "./TabText.module.css";

const TAB_LENGTH = 15;

export const TabText = ({
  text,
  onClick,
  color = "var(--color-primary)",
  isActive = false,
}: {
  text: string;
  onClick?: () => void;
  color?: string;
  isActive: boolean;
}) => {
  const text_ =
    text.length > TAB_LENGTH ? text.slice(0, TAB_LENGTH) + "..." : text;

  return (
    <button
      style={{ color }}
      className={`${styles.tabText} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      {text_}
    </button>
  );
};
