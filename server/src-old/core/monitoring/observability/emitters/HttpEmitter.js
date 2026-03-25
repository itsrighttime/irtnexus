import { HEADERS } from "#config";
import { BaseEmitter } from "./BaseEmitter.js";

/**
 * HttpEmitter
 *
 * Emits observability events to a remote HTTP endpoint.
 * Can be used for centralized logging, audit APIs, or analytics pipelines.
 *
 * Inherits from BaseEmitter and implements the required emit() method.
 */
export class HttpEmitter extends BaseEmitter {
  /**
   * @param {Object} options
   * @param {string} options.endpoint - The remote URL to POST events to
   * @param {Object} [options.headers={}] - Optional HTTP headers to include
   */
  constructor({ endpoint, headers = {} }) {
    super();
    this.endpoint = endpoint;
    this.headers = headers;
  }

  /**
   * Emit an event by sending it as a POST request to the configured endpoint.
   *
   * @param {Object} event - The structured event payload
   * @returns {Promise<void>}
   */
  async emit(event) {
    await fetch(this.endpoint, {
      method: "POST",
      headers: {
        [HEADERS.CONTENT_TYPE]: "application/json",
        ...this.headers, // Merge any custom headers
      },
      body: JSON.stringify(event),
    });
  }
}
