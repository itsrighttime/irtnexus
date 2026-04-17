"use client";

import styles from "./TabBar.module.css";
import { TabText } from "./TabText";
import { TabIcon } from "./TabIcon";
import { TabDropdown } from "./TabDropdown";
import type { TabBarConfig, TabConfig } from "./TabBar.types";
import { TabLabel } from "./TabLabel";
import { TAB_TYPE, TAB_ORIENTATION } from "../const";

type Props = {
  config: TabBarConfig;
};

export const TabBar = ({ config }: Props) => {
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

  const props = {
    "data-border-side": side,
  };

  const renderTab = (tab: TabConfig) => {
    switch (tab.type) {
      case TAB_TYPE.TEXT:
        return <TabText key={tab.id} text={tab.text} onClick={tab.onClick} />;

      case TAB_TYPE.LABEL:
        return (
          <TabLabel
            key={tab.id}
            text={tab.text}
            leftIcons={tab.leftIcons}
            rightIcons={tab.rightIcons}
            tokens={tab.tokens}
            onClick={tab.onClick}
            background={tab.background}
            border={tab.border}
          />
        );

      case TAB_TYPE.ICON:
        return (
          <TabIcon
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            onClick={tab.onClick}
          />
        );

      case TAB_TYPE.DROPDOWN:
        return (
          <TabDropdown
            key={tab.id}
            trigger={
              tab.trigger.type === TAB_TYPE.TEXT ? (
                <TabText text={tab.trigger.text || ""} />
              ) : (
                <TabIcon icon={tab.trigger.icon!} />
              )
            }
            items={tab.items}
            onSelect={tab.onSelect}
          />
        );

      case TAB_TYPE.CUSTOM:
        return <div key={tab.id}>{tab.render()}</div>;

      default:
        return null;
    }
  };

  const renderSection = (tabs?: TabConfig[], className?: string) => {
    if (!tabs?.length) return <div></div>;

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
