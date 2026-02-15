import client from "prom-client";
import express from "express";

/**
 * PrometheusExporter
 *
 * Exposes Prometheus metrics for HTTP requests, business events,
 * security events, and external dependency calls.
 *
 * Provides convenience methods to record metrics programmatically.
 */
export class PrometheusExporter {
  /**
   * @param {Object} options
   * @param {number} [options.port=9091] - Port for /metrics endpoint
   * @param {string} options.serviceName - Service name for global labels
   * @param {string} options.environment - Environment (prod, staging, dev)
   */
  constructor({ port = 9091, serviceName, environment }) {
    /** Prometheus registry for this service */
    this.register = new client.Registry();

    // Global labels attached to all metrics
    this.register.setDefaultLabels({
      service: serviceName,
      env: environment,
    });

    // Collect default Node.js metrics automatically
    client.collectDefaultMetrics({ register: this.register });

    /* -------------------------
       Core HTTP Metrics
    -------------------------- */

    /** Counts all HTTP requests by method, endpoint, and status class (2xx/3xx/4xx/5xx) */
    this.httpRequestsTotal = new client.Counter({
      name: "http_requests_total",
      help: "Total HTTP requests",
      labelNames: ["method", "endpoint", "status_class"],
      registers: [this.register],
    });

    /** Records request latency (ms) for each method and endpoint */
    this.httpRequestDuration = new client.Histogram({
      name: "http_request_duration_ms",
      help: "HTTP request latency",
      labelNames: ["method", "endpoint"],
      buckets: [25, 50, 100, 200, 400, 800, 1500, 3000], // latency buckets in ms
      registers: [this.register],
    });

    /** Tracks current in-flight HTTP requests */
    this.inFlightRequests = new client.Gauge({
      name: "http_in_flight_requests",
      help: "Current in-flight HTTP requests",
      registers: [this.register],
    });

    /* -------------------------
       Business Metrics
    -------------------------- */

    /** Counts business events, e.g., user actions or domain events */
    this.businessEventsTotal = new client.Counter({
      name: "business_events_total",
      help: "Business events count",
      labelNames: ["event_name", "outcome"], // success/failure
      registers: [this.register],
    });

    /** Counts system events by severity (info, warn, error) */
    this.systemEventsTotal = new client.Counter({
      name: "system_events_total",
      help: "System events by severity",
      labelNames: ["severity"],
      registers: [this.register],
    });

    /* -------------------------
       Security Metrics
    -------------------------- */

    /** Tracks authentication/authorization events */
    this.authEventsTotal = new client.Counter({
      name: "auth_events_total",
      help: "Authentication & authorization events",
      labelNames: ["event_type", "outcome"], // login, logout, token refresh
      registers: [this.register],
    });

    /** Tracks access denied events separately */
    this.accessDeniedTotal = new client.Counter({
      name: "access_denied_total",
      help: "Access denied events",
      registers: [this.register],
    });

    /* -------------------------
       External Dependency Metrics
    -------------------------- */

    /** Records latency of external calls (databases, APIs, etc.) */
    this.externalCallDuration = new client.Histogram({
      name: "external_call_duration_ms",
      help: "External dependency latency",
      labelNames: ["dependency", "outcome"], // success/failure
      buckets: [50, 100, 300, 500, 1000, 2000, 5000],
      registers: [this.register],
    });

    /* -------------------------
       Metrics Endpoint (Optional)
    -------------------------- */

    // Uncomment if you want Prometheus to scrape /metrics automatically
    /*
    const app = express();
    app.get("/metrics", async (_req, res) => {
      res.set("Content-Type", this.register.contentType);
      res.end(await this.register.metrics());
    });

    app.listen(port, () =>
      console.log(`Prometheus metrics available at :${port}/metrics`)
    );
    */
  }

  /* -------------------------
     Registry Access
  -------------------------- */

  /** Returns the underlying Prometheus registry */
  getRegistry() {
    return this.register;
  }

  /* -------------------------
     HTTP Request Observability
  -------------------------- */

  /** Call at the start of an HTTP request to increment in-flight gauge */
  startRequest() {
    this.inFlightRequests.inc();
  }

  /**
   * Call at the end of an HTTP request to record metrics
   * @param {Object} params
   * @param {string} params.method - HTTP method
   * @param {string} params.endpoint - Route path or endpoint
   * @param {number} params.statusCode - HTTP response status
   * @param {number} params.durationMs - Duration of request in ms
   */
  endRequest({ method, endpoint, statusCode, durationMs }) {
    this.inFlightRequests.dec();

    const statusClass = `${Math.floor(statusCode / 100)}xx`;

    this.httpRequestsTotal.inc({
      method,
      endpoint,
      status_class: statusClass,
    });

    this.httpRequestDuration.observe({ method, endpoint }, durationMs);
  }

  /* -------------------------
     Business Event Metrics
  -------------------------- */

  /**
   * Record a business/domain event
   * @param {Object} params
   * @param {string} params.name - Event name
   * @param {boolean} params.success - Outcome
   */
  recordBusinessEvent({ name, success }) {
    this.businessEventsTotal.inc({
      event_name: name,
      outcome: success ? "success" : "failure",
    });
  }

  /* -------------------------
     Security Metrics
  -------------------------- */

  /**
   * Record authentication/authorization events
   * @param {Object} params
   * @param {string} params.type - Event type (login, logout)
   * @param {boolean} params.success - Outcome
   */
  recordAuthEvent({ type, success }) {
    this.authEventsTotal.inc({
      event_type: type,
      outcome: success ? "success" : "failure",
    });

    if (!success) {
      this.accessDeniedTotal.inc();
    }
  }

  /* -------------------------
     External Dependency Metrics
  -------------------------- */

  /**
   * Record an external dependency call
   * @param {Object} params
   * @param {string} params.dependency - Name of external service
   * @param {number} params.durationMs - Latency in milliseconds
   * @param {boolean} params.success - Outcome
   */
  recordExternalCall({ dependency, durationMs, success }) {
    this.externalCallDuration.observe(
      { dependency, outcome: success ? "success" : "failure" },
      durationMs,
    );
  }
}
