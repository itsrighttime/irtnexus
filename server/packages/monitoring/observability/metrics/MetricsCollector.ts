import {
  EndpointMetrics,
  EndpointSnapshot,
  RecordRequestParams,
} from "../types";

/**
 * MetricsCollector
 *
 * Simple in-memory metrics collector for HTTP requests.
 * Tracks request counts, success/failure, and total duration per endpoint.
 * Provides snapshotting and reset functionality.
 */
export class MetricsCollector {
  private requests: Map<string, EndpointMetrics>;

  constructor() {
    this.requests = new Map<string, EndpointMetrics>();
  }

  /**
   * Record a request metric
   */
  recordRequest({ endpoint, success, durationMs }: RecordRequestParams): void {
    if (!this.requests.has(endpoint)) {
      this.requests.set(endpoint, {
        count: 0,
        success: 0,
        failure: 0,
        totalDuration: 0,
      });
    }

    const metric = this.requests.get(endpoint)!;
    metric.count++;
    success ? metric.success++ : metric.failure++;
    metric.totalDuration += durationMs;
  }

  /**
   * Get a snapshot of the current metrics
   */
  snapshot(): EndpointSnapshot[] {
    return Array.from(this.requests.entries()).map(([endpoint, m]) => ({
      endpoint,
      requestCount: m.count,
      successRate: m.count ? m.success / m.count : 0,
      avgLatencyMs: m.count ? m.totalDuration / m.count : 0,
    }));
  }

  /**
   * Reset all collected metrics
   */
  reset(): void {
    this.requests.clear();
  }
}
