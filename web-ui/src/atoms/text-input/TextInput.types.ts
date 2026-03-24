import type { BaseProps } from "@/types";

export interface TextInputProps
  extends
    BaseProps,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size" | "onChange" | "onClick" | "type"
    > {
  label?: string;
  helperText?: string;
  error?: string;

  variant?: "outline" | "filled" | "ghost" | "underline";

  type?: "text" | "password" | "number" | "email" | "tel";

  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;

  block?: boolean;

  onChange?: (value: string) => void;
}
