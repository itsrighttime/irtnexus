import { i18n } from "../core/i18n-instance";

export function t(key: string, options?: Record<string, any>) {
  return i18n.t(key, options);
}
