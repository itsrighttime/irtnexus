import { publicBase } from "./baseURL";

export const FORM_API = {
  partnershipConfig: (key: string) =>
    `${publicBase}/forms/partnership/config/${key}`,
};
