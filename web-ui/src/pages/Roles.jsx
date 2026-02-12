import React, { useState } from "react";
import {
  Shield,
  Users,
  GitBranch,
  Plus,
  Lock,
  AlertCircle,
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
import styles from "./Roles.module.css";

export const Roles = () => {
  // Mock Data
  const [roles] = useState([
    {
      id: "r1",
      name: "Owner",
      description: "Full access to all resources and settings.",
      users: 1,
      type: "System",
    },
    {
      id: "r2",
      name: "Administrator",
      description: "Can manage users and most resources.",
      users: 3,
      type: "System",
    },
    {
      id: "r3",
      name: "Developer",
      description: "Access to dev resources and deployments.",
      users: 12,
      type: "Custom",
    },
    {
      id: "r4",
      name: "Auditor",
      description: "Read-only access to logs and reports.",
      users: 2,
      type: "Custom",
    },
  ]);

  const [assignments] = useState([
    { id: "a1", user: "Alex Johnson", role: "Owner", type: "Direct" },
    {
      id: "a2",
      user: "Sarah Smith",
      role: "Administrator",
      type: "Group: DevOps",
    },
    { id: "a3", user: "Mike Jones", role: "Developer", type: "Direct" },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Roles & Authority</h1>
          <p className={styles.pageSubtitle}>
            Manage permissions and role assignments.
          </p>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary">
            <GitBranch size={16} /> Visualize Graph
          </Button>
          <Button>
            <Plus size={16} /> Create Role
          </Button>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Roles List */}
        <Card className={styles.rolesCard}>
          <CardHeader>
            <CardTitle>Defined Roles</CardTitle>
          </CardHeader>
          <CardContent className={styles.tableContent}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className={styles.roleName}>
                        <Shield size={16} className={styles.roleIcon} />
                        {role.name}
                      </div>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={role.type === "System" ? "default" : "info"}
                      >
                        {role.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{role.users}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Role Assignments */}
        <Card className={styles.assignmentsCard}>
          <CardHeader>
            <CardTitle>Role Assignments</CardTitle>
          </CardHeader>
          <CardContent className={styles.tableContent}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Assigned Role</TableHead>
                  <TableHead>Assignment Type</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assign) => (
                  <TableRow key={assign.id}>
                    <TableCell>
                      <div className={styles.userName}>
                        <div className={styles.userAvatar}>
                          {assign.user.charAt(0)}
                        </div>
                        {assign.user}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{assign.role}</Badge>
                    </TableCell>
                    <TableCell>{assign.type}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Break Glass / Emergency */}
        <Card className={styles.breakGlassCard}>
          <CardContent className={styles.breakGlassContent}>
            <div className={styles.bgIcon}>
              <Lock size={24} />
            </div>
            <div className={styles.bgInfo}>
              <h3>Break-Glass Configuration</h3>
              <p>Setup emergency access roles for critical situations.</p>
            </div>
            <Button variant="secondary">Configure</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
