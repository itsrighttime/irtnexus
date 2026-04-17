"use client";

import styles from "./TabBar.module.css";
import { TabText } from "./TabText";
import { TabIcon } from "./TabIcon";
import { TabDropdown } from "./TabDropdown";
import type { TabBarConfig, TabConfig } from "./TabBar.types";

type Props = {
  config: TabBarConfig;
};

export const TabBar = ({ config }: Props) => {
  const { orientation = "horizontal", start, center, end } = config;

  const renderTab = (tab: TabConfig) => {
    switch (tab.type) {
      case "text":
        return <TabText key={tab.id} text={tab.text} onClick={tab.onClick} />;

      case "icon":
        return (
          <TabIcon
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            onClick={tab.onClick}
          />
        );

      case "dropdown":
        return (
          <TabDropdown
            key={tab.id}
            trigger={
              tab.trigger.type === "text" ? (
                <TabText text={tab.trigger.text || ""} />
              ) : (
                <TabIcon icon={tab.trigger.icon!} />
              )
            }
            items={tab.items}
            onSelect={tab.onSelect}
          />
        );

      case "custom":
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
        orientation === "horizontal" ? styles.horizontal : styles.vertical
      }`}
    >
      {renderSection(start, styles.start)}
      {renderSection(center, styles.center)}
      {renderSection(end, styles.end)}
    </div>
  );
};
