export const getCommonCssVariables = (
  isBorder: boolean,
  color?: string,
  width?: string,
): React.CSSProperties => {
  const cssBorder = `1px solid ${color || "var(--colorCyan)"}`;

  const cssVariable: React.CSSProperties = {
    ["--color" as any]: color ?? "var(--colorCyan)",
    ["--borderTop" as any]: isBorder ? cssBorder : "none",
    ["--borderLeft" as any]: isBorder ? cssBorder : "none",
    ["--borderRight" as any]: isBorder ? cssBorder : "none",
    ["--borderBottom" as any]: isBorder
      ? cssBorder
      : `2px solid ${color || "var(--colorCyan)"}`,
    ["--width" as any]: width ?? "200px",
    ["--borderRadius" as any]: isBorder ? "5px" : "0px",
  };

  return cssVariable;
};
