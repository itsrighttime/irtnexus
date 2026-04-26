/* -------------------- IMPORTS -------------------- */

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
  AddressValue as AddressValue_,
  FileUploadProps,
  ImageUploadProps,
  VideoUploadProps,
  TextInputVarientType,
  TimePickerProps,
  UrlInputProps,
} from "@/atoms";

/* -------------------- UTIL -------------------- */

/**
 * Removes all function-type props (e.g. onChange, setResult)
 */
type NonFunctionProps<T> = {
  [K in keyof T as Extract<T[K], Function> extends never ? K : never]: T[K];
};

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

type GroupField = BaseField<typeof FORM_FIELDS_TYPE.GROUP>;

/* -------------------- FIELD → PROPS MAP -------------------- */

type FieldPropsMap = {
  [FORM_FIELDS_TYPE.ADDRESS]: AddressInputProps;
  [FORM_FIELDS_TYPE.AUDIO]: AudioUploadProps;
  [FORM_FIELDS_TYPE.CHECKBOX]: CheckboxGroupProps;
  [FORM_FIELDS_TYPE.COLOR]: {};
  [FORM_FIELDS_TYPE.DATE]: CalendarPickerProp;
  [FORM_FIELDS_TYPE.DAY]: CalendarPickerProp;
  [FORM_FIELDS_TYPE.MONTH]: CalendarPickerProp;
  [FORM_FIELDS_TYPE.MONTH_YEAR]: CalendarPickerProp;
  [FORM_FIELDS_TYPE.YEAR]: CalendarPickerProp;
  [FORM_FIELDS_TYPE.DROPDOWN]: SingleDropdownProps;
  [FORM_FIELDS_TYPE.SIMPLE_DROPDOWN]: DropdownSimpleProps;
  [FORM_FIELDS_TYPE.MULTI_DROPDOWN]: MultipleDropdownProps;
  [FORM_FIELDS_TYPE.IMAGE]: ImageUploadProps;
  [FORM_FIELDS_TYPE.RADIO]: RadioGroupProps;
  [FORM_FIELDS_TYPE.SEARCH]: SearchBoxProps;
  [FORM_FIELDS_TYPE.SECURITY_QUESTION]: {
    options: string[];
  };
  [FORM_FIELDS_TYPE.SLIDER]: SliderProps;
  [FORM_FIELDS_TYPE.STEPPER]: StepperProps;
  [FORM_FIELDS_TYPE.SWITCH]: SwitchProps;

  [FORM_FIELDS_TYPE.TEXT]: TextInputProps;
  [FORM_FIELDS_TYPE.TEXT_AREA]: TextAreaProps;
  [FORM_FIELDS_TYPE.EMAIL]: EmailInputType;
  [FORM_FIELDS_TYPE.JSON]: JsonFieldProps;
  [FORM_FIELDS_TYPE.MOBILE]: TextInputVarientType;
  [FORM_FIELDS_TYPE.OTP]: OtpFieldProps;
  [FORM_FIELDS_TYPE.PASSWORD]: TextInputVarientType;
  [FORM_FIELDS_TYPE.URL]: UrlInputProps;

  [FORM_FIELDS_TYPE.TIME]: TimePickerProps;
  [FORM_FIELDS_TYPE.VIDEO]: VideoUploadProps;
  [FORM_FIELDS_TYPE.FILE]: FileUploadProps;
};

/* -------------------- FIELD CONFIG -------------------- */

type FieldConfig<T extends keyof FieldPropsMap> = BaseField<T> &
  NonFunctionProps<FieldPropsMap[T]>;

/* -------------------- FINAL UNION -------------------- */

export type FormField =
  | {
      [K in keyof FieldPropsMap]: FieldConfig<K>;
    }[keyof FieldPropsMap]
  | GroupField;

/* -------------------- VALUES MAP -------------------- */

type FieldValueMap = {
  [FORM_FIELDS_TYPE.ADDRESS]: AddressValue_;
  [FORM_FIELDS_TYPE.AUDIO]: { size: number; type: string };
  [FORM_FIELDS_TYPE.CHECKBOX]: string[];
  [FORM_FIELDS_TYPE.COLOR]: string;
  [FORM_FIELDS_TYPE.DATE]: string;
  [FORM_FIELDS_TYPE.DAY]: string;
  [FORM_FIELDS_TYPE.MONTH]: string;
  [FORM_FIELDS_TYPE.MONTH_YEAR]: string;
  [FORM_FIELDS_TYPE.YEAR]: string;
  [FORM_FIELDS_TYPE.DROPDOWN]: string | string[];
  [FORM_FIELDS_TYPE.SIMPLE_DROPDOWN]: string | string[];
  [FORM_FIELDS_TYPE.MULTI_DROPDOWN]: string[];
  [FORM_FIELDS_TYPE.EMAIL]: string;
  [FORM_FIELDS_TYPE.IMAGE]: {
    size: number;
    type: string;
    width: number;
    height: number;
  };
  [FORM_FIELDS_TYPE.JSON]: string;
  [FORM_FIELDS_TYPE.MOBILE]: string;
  [FORM_FIELDS_TYPE.OTP]: string;
  [FORM_FIELDS_TYPE.PASSWORD]: string;
  [FORM_FIELDS_TYPE.RADIO]: string;
  [FORM_FIELDS_TYPE.SEARCH]: string;
  [FORM_FIELDS_TYPE.SECURITY_QUESTION]: {
    question: string;
    answer: string;
  };
  [FORM_FIELDS_TYPE.SLIDER]: number;
  [FORM_FIELDS_TYPE.STEPPER]: number;
  [FORM_FIELDS_TYPE.SWITCH]: boolean;
  [FORM_FIELDS_TYPE.TEXT]: string;
  [FORM_FIELDS_TYPE.TEXT_AREA]: string;
  [FORM_FIELDS_TYPE.TIME]: string;
  [FORM_FIELDS_TYPE.URL]: string;
  [FORM_FIELDS_TYPE.VIDEO]: { size: number; type: string };
  [FORM_FIELDS_TYPE.FILE]: { size: number; type: string };
};

/* -------------------- VALUE HELPER -------------------- */

export type FieldValue<T extends keyof FieldValueMap> = FieldValueMap[T];
type FieldOf<T extends FormFieldType> = Extract<FormField, { type: T }>;
type ValueOf<T extends keyof FieldValueMap> = FieldValue<T>;

/* -------------------- EXPORT -------------------- */

/* -------------------- BACKWARD COMPAT TYPES -------------------- */

export type AudioFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.AUDIO>;
export type AudioValue = ValueOf<typeof FORM_FIELDS_TYPE.AUDIO>;

export type CheckboxFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.CHECKBOX>;
export type CheckboxValue = ValueOf<typeof FORM_FIELDS_TYPE.CHECKBOX>;

export type ColorConfig = FieldOf<typeof FORM_FIELDS_TYPE.COLOR>;
export type ColorValue = ValueOf<typeof FORM_FIELDS_TYPE.COLOR>;

export type DatePickerConfig = FieldOf<typeof FORM_FIELDS_TYPE.DATE>;
export type DateValue = ValueOf<typeof FORM_FIELDS_TYPE.DATE>;

export type DayPickerConfig = FieldOf<typeof FORM_FIELDS_TYPE.DAY>;
export type DayValue = ValueOf<typeof FORM_FIELDS_TYPE.DAY>;

export type MonthPickerConfig = FieldOf<typeof FORM_FIELDS_TYPE.MONTH>;
export type MonthValue = ValueOf<typeof FORM_FIELDS_TYPE.MONTH>;

export type MonthYearPickerConfig = FieldOf<typeof FORM_FIELDS_TYPE.MONTH_YEAR>;
export type MonthYearValue = ValueOf<typeof FORM_FIELDS_TYPE.MONTH_YEAR>;

export type YearPickerConfig = FieldOf<typeof FORM_FIELDS_TYPE.YEAR>;
export type YearPickerValue = ValueOf<typeof FORM_FIELDS_TYPE.YEAR>;

export type DropdownFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.DROPDOWN>;
export type DropdownValue = ValueOf<typeof FORM_FIELDS_TYPE.DROPDOWN>;

export type SimpleDropdownFieldConfig = FieldOf<
  typeof FORM_FIELDS_TYPE.SIMPLE_DROPDOWN
>;
export type DropdownSimpleValue = ValueOf<
  typeof FORM_FIELDS_TYPE.SIMPLE_DROPDOWN
>;

export type MultiDropdownFieldConfig = FieldOf<
  typeof FORM_FIELDS_TYPE.MULTI_DROPDOWN
>;
export type MultiDropdownValue = ValueOf<
  typeof FORM_FIELDS_TYPE.MULTI_DROPDOWN
>;

export type EmailConfig = FieldOf<typeof FORM_FIELDS_TYPE.EMAIL>;
export type EmailValue = ValueOf<typeof FORM_FIELDS_TYPE.EMAIL>;

export type ImageFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.IMAGE>;
export type ImageValue = ValueOf<typeof FORM_FIELDS_TYPE.IMAGE>;

export type JsonConfig = FieldOf<typeof FORM_FIELDS_TYPE.JSON>;
export type JsonValue = ValueOf<typeof FORM_FIELDS_TYPE.JSON>;

export type MobileFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.MOBILE>;
export type MobileValue = ValueOf<typeof FORM_FIELDS_TYPE.MOBILE>;

export type OTPFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.OTP>;
export type OTPValue = ValueOf<typeof FORM_FIELDS_TYPE.OTP>;

export type PasswordConfig = FieldOf<typeof FORM_FIELDS_TYPE.PASSWORD>;
export type PasswordValue = ValueOf<typeof FORM_FIELDS_TYPE.PASSWORD>;

export type RadioFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.RADIO>;
export type RadioValue = ValueOf<typeof FORM_FIELDS_TYPE.RADIO>;

export type SearchFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.SEARCH>;
export type SearchValue = ValueOf<typeof FORM_FIELDS_TYPE.SEARCH>;

export type SecurityQuestionFieldConfig = FieldOf<
  typeof FORM_FIELDS_TYPE.SECURITY_QUESTION
>;
export type SecurityQuestionValue = ValueOf<
  typeof FORM_FIELDS_TYPE.SECURITY_QUESTION
>;

export type SliderFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.SLIDER>;
export type SliderValue = ValueOf<typeof FORM_FIELDS_TYPE.SLIDER>;

export type StepperFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.STEPPER>;
export type StepperValue = ValueOf<typeof FORM_FIELDS_TYPE.STEPPER>;

export type SwitchFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.SWITCH>;
export type SwitchValue = ValueOf<typeof FORM_FIELDS_TYPE.SWITCH>;

export type TextFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.TEXT>;
export type TextValue = ValueOf<typeof FORM_FIELDS_TYPE.TEXT>;

export type TextAreaFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.TEXT_AREA>;
export type TextAreaValue = ValueOf<typeof FORM_FIELDS_TYPE.TEXT_AREA>;

export type TimeFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.TIME>;
export type TimeFieldValue = ValueOf<typeof FORM_FIELDS_TYPE.TIME>;

export type URLFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.URL>;
export type URLFieldValue = ValueOf<typeof FORM_FIELDS_TYPE.URL>;

export type VideoFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.VIDEO>;
export type VideoFile = ValueOf<typeof FORM_FIELDS_TYPE.VIDEO>;

export type FileFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.FILE>;
export type FileFile = ValueOf<typeof FORM_FIELDS_TYPE.FILE>;

export type AddressFieldConfig = FieldOf<typeof FORM_FIELDS_TYPE.ADDRESS>;
export type AddressValue = ValueOf<typeof FORM_FIELDS_TYPE.ADDRESS>;
