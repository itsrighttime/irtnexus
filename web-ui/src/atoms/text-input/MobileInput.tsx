import React from "react";
import { TextInput } from "./TextInput";
import type { TextInputProps } from "./TextInput.types";
import { Icons } from "@/assets";

export const MobileInput = React.forwardRef<
  HTMLInputElement,
  Omit<TextInputProps, "type">
>(({ onChange, ...props }, ref) => {
  const handleChange = (value: string) => {
    // Simple cleanup: allow only digits and +
    const cleaned = value.replace(/[^\d+]/g, "");
    onChange?.(cleaned);
  };

  return (
    <TextInput
      ref={ref}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      iconLeft={Icons.callIcon}
      onChange={handleChange}
      {...props}
    />
  );
});

MobileInput.displayName = "MobileInput";
