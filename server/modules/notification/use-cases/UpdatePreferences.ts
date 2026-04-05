import { NotificationPreferenceService } from "../services/NotificationPreferenceService";

export class UpdatePreferences {
  constructor(private preferenceService: NotificationPreferenceService) {}

  async execute(userId: string, preferences: Record<string, any>) {
    return this.preferenceService.updatePreferences(userId, preferences);
  }
}