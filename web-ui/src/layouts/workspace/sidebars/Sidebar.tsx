import styles from "./Sidebar.module.css";

export const Sidebar = ({ position }: { position: string }) => {
  const side = (() => {
    if (!position) return "";

    if (position.startsWith("left")) return "right";
    if (position.startsWith("right")) return "left";

    return "";
  })();

  const props = {
    "data-border-side": side,
  };

  return (
    <div {...props} className={styles.sidebar}>
      Sidebar
    </div>
  );
};
