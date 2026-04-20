import React from "react";
import { TextInput } from "./TextInput";
import type { TextInputProps } from "./TextInput.types";
import { Icons } from "@/assets/icons";

export type EmailInputType = Omit<TextInputProps, "type" | "iconLeft">;

export const EmailInput = React.forwardRef<HTMLInputElement, EmailInputType>(
  (props, ref) => {
    return (
      <TextInput
        ref={ref}
        textType="email"
        inputMode="email"
        autoComplete="email"
        iconLeft={Icons.MailIcon}
        {...props}
      />
    );
  },
);

EmailInput.displayName = "EmailInput";
