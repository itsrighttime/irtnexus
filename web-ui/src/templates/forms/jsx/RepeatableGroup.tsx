"use client";

import { useMemo } from "react";
import { FieldRenderer } from "./FieldRenderer";
import styles from "../css/GenericForm.module.css";
import { FIELDS_PROPS } from "../validation/helper/fields";
import { Icons } from "@/assets/icons";
import { useInitializeForm } from "../hooks/useInitializeForm";
import { Button } from "@/atoms";
import type { FormField } from "../types/register.types";

const { crossIcon } = Icons;

interface RepeatableGroupSettings {
  color?: string;
  [key: string]: any;
}

// Each repeated item can have _uid plus arbitrary dynamic fields
interface RepeatableItem {
  _uid?: string;
  [key: string]: any;
}

interface RepeatableGroupProps {
  field: FormField;
  values?: RepeatableItem[];
  onChange: (updatedValues: RepeatableItem[], isError?: boolean) => void;
  settings: RepeatableGroupSettings;
}

/**
 * RepeatableGroup Component
 *
 * Renders a group of fields that can be repeated multiple times within a form.
 */
export function RepeatableGroup({
  field,
  values = [{}],
  onChange,
  settings,
}: RepeatableGroupProps) {
  const { initialState } = useInitializeForm(field[FIELDS_PROPS.FIELDS]);

  // Ensure every item has a unique internal id (for React key)
  const itemsWithIds = useMemo(
    () =>
      values.map((v) => ({
        _uid: v._uid || crypto.randomUUID(),
        ...v,
      })),
    [values],
  );

  const handleItemChange = (
    index: number,
    name: string,
    value: any,
    isError?: boolean,
  ) => {
    const updated = [...itemsWithIds];

    // Guard against undefined item
    if (updated[index]) {
      // Allow dynamic key assignment
      updated[index] = { ...updated[index], [name]: value };
    }

    onChange(updated, isError);
  };

  const handleCrossClick = (indx: number) => {
    const updated = itemsWithIds.filter((_, i) => i !== indx);
    onChange(updated);
  };

  const handleMore = () => {
    onChange([...values, { ...initialState, _uid: crypto.randomUUID() }]);
  };

  const color = settings.color;

  return (
    <div className={styles.repeatableGroup}>
      <label>{field[FIELDS_PROPS.LABEL]}</label>
      {itemsWithIds.map((item, idx) => (
        <div key={item._uid} className={styles.repeatableItem}>
          {values.length > 1 && (
            <div className={styles.repeatableCross}>
              <Button
                iconOnly
                iconLeft={crossIcon}
                color="var(--colorWhite)"
                style={{
                  borderRadius: "50%",
                  backgroundColor: "var(--colorRed)",
                }}
                onClick={() => handleCrossClick(idx)}
              />
            </div>
          )}

          {field[FIELDS_PROPS.FIELDS]?.map((subField) => (
            <FieldRenderer
              key={subField[FIELDS_PROPS.NAME]}
              field={subField}
              value={item}
              onChange={(name, val, isError) =>
                handleItemChange(idx, name, val, isError)
              }
              settings={settings}
            />
          ))}
        </div>
      ))}
      <Button onClick={handleMore} color={color}>
        {field[FIELDS_PROPS.MORE_LABEL]}
      </Button>
    </div>
  );
}
