import React, { useState } from "react";
import { GitCommit, Search, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/Table";
import styles from "./Transparency.module.css";

export const Transparency = () => {
  const [decisions] = useState([
    {
      id: "d1",
      event: "Access Request: AWS Prod",
      policy: "Policy-A1",
      outcome: "Approved",
      time: "10 mins ago",
      reason: "User in Admin Group",
    },
    {
      id: "d2",
      event: "Login: Unrecognized Device",
      policy: "Policy-Security-High",
      outcome: "Challenged",
      time: "1 hour ago",
      reason: "New device detected",
    },
    {
      id: "d3",
      event: "Data Export: Customer List",
      policy: "Policy-DLP-Strict",
      outcome: "Denied",
      time: "Yesterday",
      reason: "Export limit exceeded",
    },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Transparency & Decisions</h1>
          <p className={styles.pageSubtitle}>
            Understand why access decisions were made.
          </p>
        </div>
      </div>

      <Card className={styles.decisionsCard}>
        <CardHeader>
          <CardTitle>Decision Log</CardTitle>
        </CardHeader>
        <CardContent className={styles.tableContent}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Applied Policy</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Reasoning</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {decisions.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className={styles.eventCell}>
                      <GitCommit size={16} className={styles.icon} />
                      {d.event}
                    </div>
                  </TableCell>
                  <TableCell>{d.policy}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        d.outcome === "Approved"
                          ? "success"
                          : d.outcome === "Denied"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {d.outcome}
                    </Badge>
                  </TableCell>
                  <TableCell>{d.reason}</TableCell>
                  <TableCell>{d.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className={styles.explainerSection}>
        <h3>How Decisions Are Made</h3>
        <div className={styles.graphPlaceholder}>
          <div className={styles.node}>User Request</div>
          <div className={styles.arrow}>→</div>
          <div className={styles.node}>Policy Engine</div>
          <div className={styles.arrow}>→</div>
          <div className={styles.node}>Risk Analysis</div>
          <div className={styles.arrow}>→</div>
          <div className={`${styles.node} ${styles.final}`}>Decision</div>
        </div>
      </div>
    </div>
  );
};
