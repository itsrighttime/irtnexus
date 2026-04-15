"use client";

import { Icons } from "@/assets/icons"; // no need for .jsx extension
import styles from "./css/IconGallery.module.css";
import type { FC } from "react";
import { Button } from "@/atoms";

export const TestIconGallery: FC = () => {
  const copyToClipboard = (name: string): void => {
    navigator.clipboard.writeText(name);
    alert(`Copied to clipboard: "${name}"`);
  };

  return (
    <div className={styles.iconGrid}>
      {Object.entries(Icons).map(([name, icon]) => {
        return (
          <div
            key={name}
            onClick={() => copyToClipboard(name)}
            className={styles.iconCard}
          >
            <Button variant="ghost" size="large" iconOnly iconLeft={icon} />
          </div>
        );
      })}
    </div>
  );
};
