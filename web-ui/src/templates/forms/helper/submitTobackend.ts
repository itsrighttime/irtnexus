import { useAPICaller } from "@/hooks";

type Primitive = string | number | boolean;
type FormValue =
  | Primitive
  | File
  | Blob
  | null
  | undefined
  | FormValue[]
  | { [key: string]: FormValue };

interface SubmitResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export const submitToBackend = async (
  formData: Record<string, FormValue>,
  endpoint?: string,
): Promise<SubmitResponse> => {
  if (!endpoint) {
    return { success: false, message: "No endpoint provided in config" };
  }

  const body = new FormData();

  const appendToFormData = (key: string, value: FormValue): void => {
    if (value === null || value === undefined) return;

    // Handle Files / Blobs
    if (
      value instanceof File ||
      value instanceof Blob ||
      (typeof value === "object" && "type" in value && "size" in value)
    ) {
      body.append(key, value as Blob);
      return;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (typeof v === "object" && !(v instanceof File)) {
          body.append(`${key}[${i}]`, JSON.stringify(v));
        } else {
          body.append(`${key}[${i}]`, String(v));
        }
      });
      return;
    }

    // Handle nested objects
    if (typeof value === "object") {
      Object.entries(value).forEach(([subKey, subValue]) => {
        appendToFormData(`${key}[${subKey}]`, subValue);
      });
      return;
    }

    // Handle primitive values
    body.append(key, String(value));
  };

  Object.entries(formData || {}).forEach(([key, value]) => {
    appendToFormData(key, value);
  });

  const response: any = await useAPICaller({
    endpoint,
    method: "POST",
    body,
    headers: {},
  });

  if (response?.status === 200 || response?.success) {
    return { success: true, data: response };
  }

  if (response?.status === 400) {
    return { success: false, data: response.data };
  }

  return {
    success: false,
    message: response?.message || "Unknown server response",
  };
};
