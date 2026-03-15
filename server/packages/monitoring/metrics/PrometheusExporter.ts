import client, { Counter, Gauge, Histogram, Registry } from "prom-client";
import { PrometheusExporterOptions, StatusClass } from "../observability/types";



export class PrometheusExporter {
  private register: Registry;

  private httpRequestsTotal: Counter<"method" | "endpoint" | "status_class">;
  private httpRequestDuration: Histogram<"method" | "endpoint">;
  private inFlightRequests: Gauge<string>;

  private businessEventsTotal: Counter<"event_name" | "outcome">;
  
  private authEventsTotal: Counter<"event_type" | "outcome">;
  
  private externalCallDuration: Histogram<"dependency" | "outcome">;
  
  systemEventsTotal: Counter<"severity">;
  accessDeniedTotal: Counter<string>;

  constructor({ serviceName, environment }: PrometheusExporterOptions) {
    this.register = new client.Registry();

    this.register.setDefaultLabels({
      service: serviceName,
      env: environment,
    });

    client.collectDefaultMetrics({ register: this.register });

    /* -------------------------
       HTTP Metrics
    -------------------------- */

    this.httpRequestsTotal = new client.Counter({
      name: "http_requests_total",
      help: "Total HTTP requests",
      labelNames: ["method", "endpoint", "status_class"],
      registers: [this.register],
    });

    this.httpRequestDuration = new client.Histogram({
      name: "http_request_duration_ms",
      help: "HTTP request latency",
      labelNames: ["method", "endpoint"],
      buckets: [25, 50, 100, 200, 400, 800, 1500, 3000],
      registers: [this.register],
    });

    this.inFlightRequests = new client.Gauge({
      name: "http_in_flight_requests",
      help: "Current in-flight HTTP requests",
      registers: [this.register],
    });

    /* -------------------------
       Business Metrics
    -------------------------- */

    this.businessEventsTotal = new client.Counter({
      name: "business_events_total",
      help: "Business events count",
      labelNames: ["event_name", "outcome"],
      registers: [this.register],
    });

    this.systemEventsTotal = new client.Counter({
      name: "system_events_total",
      help: "System events by severity",
      labelNames: ["severity"],
      registers: [this.register],
    });

    /* -------------------------
       Security Metrics
    -------------------------- */

    this.authEventsTotal = new client.Counter({
      name: "auth_events_total",
      help: "Authentication & authorization events",
      labelNames: ["event_type", "outcome"],
      registers: [this.register],
    });

    this.accessDeniedTotal = new client.Counter({
      name: "access_denied_total",
      help: "Access denied events",
      registers: [this.register],
    });

    /* -------------------------
       External Dependencies
    -------------------------- */

    this.externalCallDuration = new client.Histogram({
      name: "external_call_duration_ms",
      help: "External dependency latency",
      labelNames: ["dependency", "outcome"],
      buckets: [50, 100, 300, 500, 1000, 2000, 5000],
      registers: [this.register],
    });
  }

  /* -------------------------
     Registry Access
  -------------------------- */

  getRegistry(): Registry {
    return this.register;
  }

  /* -------------------------
     HTTP Observability
  -------------------------- */

  startRequest(): void {
    this.inFlightRequests.inc();
  }

  endRequest({
    method,
    endpoint,
    statusCode,
    durationMs,
  }: {
    method: string;
    endpoint: string;
    statusCode: number;
    durationMs: number;
  }): void {
    this.inFlightRequests.dec();

    const statusClass: StatusClass =
      `${Math.floor(statusCode / 100)}xx` as StatusClass;

    this.httpRequestsTotal.inc({
      method,
      endpoint,
      status_class: statusClass,
    });

    this.httpRequestDuration.observe({ method, endpoint }, durationMs);
  }

  /* -------------------------
     Business Metrics
  -------------------------- */

  recordBusinessEvent({
    name,
    success,
  }: {
    name: string;
    success: boolean;
  }): void {
    this.businessEventsTotal.inc({
      event_name: name,
      outcome: success ? "success" : "failure",
    });
  }

  /* -------------------------
     Security Metrics
  -------------------------- */

  recordAuthEvent({ type, success }: { type: string; success: boolean }): void {
    this.authEventsTotal.inc({
      event_type: type,
      outcome: success ? "success" : "failure",
    });

    if (!success) {
      this.accessDeniedTotal.inc();
    }
  }

  /* -------------------------
     External Dependencies
  -------------------------- */

  recordExternalCall({
    dependency,
    durationMs,
    success,
  }: {
    dependency: string;
    durationMs: number;
    success: boolean;
  }): void {
    this.externalCallDuration.observe(
      {
        dependency,
        outcome: success ? "success" : "failure",
      },
      durationMs,
    );
  }
}
