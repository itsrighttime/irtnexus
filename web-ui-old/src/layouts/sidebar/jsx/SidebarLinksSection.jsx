import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { sidebarIconMap } from "core-ui";
import { IconRender } from "./IconRender";
import styles from "../css/Sidebar.module.css";

export const SidebarLinksSection = ({ section, collapsed }) => {
  return (
    <div className={styles.category}>
      {!collapsed && <h3 className={styles.categoryTitle}>{section.label}</h3>}

      {section.children.map((item) => {
        const Icon = sidebarIconMap[item.key];

        return (
          <NavLink
            key={item.key}
            to={item.route}
            className={({ isActive }) =>
              clsx(styles.navItem, isActive && styles.active)
            }
          >
            {Icon && <IconRender icon={Icon} />}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        );
      })}
    </div>
  );
};
