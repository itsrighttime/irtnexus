"use client";

import { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { TabLabel } from "../bars/TabLabel";
import type {
  onActionType,
  SidebarGroup,
  SidebarItem,
  SidebarTab,
} from "../bars/TabBar.types";
import { TAB_TYPE } from "../const";
import { IconButton } from "@/atoms";
import { Icons } from "@/assets";

type Props = {
  config: SidebarItem[];
  position: string;
  onAction?: onActionType;
};

const TAB = 8;
const BASE_TAB = 4;

export const Sidebar = ({ config, position, onAction }: Props) => {
  const location = useLocation();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    config.forEach((item) => {
      if (item.type === TAB_TYPE.GROUP) {
        initial[item.id] = item.defaultOpen ?? false;
      }
    });
    return initial;
  });

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAction = (tab: SidebarTab) => {
    if (tab.route) {
      onAction?.({ route: tab.route });
      return;
    }
    tab.onClick?.();
  };

  const isActive = (route?: string) => {
    if (!route) return false;

    return location.pathname.includes(route);
  };

  const isGroupActive = (group: SidebarGroup): boolean => {
    return group.children.some((child) => {
      if (child.type === TAB_TYPE.GROUP) {
        return isGroupActive(child);
      }

      return isActive(child.route);
    });
  };

  const renderTab = (item: SidebarTab, depth = 0) => {
    const active = isActive(item.route);

    return (
      <div
        key={item.id}
        className={`${styles.item} ${active ? styles.active : ""}`}
        style={{ marginLeft: BASE_TAB + depth * TAB }}
        onClick={() => handleAction(item)}
      >
        <TabLabel
          text={item.text}
          leftIcons={item.leftIcons}
          rightIcons={item.rightIcons}
          tokens={item.tokens}
          background={active ? "var(--color-gray2)" : ""}
          border={item.border}
        />
      </div>
    );
  };

  const renderGroup = (group: SidebarGroup, depth = 0) => {
    const isOpen = openGroups[group.id];
    const hasActiveChild = isGroupActive(group);

    const highlightGroup = hasActiveChild && !isOpen;

    return (
      <div key={group.id} className={styles.group}>
        {/* GROUP HEADER */}
        <div
          className={`${styles.groupHeader} ${
            highlightGroup ? styles.groupActive : ""
          }`}
          style={{ paddingLeft: BASE_TAB + depth * TAB }}
          onClick={() => group.collapsible !== false && toggleGroup(group.id)}
        >
          <span>{group.title}</span>
          <span>
            <IconButton
              icon={isOpen ? Icons.arrowDownIcon : Icons.arrowRightIcon}
              color="var(--color-text)"
              size={0.8}
            />
          </span>
        </div>

        {/* CHILDREN */}
        {isOpen && (
          <div className={styles.groupChildren}>
            {group.children.map((child) =>
              child.type === TAB_TYPE.GROUP
                ? renderGroup(child, depth + 1)
                : renderTab(child, depth + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  const renderItem = (item: SidebarItem) => {
    if (item.type === TAB_TYPE.GROUP) return renderGroup(item);
    return renderTab(item);
  };

  const side = position.startsWith("left")
    ? "right"
    : position.startsWith("right")
      ? "left"
      : "";

  return (
    <div className={styles.sidebar} data-border-side={side}>
      {config?.map(renderItem)}
    </div>
  );
};
