import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "../css/MasonryColumns.module.css";
import { MeasuredItem } from "../helper/MeasuredItem";

export function MasonryColumns({
  children,
  columns = 3,
  columnWidth = 280, // now number (px)
  gap = "var(--spacing-md)",
  align = "center",
}) {
  const containerRef = useRef(null);

  const items = React.Children.toArray(children);

  const [heights, setHeights] = useState(Array(items.length).fill(0));
  const [isMeasured, setIsMeasured] = useState(false);

  const [actualColumns, setActualColumns] = useState(columns);

  const handleMeasure = (index, height) => {
    setHeights((prev) => {
      const next = [...prev];
      next[index] = height;
      return next;
    });
  };

  // update actual columns based on container width
  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;
      const maxCols = Math.floor(width / columnWidth);

      setActualColumns(Math.max(1, Math.min(columns, maxCols)));
    };

    updateColumns();

    const ro = new ResizeObserver(updateColumns);
    ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, [columns, columnWidth]);

  // check if all measured
  useEffect(() => {
    if (heights.every((h) => h > 0)) {
      setIsMeasured(true);
    }
  }, [heights]);

  // distribute items once heights are ready
  const columnsData = useMemo(() => {
    const cols = Array.from({ length: actualColumns }, () => ({
      height: 0,
      items: [],
    }));

    if (!isMeasured) {
      items.forEach((item, index) => {
        cols[index % actualColumns].items.push(
          <MeasuredItem key={index} onMeasure={(h) => handleMeasure(index, h)}>
            {item}
          </MeasuredItem>,
        );
      });
      return cols;
    }

    items.forEach((item, index) => {
      const minIndex = cols
        .map((c) => c.height)
        .indexOf(Math.min(...cols.map((c) => c.height)));

      cols[minIndex].items.push(item);
      cols[minIndex].height += heights[index];
    });

    return cols;
  }, [items, actualColumns, isMeasured, heights]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{
        padding: gap,
        gap,
        justifyContent: align === "center" ? "center" : "flex-start",
      }}
    >
      {columnsData.map((column, i) => (
        <div
          key={i}
          className={styles.column}
          style={{ width: columnWidth, gap }}
        >
          {column.items}
        </div>
      ))}
    </div>
  );
}
