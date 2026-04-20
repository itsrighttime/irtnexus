import React from "react";
import { TextInput } from "./TextInput";
import type { TextInputVarientType } from "./TextInput.types";

export const NumberInput = React.forwardRef<
  HTMLInputElement,
  TextInputVarientType
>((props, ref) => {
  return (
    <TextInput
      ref={ref}
      textType="number"
      inputMode="numeric"
      autoComplete="cc-number"
      {...props}
    />
  );
});

NumberInput.displayName = "NumberInput";
