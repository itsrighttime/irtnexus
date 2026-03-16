export const preserveScrollOnAppend = (container, prevScrollHeight, prevScrollTop) => {
    const newScrollHeight = container.scrollHeight;
    const heightDiff = newScrollHeight - prevScrollHeight;
    container.scrollTop = prevScrollTop + heightDiff;
};
export const preserveScrollOnRestore = (container, prevScrollHeight) => {
    const newScrollHeight = container.scrollHeight;
    const heightDiff = newScrollHeight - prevScrollHeight;
    container.scrollTop = container.scrollTop + heightDiff;
};
