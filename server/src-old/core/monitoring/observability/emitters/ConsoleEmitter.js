import { logger } from "#utils";
import { BaseEmitter } from "./BaseEmitter.js";

/**
 * ConsoleEmitter
 *
 * A simple observability emitter that outputs events to the console.
 * Useful for local development, debugging, or analytics when persistence is not needed.
 *
 * Inherits from BaseEmitter and implements the required emit() method.
 */
export class ConsoleEmitter extends BaseEmitter {
  /**
   * Emit an event by logging it to the console.
   *
   * @param {Object} event - The structured event to emit
   * @returns {Promise<void>}
   */
  async emit(event) {
    // Optionally, you could use your logger instead of console.log:
    // logger.info(JSON.stringify(event));

    console.log(event);
  }
}
