import { IconRender } from "./IconRender";
import { Icons } from "core-ui";
import styles from "../css/Sidebar.module.css";

const { LeftArrowIcon, RightArrowIcon } = Icons;

export const SidebarHeader = ({ collapsed, toggleCollapsed }) => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        {!collapsed && <span className={styles.logoText}>irt-dev</span>}
      </div>

      <button className={styles.collapseBtn} onClick={toggleCollapsed}>
        {collapsed ? (
          <IconRender icon={RightArrowIcon} />
        ) : (
          <IconRender icon={LeftArrowIcon} />
        )}
      </button>
    </div>
  );
};
