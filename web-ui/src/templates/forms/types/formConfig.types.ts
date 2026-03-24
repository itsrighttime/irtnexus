import type { FormField } from "./register.types";
import { FIELDS_PROPS as FPs } from "../validation/helper/fields";

export type { FormField };

// Form settings
export interface FormSettings {
  [FPs.SHOW_LABEL_ALWAYS]?: boolean;
  [FPs.GAP]?: string;
  [FPs.COLOR]?: string;
  [FPs.WIDTH]?: string;
  [FPs.HEIGHT]?: string;
  [FPs.BACKGROUND_COLOR]?: string;
  [FPs.TEXT_COLOR]?: string;
  [FPs.LABEL_COLOR]?: string;
  [FPs.BORDER]?: string;
  [FPs.BORDER_RADIUS]?: string;
}

// Step definition
export interface FormStep {
  [FPs.TITLE]?: string;
  [FPs.FIELDS]: FormField[];
}

// Config types
export interface SingleStepFormConfig {
  [FPs.MODE]?: "single";
  [FPs.TITLE]?: string;
  [FPs.DESCRIPTION]?: string;
  [FPs.SETTINGS]?: FormSettings;
  [FPs.FIELDS]: FormField[];
}

export interface MultiStepFormConfig {
  [FPs.MODE]: "multi";
  [FPs.TITLE]?: string;
  [FPs.DESCRIPTION]?: string;
  [FPs.SETTINGS]?: FormSettings;
  [FPs.STEP]: FormStep[];
}

// Union type for any form config
export type FormConfig = SingleStepFormConfig | MultiStepFormConfig;

export type FormValues = Record<string, any>;

export type FormResponse = Record<string, any>;

export interface ValidateResult {
  valid: boolean;
  errors: Record<string, any>;
}
