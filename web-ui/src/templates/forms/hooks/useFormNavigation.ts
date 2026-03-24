"use client";

import { useCallback, type RefObject } from "react";
import { VALIDITY } from "../helper/validity.js";
import { FIELDS_PROPS as FPs } from "../validation/helper/fields.js";
import { isConditional } from "../validation/isConditional.js";
import { validateResponse } from "../validation/validateResponse.js";
import { FORM_STATUS, type FormStatus } from "../helper/formStatus.js";
import type { FormConfig, FormValues } from "../types/formConfig.types";
import type { addAlertType } from "@/atoms/index.js";

interface UseFormNavigationProps {
  config: FormConfig;
  formData: FormValues;
  formError: Record<string, string>;
  currentStep: number;
  setCurrentStep: (step: number | ((prev: number) => number)) => void;
  addAlert: addAlertType;
  setFormStatus: (status: FormStatus) => void;
  setFormStatusError: (errors: Record<string, any>) => void;
  scrollRef?: RefObject<HTMLElement> | null;
}

export function useFormNavigation({
  config,
  formData,
  formError,
  currentStep,
  setCurrentStep,
  addAlert,
  setFormStatus,
  setFormStatusError,
  scrollRef,
}: UseFormNavigationProps) {
  const isStepValid = useCallback((): boolean => {
    const fields =
      config.mode === "multi"
        ? config[FPs.STEP]?.[currentStep]?.[FPs.FIELDS] || []
        : config[FPs.FIELDS] || [];

    return fields.every((f) => {
      if (f.conditional) {
        const isMatch = isConditional(f.conditional, formData);
        if (!isMatch) return true; // skip validation if conditional fails
      }
      return formError[f[FPs.NAME]] === VALIDITY.valid;
    });
  }, [config, currentStep, formData, formError]);

  const next = useCallback(() => {
    const fields =
      config.mode === "multi"
        ? config[FPs.STEP]?.[currentStep]?.[FPs.FIELDS] || []
        : config[FPs.FIELDS] || [];
    const { valid, errors } = validateResponse(fields, formData);

    if (valid) {
      setCurrentStep((prev) => prev + 1);

      // Scroll to top of container smoothly
      if (scrollRef?.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      setFormStatus(FORM_STATUS.error);
      setFormStatusError(errors);
    }
  }, [
    config,
    currentStep,
    formData,
    setCurrentStep,
    setFormStatus,
    setFormStatusError,
    scrollRef,
  ]);

  const back = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));

    if (scrollRef?.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [setCurrentStep, scrollRef]);

  return { isStepValid, next, back };
}
