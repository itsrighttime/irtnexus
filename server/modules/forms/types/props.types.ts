type cssStyle = Record<string, string>;

export interface BaseProps {
  className?: string; // Custom CSS class override
  style?: cssStyle; // Inline style override
  id?: string; // Unique ID
  size?: "small" | "medium" | "large"; // Controls dimensions and typography
  radius?: "none" | "sm" | "md" | "lg"; // Border radius
  color?: string; // Primary color override
  disabled?: boolean; // Disabled state
  loading?: boolean; // Loading state
  onClick?: (event: any) => void; // Generic click handler
  setResult?: (value: any) => void; // Generic change handler
  responsive?: boolean; // Container-query based responsiveness
  tooltip?: string; // Optional tooltip text
  ariaLabel?: string; // Accessibility label
  required?: boolean;
  label?: string;
  width?: string;
  height?: string;
  value?: any;
}

export type OmitProp =
  | "size"
  | "onChange"
  | "onClick"
  | "type"
  | "height"
  | "value"
  | "name"
  | "width";

interface CalendarInputProps extends BaseProps {
  mode: "date" | "day" | "month" | "month-year" | "year";
  value?: string | number | null;
  setResult: (value: any) => void;
  placeholder?: string;
  restrictionStartDate?: string | null;
  restrictionEndDate?: string | null;
  label?: string;
  required?: boolean;
  variant?: "full" | "underline";
  color?: string;
}

export interface CalendarPickerProp extends Omit<CalendarInputProps, "mode"> {}

export interface OtpFieldProps extends BaseProps {
  length?: number;
  setResult: (otp: string | null) => void;
  verificationEndpoint?: string;
  userId?: string | number;
  setError?: (err: string) => void;
  isNumeric?: boolean;
}

export interface Suggestion {
  code: string | number;
  name: string;
}

export interface SearchBoxProps {
  suggestions: Suggestion[];
  setResult: (value: string | number) => void;
  color?: string;
  placeholder?: string;
  width?: string;
}

type CheckboxOptionType =
  | {
      value: string | number;
      label: string;
      help?: string;
      disabled?: boolean;
    }
  | string;

export interface CheckboxGroupProps {
  options?: CheckboxOptionType[];
  value?: Array<string | number>;
  setResult: (value: Array<string | number> | string | number | null) => void;
  layout?: "vertical" | "horizontal";
  label?: string;
  color?: string;
  disabled?: boolean;
  customStyles?: cssStyle;
  width?: string;
  required?: boolean;
}

export type DropdownProps = {
  options: string[];
  multiple?: boolean;
  placeholder?: string;
  label?: string;
  setResult: (selected: string[]) => void;
  color?: string;
  value?: string[];
  addNew?: boolean;
  setAddedOptions?: (options: string[]) => void;
  width?: string;
  required?: boolean;
};

export type SingleDropdownProps = Omit<
  DropdownProps,
  "multiple" | "value" | "setResult"
> & {
  value?: string;
  setResult: (value: string) => void;
};

export type MultipleDropdownProps = Omit<DropdownProps, "multiple">;

export type DropdownItem =
  | {
      key: string | number;
      route?: string;
      value: string;
      box?: string[];
      description?: string;
    }
  | string;

export type DropdownSimpleProps = {
  items: DropdownItem[];
  onSelect?: (key: string | number) => void;
  isOpen?: boolean;
};

type RadioOptionType =
  | {
      key: string | number;
      value: string | number;
      label: string;
      help?: string;
      disabled?: boolean;
    }
  | string;

export interface RadioGroupProps {
  options: RadioOptionType[];
  value?: string | number;
  setResult: (value: string | number | null) => void;
  layout?: "vertical" | "horizontal";
  label?: string;
  color?: string;
  disabled?: boolean;
  customStyles?: cssStyle;
  width?: string;
  required?: boolean;
}

interface SuggstionOption {
  value: string | number;
  label: string;
  help?: string;
  disabled?: boolean;
}

export type SliderValueSide = "none" | "left" | "right" | "top" | "bottom";

export interface SliderProps {
  value?: number;
  setResult: (val: number) => void;
  color?: string;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showRange?: boolean;
  showValueSide?: SliderValueSide;
  precision?: number;
  width?: string;
  required?: boolean;
}

export interface StepperProps {
  value?: number;
  setResult: (val: number) => void;
  color?: string;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  width?: string;
  required?: boolean;
}

export interface SwitchProps {
  value?: boolean;
  setResult: (value: boolean) => void;
  color?: string;
  label?: string;
  disabled?: boolean;
  customStyles?: cssStyle;
  required?: boolean;
  width?: string;
}

export type AddressValue = {
  house?: string;
  street?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  addressLine?: string;
  landmark?: string;
};

export type AddressInputProps = {
  value?: AddressValue;
  width?: string;
  setResult?: (value: AddressValue) => void;

  isHouse?: boolean;
  isStreet?: boolean;
  isCity?: boolean;
  isState?: boolean;
  isPostal?: boolean;
  isCountry?: boolean;
  isAddressLine?: boolean;
  isLandmark?: boolean;

  disabled?: boolean;
  loading?: boolean;
};

export interface TextInputProps extends BaseProps, Omit<any, OmitProp> {
  label?: string;
  helperText?: string;
  error?: string;

  variant?: "outline" | "filled" | "ghost" | "underline";

  textType?: "text" | "password" | "number" | "email" | "tel";

  iconLeft?: any;
  iconRight?: any;

  block?: boolean;

  setResult?: (value: string) => void;
}

export type TextInputVarientType = Omit<TextInputProps, "type">;

export type EmailInputType = Omit<TextInputProps, "type" | "iconLeft">;

export type JsonFieldProps = {
  label?: string;
  setResult: (json: string) => void;
  setIsFieldValid: (isValid: boolean) => void;
  color?: string;
  hideOnSave?: boolean;
  showCharacterCount?: boolean;
  showWordCount?: boolean;
  width?: string;
  isBorder?: boolean;
  backendError?: string;
  value?: string;
  required?: boolean;
};

export type TextAreaProps = {
  label?: string;
  value?: string;
  setResult: (value: string) => void;
  color?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  maxTextAreaHeight?: number;
  setIsFieldValid?: (isValid: boolean) => void;
  showCharacterCount?: boolean;
  showWordCount?: boolean;
  disabled?: boolean;
  style?: cssStyle;
  width?: string;
  showLabelAlways?: boolean;
  backendError?: string;
  required?: boolean;
};

export interface UrlInputProps extends Omit<TextInputProps, "textType"> {}

export interface TimePickerProps extends BaseProps {
  label?: string;
  value?: string;
  setResult: (time: string) => void;
  width?: string;
  required?: boolean;

  // 🔥 New Config
  minTime?: string; // "08:30 AM"
  maxTime?: string; // "06:00 PM"
  minuteStep?: number; // default: 1
  hourStep?: number; // default: 1
}

export interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (option: string) => void;
  color?: string;
  specialStyle?: cssStyle;
  error?: boolean;
}

export type AudioUploadProps = {
  label?: string;
  setResult: (file: File | null) => void;
  color?: string;
  setIsFieldValid?: (isValid: boolean) => void;
  allowedTypes?: string[];
  maxSizeMb?: number;
  width?: string;
  height?: string;
  value?: string | File | Blob | null;
  backendError?: string;
  required?: boolean;
};

export interface FileUploadProps {
  value?: File[];
  label?: string;
  setResult: (files: File[]) => void;
  color?: string;
  setIsFieldValid?: (isValid: boolean) => void;
  allowedTypes?: string[];
  maxSizeMb?: number; // in MB
  maxFiles?: number;
  width?: string;
  height?: string;
  backendError?: string;
  required?: boolean;
}

export interface ImageUploadProps {
  label?: string;
  setResult: (file: File | null) => void;
  color?: string;
  setIsFieldValid?: (isValid: boolean) => void;
  allowedTypes?: string[];
  maxSizeMb?: number;
  requireSquare?: boolean;
  width?: string;
  height?: string;
  previewBorderRadius?: string;
  backendError?: string;
  value?: File | string | null | any;
  required?: boolean;
}

export interface VideoUploadProps {
  label?: string;
  color?: string;
  setResult: (file: File | null) => void;
  setIsFieldValid?: (isValid: boolean | null) => void;
  allowedTypes?: string[];
  maxSizeMb?: number;
  preview?: boolean;
  width?: string;
  height?: string;
  backendError?: string;
  value?: File | Blob | string | null;
  required?: boolean;
}
