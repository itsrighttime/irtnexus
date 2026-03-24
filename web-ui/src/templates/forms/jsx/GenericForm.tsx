"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  type CSSProperties,
} from "react";
import styles from "../css/GenericForm.module.css";
import { useFormNavigation } from "../hooks/useFormNavigation";
import { useFormPersistence } from "../hooks/useFormPersistence";
import { registerValidations } from "../validation/registerValidations";
import { VALIDITY } from "../helper/validity";
import { FIELDS_PROPS as FPs } from "../validation/helper/fields";
import { ErrorList } from "./ShowError";
import { SuccessMessage } from "./SuccessMessage";
import { useInitializeForm } from "../hooks/useInitializeForm";
import { FormFooter } from "./FormFooter";
import { FORM_STATUS, type FormStatus } from "../helper/formStatus";
import { useFormSettings } from "../hooks/useFormSettings";
import { useFormSubmit } from "../hooks/useFormSubmit";
import { isValidFormStructure } from "../validation/isValidFormStructure";
import { validateSchema } from "../validation/validateSchema";
import { configToSchema } from "../validation/configToSchema";
import { AlertContainer, Loading } from "@/atoms";
import { useAlerts } from "@/hooks";
import { FieldRenderer } from "./FieldRenderer";
import type {
  FormConfig,
  FormField,
  SingleStepFormConfig,
  MultiStepFormConfig,
} from "../types/formConfig.types";

interface GenericFormProps {
  config: FormConfig;
  onSubmit?: (data: Record<string, any>) => void;
  submitLabel?: string;
  style?: CSSProperties;
  settings?: Record<string, any>;
  scrollRef?: React.RefObject<HTMLElement> | null;
}

export function GenericForm({
  config,
  onSubmit,
  submitLabel = "Submit",
  style,
  settings = {},
  scrollRef = null,
}: GenericFormProps) {
  const mode = config.mode ?? "single";
  const STORAGE_KEY = `genericForm_${config.title ?? "form"}`;
  const [formStatus, setFormStatus] = useState<FormStatus>(FORM_STATUS.fill);
  const [formStatusError, setFormStatusError] = useState<Record<string, any>>(
    {},
  );
  const mountedRef = useRef(true);

  const { alertContainer, addAlert, removeAlert } = useAlerts();

  useEffect(() => {
    registerValidations();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const { _settings, formStyle } = useFormSettings(settings, style);
  const color = _settings.color;

  // --- Flatten all fields for initial state ---
  const allFields: FormField[] = useMemo(() => {
    if (config.mode === "multi") {
      const multiConfig = config as MultiStepFormConfig;
      return multiConfig[FPs.STEP]?.flatMap((s) => s[FPs.FIELDS]) ?? [];
    } else {
      const singleConfig = config as SingleStepFormConfig;
      return singleConfig[FPs.FIELDS] ?? [];
    }
  }, [config]);

  const { initialState, initialError } = useInitializeForm(allFields);

  // --- Form persistence ---
  const {
    formData,
    setFormData,
    formError,
    setFormError,
    currentStep,
    setCurrentStep,
    isFileLike,
    isFileArray,
    clearFormPersistence,
  } = useFormPersistence(STORAGE_KEY, initialState, initialError);

  // --- Form navigation ---
  const { next, back } = useFormNavigation({
    config,
    formData,
    formError,
    currentStep,
    setCurrentStep,
    addAlert,
    setFormStatus,
    setFormStatusError,
    scrollRef,
  });

  // --- Change handler ---
  const handleChange = useCallback(
    (name: string, value: any, isError?: boolean) => {
      if (!isError) setFormData((prev) => ({ ...prev, [name]: value }));
      setFormError((prev) => ({
        ...prev,
        [name]: isError
          ? value
            ? VALIDITY.valid
            : VALIDITY.invalid
          : prev[name],
      }));
    },
    [setFormData, setFormError],
  );

  // --- Submit handler ---
  const { handleSubmit } = useFormSubmit({
    config,
    formData,
    setFormStatus,
    setFormStatusError,
    addAlert,
    onSubmit,
    STORAGE_KEY,
    isFileLike,
    isFileArray,
  });

  // --- Fields to render for current step ---
  const fieldsToRender: FormField[] =
    mode === "multi"
      ? ((config as MultiStepFormConfig)[FPs.STEP]?.[currentStep]?.[
          FPs.FIELDS
        ] ?? [])
      : ((config as SingleStepFormConfig)[FPs.FIELDS] ?? []);

  // --- Validate form structure ---
  const _isValidFormStructure = isValidFormStructure(config);
  let validStructure = false;
  if (_isValidFormStructure) {
    const schema = configToSchema(config);
    const { valid } = validateSchema(schema);
    validStructure = valid;
  }

  if (!validStructure) {
    return (
      <div className={styles.formWrapper}>
        <SuccessMessage
          color="var(--color-error)"
          message="Something wrong with the structure, contact the admin!"
          onHomeClick={() => (window.location.href = "/")}
          title="ERROR !!!"
        />
      </div>
    );
  }

  // --- Loading / submitting states ---
  if (formStatus === FORM_STATUS.submitting) {
    return (
      <div className={styles.formWrapper}>
        <div className={styles.loading}>
          <Loading color={color} text="Submitting..." showText />
        </div>
      </div>
    );
  }

  if (formStatus === FORM_STATUS.error || formStatus === FORM_STATUS.failed) {
    return (
      <div className={styles.formWrapper}>
        <ErrorList
          errors={formStatusError}
          color={formStatus === FORM_STATUS.error ? color : "var(--color-error)"}
          onClick={() => setFormStatus(FORM_STATUS.fill)}
          clearFormPersistence={clearFormPersistence}
        />
      </div>
    );
  }

  if (formStatus === FORM_STATUS.submitted) {
    return (
      <div className={styles.formWrapper}>
        <SuccessMessage
          color={color}
          message="Your form has been submitted successfully!"
          onHomeClick={() => (window.location.href = "/")}
        />
      </div>
    );
  }

  // --- Render form ---
  return (
    <div className={styles.formWrapper}>
      <AlertContainer
        alertContainer={alertContainer}
        removeAlert={removeAlert}
      />

      <form className={styles.form} style={formStyle} onSubmit={handleSubmit}>
        {/* Form title and description */}
        <div className={styles.stepHeader}>
          <h3>{config[FPs.TITLE]}</h3>
          {config[FPs.DESCRIPTION] && <p>{config[FPs.DESCRIPTION]}</p>}
        </div>

        {/* Multi-step current step title & description */}
        {config.mode === "multi" && (
          <div className={styles.stepHeader}>
            <h3>
              {
                (config as MultiStepFormConfig)[FPs.STEP]?.[currentStep]?.[
                  FPs.TITLE
                ]
              }
            </h3>
            {(config as MultiStepFormConfig)?.[FPs.DESCRIPTION] && (
              <p>{(config as MultiStepFormConfig)?.[FPs.DESCRIPTION]}</p>
            )}
          </div>
        )}

        {/* Render fields */}
        {fieldsToRender.map((field: FormField) => (
          <FieldRenderer
            key={field[FPs.NAME]}
            field={field}
            value={formData}
            onChange={handleChange}
            settings={_settings}
          />
        ))}

        {/* Footer buttons */}
        <FormFooter
          mode={mode}
          config={config}
          currentStep={currentStep}
          color={color}
          submitLabel={submitLabel}
          next={next}
          back={back}
          handleSubmit={handleSubmit}
          clearFormPersistence={clearFormPersistence}
        />
      </form>
    </div>
  );
}
