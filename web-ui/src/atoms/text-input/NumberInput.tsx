import React from "react";
import { TextInput } from "./TextInput";
import type { TextInputProps } from "./TextInput.types";

export const NumberInput = React.forwardRef<
  HTMLInputElement,
  Omit<TextInputProps, "type">
>((props, ref) => {
  return (
    <TextInput
      ref={ref}
      type="number"
      inputMode="email"
      autoComplete="email"
      {...props}
    />
  );
});

NumberInput.displayName = "NumberInput";
