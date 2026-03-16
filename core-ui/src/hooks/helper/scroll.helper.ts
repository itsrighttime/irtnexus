export const preserveScrollOnAppend = (
  container: HTMLElement,
  prevScrollHeight: number,
  prevScrollTop: number,
): void => {
  const newScrollHeight = container.scrollHeight;
  const heightDiff = newScrollHeight - prevScrollHeight;
  container.scrollTop = prevScrollTop + heightDiff;
};

export const preserveScrollOnRestore = (
  container: HTMLElement,
  prevScrollHeight: number,
): void => {
  const newScrollHeight = container.scrollHeight;
  const heightDiff = newScrollHeight - prevScrollHeight;
  container.scrollTop = container.scrollTop + heightDiff;
};
