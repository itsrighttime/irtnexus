import { type CSSProperties } from "react";
import type { FormSettings } from "../types/formConfig.types";

export type ResolvedFormSettings = Required<FormSettings>;

export function useFormSettings(
  settings: FormSettings = {},
  style: CSSProperties = {},
): {
  _settings: ResolvedFormSettings;
  formStyle: CSSProperties;
} {
  const _settings: ResolvedFormSettings = {
    showLabelAlways: false,
    gap: "2rem",
    color: "var(--color-primary)",
    width: "100%",
    height: "100%",
    backgroundColor: "var(--color-background)",
    textColor: "var(--color-text)",
    labelColor: "var(--color-text-muted)",
    border: "1px solid var(--color-border)",
    borderRadius: "5px",
    boxShadow: "var(--shadow-lg)",
    successPage: {
      show: false,
      message: "Your form has been submitted successfully!",
      label: "Go to Home",
      href: "/",
    },
    ...settings,
  };

  const formStyle: CSSProperties = {
    gap: _settings.gap,
    border: _settings.border,
    borderRadius: _settings.borderRadius,
    boxShadow: _settings.boxShadow,
    ...style,
  };

  console.log("DDDD : ", { settings, style, _settings, formStyle });

  return { _settings, formStyle };
}
