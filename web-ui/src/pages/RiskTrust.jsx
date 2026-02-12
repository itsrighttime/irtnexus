import React, { useState } from "react";
import {
  ShieldAlert,
  TrendingUp,
  MapPin,
  Smartphone,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import styles from "./RiskTrust.module.css";

export const RiskTrust = () => {
  // Mock Risk Data
  const riskScore = 15; // Low risk
  const riskLevel = "Low";

  // Mock Factors
  const factors = [
    {
      id: 1,
      name: "New Device Login",
      impact: "Medium",
      date: "2 hours ago",
      icon: Smartphone,
    },
    {
      id: 2,
      name: "Login from New Location",
      impact: "Low",
      date: "2 hours ago",
      icon: MapPin,
    },
  ];

  const recommendations = [
    {
      id: 1,
      title: "Enable Hardware Key MFA",
      desc: "Adding a YubiKey or similar device will significantly lower your risk score.",
      action: "Setup",
    },
    {
      id: 2,
      title: "Review Trusted Devices",
      desc: "You have 2 devices that haven't been used in 30 days.",
      action: "Review",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Risk & Trust</h1>
          <p className={styles.pageSubtitle}>
            Monitor your security posture and risk factors.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Score Card */}
        <Card className={styles.scoreCard}>
          <CardContent className={styles.scoreContent}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreValue}>{riskScore}</span>
              <span className={styles.scoreLabel}>RISK SCORE</span>
            </div>
            <div className={styles.scoreInfo}>
              <h2 className={styles.scoreTitle}>
                Your Risk Level is {riskLevel}
              </h2>
              <p className={styles.scoreDesc}>
                Great job! Your account security posture is strong. Keep
                reviewing activity to maintain this score.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card className={styles.factorsCard}>
          <CardHeader>
            <CardTitle>Contributing Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.factorsList}>
              {factors.map((factor) => (
                <div key={factor.id} className={styles.factorItem}>
                  <div className={styles.factorIcon}>
                    <factor.icon size={20} />
                  </div>
                  <div className={styles.factorInfo}>
                    <div className={styles.factorName}>{factor.name}</div>
                    <div className={styles.factorDate}>{factor.date}</div>
                  </div>
                  <Badge variant="warning">{factor.impact} Impact</Badge>
                </div>
              ))}
              {factors.length === 0 && (
                <p className={styles.emptyState}>
                  No active risk factors detected.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className={styles.recsCard}>
          <CardHeader>
            <CardTitle>Security Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.recsList}>
              {recommendations.map((rec) => (
                <div key={rec.id} className={styles.recItem}>
                  <div className={styles.recContent}>
                    <h4 className={styles.recTitle}>{rec.title}</h4>
                    <p className={styles.recDesc}>{rec.desc}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className={styles.recBtn}
                  >
                    {rec.action} <ArrowRight size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trust Signals */}
        <Card className={styles.trustCard}>
          <CardHeader>
            <CardTitle>Trust Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.signalsGrid}>
              <div className={styles.signalItem}>
                <span className={styles.signalLabel}>Device Trust</span>
                <span className={styles.signalValue}>High</span>
              </div>
              <div className={styles.signalItem}>
                <span className={styles.signalLabel}>Behavioral Trust</span>
                <span className={styles.signalValue}>High</span>
              </div>
              <div className={styles.signalItem}>
                <span className={styles.signalLabel}>Network Trust</span>
                <span className={styles.signalValue}>Medium</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
