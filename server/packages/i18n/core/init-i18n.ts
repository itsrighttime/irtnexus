import Backend from "i18next-fs-backend";
import { i18n } from "./i18n-instance";
import { loadModuleTranslations } from "../loader/module-translation-loader";
import { i18nConfig } from "../config/i18n-config";

export async function initI18n(modulesPath: string) {
  const resources = loadModuleTranslations(modulesPath);

  await i18n.use(Backend).init({
    ...i18nConfig,
    resources,
    preload: Object.keys(resources),
  });
}
