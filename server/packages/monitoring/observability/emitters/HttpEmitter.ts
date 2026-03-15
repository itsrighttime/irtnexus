import { HEADERS } from "#configs";
import { BaseEmitter } from "./BaseEmitter";

export interface HttpEmitterOptions {
  endpoint: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

/**
 * HttpEmitter
 *
 * Sends observability events to a remote HTTP endpoint.
 * Useful for centralized logging, analytics pipelines,
 * or remote audit collectors.
 */
export class HttpEmitter<TEvent = unknown> extends BaseEmitter<TEvent> {
  private endpoint: string;
  private headers: Record<string, string>;
  private timeoutMs: number;

  constructor({
    endpoint,
    headers = {},
    timeoutMs = 5000,
  }: HttpEmitterOptions) {
    super();
    this.endpoint = endpoint;
    this.headers = headers;
    this.timeoutMs = timeoutMs;
  }

  async emit(event: TEvent): Promise<void> {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, this.timeoutMs);

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          [HEADERS.CONTENT_TYPE]: "application/json",
          ...this.headers,
        },
        body: JSON.stringify(event),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `HttpEmitter failed: ${response.status} ${response.statusText}`,
        );
      }
    } finally {
      clearTimeout(timeout);
    }
  }
}
