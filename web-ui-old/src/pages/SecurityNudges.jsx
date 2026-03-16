import React, { useState } from "react";
import { Bell, ArrowRight, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import styles from "./SecurityNudges.module.css";

export const SecurityNudges = () => {
  const [nudges, setNudges] = useState([
    {
      id: "n1",
      title: "Suspicious Login Attempt",
      desc: "We blocked a login attempt from Indonesia (IP: 102.33...).",
      type: "critical",
      time: "2 hours ago",
    },
    {
      id: "n2",
      title: "Update Your Backup Email",
      desc: "Your backup email has not been verified yet.",
      type: "warning",
      time: "1 day ago",
    },
    {
      id: "n3",
      title: "New Feature: Passkeys",
      desc: "You can now use Passkeys for passwordless login.",
      type: "info",
      time: "3 days ago",
    },
  ]);

  const handleDismiss = (id) => {
    setNudges((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Security Nudges</h1>
          <p className={styles.pageSubtitle}>
            Real-time alerts and security recommendations.
          </p>
        </div>
      </div>

      <div className={styles.updatesContainer}>
        {nudges.map((nudge) => (
          <Card key={nudge.id} className={styles.nudgeCard}>
            <div
              className={`${styles.nudgeStripe} ${styles[nudge.type]}`}
            ></div>
            <div className={styles.nudgeContent}>
              <div className={styles.nudgeHeader}>
                <div className={styles.titleWrapper}>
                  <Bell
                    size={18}
                    className={`${styles.icon} ${styles[nudge.type]}`}
                  />
                  <h3 className={styles.nudgeTitle}>{nudge.title}</h3>
                  {nudge.type === "critical" && (
                    <Badge variant="danger">Critical</Badge>
                  )}
                </div>
                <span className={styles.time}>{nudge.time}</span>
              </div>
              <p className={styles.nudgeDesc}>{nudge.desc}</p>
              <div className={styles.nudgeActions}>
                <Button
                  size="sm"
                  variant={nudge.type === "critical" ? "danger" : "primary"}
                >
                  Take Action <ArrowRight size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDismiss(nudge.id)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {nudges.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Bell size={48} />
            </div>
            <h3>All caught up!</h3>
            <p>You have no new security notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};
