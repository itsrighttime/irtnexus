import { repoNotificationPreferences } from "../repository";
import {
  NotificationPreferences,
  NotificationChannel,
  INotificationPreferenceService,
} from "../types";
import { DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";

export class NotificationPreferenceService implements INotificationPreferenceService {
  private preferenceRepo = repoNotificationPreferences;

  /**
   * Get preferences for a user
   */
  async getUserPreferences(
    params: { accountId: string },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<NotificationPreferences | null> {
    const { accountId } = params;

    const prefs = await this.preferenceRepo.findOne(
      { account_id: accountId },
      ctx,
      client,
    );

    if (!prefs) {
      return null;
    }

    return prefs;
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    params: {
      accountId: string;
      preferences: Partial<NotificationPreferences>;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<Partial<NotificationPreferences>> {
    const { accountId, preferences } = params;

    const existing = await this.getUserPreferences(
      { accountId: accountId },
      ctx,
      client,
    );

    const updated: Partial<NotificationPreferences> = {
      account_id: accountId,
    };

    await this.preferenceRepo.update(accountId, updated, ctx, client);

    return updated;
  }

  /**
   * THIS is what your NotificationService expects
   */
  async resolveAllowedChannels(
    params: {
      accountId: string;
      type: string; // (kept for future use)
      category?: string; // (not used yet but preserved)
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<NotificationChannel[]> {
    const { accountId } = params;

    const prefs = await this.getUserPreferences({ accountId }, ctx, client);

    if (!prefs) {
      // No prefs found, apply your default logic (e.g. all channels enabled)
      return ["IN_APP"];
    }

    // 1. Hard stop → globally muted
    if (prefs.is_muted) {
      return [];
    }

    // 2. DND check (if within range → block)
    if (this.isWithinDndWindow(prefs)) {
      return [];
    }

    const enabled: Partial<Record<NotificationChannel, boolean>> =
      prefs.channels_enabled ?? {};
    const mutedPerChannel: Partial<Record<NotificationChannel, boolean>> =
      prefs.mute_per_channel ?? {};
    const configs = prefs.channel_configs ?? {};

    // 3. Resolve allowed channels
    return (Object.keys(enabled) as NotificationChannel[])
      .filter((channel) => enabled[channel]) // enabled
      .filter((channel) => !mutedPerChannel[channel]) // not muted individually
      .filter((channel) => this.hasValidConfig(channel, configs)); // usable
  }

  private isWithinDndWindow(prefs: NotificationPreferences): boolean {
    const { dnd_start, dnd_end } = prefs;

    if (!dnd_start || !dnd_end) return false;

    const now = new Date();

    const start = new Date(dnd_start);
    const end = new Date(dnd_end);

    // Handles normal + overnight windows
    if (start <= end) {
      return now >= start && now <= end;
    } else {
      // e.g. 10 PM → 6 AM
      return now >= start || now <= end;
    }
  }

  private hasValidConfig(
    channel: NotificationChannel,
    configs: NotificationPreferences["channel_configs"],
  ): boolean {
    if (!configs) return true; // assume OK if not enforced

    switch (channel) {
      case "EMAIL":
        return !!configs.EMAIL?.email;

      case "SMS":
        return !!configs.SMS?.phone;

      case "PUSH":
        return !!configs.PUSH?.deviceToken;

      case "IN_APP":
        return true; // usually always valid

      default:
        return false;
    }
  }
}
