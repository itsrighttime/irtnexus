import {
  FIELDS_PROPS as FPs,
  type FormFieldType,
} from "../validation/helper/fields";
import { type OperatorValue } from "../validation/helper/operators";

export interface ConditionalField {
  [FPs.DEPENDS_ON]: string;
  [FPs.VALUE]: any | any[];
  [FPs.OPERATOR]: OperatorValue;
}

// Union of all field types
export type FormField =
  | VideoFieldConfig
  | URLFieldConfig
  | TimeFieldConfig
  | TextAreaFieldConfig
  | TextFieldConfig
  | SwitchFieldConfig
  | StepperFieldConfig
  | SliderFieldConfig
  | SecurityQuestionFieldConfig
  | SearchFieldConfig
  | RadioFieldConfig
  | PasswordConfig
  | OTPFieldConfig
  | MultiDropdownFieldConfig
  | MobileFieldConfig
  | JsonConfig
  | ImageFieldConfig
  | EmailConfig
  | DropdownFieldConfig
  | DateFieldConfig
  | ColorConfig
  | CheckboxFieldConfig
  | AudioFieldConfig
  | AddressFieldConfig;

// Base field types
interface BaseField {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  conditional?: ConditionalField;
  repeatable?: boolean;
  fields?: FormField[]; // For repeatable sub-fields,
  moreLabel?: string;
  type: FormFieldType;
}

// Define the expected shape of an address field configuration
export interface AddressFieldConfig extends BaseField {
  [FPs.IS_HOUSE]?: boolean;
  [FPs.IS_STREET]?: boolean;
  [FPs.IS_CITY]?: boolean;
  [FPs.IS_STATE]?: boolean;
  [FPs.IS_POSTAL]?: boolean;
  [FPs.IS_COUNTRY]?: boolean;
  [FPs.IS_LANDMARK]?: boolean;
  [FPs.IS_ADDRESS_LINE]?: boolean;
}

// Define the expected shape of the submitted address value
export interface AddressValue {
  house?: string;
  street?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  landmark?: string;
  addressLine?: string;
}

// Define the shape of the audio field config
export interface AudioFieldConfig extends BaseField {
  [FPs.MAX_SIZE_MB]?: number;
  [FPs.ALLOWED_TYPES]?: string[];
}

// Define the shape of the audio value
export interface AudioValue {
  size: number; // in bytes
  type: string; // MIME type, e.g., "audio/mp3"
}

// Define the shape of a checkbox option
export interface CheckboxOption {
  label: string;
  value: string;
}

// Define the shape of the checkbox field config
export interface CheckboxFieldConfig extends BaseField {
  [FPs.OPTIONS]: CheckboxOption[];
}

// Define the shape of the submitted checkbox value
export type CheckboxValue = string[];

export interface ColorConfig extends BaseField {}
// Define the expected color value type
export type ColorValue = string;

// Allowed date modes
export type DateMode = "date" | "month" | "month-year" | "year";

// Field config type
export interface DateFieldConfig extends BaseField {
  [FPs.MODE]?: DateMode;
  [FPs.RESTRICTION_START_DATE]?: string;
  [FPs.RESTRICTION_END_DATE]?: string;
}

// Submitted value type
export type DateValue = string;

// Field config type for dropdown
export interface DropdownFieldConfig extends BaseField {
  [FPs.OPTIONS]: string[];
}

// Submitted value type
export type DropdownValue = string | string[];

// Define the submitted email value type
export interface EmailConfig extends BaseField {}
export type EmailValue = string;

// Field config type for IMAGE
export interface ImageFieldConfig extends BaseField {
  [FPs.MAX_SIZE_MB]?: number;
  [FPs.ALLOWED_TYPES]?: string[];
  [FPs.REQUIRE_SQUARE]?: boolean;
}

// Single image value type
export interface ImageValue {
  size: number; // in bytes
  type: string; // MIME type, e.g., "image/png"
  width: number;
  height: number;
}

// Submitted value type for JSON field
export interface JsonConfig extends BaseField {}
export type JsonValue = string;

// Config type for MOBILE field
export interface MobileFieldConfig extends BaseField {
  [FPs.CODE]?: string;
}

// Value type for MOBILE field
export interface MobileValue {
  [FPs.CODE]: string;
  [FPs.NUMBER]: string;
}

// Config type for multi-dropdown
export interface MultiDropdownFieldConfig extends BaseField {
  [FPs.OPTIONS]: string[];
}

// Value type for multi-dropdown
export type MultiDropdownValue = string[];

// Config type for OTP
export interface OTPFieldConfig extends BaseField {
  [FPs.LENGTH]: number;
  [FPs.IS_NUMERIC]?: boolean;
}

// Value type for OTP
export type OTPValue = string;

// Value type for PASSWORD
export interface PasswordConfig extends BaseField {}
export type PasswordValue = string;

// Option type for RADIO
interface RadioOption {
  label: string;
  value: string;
}

// Config type for RADIO
export interface RadioFieldConfig extends BaseField {
  [FPs.OPTIONS]: RadioOption[];
}

// Value type for RADIO
export type RadioValue = string;

// Config type for SEARCH
export interface SearchFieldConfig extends BaseField {
  [FPs.OPTIONS]: string[];
}

// Value type for SEARCH
export type SearchValue = string;

// Option type for security questions
type SecurityQuestionOption = string;

// Config type for SECURITY_QUESTION
export interface SecurityQuestionFieldConfig extends BaseField {
  [FPs.OPTIONS]: SecurityQuestionOption[];
}

// Value type for SECURITY_QUESTION
export interface SecurityQuestionValue {
  question: string;
  answer: string;
}

// Config type for SLIDER
export interface SliderFieldConfig extends BaseField {
  [FPs.MIN]: number;
  [FPs.MAX]: number;
  [FPs.STEP]?: number;
}

// Value type for SLIDER
export type SliderValue = number;

// Config type for STEPPER
export interface StepperFieldConfig extends BaseField {
  [FPs.MIN]: number;
  [FPs.MAX]: number;
  [FPs.STEP]?: number;
}

// Value type for STEPPER
export type StepperValue = number;

// Config type for SWITCH (no required config)
export interface SwitchFieldConfig extends BaseField {}

// Value type for SWITCH
export type SwitchValue = boolean;

// Config type for TEXT
export interface TextFieldConfig extends BaseField {
  [FPs.MIN_LENGTH]?: number;
  [FPs.MAX_LENGTH]?: number;
}

// Value type for TEXT
export type TextValue = string;

// Config type for TEXT_AREA
export interface TextAreaFieldConfig extends BaseField {
  [FPs.MIN_LENGTH]?: number;
  [FPs.MAX_LENGTH]?: number;
  [FPs.MAX_TEXTAREA_HEIGHT]?: number;
  [FPs.SHOW_CHARACTER_COUNT]?: boolean;
  [FPs.SHOW_WORD_COUNT]?: boolean;
  [FPs.DISABLED]?: boolean;
}

// Value type for TEXT_AREA
export type TextAreaValue = string;

// Config type for TIME (future: could add minTime, maxTime)
export interface TimeFieldConfig extends BaseField {
  // Placeholder for potential future properties
}

// Value type for TIME
export type TimeFieldValue = string;

// Config type for URL (currently empty, can add future options)
export interface URLFieldConfig extends BaseField {
  // Placeholder for future properties
}

// Value type for URL field
export type URLFieldValue = string;

// Config type for VIDEO field
export interface VideoFieldConfig extends BaseField {
  [FPs.MAX_SIZE_MB]?: number;
  [FPs.ALLOWED_TYPES]?: string[];
}

// Value type for VIDEO field
export interface VideoFile {
  size: number; // in bytes
  type: string; // MIME type
}
