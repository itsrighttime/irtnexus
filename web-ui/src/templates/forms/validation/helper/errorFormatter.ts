import { FIELDS_PROPS as FPs } from "./fields.js";

type Field = Record<string, any>;

interface FieldError {
  name: string | null;
  label: string | null;
  error: string;
}

type ErrorsMap = Record<string, FieldError>;

// --- utils/errors.ts ---
function makeError(field: Field, message: string): FieldError {
  return {
    name: field[FPs.NAME] ?? null,
    label: field[FPs.LABEL] ?? null,
    error: message,
  };
}

export function pushError(
  errors: ErrorsMap,
  field: Field,
  message: string,
): void {
  const key = field[FPs.NAME] as string;
  if (!key) return;

  errors[key] = makeError(field, message);
}
