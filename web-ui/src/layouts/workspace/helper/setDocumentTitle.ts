/**
 * Sets the document's title in the browser tab.
 *
 * @param title - The new title to set for the document.
 */
export const setDocumentTitle = (title: string): void => {
  if (typeof document === "undefined") return;

  document.title = title;
};
