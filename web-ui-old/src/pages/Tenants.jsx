import React, { useState } from "react";
import { Plus, Check, LogOut, Building, ShieldCheck } from "lucide-react";
import { useMockData } from "core-ui";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import styles from "./Tenants.module.css";
import clsx from "clsx";

export const Tenants = () => {
  const { tenants, activeTenant, switchTenant } = useMockData();
  const [isCreating, setIsCreating] = useState(false);
  const [newTenantName, setNewTenantName] = useState("");

  // Mock creation - in real app would update context
  const handleCreate = (e) => {
    e.preventDefault();
    alert(`Mock: Created tenant "${newTenantName}"`);
    setIsCreating(false);
    setNewTenantName("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Tenant Management</h1>
          <p className={styles.pageSubtitle}>
            Switch between workspaces or create a new organization.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus size={18} /> Create Tenant
        </Button>
      </div>

      {isCreating && (
        <Card className={styles.createCard}>
          <CardContent>
            <form onSubmit={handleCreate} className={styles.createForm}>
              <input
                type="text"
                placeholder="Enter organization name..."
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                className={styles.createInput}
                autoFocus
              />
              <div className={styles.createActions}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!newTenantName}>
                  Create
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className={styles.grid}>
        {tenants.map((tenant) => {
          const isActive = activeTenant?.id === tenant.id;
          return (
            <Card
              key={tenant.id}
              className={clsx(styles.tenantCard, isActive && styles.activeCard)}
            >
              <CardContent className={styles.cardContent}>
                <div className={styles.tenantHeader}>
                  <div className={styles.iconWrapper}>
                    <Building size={24} />
                  </div>
                  <div className={styles.tenantInfo}>
                    <h3 className={styles.tenantName}>{tenant.name}</h3>
                    <div className={styles.meta}>
                      <span className={styles.role}>{tenant.role}</span>
                      <Badge
                        variant={
                          tenant.status === "Active" ? "success" : "default"
                        }
                      >
                        {tenant.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  {isActive ? (
                    <div className={styles.currentBadge}>
                      <Check size={16} /> Currently Active
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => switchTenant(tenant.id)}
                    >
                      Switch to Tenant
                    </Button>
                  )}

                  {!isActive && tenant.role !== "Owner" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={styles.leaveBtn}
                    >
                      <LogOut size={16} /> Leave
                    </Button>
                  )}
                </div>
              </CardContent>
              {isActive && <div className={styles.activeBar}></div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
