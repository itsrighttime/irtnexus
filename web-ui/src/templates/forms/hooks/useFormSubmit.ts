"use client";

import type { FormEvent } from "react";
import { deleteFile } from "../helper/indexedDb";
import { configToSchema } from "../validation/configToSchema";
import { validateResponse } from "../validation/validateResponse";
import { submitToBackend } from "../helper/submitTobackend";
import { FORM_STATUS, type FormStatus } from "../helper/formStatus";
import { FIELDS_PROPS as FPs } from "../validation/helper/fields";
import type { FormConfig } from "../types/formConfig.types";

interface UseFormSubmitProps {
  config: FormConfig;
  formData: Record<string, any>;
  setFormStatus: (status: FormStatus) => void;
  setFormStatusError: (errors: Record<string, any>) => void;
  addAlert: (
    message: string,
    type: "success" | "error" | "info" | "warning",
  ) => void;
  onSubmit?: (data: Record<string, any>) => void;
  STORAGE_KEY: string;
  isFileLike: (v: unknown) => v is File | Blob;
  isFileArray: (v: unknown) => v is (File | Blob)[];
}

interface BackendResponse {
  success?: boolean;
  message?: string;
  data?: {
    message?: string;
  };
}

export function useFormSubmit({
  config,
  formData,
  setFormStatus,
  setFormStatusError,
  addAlert,
  onSubmit,
  STORAGE_KEY,
  isFileLike,
  isFileArray,
}: UseFormSubmitProps) {
  const handleSubmit = async (e: FormEvent<Element>) => {
    e.preventDefault();
    setFormStatus(FORM_STATUS.submitting);

    const schema = configToSchema(config);
    const { valid, errors } = validateResponse(schema, formData);

    if (!valid) {
      setFormStatus(FORM_STATUS.error);
      setFormStatusError(errors);
      return;
    }

    try {
      // const endpoint = config?.[FPs.ENDPOINT]
      const endpoint = ""; // TODO

      const response: BackendResponse = await submitToBackend(
        formData,
        endpoint,
      );

      if (response?.success) {
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEY);

        // Cleanup files from IndexedDB
        for (const key of Object.keys(formData)) {
          const value = formData[key];

          if (isFileLike(value)) {
            await deleteFile(`${STORAGE_KEY}::${key}`);
          }

          if (isFileArray(value)) {
            for (let idx = 0; idx < value.length; idx++) {
              await deleteFile(`${STORAGE_KEY}::${key}_${idx}`);
            }
          }
        }

        onSubmit?.(formData);

        setFormStatus(FORM_STATUS.submitted);

        addAlert(
          `${config[FPs.TITLE] || "Details"} Submitted Successfully`,
          "success",
        );
      } else {
        setFormStatus(FORM_STATUS.failed);

        setFormStatusError({
          general: {
            label: "Backend Validation",
            error:
              response?.data?.message ||
              response?.message ||
              "Submission failed",
          },
        });

        addAlert("Resolve the errors and submit again", "error");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Network error";

      setFormStatus(FORM_STATUS.failed);

      setFormStatusError({
        general: {
          label: "Backend Validation",
          error: errorMessage,
        },
      });

      addAlert("Resolve the errors and submit again", "error");
    }
  };

  return { handleSubmit };
}
