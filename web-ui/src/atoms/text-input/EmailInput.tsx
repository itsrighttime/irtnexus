import React from "react";
import { TextInput } from "./TextInput";
import type { TextInputProps } from "./TextInput.types";
import { Icons } from "@/assets/icons";

export const EmailInput = React.forwardRef<
  HTMLInputElement,
  Omit<TextInputProps, "type" | "iconLeft">
>((props, ref) => {
  return (
    <TextInput
      ref={ref}
      type="email"
      inputMode="email"
      autoComplete="email"
      iconLeft={Icons.MailIcon}
      {...props}
    />
  );
});

EmailInput.displayName = "EmailInput";
