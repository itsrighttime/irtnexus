import { IconRender } from "./IconRender";
import { Icons } from "core-ui";
import styles from "../css/Sidebar.module.css";

const { arrowLeftIcon, arrowRightIcon } = Icons;

export const SidebarHeader = ({ collapsed, toggleCollapsed }) => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        {!collapsed && <span className={styles.logoText}>irtnexus</span>}
      </div>

      <button className={styles.collapseBtn} onClick={toggleCollapsed}>
        {collapsed ? (
          <IconRender icon={arrowRightIcon} />
        ) : (
          <IconRender icon={arrowLeftIcon} />
        )}
      </button>
    </div>
  );
};
