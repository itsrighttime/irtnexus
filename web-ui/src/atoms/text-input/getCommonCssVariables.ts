export const getCommonCssVariables = (
  isBorder: boolean,
  color: any,
  width: any,
) => {
  const cssBorder = `1px solid ${color || `var(--color-primary)`}`;
  const cssVariable = {
    "--color": color ? color : "var(--color-primary)",
    "--borderTop": isBorder ? cssBorder : "none",
    "--borderLeft": isBorder ? cssBorder : "none",
    "--borderRight": isBorder ? cssBorder : "none",
    "--borderBottom": isBorder
      ? cssBorder
      : `2px solid ${color || "var(--color-primary"}`,
    "--width": width,
    "--borderRadius": isBorder ? "5px" : "0px",
  };
  return cssVariable;
};
