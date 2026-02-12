import { useEffect, useRef } from "react";

export function MeasuredItem({ children, onMeasure }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const measure = () => {
      if (!ref.current) return;
      const height = ref.current.offsetHeight;
      onMeasure(height);
    };

    measure();

    // optional: watch for changes
    const ro = new ResizeObserver(measure);
    ro.observe(ref.current);

    return () => ro.disconnect();
  }, [onMeasure]);

  return <div ref={ref}>{children}</div>;
}
