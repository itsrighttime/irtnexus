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

  if (!containsFile) {
    // ✅ Simple JSON case
    body = JSON.stringify(formData);
    headers["Content-Type"] = "application/json";
  } else {
    // ✅ Multipart but WITHOUT flattening structure
    const fd = new FormData();

    // 1. Send full structured JSON
    fd.append("data", JSON.stringify(formData));

    // 2. Extract and append files separately
    const appendFiles = (value: FormValue) => {
      if (!value) return;

      if (value instanceof File || value instanceof Blob) {
        fd.append("files", value);
        return;
      }

      if (Array.isArray(value)) {
        value.forEach(appendFiles);
        return;
      }

      if (typeof value === "object") {
        Object.values(value).forEach(appendFiles);
      }
    };

    appendFiles(formData);

    body = fd;
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
