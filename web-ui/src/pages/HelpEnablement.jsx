import React from "react";
import { Book, MessageCircle, ExternalLink, Search } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import styles from "./HelpEnablement.module.css";

export const HelpEnablement = () => {
  const guides = [
    { id: 1, title: "Getting Started with irtnexus", category: "Basics" },
    { id: 2, title: "Setting up MFA on Mobile", category: "Security" },
    { id: 3, title: "Requesting Access to Resources", category: "Access" },
    { id: 4, title: "Understanding your Risk Score", category: "Security" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Help & Enablement</h1>
          <p className={styles.pageSubtitle}>
            Guides, documentation, and support.
          </p>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for help..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.grid}>
        <Card className={styles.guidesCard}>
          <CardHeader>
            <CardTitle>Popular Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.guidesList}>
              {guides.map((guide) => (
                <div key={guide.id} className={styles.guideItem}>
                  <div className={styles.guideIcon}>
                    <Book size={20} />
                  </div>
                  <div className={styles.guideContent}>
                    <h4 className={styles.guideTitle}>{guide.title}</h4>
                    <span className={styles.guideCategory}>
                      {guide.category}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={styles.contactCard}>
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
          </CardHeader>
          <CardContent className={styles.contactContent}>
            <p>
              Our support team is available 24/7 to assist you with any security
              or access issues.
            </p>
            <Button className={styles.contactBtn}>
              <MessageCircle size={18} /> Contact Support
            </Button>
            <Button variant="secondary" className={styles.contactBtn}>
              Open a Ticket
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
