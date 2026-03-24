"use client";

// RepeatableGroup.jsx
import { FieldRenderer } from "./FieldRenderer.jsx";
import { Button } from "../../../InputFields/Actions/jsx/Button.jsx";
import styles from "../css/GenericForm.module.css";
import { FIELDS_PROPS } from "../validation/helper/fields.js";
import { IconButton } from "../../../InputFields/Actions/jsx/IconButton.jsx";
import { crossIcon } from "../../../utils/icons.jsx";
import { useMemo } from "react";
import { useInitializeForm } from "../hooks/useInitializeForm.js";

/**
 * RepeatableGroup Component
 *
 * Renders a group of fields that can be repeated multiple times within a form.
 * Useful for dynamic lists or arrays of similar inputs (e.g., multiple addresses, contacts, or items).
 *
 * Props:
 * @param {Object} field - Field configuration object containing label, sub-fields, and more-label.
 * @param {Array<Object>} [values=[{}]] - Array of values representing each repeated item.
 * @param {Function} onChange - Callback fired when any field value changes or items are added/removed.
 *                               Receives updated values array and error status.
 * @param {Object} settings - Additional settings like color and other UI configurations.
 *
 * Behavior:
 * - Initializes each repeated item with default state.
 * - Adds a unique internal _uid to each item for consistent React keys.
 * - Allows adding new items using the "More" button.
 * - Allows removing items via a cross icon if there are multiple items.
 * - Delegates individual field rendering to FieldRenderer.
 * - Updates parent form state via onChange whenever any sub-field changes.
 */
export function RepeatableGroup({ field, values = [{}], onChange, settings }) {
  const { initialState, initialError } = useInitializeForm(
    field[FIELDS_PROPS.FIELDS]
  );

  // Ensure every item has a unique internal id (for React key)
  const itemsWithIds = useMemo(
    () =>
      values.map((v) => ({
        _uid: v._uid || crypto.randomUUID(),
        ...v,
      })),
    [values]
  );

  const handleItemChange = (index, name, value, isError) => {
    const updated = [...itemsWithIds];
    if (!isError) updated[index][name] = value;
    onChange(updated, isError);
  };

  const handleCrossClick = (indx) => {
    const updated = itemsWithIds.filter((_, i) => i !== indx);
    onChange(updated);
  };

  const handleMore = () => {
    onChange([...values, initialState]);
    // onChange([...values, initialError, true]);
  };

  const color = settings.color;

  return (
    <div className={styles.repeatableGroup}>
      <label>{field[FIELDS_PROPS.LABEL]}</label>
      {itemsWithIds.map((item, idx) => (
        <div key={item._uid} className={styles.repeatableItem}>
          {values.length > 1 && (
            <div className={styles.repeatableCross}>
              <IconButton
                icon={crossIcon}
                color={"var(--colorWhite)"}
                size={1}
                style={{
                  borderRadius: "50%",
                  backgroundColor: "var(--colorRed)",
                }}
                onClick={() => {
                  handleCrossClick(idx);
                }}
              />
            </div>
          )}

          {field[FIELDS_PROPS.FIELDS].map((subField) => (
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
      <Button
        text={field[FIELDS_PROPS.MORE_LABEL]}
        // onClick={() => onChange([...values, {}])}
        onClick={handleMore}
        color={color}
      />
    </div>
  );
}
