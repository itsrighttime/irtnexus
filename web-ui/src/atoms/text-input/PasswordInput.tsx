import React from "react";
import { TextInput } from "./TextInput";
import type { TextInputProps } from "./TextInput.types";

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<TextInputProps, "type">
>((props, ref) => {
  return (
    <TextInput
      ref={ref}
      type="password"
      autoComplete="current-password"
      {...props}
    />
  );
});

PasswordInput.displayName = "PasswordInput";
