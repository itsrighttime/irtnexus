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
      const endpoint = config?.[FPs.ENDPOINT];

      if (!endpoint) {
        onSubmit?.(formData);
        setFormStatus(FORM_STATUS.submitted);

        addAlert(
          `${config[FPs.TITLE] || "Details"} Submitted Successfully`,
          "success",
        );
        return;
      }

      const response: BackendResponse = await submitToBackend(
        formData,
        endpoint,
      );

      // const response = { success: true, data: { message: "" }, message: "" };

      if (response?.success) {
        // Clear localStorage

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
