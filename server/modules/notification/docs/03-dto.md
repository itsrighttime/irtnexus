Perfect! The **DTO (Data Transfer Object) layer** is about **defining strict input/output structures** for your notification service. It ensures that what flows in (requests) and out (responses) is **typed, validated, and predictable**.

Let’s define each of the files in your `dto/` folder.

## 1️⃣ **CreateNotificationDTO.ts**

**Purpose:**

- Defines the input structure for creating/sending a notification.
- Includes recipients, type, payload, optional channels, and scheduling info.

```ts id="w9f2t4"
export interface CreateNotificationDTO {
  tenantId: string; // Tenant identifier
  recipientIds: string[]; // List of user IDs
  type: string; // Notification type (e.g., 'PASSWORDLESS_LOGIN', 'TASK_ASSIGNED')
  payload: Record<string, any>; // Dynamic content for the template
  channels?: ("email" | "sms" | "whatsapp" | "push")[]; // Optional override channels
  scheduledAt?: Date; // Optional: schedule for future delivery
  priority?: "low" | "medium" | "high"; // Optional priority
  metadata?: Record<string, any>; // Optional extra info (tracking, source, etc.)
}
```

## 2️⃣ **NotificationResponseDTO.ts**

**Purpose:**

- Defines how a notification is returned to the client.
- Includes status, delivery channels, timestamps, and read info.

```ts id="l3q7n5"
export interface NotificationResponseDTO {
  notificationId: string;
  tenantId: string;
  recipientId: string;
  type: string;
  payload: Record<string, any>;
  channels: ("email" | "sms" | "whatsapp" | "push")[];
  status: "PENDING" | "SENT" | "FAILED";
  readAt?: Date | null;
  sentAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}
```

## 3️⃣ **PreferenceDTO.ts**

**Purpose:**

- Defines the input/output structure for **user notification preferences**.
- Includes preferred channels per notification type and general opt-in/opt-out flags.

```ts id="j6d8p1"
export interface PreferenceDTO {
  userId: string;
  tenantId: string;
  preferences: {
    [notificationType: string]: {
      enabled: boolean; // True if user wants to receive this type
      channels: ("email" | "sms" | "whatsapp" | "push")[]; // Preferred channels
      dailyLimit?: number; // Optional: max notifications per day
      doNotDisturb?: {
        // Optional: quiet hours
        startHour: number; // 0-23
        endHour: number; // 0-23
      };
    };
  };
}
```

### ✅ Summary

| DTO                        | Purpose                                        |
| -------------------------- | ---------------------------------------------- |
| CreateNotificationDTO.ts   | Input for sending/creating notifications       |
| NotificationResponseDTO.ts | Output when returning notifications to clients |
| PreferenceDTO.ts           | Input/output for user notification preferences |

This structure makes the **service layer and use-cases layer strongly typed** and ensures that **all incoming requests are validated against a contract** before hitting the DB or dispatchers.
