// components/FieldRenderer.tsx

"use client";

import type { FormField } from "../types/register.types";
import { COMPONENT_REGISTRY } from "../registry/componentRegistry";

import { isConditional } from "../validation/isConditional";
import { RepeatableGroup } from "./RepeatableGroup";
import { createFieldUIConfig } from "../registry/createFieldUIConfig";
import { resolveProps } from "../registry/resolveProps";
import type { ResolvedFormSettings } from "../hooks/useFormSettings";

const FIELD_UI_CONFIG = createFieldUIConfig();

interface FieldRendererProps {
  field: FormField;
  value: Record<string, any>;
  onChange: (name: string, value: any, isError?: boolean) => void;
  settings: ResolvedFormSettings;
}

export function FieldRenderer({
  field,
  value,
  onChange,
  settings,
}: FieldRendererProps) {
  // Conditional rendering
  if (field.conditional) {
    const match = isConditional(field.conditional, value);
    if (!match) return null;
  }

  // Repeatable fields
  if (field.repeatable) {
    return (
      <RepeatableGroup
        field={field}
        values={value[field.name] || [{}]}
        onChange={(v, isError) => onChange(field.name, v, isError)}
        settings={settings}
      />
    );
  }

  // UI Config
  const uiConfig = FIELD_UI_CONFIG[field.type];
  if (!uiConfig) return null;

  // Component resolution
  const Component = COMPONENT_REGISTRY[uiConfig.component];
  if (!Component) {
    console.warn(`Missing component for type: ${field.type}`);
    return null;
  }

  // Props resolution
  const props = resolveProps(field, value, uiConfig.props, onChange, settings);

  return <Component {...props} />;
}
