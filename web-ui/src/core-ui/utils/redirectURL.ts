/**
 * Redirects the browser to the specified target URL.
 *
 * @param target - The URL to navigate to. If falsy, no action is taken.
 */
export const redirectURL = (target?: string): void => {
  if (target) {
    window.location.href = target;
  }
};
