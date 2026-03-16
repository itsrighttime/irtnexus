import React, { useState } from "react";
import {
  Smartphone,
  Laptop,
  Monitor,
  Shield,
  Trash2,
  CheckCircle,
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
import styles from "./DevicesTrust.module.css";

export const DevicesTrust = () => {
  const [devices] = useState([
    {
      id: "d1",
      name: "MacBook Pro",
      type: "Laptop",
      os: "macOS 14.2",
      lastSeen: "Just now",
      status: "Trusted",
    },
    {
      id: "d2",
      name: "iPhone 15",
      type: "Mobile",
      os: "iOS 17.3",
      lastSeen: "2 hours ago",
      status: "Trusted",
    },
    {
      id: "d3",
      name: "Windows Workstation",
      type: "Desktop",
      os: "Windows 11",
      lastSeen: "5 days ago",
      status: "Monitoring",
    },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Devices & Trust</h1>
          <p className={styles.pageSubtitle}>
            Manage your trusted devices and security endpoints.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        <Card className={styles.mainCard}>
          <CardHeader>
            <CardTitle>Trusted Devices</CardTitle>
          </CardHeader>
          <CardContent className={styles.tableContent}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>OS Version</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Trust Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className={styles.deviceName}>
                        {device.type === "Mobile" ? (
                          <Smartphone size={16} />
                        ) : device.type === "Laptop" ? (
                          <Laptop size={16} />
                        ) : (
                          <Monitor size={16} />
                        )}
                        {device.name}
                      </div>
                    </TableCell>
                    <TableCell>{device.type}</TableCell>
                    <TableCell>{device.os}</TableCell>
                    <TableCell>{device.lastSeen}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          device.status === "Trusted" ? "success" : "warning"
                        }
                      >
                        {device.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={styles.revokeBtn}
                      >
                        <Trash2 size={14} /> Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className={styles.policyCard}>
          <CardHeader>
            <CardTitle>Device Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.policyList}>
              <div className={styles.policyItem}>
                <div className={styles.policyIcon}>
                  <Shield size={20} />
                </div>
                <div className={styles.policyInfo}>
                  <h4>Encryption Required</h4>
                  <p>All devices must have disk encryption enabled.</p>
                </div>
                <CheckCircle size={20} className={styles.check} />
              </div>
              <div className={styles.policyItem}>
                <div className={styles.policyIcon}>
                  <Shield size={20} />
                </div>
                <div className={styles.policyInfo}>
                  <h4>OS Updates</h4>
                  <p>Devices must be on the latest OS version.</p>
                </div>
                <CheckCircle size={20} className={styles.check} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
