import fs from "fs";
import path from "path";

/**
 * Flatten nested JSON keys
 * e.g., { project: { created: "x" } } => ["project.created"]
 */
function flattenKeys(obj: Record<string, any>, prefix = ""): string[] {
  let keys: string[] = [];
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, newKey));
    } else {
      keys.push(newKey);
    }
  }
  return keys;
}

/**
 * Reads JSON file
 */
function readJSON(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

/**
 * Validate translations across languages for all modules.
 *
 * @param modulesPath Path to the modules folder
 * @returns true if all translations are valid, false if errors found
 */
export function validateTranslations(modulesPath: string): boolean {
  const modules = fs.readdirSync(modulesPath);

  let hasErrors = false;

  modules.forEach((moduleName) => {
    const i18nPath = path.join(modulesPath, moduleName, "interface", "i18n");
    if (!fs.existsSync(i18nPath)) return;

    const files = fs.readdirSync(i18nPath).filter((f) => f.endsWith(".json"));
    if (files.length === 0) return;

    const langKeys: Record<string, string[]> = {};

    files.forEach((file) => {
      const lang = file.replace(".json", "");
      const content = readJSON(path.join(i18nPath, file));
      langKeys[lang] = flattenKeys(content);
    });

    const allKeys = new Set(Object.values(langKeys).flat());

    Object.entries(langKeys).forEach(([lang, keys]) => {
      const missing = [...allKeys].filter((k) => !keys.includes(k));
      if (missing.length) {
        hasErrors = true;
        console.warn(`[${moduleName}] Missing keys in ${lang}.json:`, missing);
      }
    });
  });

  if (!hasErrors) {
    console.log("✅ All module translations are valid!");
  }

  return !hasErrors;
}
