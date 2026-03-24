"use client";

import { TextInput } from "@/atoms";
import {
  FORM_FIELDS_TYPE,
  FIELDS_PROPS as FPs,
} from "../validation/helper/fields";
import { isConditional } from "../validation/isConditional";
import { RepeatableGroup } from "./RepeatableGroup";
import type { FormField } from "../types/register.types";

interface FieldRendererProps {
  field: FormField;
  value: Record<string, any>;
  onChange: (name: string, value: any, isError?: boolean) => void;
  settings: {
    color?: string;
    [key: string]: any;
  };
}

export function FieldRenderer({
  field,
  value,
  onChange,
  settings,
}: FieldRendererProps) {
  // Conditional rendering
  if (field.conditional) {
    const isMatch = isConditional(field.conditional, value);
    if (!isMatch) return null;
  }

  const color = settings.color;
  const width = "100%";

  // Repeatable group
  if (field[FPs.REPEATABLE]) {
    return (
      <RepeatableGroup
        field={field}
        values={value[field[FPs.NAME]] || [{}]}
        onChange={(v, isError) => onChange(field[FPs.NAME], v, isError)}
        settings={settings}
      />
    );
  }

  const fieldMap = {
    [FORM_FIELDS_TYPE.PASSWORD]: (
      <TextInput
        width={width}
        type="password"
        color={color}
        key={field[FPs.NAME]}
        label={field[FPs.LABEL]}
        placeholder={field[FPs.PLACEHOLDER] || field[FPs.LABEL]}
        required={field?.[FPs.REQUIRED] || false}
        value={value[field[FPs.NAME]]}
        onChange={(v) => {
          onChange(field[FPs.NAME], v);
          onChange(field[FPs.NAME], true, true); // to update Error State as valid
        }} // Update state on change
        // showLabelAlways={settings.showLabelAlways}
      />
    ),

    [FORM_FIELDS_TYPE.TEXT]: (
      <TextInput
        key={field[FPs.NAME]}
        label={field[FPs.LABEL]}
        placeholder={field[FPs.PLACEHOLDER] || field[FPs.LABEL]}
        name={field[FPs.NAME]}
        value={value[field[FPs.NAME]]}
        onChange={(v) => onChange(field[FPs.NAME], v)} // Update state on change
        width={width}
        color={color}
        // showLabelAlways={settings.showLabelAlways}
        required={field?.[FPs.REQUIRED] || false}
        // setIsFieldValid={(v) => onChange(field[FPs.NAME], v, true)}
      />
    ),
  };

  const key = field[FPs.TYPE] as keyof typeof fieldMap;
  return fieldMap[key] || null;
}
