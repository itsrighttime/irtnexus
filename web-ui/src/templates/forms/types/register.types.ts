import {
  FORM_FIELDS_TYPE,
  FIELDS_PROPS as FPs,
  type FormFieldType,
} from "../validation/helper/fields";
import { type OperatorValue } from "../validation/helper/operators";

import type {
  AudioUploadProps,
  CheckboxGroupProps,
  RadioGroupProps,
  SingleDropdownProps,
  MultipleDropdownProps,
  DropdownSimpleProps,
  CalendarPickerProp,
  OtpFieldProps,
  SearchBoxProps,
  SliderProps,
  StepperProps,
  SwitchProps,
  EmailInputType,
  JsonFieldProps,
  TextAreaProps,
  TextInputProps,
  AddressInputProps,
  AddressValue,
  FileUploadProps,
  ImageUploadProps,
  VideoUploadProps,
  TextInputVarientType,
  TimePickerProps,
} from "@/atoms";

/* -------------------- CONDITIONAL -------------------- */

export interface ConditionalField {
  [FPs.DEPENDS_ON]: string;
  [FPs.VALUE]: unknown | unknown[];
  [FPs.OPERATOR]: OperatorValue;
}

/* -------------------- BASE -------------------- */

interface BaseField<T extends FormFieldType> {
  name: string;
  type: T;
  label?: string;
  placeholder?: string;
  required?: boolean;
  conditional?: ConditionalField;
  repeatable?: boolean;
  fields?: FormField[];
  moreLabel?: string;
}

/* -------------------- FIELD UNION -------------------- */

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
  | SimpleDropdownFieldConfig
  | DatePickerConfig
  | DayPickerConfig
  | MonthPickerConfig
  | MonthYearPickerConfig
  | YearPickerConfig
  | ColorConfig
  | CheckboxFieldConfig
  | AudioFieldConfig
  | FileFieldConfig
  | AddressFieldConfig;

/* -------------------- FIELDS -------------------- */
export interface AddressFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.ADDRESS>, AddressInputProps {}

export interface AudioFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.AUDIO>, AudioUploadProps {}

export interface CheckboxFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.CHECKBOX>, CheckboxGroupProps {}

export interface ColorConfig extends BaseField<typeof FORM_FIELDS_TYPE.COLOR> {
  setResult?: () => void;
}

export interface DatePickerConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.DATE>, CalendarPickerProp {}
export interface DayPickerConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.DAY>, CalendarPickerProp {}
export interface MonthPickerConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.MONTH>, CalendarPickerProp {}
export interface MonthYearPickerConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.MONTH_YEAR>, CalendarPickerProp {}
export interface YearPickerConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.YEAR>, CalendarPickerProp {}

export interface DropdownFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.DROPDOWN>, SingleDropdownProps {}

export interface SimpleDropdownFieldConfig
  extends
    BaseField<typeof FORM_FIELDS_TYPE.SIMPLE_DROPDOWN>,
    DropdownSimpleProps {}

export interface MultiDropdownFieldConfig
  extends
    BaseField<typeof FORM_FIELDS_TYPE.MULTI_DROPDOWN>,
    MultipleDropdownProps {}

export interface EmailConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.EMAIL>, EmailInputType {}

export interface ImageFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.IMAGE>, ImageUploadProps {}

export interface JsonConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.JSON>, JsonFieldProps {}

export interface MobileFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.MOBILE>, TextInputVarientType {}

export interface OTPFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.OTP>, OtpFieldProps {}

export interface PasswordConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.PASSWORD>, TextInputVarientType {}

export interface RadioFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.RADIO>, RadioGroupProps {}

export interface SearchFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.SEARCH>, SearchBoxProps {}

export interface SecurityQuestionFieldConfig extends BaseField<
  typeof FORM_FIELDS_TYPE.SECURITY_QUESTION
> {
  options: string[];
  setResult?: () => void;
}

export interface SliderFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.SLIDER>, SliderProps {}

export interface StepperFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.STEPPER>, StepperProps {}

export interface SwitchFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.SWITCH>, SwitchProps {}

export interface TextFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.TEXT>, TextInputProps {}

export interface TextAreaFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.TEXT_AREA>, TextAreaProps {}

export interface TimeFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.TIME>, TimePickerProps {}

export interface URLFieldConfig extends BaseField<typeof FORM_FIELDS_TYPE.URL> {
  setResult?: () => void;
}

export interface VideoFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.VIDEO>, VideoUploadProps {}

export interface FileFieldConfig
  extends BaseField<typeof FORM_FIELDS_TYPE.FILE>, FileUploadProps {}

// ########################

export type { AddressValue };

export interface AudioValue {
  size: number;
  type: string;
}

export type CheckboxValue = string[];

export type ColorValue = string;

export type DateValue = string;

export type DropdownValue = string | string[];

export type DropdownSimpleValue = string | string[];

export type MultiDropdownValue = string[];

export type EmailValue = string;

export interface ImageValue {
  size: number;
  type: string;
  width: number;
  height: number;
}

export type JsonValue = string;

export type MobileValue = string

export type OTPValue = string;

export type PasswordValue = string;

export type RadioValue = string;

export type SearchValue = string;

export interface SecurityQuestionValue {
  question: string;
  answer: string;
}

export type SliderValue = number;

export type StepperValue = number;

export type SwitchValue = boolean;

export type TextValue = string;

export type TextAreaValue = string;

export type TimeFieldValue = string;

export type URLFieldValue = string;

export interface VideoFile {
  size: number;
  type: string;
}

export interface FileFile {
  size: number;
  type: string;
}
