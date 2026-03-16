import { redirectURL as tempRedirectURL } from "./redirectURL";

/**
 * Redirects the browser to a specified URL while appending a "redirectBack" parameter.
 *
 * @param params - Parameters object.
 * @param params.to - The target URL to redirect to.
 * @param params.from - The current URL to be used as the redirect back URL.
 * @returns null - Always returns null.
 */
export const redirectUrlWithBack = ({
  to,
  from,
}: {
  to: string;
  from: string;
}): null => {
  tempRedirectURL(`${to}?redirectBack=${encodeURIComponent(from)}`);
  return null;
};

/**
 * Extracts and validates the "redirectBack" URL from a given URL string.
 *
 * @param url - The full URL containing the optional "redirectBack" query parameter.
 * @returns The validated redirect back URL if it exists and starts with the current origin; otherwise, null.
 */
export const getRedirectBackUrl = (url: string): string | null => {
  try {
    const fullUrl = new URL(url, window.location.origin);
    const params = new URLSearchParams(fullUrl.search);
    const redirectUrl = params.get("redirectBack");

    // Only allow URLs that start with the current origin for safety
    if (redirectUrl && redirectUrl.startsWith(window.location.origin)) {
      return redirectUrl;
    }
  } catch (err) {
    console.warn("Invalid URL passed to getRedirectBackUrl:", url, err);
  }

  return null;
};
