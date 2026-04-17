"use client";

import { IconButton } from "@/atoms";
import styles from "./TabLabel.module.css";
import { Icons, type IconTypes } from "@/assets";
import type { TabIconItem, TabLabelProps, TabToken } from "./TabBar.types";

export const TabLabel = ({
  leftIcons,
  rightIcons,
  tokens,
  text,
  onClick,
  background = null,
  border = null,
}: TabLabelProps) => {
  return (
    <div
      className={styles.wrapper}
      onClick={onClick}
      style={
        {
          "--background": background ? background : "",
          "--border": border ? border : "none",
        } as React.CSSProperties
      }
    >
      {renderIcons(leftIcons)}

      <span className={styles.text}>{text}</span>

      {renderTokens(tokens)}

      {renderIcons(rightIcons)}
    </div>
  );
};

const renderIcons = (items?: TabIconItem[]) => {
  if (!items?.length) return null;

  return (
    <div className={styles.iconGroup}>
      {items.map((item, i) => {
        const iconNode = Icons[item.icon];

        // clickable → use IconButton
        if (item.clickable !== false && item.onClick) {
          return (
            <IconButton
              key={i}
              icon={iconNode}
              onClick={(e) => {
                e?.stopPropagation?.();
                item.onClick?.();
              }}
              color={item.color}
              label={item.label}
              disabled={item.disabled}
              size={1.3}
            />
          );
        }

        // static icon
        return (
          <span key={i} className={styles.icon} style={{ color: item.color }}>
            {iconNode}
          </span>
        );
      })}
    </div>
  );
};

const renderTokens = (tokens?: TabToken[]) => {
  if (!tokens?.length) return null;

  return (
    <div className={styles.tokens}>
      {tokens.map((t, i) => (
        <span
          key={i}
          className={styles.token}
          style={{
            color: t.color,
            background: t.background,
          }}
        >
          {t.text}
        </span>
      ))}
    </div>
  );
};
