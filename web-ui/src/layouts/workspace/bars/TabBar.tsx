"use client";

import styles from "./TabBar.module.css";
import { TabText } from "./TabText";
import { TabIcon } from "./TabIcon";
import { TabDropdown } from "./TabDropdown";
import type { onActionType, TabBarConfig, TabConfig } from "./TabBar.types";
import { TabLabel } from "./TabLabel";
import { TAB_TYPE, TAB_ORIENTATION } from "../const";

type Props = {
  config: TabBarConfig;
  onAction?: onActionType;
};

export const TabBar = ({ config, onAction }: Props) => {
  const {
    orientation = TAB_ORIENTATION.HORIZONTAL,
    position,
    start,
    center,
    end,
  } = config;

  const side = (() => {
    if (!position) return "";
    if (position.startsWith("top")) return "bottom";
    if (position.startsWith("bottom")) return "top";
    if (position.startsWith("left")) return "right";
    if (position.startsWith("right")) return "left";
    return "";
  })();

  const isActive = (route?: string) => {
    if (!route) return false;

    return location.pathname.includes(route);
  };

  const props = {
    "data-border-side": side,
  };

  /**
   * Unified action handler
   */
  const handleAction = (tab: any, extraKey?: string | number) => {
    // priority: route > key > click fallback

    if (tab.route) {
      onAction?.({ route: tab.route });
      return;
    }

    if (extraKey !== undefined) {
      onAction?.({ key: extraKey });
      return;
    }

    tab.onClick?.();
  };

  const renderTab = (tab: TabConfig) => {
    switch (tab.type) {
      case TAB_TYPE.TEXT:
        return (
          <TabText
            key={tab.id}
            text={tab.text}
            onClick={() => handleAction(tab)}
            isActive={isActive(tab.route)}
          />
        );

      case TAB_TYPE.LABEL:
        return (
          <TabLabel
            key={tab.id}
            text={tab.text}
            leftIcons={tab.leftIcons}
            rightIcons={tab.rightIcons}
            tokens={tab.tokens}
            background={tab.background}
            border={tab.border}
            onClick={() => handleAction(tab)}
          />
        );

      case TAB_TYPE.ICON:
        return (
          <TabIcon
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            onClick={() => handleAction(tab)}
            isActive={isActive(tab.route)}
          />
        );

      case TAB_TYPE.DROPDOWN:
        return (
          <TabDropdown
            key={tab.id}
            trigger={
              tab.trigger.type === TAB_TYPE.TEXT ? (
                <TabText
                  text={tab.trigger.text || ""}
                  isActive={isActive(tab.route)}
                />
              ) : (
                <TabIcon
                  icon={tab.trigger.icon!}
                  isActive={isActive(tab.route)}
                />
              )
            }
            items={tab.items}
            onSelect={(key) => {
              const item = tab.items.find((i) => i.key === key);

              if (item?.route) {
                onAction?.({ route: item.route });
                return;
              }

              handleAction(tab, key);
            }}
          />
        );

      case TAB_TYPE.CUSTOM:
        return <div key={tab.id}>{tab.render()}</div>;

      default:
        return null;
    }
  };

  const renderSection = (tabs?: TabConfig[], className?: string) => {
    if (!tabs?.length) return <div />;

    return (
      <div className={`${styles.section} ${className}`}>
        {tabs.map(renderTab)}
      </div>
    );
  };

  return (
    <div
      className={`${styles.bar} ${
        orientation === TAB_ORIENTATION.HORIZONTAL
          ? styles.horizontal
          : styles.vertical
      }`}
      {...props}
    >
      {renderSection(start, styles.start)}
      {renderSection(center, styles.center)}
      {renderSection(end, styles.end)}
    </div>
  );
};
