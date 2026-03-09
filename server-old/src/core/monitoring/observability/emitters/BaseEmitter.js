/**
 * BaseEmitter
 *
 * Abstract base class for all observability emitters (audit, logging, analytics, etc.).
 * Defines the interface that all concrete emitters must implement.
 */
export class BaseEmitter {
  /**
   * Emit an event to the underlying system (database, console, message queue, etc.)
   * This method **must** be implemented by subclasses.
   *
   * @param {Object} _event - The structured event payload
   * @returns {Promise<void>}
   */
  async emit(_event) {
    throw new Error("emit() must be implemented by subclass");
  }

  /**
   * Flush any buffered events to the underlying system.
   * Optional: useful for batching emitters that buffer events in memory.
   *
   * @returns {Promise<void>}
   */
  async flush() {
    // Default implementation does nothing
    // Subclasses may override if batching is supported
  }
}
