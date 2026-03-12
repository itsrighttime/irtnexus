import fs from "fs";
import path from "path";
import { TranslationResource } from "../types/translation-resource";

export function loadModuleTranslations(
  modulesPath: string,
): TranslationResource {
  const resources: TranslationResource = {};

  const modules = fs.readdirSync(modulesPath);

  for (const moduleName of modules) {
    const i18nPath = path.join(modulesPath, moduleName, "interface", "i18n");

    if (!fs.existsSync(i18nPath)) continue;

    const files = fs.readdirSync(i18nPath);

    for (const file of files) {
      const lang = file.replace(".json", "");

      resources[lang] ??= { translation: {} };

      const filePath = path.join(i18nPath, file);

      const content = JSON.parse(fs.readFileSync(filePath, "utf8"));

      Object.assign(resources[lang].translation, content);
    }
  }

  return resources;
}
