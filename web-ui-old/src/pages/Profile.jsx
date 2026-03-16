import React, { useState } from "react";
import {
  User,
  Shield,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Lock,
  Eye,
  CheckCircle,
  Clock,
  Settings,
  FileText,
  AlertCircle,
  History,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { useMockData } from "core-ui";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Switch from "../components/ui/Switch"; // We might need to create this or use a simple checkbox for now
import styles from "./Profile.module.css";

// Verification Badge Component
const VerifiedBadge = ({ type, date }) => (
  <div
    className={styles.verifiedBadge}
    title={`Verified via ${type} on ${date}`}
  >
    <CheckCircle size={14} className={styles.verifiedIcon} />
    <span>Verified</span>
  </div>
);

export const Profile = () => {
  const { user } = useMockData();
  const [activeTab, setActiveTab] = useState("identity");

  // Extended Mock Data for Canonical Profile
  const profileData = {
    core: {
      did: "did:lets:1234-5678-90ab-cdef",
      legalName: "Alexandra Marie Johnson",
      displayName: user?.name || "Alex Johnson",
      dob: "1990-05-15",
      jurisdiction: "United States (WA)",
      assuranceLevel: "IAL2 (Medium)",
      kycStatus: "Verified",
      created: "2023-01-15",
    },
    contact: {
      emails: [
        {
          id: 1,
          value: user?.email || "alex.j@example.com",
          type: "Primary",
          verified: true,
          visibility: "Tenant",
        },
        {
          id: 2,
          value: "alex.private@gmail.com",
          type: "Personal",
          verified: true,
          visibility: "Private",
        },
      ],
      phones: [
        {
          id: 1,
          value: "+1 (555) 123-4567",
          type: "Mobile",
          verified: true,
          visibility: "Tenant",
        },
      ],
    },
    professional: {
      title: "Senior Security Architect",
      organization: "Acme Corp",
      industry: "Technology / SaaS",
      certifications: ["CISSP", "CISM"],
      bio: "Security professional with 10+ years of experience in IAM and Cloud Security.",
    },
    privacy: {
      defaultVisibility: "Tenant",
      publicProfile: false,
      searchable: true,
    },
    history: [
      {
        id: 1,
        action: "Email Added",
        date: "2023-10-01",
        detail: "Secondary email added",
      },
      {
        id: 2,
        action: "KYC Verified",
        date: "2023-01-20",
        detail: "Identity document approved",
      },
      {
        id: 3,
        action: "Profile Created",
        date: "2023-01-15",
        detail: "Initial setup",
      },
    ],
  };

  return (
    <div className={styles.container}>
      {/* 1. Header & Identity Snapshot */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.avatarContainer}>
            <img src={user?.avatar} alt="Profile" className={styles.avatar} />
            <div className={styles.ialBadge} title="Identity Assurance Level 2">
              IAL2
            </div>
          </div>
          <div>
            <h1 className={styles.displayName}>
              {profileData.core.displayName}
            </h1>
            <div className={styles.idRow}>
              <span className={styles.did}>{profileData.core.did}</span>
              <Badge variant="success">Identity Verified</Badge>
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary">View Public Profile</Button>
          <Button>Edit Profile</Button>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left Column: Navigation/Status */}
        <div className={styles.leftCol}>
          <Card className={styles.trustCard}>
            <CardHeader>
              <CardTitle>Trust Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.trustList}>
                <div className={styles.trustItem}>
                  <Mail size={16} /> Email Certified
                  <CheckCircle size={16} className={styles.checkSuccess} />
                </div>
                <div className={styles.trustItem}>
                  <Phone size={16} /> Phone Verified
                  <CheckCircle size={16} className={styles.checkSuccess} />
                </div>
                <div className={styles.trustItem}>
                  <FileText size={16} /> Gov ID Verified
                  <CheckCircle size={16} className={styles.checkSuccess} />
                </div>
              </div>
            </CardContent>
          </Card>

          <nav className={styles.navMenu}>
            <a
              href="#core"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("identity");
              }}
            >
              Core Identity
            </a>
            <a
              href="#contact"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("contact");
              }}
            >
              Contact & Reachability
            </a>
            <a
              href="#pro"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("pro");
              }}
            >
              Professional Context
            </a>
            <a
              href="#privacy"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("privacy");
              }}
            >
              Privacy Controls
            </a>
          </nav>
        </div>

        {/* Right Column: Content */}
        <div className={styles.mainCol}>
          {/* 2. Core Identity (Immutable) */}
          <section id="core" className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Core Identity</h2>
              <Badge variant="info">Immutable</Badge>
            </div>
            <Card>
              <CardContent className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label>Legal Name</label>
                  <div className={styles.value}>
                    {profileData.core.legalName}
                  </div>
                  <span className={styles.verifiedLabel}>
                    <Lock size={12} /> Verified by Jumio
                  </span>
                </div>
                <div className={styles.field}>
                  <label>Date of Birth</label>
                  <div className={styles.value}>••/••/1990</div>
                  <span className={styles.verifiedLabel}>
                    <Eye size={12} /> Hidden
                  </span>
                </div>
                <div className={styles.field}>
                  <label>Jurisdiction</label>
                  <div className={styles.value}>
                    {profileData.core.jurisdiction}
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Global ID (DID)</label>
                  <div className={styles.valueMono}>{profileData.core.did}</div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 3. Contact & Reachability */}
          <section id="contact" className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Contact & Reachability</h2>
            </div>
            <Card>
              <CardContent>
                <div className={styles.contactList}>
                  {profileData.contact.emails.map((email) => (
                    <div key={email.id} className={styles.contactItem}>
                      <div className={styles.contactIcon}>
                        <Mail size={18} />
                      </div>
                      <div className={styles.contactInfo}>
                        <div className={styles.contactValue}>{email.value}</div>
                        <div className={styles.contactMeta}>
                          {email.type} • {email.visibility}
                        </div>
                      </div>
                      {email.verified && (
                        <VerifiedBadge type="Email Link" date="2023" />
                      )}
                    </div>
                  ))}
                  {profileData.contact.phones.map((phone) => (
                    <div key={phone.id} className={styles.contactItem}>
                      <div className={styles.contactIcon}>
                        <Phone size={18} />
                      </div>
                      <div className={styles.contactInfo}>
                        <div className={styles.contactValue}>{phone.value}</div>
                        <div className={styles.contactMeta}>
                          {phone.type} • {phone.visibility}
                        </div>
                      </div>
                      {phone.verified && (
                        <VerifiedBadge type="SMS" date="2023" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 4. Professional Identity */}
          <section id="pro" className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Professional Identity</h2>
            </div>
            <div className={styles.disclaimer}>
              <AlertCircle size={16} />
              <span>
                This information provides context but does NOT grant authority
                or access rights.
              </span>
            </div>
            <Card>
              <CardContent className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label>Title</label>
                  <div className={styles.value}>
                    {profileData.professional.title}
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Organization</label>
                  <div className={styles.value}>
                    {profileData.professional.organization}
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Certifications</label>
                  <div className={styles.chipContainer}>
                    {profileData.professional.certifications.map((c) => (
                      <span key={c} className={styles.chip}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 6. Profile History */}
          <section id="history" className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Profile History</h2>
            </div>
            <Card>
              <CardContent>
                <div className={styles.timeline}>
                  {profileData.history.map((item) => (
                    <div key={item.id} className={styles.timelineItem}>
                      <div className={styles.timelineIcon}>
                        <History size={14} />
                      </div>
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineTitle}>
                          {item.action}
                        </div>
                        <div className={styles.timelineMeta}>
                          {item.date} • {item.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};
