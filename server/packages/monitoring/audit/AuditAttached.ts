import { PostgresAuditEmitter } from "../observability/emitters/MySQLAuditEmitter";
import { Observability } from "../observability/Observability";
import { AuditChain } from "./AuditChain";
import { PostgresAuditStore } from "./PostgresAuditStore";
import { ConsoleEmitter } from "../observability/emitters/ConsoleEmitter";
import { MetricsCollector } from "../observability/metrics/MetricsCollector";
import { PrometheusExporter } from "../metrics/PrometheusExporter";
import { auditServiceName } from "../observability/utils/servieName";

/**
 * Initialize the persistent audit store.
 * This handles writing audit events into MySQL.
 */
const auditStore = new PostgresAuditStore();

/**
 * Initialize the audit chain.
 * This ensures that each audit event will include a
 * cryptographic link to the previous event.
 */
const auditChain = new AuditChain(auditStore);

/**
 * MySQL-based audit emitter.
 * Responsible for:
 * - Receiving structured audit events
 * - Chaining them using AuditChain
 * - Persisting them into MySQL via auditStore
 */
const auditEmitter = new PostgresAuditEmitter({
  auditChain,
  store: auditStore,
});

/**
 * Prometheus exporter for metrics.
 * Exposes metrics endpoint for scraping.
 */
const prometheusExporter = new PrometheusExporter({
  port: 9091,
  serviceName: auditServiceName,
  environment: "prod",
});

/**
 * Central observability instance.
 *
 * Responsibilities:
 * - Emits events to configured emitters
 * - Collects metrics via MetricsCollector
 * - Exposes Prometheus metrics via PrometheusExporter
 * - Supports sampling and multiple emitters
 */
const obs = new Observability({
  serviceName: auditServiceName,
  environment: "prod",
  version: "1.0.0",
  emitters: [
    auditEmitter, // Immutable, cryptographically linked audit logs
    // new ConsoleEmitter(), // Optional: debug / analytics output
  ],
  metricsCollector: new MetricsCollector(),
  prometheusExporter,
  // sampleRate: 0.2, // Optional: sample 20% of events, TODO : Add the samplReate
});

/**
 * Export the central observability instance
 * for use across the application.
 */
export const observability = obs;

/**
 * Export Prometheus registry to allow custom metrics registration.
 */
export const prometheusRegistry = prometheusExporter.getRegistry();
