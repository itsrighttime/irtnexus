# Users, Roles, Identity, and Permissions – System Overview

In a multi-tenant SaaS system, **access control** and **user management** are critical. We combine **user attributes** (`status`, `identity_level`, `role`) with a **permissions table** to create a **flexible, secure, and auditable system**.

## 1 User Columns

### **1. `status`**

- Tracks the **operational state** of the user.
- Examples: `active`, `suspended`, `compromised`, `deceased`.
- **Purpose:** Determines whether a user can log in or perform actions.
- **Use case:** Suspended or compromised accounts are blocked automatically; deceased accounts become historical.

### **2. `identity_level`**

- Represents the **trust / verification level** of a user.
- Examples: `L0` → guest, `L4` → fully verified/trusted.
- **Purpose:** Adds a layer of **security and compliance**. Sensitive operations are gated by identity level.
- **Use case:** Only `L3` or `L4` users can approve financial transactions or legal agreements.

### **3. `role`**

- Defines **functional scope** of the user: what modules, actions, or entities they can access.
- Examples: `super_admin`, `finance`, `developer`, `client`, `system`.
- **Purpose:** Separates responsibilities and modules based on **business function**.
- **Use case:** A `developer` cannot approve payouts, but a `finance` role can.

## 2 Permissions Table

To complement the role system, a **`user_permissions` table** stores **fine-grained, tenant-specific permissions**:

```sql
CREATE TABLE user_permissions (
    permission_id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    tenant_id BINARY(16) NOT NULL,
    module VARCHAR(64) NOT NULL,       -- e.g., projects, wallets, marketing
    action ENUM('view', 'edit', 'delete', 'approve') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
);
```

**Purpose:**

- Overrides or extends role-based defaults.
- Provides **tenant-level customization** for module access.
- Supports temporary or exceptional permissions without changing the main role.

## 3 How They Work Together

| Component             | Role in the System                                                                 |
| --------------------- | ---------------------------------------------------------------------------------- |
| **status**            | Controls if a user can log in or perform any actions.                              |
| **identity_level**    | Determines trustworthiness and eligibility for sensitive operations.               |
| **role**              | Defines default module access and responsibilities.                                |
| **permissions table** | Provides fine-grained control for **specific modules or actions** within a tenant. |

### Example Workflow:

1. A `finance` user (`status=active`, `identity_level=L3`) logs in.

2. The system checks:
   - Status → active?
   - Identity Level → L3 sufficient for payouts?
   - Role → finance → access to wallets & reports
   - Permissions → allowed to approve this specific department’s transactions?

3. Access granted.

4. A `developer` (`status=active`, `identity_level=L1`) tries to approve a payout.
   - Status → active
   - Identity Level → L1 insufficient
   - Role → developer cannot approve payouts
   - Access denied.

## 4 Benefits of This Design

1. **Security First**
   - Users are blocked automatically if compromised or unverified.

2. **Fine-Grained Control**
   - Roles give broad module-level access; permissions table allows **exceptions or tenant-specific customization**.

3. **Multi-Tenant Support**
   - Each user is tied to a tenant. Permissions can vary per tenant without changing the global role.

4. **Audit & Compliance Ready**
   - Every action can be traced to user, role, tenant, and verification level.

5. **Extensible**
   - New roles, modules, or actions can be added without redesigning the schema.

**Summary:**

Together, **`status` + `identity_level` + `role` + `permissions table`** form a **secure, flexible, multi-tenant access control system**.

- **Roles** define defaults.
- **Identity level** adds trust checks.
- **Status** ensures only active users can act.
- **Permissions table** allows **custom, tenant-specific overrides**.

This is the **backbone of a SaaS system with strong security, compliance, and modular access control**.
