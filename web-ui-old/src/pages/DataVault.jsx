import React, { useState } from "react";
import {
  Lock,
  FileText,
  Key,
  MoreHorizontal,
  Plus,
  Eye,
  EyeOff,
  Copy,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import styles from "./DataVault.module.css";

export const DataVault = () => {
  const [items, setItems] = useState([
    {
      id: "v1",
      type: "Credential",
      name: "AWS Production Keys",
      updated: "2 days ago",
      access: "Owner",
      hidden: true,
    },
    {
      id: "v2",
      type: "Note",
      name: "Recovery Codes",
      updated: "1 week ago",
      access: "Owner",
      hidden: true,
    },
    {
      id: "v3",
      type: "Credential",
      name: "Database Admin",
      updated: "3 weeks ago",
      access: "Read-Only",
      hidden: true,
    },
    {
      id: "v4",
      type: "Document",
      name: "Identity Proof.pdf",
      updated: "1 month ago",
      access: "Owner",
      hidden: true,
    },
  ]);

  const toggleVisibility = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, hidden: !item.hidden } : item,
      ),
    );
  };

  const handleCopy = () => {
    alert("Mock: Copied to clipboard!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Data Vault</h1>
          <p className={styles.pageSubtitle}>
            Securely store and manage your sensitive credentials and documents.
          </p>
        </div>
        <Button>
          <Plus size={16} /> Add Item
        </Button>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <Card key={item.id} className={styles.vaultCard}>
            <div className={styles.cardTop}>
              <div className={styles.iconWrapper}>
                {item.type === "Credential" ? (
                  <Key size={20} />
                ) : item.type === "Document" ? (
                  <FileText size={20} />
                ) : (
                  <Lock size={20} />
                )}
              </div>
              <Button variant="ghost" size="sm" className={styles.moreBtn}>
                <MoreHorizontal size={16} />
              </Button>
            </div>

            <div className={styles.cardMain}>
              <h3 className={styles.itemName}>{item.name}</h3>
              <div className={styles.itemMeta}>
                <Badge variant="secondary">{item.type}</Badge>
                <span className={styles.updated}>{item.updated}</span>
              </div>
            </div>

            <div className={styles.cardActions}>
              {item.hidden ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleVisibility(item.id)}
                  className={styles.actionBtn}
                >
                  <Eye size={14} /> Show
                </Button>
              ) : (
                <div className={styles.revealedActions}>
                  <span className={styles.secretValue}>••••••••••••</span>
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    <Copy size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleVisibility(item.id)}
                  >
                    <EyeOff size={14} />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
