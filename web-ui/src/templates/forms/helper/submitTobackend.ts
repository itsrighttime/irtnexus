import { apiCaller } from "@/core-ui";

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

/** Detect if payload contains any file/blob */
const hasFile = (value: any): boolean => {
  if (value instanceof File || value instanceof Blob) return true;

  if (Array.isArray(value)) {
    return value.some(hasFile);
  }

  if (value && typeof value === "object") {
    return Object.values(value).some(hasFile);
  }

  return false;
};

export const submitToBackend = async (
  formData: Record<string, FormValue>,
  endpoint?: string,
): Promise<SubmitResponse> => {
  if (!endpoint) {
    return { success: false, message: "No endpoint provided in config" };
  }

  const containsFile = hasFile(formData);

  let body: any;
  let headers: Record<string, string> = {};

  /**
   * =========================
   * CASE 1: JSON REQUEST
   * =========================
   * Best for Fastify normal routes (fast + clean)
   */
  if (!containsFile) {
    body = JSON.stringify(formData);
    headers["Content-Type"] = "application/json";
  } else {

  /**
   * =========================
   * CASE 2: MULTIPART (FILES)
   * =========================
   * Only when File/Blob exists
   */
    const fd = new FormData();

    const append = (key: string, value: FormValue): void => {
      if (value === null || value === undefined) return;

      // File / Blob
      if (value instanceof File || value instanceof Blob) {
        fd.append(key, value);
        return;
      }

      // Array handling
      if (Array.isArray(value)) {
        value.forEach((v, i) => append(`${key}[${i}]`, v));
        return;
      }

      // Object handling
      if (typeof value === "object") {
        Object.entries(value).forEach(([k, v]) => {
          append(`${key}[${k}]`, v);
        });
        return;
      }

      // Primitive
      fd.append(key, String(value));
    };

    Object.entries(formData).forEach(([key, value]) => {
      append(key, value);
    });

    body = fd;
    // IMPORTANT: DO NOT set Content-Type manually for FormData
  }

  const response: any = await apiCaller({
    endpoint,
    method: "POST",
    body,
    headers,
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
