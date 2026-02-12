import { MySQLAuditEmitter } from "../observability/emitters/MySQLAuditEmitter.js";
import { Observability } from "../observability/Observability.js";
import { AuditChain } from "./AuditChain.js";
import { MySQLAuditStore } from "./MySQLAuditStore.js";
import { ConsoleEmitter } from "../observability/emitters/ConsoleEmitter.js";
import { MetricsCollector } from "../observability/metrics/MetricsCollector.js";
import { PrometheusExporter } from "../metrics/PrometheusExporter.js";
import { auditServiceName } from "../observability/utils/servieName.js";

/**
 * Initialize the audit chain.
 * This ensures that each audit event will include a
 * cryptographic link to the previous event.
 */
const auditChain = new AuditChain();

/**
 * Initialize the persistent audit store.
 * This handles writing audit events into MySQL.
 */
const auditStore = new MySQLAuditStore();

/**
 * MySQL-based audit emitter.
 * Responsible for:
 * - Receiving structured audit events
 * - Chaining them using AuditChain
 * - Persisting them into MySQL via auditStore
 */
const auditEmitter = new MySQLAuditEmitter({
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
  // sampleRate: 0.2, // Optional: sample 20% of events
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
