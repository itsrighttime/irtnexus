import React, { useState } from "react";
import { Calendar, UserCheck, RefreshCw, Power } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import styles from "./Lifecycle.module.css";

export const Lifecycle = () => {
  const steps = [
    {
      id: 1,
      title: "Account Created",
      date: "Jan 15, 2023",
      status: "completed",
      desc: "Identity established",
    },
    {
      id: 2,
      title: "Onboarding",
      date: "Jan 16, 2023",
      status: "completed",
      desc: "Initial setup & training",
    },
    {
      id: 3,
      title: "Probation End",
      date: "Apr 15, 2023",
      status: "completed",
      desc: "Full access granted",
    },
    {
      id: 4,
      title: "Annual Review",
      date: "Jan 15, 2024",
      status: "current",
      desc: "Access re-certification pending",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Identity Lifecycle</h1>
          <p className={styles.pageSubtitle}>
            Track your identity stages and account status.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent className={styles.statusContent}>
            <div className={styles.statusBadge}>
              <UserCheck size={32} />
              <span className={styles.statusText}>Active</span>
            </div>
            <div className={styles.statusDetails}>
              <p>
                <strong>Joined:</strong> Jan 15, 2023
              </p>
              <p>
                <strong>Next Review:</strong> Jan 15, 2024
              </p>
              <p>
                <strong>Manager:</strong> Sarah Connor
              </p>
            </div>
            <div className={styles.statusActions}>
              <Button variant="secondary">
                <RefreshCw size={16} /> Renew Access
              </Button>
              <Button variant="danger" variantType="outline">
                <Power size={16} /> Request Suspension
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.timelineCard}>
          <CardHeader>
            <CardTitle>Lifecycle Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.timeline}>
              {steps.map((step, index) => (
                <div key={step.id} className={styles.timelineItem}>
                  <div className={styles.timelineMarker}>
                    <div
                      className={`${styles.dot} ${step.status === "completed" ? styles.dotCompleted : step.status === "current" ? styles.dotCurrent : ""}`}
                    ></div>
                    {index !== steps.length - 1 && (
                      <div className={styles.line}></div>
                    )}
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.stepHeader}>
                      <h4 className={styles.stepTitle}>{step.title}</h4>
                      <span className={styles.stepDate}>{step.date}</span>
                    </div>
                    <p className={styles.stepDesc}>{step.desc}</p>
                    {step.status === "current" && (
                      <Badge variant="warning" className={styles.currentBadge}>
                        Current Stage
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
