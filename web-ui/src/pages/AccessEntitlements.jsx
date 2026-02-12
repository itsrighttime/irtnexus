import React, { useState } from "react";
import { Key, Lock, Clock, Plus, ChevronRight } from "lucide-react";
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
import styles from "./AccessEntitlements.module.css";

export const AccessEntitlements = () => {
  const [entitlements] = useState([
    {
      id: "e1",
      resource: "AWS Production",
      type: "Infrastructure",
      role: "Viewer",
      since: "2023-01-15",
      status: "Active",
    },
    {
      id: "e2",
      resource: "Salesforce",
      type: "SaaS",
      role: "Standard User",
      since: "2023-03-10",
      status: "Active",
    },
    {
      id: "e3",
      resource: "GitHub: Backend Repo",
      type: "Code",
      role: "Contributor",
      since: "2023-06-20",
      status: "Active",
    },
  ]);

  const [requests] = useState([
    {
      id: "r1",
      resource: "Jira Admin",
      status: "Pending",
      requested: "2 days ago",
    },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Access & Entitlements</h1>
          <p className={styles.pageSubtitle}>
            Review your access and request new permissions.
          </p>
        </div>
        <Button>
          <Plus size={16} /> Request Access
        </Button>
      </div>

      <div className={styles.grid}>
        <Card className={styles.mainCard}>
          <CardHeader>
            <CardTitle>My Access</CardTitle>
          </CardHeader>
          <CardContent className={styles.tableContent}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Granted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entitlements.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className={styles.resourceName}>
                        <Key size={16} className={styles.icon} />
                        {item.resource}
                      </div>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <Badge variant="info">{item.role}</Badge>
                    </TableCell>
                    <TableCell>{item.since}</TableCell>
                    <TableCell>
                      <Badge variant="success">{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className={styles.sideCard}>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.requestList}>
              {requests.map((req) => (
                <div key={req.id} className={styles.requestItem}>
                  <div className={styles.requestInfo}>
                    <div className={styles.requestTitle}>{req.resource}</div>
                    <div className={styles.requestMeta}>
                      <Clock size={14} /> {req.requested}
                    </div>
                  </div>
                  <Badge variant="warning">{req.status}</Badge>
                </div>
              ))}
              {requests.length === 0 && (
                <p className={styles.empty}>No pending requests.</p>
              )}
            </div>
            <div className={styles.quickActions}>
              <h4 className={styles.quickTitle}>Quick Actions</h4>
              <Button variant="secondary" className={styles.quickBtn}>
                View Access Policy <ChevronRight size={16} />
              </Button>
              <Button variant="secondary" className={styles.quickBtn}>
                Report Access Issue <ChevronRight size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
