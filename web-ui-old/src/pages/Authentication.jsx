import React, { useState } from "react";
import {
  Shield,
  Smartphone,
  Key,
  Globe,
  LogOut,
  Plus,
  Trash2,
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
import styles from "./Authentication.module.css";

export const Authentication = () => {
  // Local mock state for this page specific data
  const [mfaMethods, setMfaMethods] = useState([
    {
      id: 1,
      type: "Authenticator App",
      name: "Google Authenticator",
      added: "2023-10-15",
      lastUsed: "2 hours ago",
      status: "Active",
    },
    {
      id: 2,
      type: "SMS Recovery",
      name: "+1 ***-***-9988",
      added: "2023-01-20",
      lastUsed: "1 week ago",
      status: "Active",
    },
  ]);

  const [sessions, setSessions] = useState([
    {
      id: "s1",
      device: "Chrome on Windows",
      ip: "192.168.1.1",
      location: "New York, US",
      lastActive: "Current Session",
      current: true,
    },
    {
      id: "s2",
      device: "Safari on iPhone",
      ip: "10.0.0.5",
      location: "New York, US",
      lastActive: "2 days ago",
      current: false,
    },
    {
      id: "s3",
      device: "Firefox on MacOS",
      ip: "172.16.0.2",
      location: "London, UK",
      lastActive: "5 days ago",
      current: false,
    },
  ]);

  const handleRevokeSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDeleteMFA = (id) => {
    if (confirm("Are you sure you want to remove this MFA method?")) {
      setMfaMethods((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Authentication & Security</h1>
          <p className={styles.pageSubtitle}>
            Manage your sign-in methods and active sessions.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* MFA Methods */}
        <Card className={styles.mfaCard}>
          <CardHeader className={styles.cardHeaderFlex}>
            <CardTitle>Multi-Factor Authentication</CardTitle>
            <Button size="sm">
              <Plus size={16} /> Add Method
            </Button>
          </CardHeader>
          <CardContent>
            <div className={styles.mfaList}>
              {mfaMethods.map((method) => (
                <div key={method.id} className={styles.mfaItem}>
                  <div className={styles.mfaIcon}>
                    {method.type.includes("App") ? (
                      <Smartphone size={24} />
                    ) : (
                      <Key size={24} />
                    )}
                  </div>
                  <div className={styles.mfaInfo}>
                    <div className={styles.mfaName}>{method.type}</div>
                    <div className={styles.mfaDetail}>
                      {method.name} • Added {method.added}
                    </div>
                  </div>
                  <div className={styles.mfaActions}>
                    <Badge variant="success">{method.status}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMFA(method.id)}
                    >
                      <Trash2 size={16} className={styles.dangerIcon} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Password Management */}
        <Card className={styles.passwordCard}>
          <CardHeader>
            <CardTitle>Password & Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.securityRow}>
              <div>
                <div className={styles.securityLabel}>Last Password Change</div>
                <div className={styles.securityValue}>3 months ago</div>
              </div>
              <Button variant="secondary" size="sm">
                Change Password
              </Button>
            </div>
            <div className={styles.securityCheck}>
              <Shield size={20} className={styles.checkIcon} />
              <span>Your password is strong and distinct.</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className={styles.sessionsCard}>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent className={styles.tableContent}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Location & IP</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className={styles.deviceCell}>
                        <Globe size={16} />
                        <span
                          className={
                            session.current ? styles.currentDevice : ""
                          }
                        >
                          {session.device} {session.current && "(This Device)"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles.locationCell}>
                        <span>{session.location}</span>
                        <span className={styles.ipAddress}>{session.ip}</span>
                      </div>
                    </TableCell>
                    <TableCell>{session.lastActive}</TableCell>
                    <TableCell>
                      {!session.current && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeSession(session.id)}
                        >
                          <LogOut size={16} /> Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
