"use client";

import type { SidebarTab } from "../bars";
import styles from "./Sidebar.module.css";
import { TabLabel } from "../bars/TabLabel";
import type { onActionType } from "../bars/TabBar.types";

type Props = {
  config: SidebarTab[];
  position: string;
  onAction?: onActionType;
};

export const Sidebar = ({ config, position, onAction }: Props) => {
  const side = (() => {
    if (!position) return "";
    if (position.startsWith("left")) return "right";
    if (position.startsWith("right")) return "left";
    return "";
  })();

  const handleAction = (tab: SidebarTab) => {
    if (tab.route) {
      onAction?.({ route: tab.route });
      return;
    }

    tab.onClick?.();
  };

  const renderItem = (item: SidebarTab) => {
    return (
      <div
        key={item.id}
        className={styles.sidebarItems}
        onClick={() => handleAction(item)}
      >
        <TabLabel
          text={item.text}
          leftIcons={item.leftIcons}
          rightIcons={item.rightIcons}
          tokens={item.tokens}
          background={item.background || "var(--color-gray2)"}
          border={item.border}
        />
      </div>
    );
  };

  return (
    <div className={styles.sidebar} data-border-side={side}>
      {config?.map(renderItem)}
    </div>
  );
};
