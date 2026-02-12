/**
 * MetricsCollector
 *
 * Simple in-memory metrics collector for HTTP requests.
 * Tracks request counts, success/failure, and total duration per endpoint.
 * Provides snapshotting and reset functionality for observability reporting.
 */
export class MetricsCollector {
  constructor() {
    /**
     * @private
     * Map of endpoint → metrics object
     * metrics object contains: count, success, failure, totalDuration
     */
    this.requests = new Map();
  }

  /**
   * Record a request metric
   *
   * @param {Object} params
   * @param {string} params.endpoint - The HTTP endpoint being tracked
   * @param {boolean} params.success - Whether the request was successful
   * @param {number} params.durationMs - Duration of the request in milliseconds
   */
  recordRequest({ endpoint, success, durationMs }) {
    if (!this.requests.has(endpoint)) {
      this.requests.set(endpoint, {
        count: 0,
        success: 0,
        failure: 0,
        totalDuration: 0,
      });
    }

    const metric = this.requests.get(endpoint);
    metric.count++;
    success ? metric.success++ : metric.failure++;
    metric.totalDuration += durationMs;
  }

  /**
   * Get a snapshot of the current metrics
   *
   * @returns {Array<Object>} - Array of metrics per endpoint
   *  Each object contains: endpoint, requestCount, successRate, avgLatencyMs
   */
  snapshot() {
    return Array.from(this.requests.entries()).map(([endpoint, m]) => ({
      endpoint,
      requestCount: m.count,
      successRate: m.success / m.count,
      avgLatencyMs: m.totalDuration / m.count,
    }));
  }

  /**
   * Reset all collected metrics
   */
  reset() {
    this.requests.clear();
  }
}
