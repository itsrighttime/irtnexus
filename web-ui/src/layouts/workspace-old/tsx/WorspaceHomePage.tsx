"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductLogo, IMAGE_ASSETS_KEYS as IAK } from "@/assets";
// @ts-ignore – CSS module types not yet generated
import styles from "../css/WorkspaceHomePage.module.css";
import { WorkspaceHomePageTabs } from "../helper/WorspaceHomePageTabs.js";
import { makeUrl } from "../helper/urlFormatter.js";
import { workspaceLayoutKeys } from "../helper/workspaceLayoutKeys.js";

const { LEVELS, ZONES, POSITIONS } = workspaceLayoutKeys;

interface WorkspaceHomePageProps {
  apps?: string[];
  toggleFullscreen: () => void;
}

export const WorkspaceHomePage: React.FC<WorkspaceHomePageProps> = ({
  apps = [],
  toggleFullscreen,
}) => {
  const navigate = useNavigate();
  const [productNotification, setProductNotification] = useState<
    Record<string, number | string | undefined>
  >({});

  const handleClick = (value: string) => {
    navigate(
      makeUrl(
        {
          level: LEVELS.primary,
          zone: ZONES.commandBar,
          position: POSITIONS.start,
          workspaceId: value,
          key: value,
        },
        true,
      ),
    );
  };

  return (
    <div className={styles.workspaceHomePage}>
      <WorkspaceHomePageTabs
        toggleFullscreen={toggleFullscreen}
        setProductNotification={setProductNotification}
      />

      <div className={styles.products}>
        {apps.map((value) => {
          const notification = productNotification[value];
          return (
            <div
              className={`${styles.product} ${
                notification ? styles.productNoti : ""
              }`}
              key={value}
              onClick={() => handleClick(value)}
            >
              {notification !== undefined && (
                <span className={styles.notification}>{notification}</span>
              )}
              <img
                className={styles.image}
                src={getProductLogo(value as any)}
                alt=""
              />
              <p className={styles.name}>{value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
