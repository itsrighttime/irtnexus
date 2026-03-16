import React, { useState } from "react";
import { Filter, Download, Activity as ActivityIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/Table";
import styles from "./Activity.module.css";

export const Activity = () => {
  const [logs] = useState([
    {
      id: "l1",
      action: "User Login",
      actor: "Alex Johnson",
      target: "Portal",
      result: "Success",
      time: "10 mins ago",
    },
    {
      id: "l2",
      action: "Switch Tenant",
      actor: "Alex Johnson",
      target: "Acme Corp",
      result: "Success",
      time: "1 hour ago",
    },
    {
      id: "l3",
      action: "Update Profile",
      actor: "Alex Johnson",
      target: "User: Alex",
      result: "Success",
      time: "1 hour ago",
    },
    {
      id: "l4",
      action: "Access Resource",
      actor: "System",
      target: "Vault: ID-992",
      result: "Denied",
      time: "3 hours ago",
    },
    {
      id: "l5",
      action: "API Key Created",
      actor: "Alex Johnson",
      target: "API: Test",
      result: "Success",
      time: "1 day ago",
    },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Activity & Decisions</h1>
          <p className={styles.pageSubtitle}>
            Audit logs and automated decision history.
          </p>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary">
            <Filter size={16} /> Filter
          </Button>
          <Button variant="secondary">
            <Download size={16} /> Export
          </Button>
        </div>
      </div>

      <Card className={styles.logsCard}>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className={styles.tableContent}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className={styles.actionCell}>
                      <ActivityIcon size={16} className={styles.actionIcon} />
                      {log.action}
                    </div>
                  </TableCell>
                  <TableCell>{log.actor}</TableCell>
                  <TableCell>{log.target}</TableCell>
                  <TableCell>
                    <Badge
                      variant={log.result === "Success" ? "success" : "danger"}
                    >
                      {log.result}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.time}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
