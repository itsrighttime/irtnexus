import React, { useState } from "react";
import clsx from "clsx";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarLinksSection } from "./SidebarLinksSection";
import { useSidebar } from "core-ui";
import styles from "../css/Sidebar.module.css";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { data, loading, error } = useSidebar();

  const toggleCollapsed = () => setCollapsed((c) => !c);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading sidebar</div>;

  return (
    <aside className={clsx(styles.sidebar, collapsed && styles.collapsed)}>
      {/* Header */}
      <SidebarHeader collapsed={collapsed} toggleCollapsed={toggleCollapsed} />

      {/* Top navigation */}
      <div className={styles.navContainer}>
        {data.map((section) => (
          <SidebarLinksSection
            key={section.key}
            section={section}
            collapsed={collapsed}
          />
        ))}
      </div>
    </aside>
  );
};
