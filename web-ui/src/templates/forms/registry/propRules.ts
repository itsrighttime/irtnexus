// engine/propRules.ts

import { FIELDS_PROPS as FPs } from "../validation/helper/fields";
import type { PropConfig } from "./types";

export const BASE_PROP_RULES: PropConfig = {
  name: FPs.NAME,
  label: FPs.LABEL,
  required: FPs.REQUIRED,
  width: FPs.WIDTH,
  color: FPs.COLOR,

  value: {
    fromState: true,
  },

  placeholder: {
    from: FPs.PLACEHOLDER,
    fallback: FPs.LABEL,
  },
};
