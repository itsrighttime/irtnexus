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

const profileData1 = {
  core: {
    did: "did:lets:1234-5678-90ab-cdef",
    legalName: "Alexandra Marie Johnson",
    displayName: user?.name || "Alex Johnson",
    dob: "1990-05-15",
    jurisdiction: "United States (WA)",
    assuranceLevel: "IAL2 (Medium)",
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
    bio: "Security professional with 10+ years of experience.",
  },
  privacy: {
    defaultVisibility: "Tenant",
    searchable: true,
    publicProfile: false,
  },
  history: [
    {
      id: 1,
      action: "Email Added",
      date: "2023-10-01",
      detail: "Secondary email added",
    },
  ],
};

const signals = [
  {
    label: "Email Verified",
    icon: Mail,
    ok: contact.emails?.some((e) => e.verified),
  },
  {
    label: "Phone Verified",
    icon: Phone,
    ok: contact.phones?.some((p) => p.verified),
  },
  { label: "Government ID Verified", icon: FileText, ok: true },
];

/**
 * irt-dev — Canonical User Profile (Dummy Data)
 * Version: canonical-v1
 *
 * This file represents WHO the user is.
 * It does NOT represent access, roles, permissions, or tenant authority.
 */

const profileConfig = {
  meta: {
    profileVersion: "canonical-v1",
    profileOwner: "user",
    tenantAgnostic: true,
    createdAt: "2024-06-14T09:22:11Z",
    lastUpdatedAt: "2026-01-12T18:03:42Z",
  },

  coreIdentity: {
    immutable: true,
    assuranceLevel: "high",

    fields: {
      globalUserId: {
        value: "usr_8f21a9e2-91ac-4c7a-bf2b-01c9f7f5a821",
        immutable: true,
        visibility: "private",
        exportable: false,
      },

      legalFullName: {
        value: "Alexander James Morgan",
        immutable: true,
        visibility: "private",
        exportable: false,
      },

      displayName: {
        value: "Alex Morgan",
        immutable: false,
        visibility: "trustedTenants",
        exportable: true,
      },

      dateOfBirth: {
        value: "1991-04-19",
        immutable: true,
        visibility: "private",
        policyControlled: true,
        exportable: false,
      },

      jurisdiction: {
        value: "US",
        immutable: true,
        visibility: "trustedTenants",
      },

      identityCreatedAt: {
        value: "2024-06-14T09:22:11Z",
        immutable: true,
        visibility: "private",
      },
    },
  },

  contactAndReachability: {
    purpose: "notification-recovery-trust",

    fields: {
      primaryEmail: {
        value: "alex.morgan@example.com",
        verified: true,
        verification: {
          issuer: "email-provider",
          verifiedAt: "2024-06-14T10:01:55Z",
        },
        visibility: "private",
        trustSignal: true,
      },

      secondaryEmails: {
        value: ["alex.work@example.com"],
        verified: false,
        visibility: "private",
      },

      mobilePhone: {
        value: "+1-555-0199",
        verified: true,
        verification: {
          issuer: "sms-gateway",
          verifiedAt: "2024-06-14T10:10:12Z",
        },
        visibility: "private",
        trustSignal: true,
      },

      emergencyContact: {
        value: {
          name: "Jamie Morgan",
          relationship: "Sibling",
          phone: "+1-555-0177",
        },
        visibility: "private",
      },

      preferredLanguage: {
        value: "en-US",
        visibility: "trustedTenants",
      },

      timeZone: {
        value: "America/New_York",
        visibility: "trustedTenants",
      },
    },
  },

  professionalIdentity: {
    optional: true,
    portable: true,
    exportable: true,

    fields: {
      professionalTitle: {
        value: "Senior Security Architect",
        visibility: "trustedTenants",
      },

      organizationAffiliations: {
        value: [
          {
            name: "SecureCloud Inc.",
            relationship: "employee",
            startDate: "2021-03-01",
          },
        ],
        visibility: "trustedTenants",
      },

      industryTags: {
        value: ["Cloud Security", "Zero Trust", "IAM"],
        visibility: "trustedTenants",
      },

      workEmails: {
        value: ["alex.morgan@securecloud.example"],
        visibility: "trustedTenants",
      },

      certifications: {
        value: [
          {
            name: "CISSP",
            issuer: "ISC2",
            verified: true,
            verifiedAt: "2023-11-02",
          },
          {
            name: "AWS Security Specialty",
            issuer: "Amazon",
            verified: false,
          },
        ],
        visibility: "trustedTenants",
        trustSignal: true,
      },

      professionalBio: {
        value:
          "Security architect with a focus on identity-first cloud security and zero-trust policy design.",
        visibility: "trustedTenants",
      },
    },
  },

  visibilityMatrix: {
    defaultVisibility: "private",
    allowedScopes: ["private", "trustedTenants", "specificTenants", "public"],
  },

  verificationSignals: {
    summary: {
      emailVerified: true,
      phoneVerified: true,
      identityVerified: true,
      professionalCredentialsVerified: true,
    },

    lastVerificationEvent: {
      date: "2025-09-18",
      issuer: "irt-dev Identity Services",
      level: "high",
    },
  },

  changeHistory: {
    auditEnabled: true,

    events: [
      {
        id: "chg_001",
        field: "displayName",
        previousValue: "Alexander Morgan",
        newValue: "Alex Morgan",
        changedAt: "2026-01-12T18:03:42Z",
        reason: "Preferred name update",
        verificationRequired: false,
        revertAllowed: true,
      },
      {
        id: "chg_002",
        field: "mobilePhone",
        previousValue: null,
        newValue: "+1-555-0199",
        changedAt: "2024-06-14T10:10:12Z",
        reason: "Initial profile setup",
        verificationRequired: true,
        revertAllowed: false,
      },
    ],
  },

  preferencesAndPersonalization: {
    securityImpact: "none",

    fields: {
      theme: {
        value: "light",
        visibility: "private",
      },

      accessibility: {
        value: {
          highContrast: false,
          reducedMotion: false,
        },
        visibility: "private",
      },

      communicationPreferences: {
        value: {
          email: true,
          sms: false,
          inApp: true,
        },
        visibility: "private",
      },

      riskNotificationSensitivity: {
        value: "medium",
        visibility: "private",
      },

      defaultTenantLanding: {
        value: "last-used",
        visibility: "private",
      },

      profileDisplayOrder: {
        value: [
          "coreIdentity",
          "contactAndReachability",
          "professionalIdentity",
        ],
        visibility: "private",
      },
    },
  },

  explicitNonGoals: {
    roles: false,
    permissions: false,
    entitlements: false,
    tenantAdminFlags: false,
    delegationAuthority: false,
    policyDefinitions: false,
  },
};
