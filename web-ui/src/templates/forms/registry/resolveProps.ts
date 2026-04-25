import type { ResolvedFormSettings } from "../hooks/useFormSettings";
import type { PropConfig } from "./types";

type FormValues = Record<string, any>;

export function resolveProps(
  field: Record<string, any>,
  values: FormValues,
  config: PropConfig,
  onChange: (name: string, value: any) => void,
  settings: ResolvedFormSettings,
): Record<string, any> {
  const resolved: Record<string, any> = {};

  Object.entries(config).forEach(([key, rule]) => {
    // string mapping
    if (typeof rule === "string") {
      resolved[key] = field[rule];
      return;
    }

    // from state
    if (rule.fromState) {
      resolved[key] = values[field.name];
      return;
    }

    // static
    if ("static" in rule) {
      resolved[key] = rule.static;
      return;
    }

    // from + fallback
    if (rule.from) {
      resolved[key] =
        field[rule.from] ?? (rule.fallback ? field[rule.fallback] : undefined);
    }
  });

  // inject onChange globally
  resolved.setResult = (value: any) => onChange(field.name, value);
  resolved.width = settings.width;

  return resolved;
}
