// --- Form Field Types ---
export const FORM_FIELDS_TYPE = {
  DROPDOWN: "dropdown",
  MULTI_DROPDOWN: "multi-dropdown",
  EMAIL: "email",
  PASSWORD: "password",
  MOBILE: "mobile",
  DATE: "date",
  DAY: "day",
  MONTH: "month",
  MONTH_YEAR: "monthYear",
  YEAR: "year",
  TIME: "time",
  ADDRESS: "address",
  TEXT: "text",
  TEXT_AREA: "textArea",
  JSON: "json",
  FILE: "file",
  AUDIO: "audio",
  VIDEO: "video",
  IMAGE: "image",
  SECURITY_QUESTION: "securityQuestion",
  OTP: "otp",
  CHECKBOX: "checkbox",
  COLOR: "color",
  RADIO: "radio",
  SEARCH: "search",
  SWITCH: "switch",
  SLIDER: "slider",
  STEPPER: "stepper",
  URL: "url",
  GROUP: "group",
} as const;

export type FormFieldType =
  (typeof FORM_FIELDS_TYPE)[keyof typeof FORM_FIELDS_TYPE];

// --- Property Constants ---
export const NAME = "name";
export const LABEL = "label";
export const PLACEHOLDER = "placeholder";
export const OPTIONS = "options";
export const MULTIPLE = "multiple";
export const REQUIRED = "required";
export const CODE = "code";
export const RESTRICTION_START_DATE = "restrictionStartDate";
export const RESTRICTION_END_DATE = "restrictionEndDate";
export const MODE = "mode";
export const IS_HOUSE = "isHouse";
export const IS_STREET = "isStreet";
export const IS_CITY = "isCity";
export const IS_STATE = "isState";
export const IS_POSTAL = "isPostal";
export const IS_COUNTRY = "isCountry";
export const IS_ADDRESS_LINE = "isAddressLine";
export const IS_LANDMARK = "isLandmark";
export const MIN_LENGTH = "minLength";
export const MAX_LENGTH = "maxLength";
export const MAX_TEXTAREA_HEIGHT = "maxTextAreaHeight";
export const SHOW_CHARACTER_COUNT = "showCharacterCount";
export const SHOW_WORD_COUNT = "showWordCount";
export const DISABLED = "disabled";
export const HIDE_ON_SAVE = "hideOnSave";
export const IS_BORDER = "isBorder";
export const MAX_FILES = "maxFiles";
export const ALLOWED_TYPES = "allowedTypes";
export const HEIGHT = "height";
export const MAX_SIZE_MB = "maxSizeMB";
export const REQUIRE_SQUARE = "requireSquare";
export const PREVIEW_BORDER_RADIUS = "previewBorderRadius";
export const PREVIEW = "preview";
export const VERIFICATION_ENDPOINT = "verificationEndpoint";
export const USER_ID = "userId";
export const IS_NUMERIC = "isNumeric";
export const LAYOUT = "layout";
export const COLOR = "color";
export const MIN = "min";
export const MAX = "max";
export const STEP = "step";
export const SHOW_RANGE = "showRange";
export const SHOW_VALUE_SIDE = "showValueSide";
export const PRECISION = "precision";
export const TYPE = "type";
export const VALUE = "value";
export const REPEATABLE = "repeatable";
export const CONDITIONAL = "conditional";
export const DEPENDS_ON = "dependsOn";
export const OPERATOR = "operator";
export const LENGTH = "length";
export const FIELDS = "fields";
export const MORE_LABEL = "moreLabel";
export const HELP = "help";
export const NUMBER = "number";
export const TITLE = "title";
export const DESCRIPTION = "description";
export const ENDPOINT = "endpoint";
export const SETTINGS = "settings";
export const SHOW_LABEL_ALWAYS = "showLabelAlways";
export const GAP = "gap";
export const WIDTH = "width";
export const BACKGROUND_COLOR = "backgroundColor";
export const TEXT_COLOR = "textColor";
export const LABEL_COLOR = "labelColor";
export const BORDER = "border";
export const BORDER_RADIUS = "borderRadius";

// --- Generic Properties ---
export interface GenericProps {
  compulsory: string[];
  optional: string[];
}

export const GENERIC_PROP: GenericProps = {
  compulsory: [NAME, TYPE, LABEL],
  optional: [
    REQUIRED,
    VALUE,
    PLACEHOLDER,
    CONDITIONAL,
    DEPENDS_ON,
    OPERATOR,
    REPEATABLE,
    FIELDS,
    MORE_LABEL,
  ],
};

// --- Field-Specific Core Properties ---
export interface CoreFieldProps {
  compulsory: string[];
  optional: string[];
}

export type CoreFieldsPropsMap = Record<FormFieldType, CoreFieldProps>;

export const CORE_FIELDS_PROPS: CoreFieldsPropsMap = {
  [FORM_FIELDS_TYPE.DROPDOWN]: { compulsory: [OPTIONS], optional: [] },
  [FORM_FIELDS_TYPE.MULTI_DROPDOWN]: {
    compulsory: [OPTIONS],
    optional: [MULTIPLE],
  },
  [FORM_FIELDS_TYPE.EMAIL]: { compulsory: [], optional: [] },
  [FORM_FIELDS_TYPE.PASSWORD]: { compulsory: [], optional: [] },
  [FORM_FIELDS_TYPE.MOBILE]: { compulsory: [CODE], optional: [] },
  [FORM_FIELDS_TYPE.DATE]: {
    compulsory: [],
    optional: [
      RESTRICTION_START_DATE,
      RESTRICTION_END_DATE,
      MODE,
      VALUE,
      REQUIRED,
    ],
  },
  [FORM_FIELDS_TYPE.DAY]: {
    compulsory: [],
    optional: [
      RESTRICTION_START_DATE,
      RESTRICTION_END_DATE,
      MODE,
      VALUE,
      REQUIRED,
    ],
  },
  [FORM_FIELDS_TYPE.MONTH]: {
    compulsory: [],
    optional: [
      RESTRICTION_START_DATE,
      RESTRICTION_END_DATE,
      MODE,
      VALUE,
      REQUIRED,
    ],
  },
  [FORM_FIELDS_TYPE.MONTH_YEAR]: {
    compulsory: [],
    optional: [
      RESTRICTION_START_DATE,
      RESTRICTION_END_DATE,
      MODE,
      VALUE,
      REQUIRED,
    ],
  },
  [FORM_FIELDS_TYPE.YEAR]: {
    compulsory: [],
    optional: [
      RESTRICTION_START_DATE,
      RESTRICTION_END_DATE,
      MODE,
      VALUE,
      REQUIRED,
    ],
  },
  [FORM_FIELDS_TYPE.TIME]: { compulsory: [], optional: [] },
  [FORM_FIELDS_TYPE.ADDRESS]: {
    compulsory: [],
    optional: [
      IS_HOUSE,
      IS_STREET,
      IS_CITY,
      IS_STATE,
      IS_POSTAL,
      IS_COUNTRY,
      IS_ADDRESS_LINE,
      IS_LANDMARK,
    ],
  },
  [FORM_FIELDS_TYPE.TEXT]: {
    compulsory: [],
    optional: [MIN_LENGTH, MAX_LENGTH],
  },
  [FORM_FIELDS_TYPE.URL]: { compulsory: [], optional: [] },
  [FORM_FIELDS_TYPE.TEXT_AREA]: {
    compulsory: [],
    optional: [
      MIN_LENGTH,
      MAX_LENGTH,
      MAX_TEXTAREA_HEIGHT,
      SHOW_CHARACTER_COUNT,
      SHOW_WORD_COUNT,
      DISABLED,
    ],
  },
  [FORM_FIELDS_TYPE.JSON]: {
    compulsory: [],
    optional: [SHOW_CHARACTER_COUNT, SHOW_WORD_COUNT, HIDE_ON_SAVE, IS_BORDER],
  },
  [FORM_FIELDS_TYPE.FILE]: {
    compulsory: [],
    optional: [MULTIPLE, MAX_FILES, MAX_SIZE_MB, ALLOWED_TYPES, HEIGHT],
  },
  [FORM_FIELDS_TYPE.AUDIO]: {
    compulsory: [],
    optional: [HEIGHT, MAX_SIZE_MB, ALLOWED_TYPES],
  },
  [FORM_FIELDS_TYPE.VIDEO]: {
    compulsory: [],
    optional: [HEIGHT, MAX_SIZE_MB, ALLOWED_TYPES, PREVIEW],
  },
  [FORM_FIELDS_TYPE.IMAGE]: {
    compulsory: [],
    optional: [
      HEIGHT,
      MAX_SIZE_MB,
      ALLOWED_TYPES,
      REQUIRE_SQUARE,
      PREVIEW_BORDER_RADIUS,
    ],
  },
  [FORM_FIELDS_TYPE.SECURITY_QUESTION]: { compulsory: [OPTIONS], optional: [] },
  [FORM_FIELDS_TYPE.OTP]: {
    compulsory: [LENGTH, VERIFICATION_ENDPOINT, USER_ID],
    optional: [IS_NUMERIC],
  },
  [FORM_FIELDS_TYPE.CHECKBOX]: {
    compulsory: [OPTIONS],
    optional: [LAYOUT, DISABLED],
  },
  [FORM_FIELDS_TYPE.COLOR]: { compulsory: [], optional: [COLOR] },
  [FORM_FIELDS_TYPE.RADIO]: {
    compulsory: [OPTIONS],
    optional: [LAYOUT, DISABLED],
  },
  [FORM_FIELDS_TYPE.SEARCH]: { compulsory: [OPTIONS], optional: [] },
  [FORM_FIELDS_TYPE.SWITCH]: { compulsory: [], optional: [DISABLED] },
  [FORM_FIELDS_TYPE.SLIDER]: {
    compulsory: [MIN, MAX],
    optional: [STEP, SHOW_RANGE, SHOW_VALUE_SIDE, PRECISION],
  },
  [FORM_FIELDS_TYPE.STEPPER]: { compulsory: [MIN, MAX], optional: [STEP] },
  [FORM_FIELDS_TYPE.GROUP]: { compulsory: [], optional: [] },
};

// --- All Fields Props ---
export const FIELDS_PROPS = {
  NAME,
  LABEL,
  PLACEHOLDER,
  OPTIONS,
  MULTIPLE,
  REQUIRED,
  CODE,
  RESTRICTION_START_DATE,
  RESTRICTION_END_DATE,
  MODE,
  IS_HOUSE,
  IS_STREET,
  IS_CITY,
  IS_STATE,
  IS_POSTAL,
  IS_COUNTRY,
  IS_ADDRESS_LINE,
  IS_LANDMARK,
  MIN_LENGTH,
  MAX_LENGTH,
  MAX_TEXTAREA_HEIGHT,
  SHOW_CHARACTER_COUNT,
  SHOW_WORD_COUNT,
  DISABLED,
  HIDE_ON_SAVE,
  IS_BORDER,
  MAX_FILES,
  ALLOWED_TYPES,
  HEIGHT,
  MAX_SIZE_MB,
  REQUIRE_SQUARE,
  PREVIEW_BORDER_RADIUS,
  PREVIEW,
  VERIFICATION_ENDPOINT,
  USER_ID,
  IS_NUMERIC,
  LAYOUT,
  COLOR,
  MIN,
  MAX,
  STEP,
  SHOW_RANGE,
  SHOW_VALUE_SIDE,
  PRECISION,
  TYPE,
  VALUE,
  REPEATABLE,
  CONDITIONAL,
  DEPENDS_ON,
  OPERATOR,
  LENGTH,
  FIELDS,
  MORE_LABEL,
  HELP,
  NUMBER,
  TITLE,
  DESCRIPTION,
  ENDPOINT,
  SETTINGS,
  SHOW_LABEL_ALWAYS,
  GAP,
  WIDTH,
  BACKGROUND_COLOR,
  TEXT_COLOR,
  LABEL_COLOR,
  BORDER,
  BORDER_RADIUS,
} as const;
