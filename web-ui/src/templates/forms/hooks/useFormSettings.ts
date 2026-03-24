import { type CSSProperties } from "react";

type FormSettings = {
  showLabelAlways?: boolean;
  gap?: string;
  color?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  border?: string;
  borderRadius?: string;
};

type ResolvedFormSettings = Required<FormSettings>;

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
    color: "var(--colorCyan)",
    width: "100%",
    height: "100%",
    backgroundColor: "var(--colorWhite)",
    textColor: "var(--colorSimple)",
    labelColor: "var(--colorGray4)",
    border: "none",
    borderRadius: "5px",
    ...settings,
  };

  const formStyle: CSSProperties = {
    gap: _settings.gap,
    width: _settings.width,
    height: _settings.height,
    border: _settings.border,
    borderRadius: _settings.borderRadius,
    ...style,
  };

  return { _settings, formStyle };
}
