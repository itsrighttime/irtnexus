import { useCallback, type RefObject } from "react";
import { VALIDITY } from "../helper/validity";
import { FIELDS_PROPS as FPs } from "../validation/helper/fields";
import { isConditional } from "../validation/isConditional";
import { validateResponse } from "../validation/validateResponse";
import { FORM_STATUS } from "../helper/formStatus";

type FormData = Record<string, any>;
type FormError = Record<string, string>;

interface UseFormNavigationParams {
  config: any;
  formData: FormData;
  formError: FormError;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  addAlert?: (msg: string) => void;
  setFormStatus: (status: string) => void;
  setFormStatusError: (errors: any) => void;
  scrollRef?: RefObject<HTMLElement>;
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
}: UseFormNavigationParams) {
  const isStepValid = useCallback((): boolean => {
    const fields =
      config.mode === "multi"
        ? config.steps[currentStep][FPs.FIELDS]
        : config[FPs.FIELDS];

    return fields.every((f: any) => {
      if (f[FPs.CONDITIONAL]) {
        const isMatch = isConditional(f, formData);
        if (!isMatch) return true;
      }
      return formError[f[FPs.NAME]] === VALIDITY.valid;
    });
  }, [config, currentStep, formError, formData]);

  const next = (): void => {
    const subConfig = config[FPs.STEP][currentStep][FPs.FIELDS];
    const { valid, errors } = validateResponse(subConfig, formData);

    if (valid) {
      setCurrentStep((s) => s + 1);

      if (scrollRef?.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      setFormStatus(FORM_STATUS.error);
      setFormStatusError(errors);
    }
  };

  const back = (): void => {
    setCurrentStep((s) => Math.max(0, s - 1));

    if (scrollRef?.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return { isStepValid, next, back };
}
