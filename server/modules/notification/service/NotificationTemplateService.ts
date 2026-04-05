import { repoNotificationTemplate } from "../repository";
import {
  NotificationTemplate,
  NotificationChannel,
  INotificationTemplateService,
  NotificationType,
} from "../types";
import { DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";

export class NotificationTemplateService implements INotificationTemplateService {
  /**
   * MAIN METHOD used by NotificationService
   */
  async render(
    params: {
      type: NotificationType;
      channel: NotificationChannel;
      tenantId: string;
      data?: Record<string, any>;
      locale?: string;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<{ subject?: string; body: string }> {
    const { type, channel, tenantId, data = {}, locale = "en" } = params;

    // 1. Fetch template (latest active version)
    const template = await this.getTemplate(
      {
        type,
        channel,
        tenantId,
        locale,
      },
      ctx,
      client,
    );

    if (!template) {
      throw new Error(
        `Template not found for type=${type}, channel=${channel}, tenant=${tenantId}`,
      );
    }

    // 2. Render content
    const subject = template.subject
      ? this.interpolate(template.subject, data)
      : undefined;

    const body = this.interpolate(template.body, data);

    return { subject, body };
  }

  /**
   * Get latest active template
   */
  async getTemplate(
    params: {
      type: NotificationType;
      channel: NotificationChannel;
      tenantId: string;
      locale?: string;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<NotificationTemplate | null> {
    const { type, channel, tenantId, locale = "en" } = params;

    const template = await repoNotificationTemplate.select(
      {
        where: {
          type: type,
          template_id: tenantId,
          channel,
          locale,
          is_active: true,
        },
        orderBy: [{ column: "version", direction: "DESC" }], // get latest version
        limit: 1,
      },
      ctx,
      client,
    );

    return template.length > 0 ? template[0] : null;
  }

  /**
   * Simple placeholder interpolation
   * {{name}} → John
   */
  private interpolate(
    template: string,
    variables: Record<string, any>,
  ): string {
    let result = template;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      result = result.replace(regex, String(value));
    }

    return result;
  }

  /**
   * Upsert template (aligned with schema)
   */
  async upsertTemplate(
    params: {
      template: NotificationTemplate;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<NotificationTemplate> {
    const { template } = params;

    const existing = await repoNotificationTemplate.findOne(
      {
        tenant_id: template.tenant_id,
        type: template.type,
        channel: template.channel,
        locale: template.locale ?? "en",
        version: template.version,
      },
      ctx,
      client,
    );

    if (existing) {
      return repoNotificationTemplate.update(
        template.template_id,
        template,
        ctx,
        client,
      );
    }

    return repoNotificationTemplate.create(template, ctx, client);
  }

  /**
   * Soft delete
   */
  async deleteTemplate(
    params: {
      templateId: string;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<void> {
    await repoNotificationTemplate.update(
      params.templateId,
      { is_active: false, deleted_at: new Date() },
      ctx,
      client,
    );
  }
}
