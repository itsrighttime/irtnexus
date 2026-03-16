
# ✅ 1. Badge System Design (Rules + Categories)

## 🧠 Badge Categories

We will define badges in categories to enforce rules:

### **A. Verification Badges**

Only **one verification badge** can be present at a time:

* Verified
* Verified by Issuer
* Document Verified
* Liveness Verified
* Address Verified

### **B. Trustworthiness Badges**

Only **one trust level** can be present:

* High Trust
* Medium Trust
* Low Trust

### **C. Proof & Source Badges**

Only **one proof/source** badge can be present:

* Issuer Signed
* External Source
* User Self-Asserted
* Recently Verified

### **D. Privacy Badges**

Can co-exist with others (no restrictions)

---

# ✅ 2. Badge Definitions (Central Source)

### `badgeDefinitions.js`

```js
export const BADGE_CATEGORIES = {
  verification: "verification",
  trust: "trust",
  proof: "proof",
  privacy: "privacy",
};

export const BADGE_DEFINITIONS = {
  VERIFIED: {
    id: "VERIFIED",
    category: BADGE_CATEGORIES.verification,
    label: "Verified",
    icon: "✔",
  },
  VERIFIED_BY_ISSUER: {
    id: "VERIFIED_BY_ISSUER",
    category: BADGE_CATEGORIES.verification,
    label: "Verified by Issuer",
    icon: "🏷️",
  },
  DOCUMENT_VERIFIED: {
    id: "DOCUMENT_VERIFIED",
    category: BADGE_CATEGORIES.verification,
    label: "Document Verified",
    icon: "🧾",
  },
  LIVENESS_VERIFIED: {
    id: "LIVENESS_VERIFIED",
    category: BADGE_CATEGORIES.verification,
    label: "Liveness Verified",
    icon: "🧿",
  },
  ADDRESS_VERIFIED: {
    id: "ADDRESS_VERIFIED",
    category: BADGE_CATEGORIES.verification,
    label: "Address Verified",
    icon: "📌",
  },

  HIGH_TRUST: {
    id: "HIGH_TRUST",
    category: BADGE_CATEGORIES.trust,
    label: "High Trust",
    icon: "🟢",
  },
  MEDIUM_TRUST: {
    id: "MEDIUM_TRUST",
    category: BADGE_CATEGORIES.trust,
    label: "Medium Trust",
    icon: "🟡",
  },
  LOW_TRUST: {
    id: "LOW_TRUST",
    category: BADGE_CATEGORIES.trust,
    label: "Low Trust",
    icon: "🔴",
  },

  ISSUER_SIGNED: {
    id: "ISSUER_SIGNED",
    category: BADGE_CATEGORIES.proof,
    label: "Issuer Signed",
    icon: "🧾",
  },
  EXTERNAL_SOURCE: {
    id: "EXTERNAL_SOURCE",
    category: BADGE_CATEGORIES.proof,
    label: "External Source",
    icon: "🌐",
  },
  USER_ASSERTED: {
    id: "USER_ASSERTED",
    category: BADGE_CATEGORIES.proof,
    label: "User Self-Asserted",
    icon: "🧩",
  },
  RECENTLY_VERIFIED: {
    id: "RECENTLY_VERIFIED",
    category: BADGE_CATEGORIES.proof,
    label: "Recently Verified",
    icon: "🔁",
  },

  PRIVATE: {
    id: "PRIVATE",
    category: BADGE_CATEGORIES.privacy,
    label: "Private",
    icon: "🔒",
  },
  TRUSTED_TENANTS: {
    id: "TRUSTED_TENANTS",
    category: BADGE_CATEGORIES.privacy,
    label: "Trusted Tenants",
    icon: "🧑‍🤝‍🧑",
  },
  TENANT_SPECIFIC: {
    id: "TENANT_SPECIFIC",
    category: BADGE_CATEGORIES.privacy,
    label: "Tenant Specific",
    icon: "🏢",
  },
  PUBLIC: {
    id: "PUBLIC",
    category: BADGE_CATEGORIES.privacy,
    label: "Public",
    icon: "🌍",
  },
};
```
