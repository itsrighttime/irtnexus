/**
 * Returns a promise that resolves after a specified delay.
 *
 * @param ms - The number of milliseconds to wait before resolving.
 * @returns A promise that resolves after the given delay.
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
