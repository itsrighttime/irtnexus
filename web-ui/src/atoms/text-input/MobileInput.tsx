import React from "react";
import { TextInput } from "./TextInput";
import type { TextInputVarientType } from "./TextInput.types";
import { Icons } from "@/assets/icons";

export const MobileInput = React.forwardRef<
  HTMLInputElement,
  TextInputVarientType
>(({ setResult, ...props }, ref) => {
  const handleChange = (value: string) => {
    // Simple cleanup: allow only digits and +
    const cleaned = value.replace(/[^\d+]/g, "");

    setResult?.(cleaned);
  };

  return (
    <TextInput
      ref={ref}
      textType="tel"
      inputMode="tel"
      autoComplete="tel"
      iconLeft={Icons.callIcon}
      setResult={handleChange}
      {...props}
    />
  );
});

MobileInput.displayName = "MobileInput";
