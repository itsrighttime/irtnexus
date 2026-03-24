import { deleteFile } from "../helper/indexedDb.js";
import { configToSchema } from "../validation/configToSchema.js";
import { validateResponse } from "../validation/validateResponse.js";
import { submitToBackend } from "../helper/submitTobackend.js";
import { FORM_STATUS } from "../helper/formStatus.js";
import { FIELDS_PROPS as FPs } from "../validation/helper/fields.js";

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
}) {
  const handleSubmit = async (e) => {
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
      const response = await submitToBackend(formData, config?.[FPs.ENDPOINT]);
      if (response?.success) {
        localStorage.removeItem(STORAGE_KEY);

        for (const k of Object.keys(formData)) {
          const v = formData[k];
          if (isFileLike(v)) await deleteFile(`${STORAGE_KEY}::${k}`);
          if (isFileArray(v))
            for (let idx = 0; idx < v.length; idx++)
              await deleteFile(`${STORAGE_KEY}::${k}_${idx}`);
        }

        if (onSubmit) onSubmit(formData);
        setFormStatus(FORM_STATUS.submitted);
        addAlert(
          `${config[FPs.TITLE] || "Details"} Submitted Successfully`,
          "success"
        );
      } else {
        setFormStatus(FORM_STATUS.failed);
        setFormStatusError({
          general: {
            label: "Backend Validation",
            error:
              response.data?.message || response?.message || "Submission failed",
          },
        });
        addAlert("Resolve the errors and submit again", "error");
      }
    } catch (err) {
      setFormStatus(FORM_STATUS.failed);
      setFormStatusError({
        general: {
          label: "Backend Validation",
          error: err.message || "Network error",
        },
      });
      addAlert("Resolve the errors and submit again", "error");
    }
  };

  return { handleSubmit };
}
