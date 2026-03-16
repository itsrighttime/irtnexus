"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import throttle from "lodash.throttle";
import {
  preserveScrollOnAppend,
  preserveScrollOnRestore,
} from "./helper/scroll.helper";
import {
  getAppendIndices,
  getRestoreIndices,
} from "./helper/pagination.helper";
import type { RefObject } from "react";

interface UseInfiniteScrollOptions<T> {
  data: T[];
  initialChunk: number;
  chunkSize?: number;
  maxItems?: number;
  scrollContainerRef: RefObject<HTMLElement>;
}

interface UseInfiniteScrollReturn<T> {
  visibleData: T[];
  appendItems: () => void;
  restoreItems: () => void;
}

export const useInfiniteScroll = <T>({
  data,
  initialChunk,
  chunkSize = 10,
  maxItems = 50,
  scrollContainerRef,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> => {
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(initialChunk);
  const [visibleData, setVisibleData] = useState<T[]>([]);

  useEffect(() => {
    setStartIndex(0);
    setEndIndex(initialChunk);
    setVisibleData(data.slice(0, initialChunk));
  }, [data, initialChunk]);

  const appendItems = useCallback(() => {
    const container = scrollContainerRef?.current;
    if (!container) return;

    const indices = getAppendIndices({
      startIndex,
      endIndex,
      chunkSize,
      maxItems,
      dataLength: data.length,
    });

    if (!indices) return;

    const prevScrollTop = container.scrollTop;
    const prevScrollHeight = container.scrollHeight;

    setStartIndex(indices.newStart);
    setEndIndex(indices.newEnd);
    setVisibleData(data.slice(indices.newStart, indices.newEnd));

    setTimeout(() => {
      preserveScrollOnAppend(container, prevScrollHeight, prevScrollTop);
    }, 0);
  }, [data, startIndex, endIndex, chunkSize, maxItems, scrollContainerRef]);

  const restoreItems = useCallback(() => {
    const container = scrollContainerRef?.current;
    if (!container) return;

    const indices = getRestoreIndices({
      startIndex,
      endIndex,
      chunkSize,
    });

    if (!indices) return;

    const prevScrollHeight = container.scrollHeight;

    setStartIndex(indices.newStart);
    setEndIndex(indices.newEnd);
    setVisibleData(data.slice(indices.newStart, indices.newEnd));

    setTimeout(() => {
      preserveScrollOnRestore(container, prevScrollHeight);
    }, 0);
  }, [startIndex, endIndex, data, chunkSize, scrollContainerRef]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef?.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    const atBottom = scrollHeight - scrollTop - clientHeight < 5;
    const atTop = scrollTop === 0;

    if (atBottom) appendItems();
    if (atTop) restoreItems();
  }, [appendItems, restoreItems, scrollContainerRef]);

  const throttledScroll = useMemo(() => {
    return throttle(handleScroll, 100);
  }, [handleScroll]);

  useEffect(() => {
    const container = scrollContainerRef?.current;
    if (!container) return;

    container.addEventListener("scroll", throttledScroll);

    return () => {
      container.removeEventListener("scroll", throttledScroll);
      throttledScroll.cancel();
    };
  }, [throttledScroll, scrollContainerRef]);

  return {
    visibleData,
    appendItems,
    restoreItems,
  };
};
