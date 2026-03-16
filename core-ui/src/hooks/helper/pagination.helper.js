export const getAppendIndices = ({ startIndex, endIndex, chunkSize, maxItems, dataLength, }) => {
    const remaining = dataLength - endIndex;
    if (remaining <= 0)
        return null;
    const newEnd = Math.min(endIndex + chunkSize, dataLength);
    let newStart = startIndex;
    const nextChunkLength = newEnd - startIndex;
    if (nextChunkLength > maxItems) {
        newStart += chunkSize;
    }
    return { newStart, newEnd };
};
export const getRestoreIndices = ({ startIndex, endIndex, chunkSize, }) => {
    if (startIndex === 0)
        return null;
    const newStart = Math.max(startIndex - chunkSize, 0);
    const newEnd = endIndex - chunkSize;
    if (newStart >= newEnd)
        return null;
    return { newStart, newEnd };
};
