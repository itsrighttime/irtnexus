interface NotificationHandler {
  send(target: string, message: string, meta?: any): Promise<void>;
}

class EmailNotificationHandler implements NotificationHandler {
  async send(target: string, message: string, meta?: any): Promise<void> {
    // Implementation for sending email notifications
  }
}

class SmsNotificationHandler implements NotificationHandler {
  async send(target: string, message: string, meta?: any): Promise<void> {
    // Implementation for sending SMS notifications
  }
}

class WhatsAppNotificationHandler implements NotificationHandler {
  async send(target: string, message: string, meta?: any): Promise<void> {
    // Implementation for sending WhatsApp notifications
  }
}

class PushNotificationHandler implements NotificationHandler {
  async send(target: string, message: string, meta?: any): Promise<void> {
    // Implementation for sending push notifications
  }
}

const notificationRegistry = {
  EMAIL: new EmailNotificationHandler(),
  SMS: new SmsNotificationHandler(),
  WHATSAPP: new WhatsAppNotificationHandler(),
  PUSH: new PushNotificationHandler(),
};