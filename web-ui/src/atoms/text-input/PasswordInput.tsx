import React from "react";
import { TextInput } from "./TextInput";
import type { TextInputVarientType } from "./TextInput.types";

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  TextInputVarientType
>((props, ref) => {
  return (
    <TextInput
      ref={ref}
      textType="password"
      autoComplete="current-password"
      {...props}
    />
  );
});

PasswordInput.displayName = "PasswordInput";
