import {
  CORE_FIELDS_PROPS,
  FORM_FIELDS_TYPE,
} from "../validation/helper/fields";

import { BASE_PROP_RULES } from "./propRules";
import type { FieldUIConfigMap } from "./types";

export function createFieldUIConfig(): FieldUIConfigMap {
  const config: Record<string, any> = {};

  Object.values(FORM_FIELDS_TYPE).forEach((type) => {
    const coreProps = CORE_FIELDS_PROPS[type];

    config[type] = {
      component: type, // same as type (no duplication)

      props: {
        ...BASE_PROP_RULES,
      },
    };

    // Add field-specific props dynamically
    [...coreProps.compulsory, ...coreProps.optional].forEach((prop) => {
      if (!config[type].props[prop]) {
        config[type].props[prop] = prop;
      }
    });
  });

  return config;
}
