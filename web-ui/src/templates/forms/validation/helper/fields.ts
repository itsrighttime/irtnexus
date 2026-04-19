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
const NAME = "name";
const LABEL = "label";
const PLACEHOLDER = "placeholder";
const OPTIONS = "options";
const MULTIPLE = "multiple";
const REQUIRED = "required";
const CODE = "code";
const RESTRICTION_START_DATE = "restrictionStartDate";
const RESTRICTION_END_DATE = "restrictionEndDate";
const MODE = "mode";
const IS_HOUSE = "isHouse";
const IS_STREET = "isStreet";
const IS_CITY = "isCity";
const IS_STATE = "isState";
const IS_POSTAL = "isPostal";
const IS_COUNTRY = "isCountry";
const IS_ADDRESS_LINE = "isAddressLine";
const IS_LANDMARK = "isLandmark";
const MIN_LENGTH = "minLength";
const MAX_LENGTH = "maxLength";
const MAX_TEXTAREA_HEIGHT = "maxTextAreaHeight";
const SHOW_CHARACTER_COUNT = "showCharacterCount";
const SHOW_WORD_COUNT = "showWordCount";
const DISABLED = "disabled";
const HIDE_ON_SAVE = "hideOnSave";
const IS_BORDER = "isBorder";
const MAX_FILES = "maxFiles";
const ALLOWED_TYPES = "allowedTypes";
const HEIGHT = "height";
const MAX_SIZE_MB = "maxSizeMB";
const REQUIRE_SQUARE = "requireSquare";
const PREVIEW_BORDER_RADIUS = "previewBorderRadius";
const PREVIEW = "preview";
const VERIFICATION_ENDPOINT = "verificationEndpoint";
const USER_ID = "userId";
const IS_NUMERIC = "isNumeric";
const LAYOUT = "layout";
const COLOR = "color";
const MIN = "min";
const MAX = "max";
const STEP = "step";
const SHOW_RANGE = "showRange";
const SHOW_VALUE_SIDE = "showValueSide";
const PRECISION = "precision";
const TYPE = "type";
const VALUE = "value";
const REPEATABLE = "repeatable";
const CONDITIONAL = "conditional";
const DEPENDS_ON = "dependsOn";
const OPERATOR = "operator";
const LENGTH = "length";
const FIELDS = "fields";
const MORE_LABEL = "moreLabel";
const HELP = "help";
const NUMBER = "number";
const TITLE = "title";
const DESCRIPTION = "description";
const ENDPOINT = "endpoint";
const SETTINGS = "settings";
const SHOW_LABEL_ALWAYS = "showLabelAlways";
const GAP = "gap";
const WIDTH = "width";
const BACKGROUND_COLOR = "backgroundColor";
const TEXT_COLOR = "textColor";
const LABEL_COLOR = "labelColor";
const BORDER = "border";
const BORDER_RADIUS = "borderRadius";
const BOX_SHADOW = "boxShadow";

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
  BOX_SHADOW,
} as const;
