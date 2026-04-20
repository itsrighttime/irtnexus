import type { BaseProps } from "@/types";
import type { OmitProp } from "@/types/atoms/base-props";

export interface TextInputProps
  extends
    BaseProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, OmitProp> {
  label?: string;
  helperText?: string;
  error?: string;

  variant?: "outline" | "filled" | "ghost" | "underline";

  textType?: "text" | "password" | "number" | "email" | "tel";

  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;

  block?: boolean;

  setResult?: (value: string) => void;
}

export type TextInputVarientType = Omit<TextInputProps, "type">;
