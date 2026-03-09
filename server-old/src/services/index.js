export * as userService from "./user/user.service.js";

/**
 *
 * TODO :
 * - update logic to handle the event in Observability to record action: {},  resource: {},   metadata: {},
 * - Add the kafka emitter to send the observability events to kafka topic for further processing
 * - Update for PrometheusExporter to add more business specific metrics as needed
 * - Add the Grafana dashboard json files for visualizing the metrics
 * - checkpoint strategy for search long audit chains
 *
 */
