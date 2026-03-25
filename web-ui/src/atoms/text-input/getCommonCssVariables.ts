export const getCommonCssVariables = (
  isBorder: boolean,
  color: any,
  width: any,
) => {
  const cssBorder = `1px solid ${color || `var(--colorCyan)`}`;
  const cssVariable = {
    "--color": color ? color : "var(--colorCyan)",
    "--borderTop": isBorder ? cssBorder : "none",
    "--borderLeft": isBorder ? cssBorder : "none",
    "--borderRight": isBorder ? cssBorder : "none",
    "--borderBottom": isBorder
      ? cssBorder
      : `2px solid ${color || "var(--colorCyan"}`,
    "--width": width,
    "--borderRadius": isBorder ? "5px" : "0px",
  };
  return cssVariable;
};
