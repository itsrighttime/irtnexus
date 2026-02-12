import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Shield,
} from "lucide-react";
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
import styles from "./ConsentCompliance.module.css";

export const ConsentCompliance = () => {
  const [consents] = useState([
    {
      id: "c1",
      app: "Slack Integration",
      scope: "Read User Profile, Read Channels",
      granted: "2023-09-01",
      status: "Active",
      expires: "Never",
    },
    {
      id: "c2",
      app: "Jira Connector",
      scope: "Create Issues",
      granted: "2023-10-15",
      status: "Active",
      expires: "2024-10-15",
    },
    {
      id: "c3",
      app: "Test App Beta",
      scope: "Full Access",
      granted: "2023-11-20",
      status: "Revoked",
      expires: "-",
    },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Consent & Compliance</h1>
          <p className={styles.pageSubtitle}>
            Review application permissions and compliance reports.
          </p>
        </div>
        <Button variant="secondary">
          <ExternalLink size={16} /> Export Report
        </Button>
      </div>

      <div className={styles.grid}>
        {/* Consents List */}
        <Card className={styles.consentsCard}>
          <CardHeader>
            <CardTitle>Application Consents</CardTitle>
          </CardHeader>
          <CardContent className={styles.tableContent}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Granted Date</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consents.map((consent) => (
                  <TableRow key={consent.id}>
                    <TableCell>
                      <div className={styles.appName}>
                        <div className={styles.appIcon}>
                          {consent.app.charAt(0)}
                        </div>
                        {consent.app}
                      </div>
                    </TableCell>
                    <TableCell>{consent.scope}</TableCell>
                    <TableCell>{consent.granted}</TableCell>
                    <TableCell>{consent.expires}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          consent.status === "Active" ? "success" : "default"
                        }
                      >
                        {consent.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {consent.status === "Active" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className={styles.revokeBtn}
                        >
                          Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card className={styles.complianceCard}>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.complianceList}>
              <div className={styles.complianceItem}>
                <div className={styles.complianceIcon}>
                  <Shield size={20} />
                </div>
                <div className={styles.complianceInfo}>
                  <div className={styles.complianceTitle}>SOC2 Type II</div>
                  <div className={styles.complianceDesc}>
                    Compliant • Last audited Oct 2023
                  </div>
                </div>
                <CheckCircle size={20} className={styles.checkSuccess} />
              </div>
              <div className={styles.complianceItem}>
                <div className={styles.complianceIcon}>
                  <Shield size={20} />
                </div>
                <div className={styles.complianceInfo}>
                  <div className={styles.complianceTitle}>
                    GDPR Data Processing
                  </div>
                  <div className={styles.complianceDesc}>
                    Compliant • DPA Signed
                  </div>
                </div>
                <CheckCircle size={20} className={styles.checkSuccess} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
