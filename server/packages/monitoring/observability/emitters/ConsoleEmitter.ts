import { logger } from "#utils";
import { BaseEmitter } from "./BaseEmitter";

/**
 * ConsoleEmitter
 *
 * Simple emitter that outputs events to the console.
 * Useful for local development, debugging, or analytics
 * when persistence is not required.
 */
export class ConsoleEmitter<TEvent = unknown> extends BaseEmitter<TEvent> {
  async emit(event: TEvent): Promise<void> {
    // Prefer structured logging
    logger.info("ConsoleEmitter event", { event });

    // Optional fallback:
    // console.log(event)
  }
}
