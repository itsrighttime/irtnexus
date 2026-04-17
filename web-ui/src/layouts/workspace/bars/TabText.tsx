import styles from "./TabText.module.css";

const TAB_LENGTH = 15;

export const TabText = ({
  text,
  onClick,
  color = "var(--color-primary)",
}: {
  text: string;
  onClick?: () => void;
  color?: string;
}) => {
  const text_ =
    text.length > TAB_LENGTH ? text.slice(0, TAB_LENGTH) + "..." : text;
  return (
    <button style={{ color }} className={styles.tabText} onClick={onClick}>
      {text_}
    </button>
  );
};
