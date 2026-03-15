/**
 * BaseEmitter
 *
 * Abstract base class for all observability emitters
 * (audit, logging, analytics, metrics, etc.).
 *
 * Concrete emitters must implement `emit()`.
 */

export abstract class BaseEmitter<TEvent = unknown> {
  /**
   * Emit an event to the underlying system
   * (database, console, message queue, etc.)
   */
  abstract emit(event: TEvent): Promise<void>;

  /**
   * Flush buffered events if batching is used.
   * Default implementation does nothing.
   */
  async flush(): Promise<void> {
    // optional override
  }
}
