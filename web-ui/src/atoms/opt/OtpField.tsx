"use client";

import React, { useState, useRef, useEffect, type CSSProperties } from "react";
import style from "./OtpField.module.css";
import { logger, apiCaller } from "core-ui";
import type { BaseProps } from "@/types";

export interface OtpFieldProps extends BaseProps {
  length?: number;
  setResult: (otp: string | null) => void;
  verificationEndpoint?: string;
  userId?: string | number;
  setError?: (err: string) => void;
  isNumeric?: boolean;
}

export const OtpField: React.FC<OtpFieldProps> = ({
  length = 6,
  setResult,
  color,
  width = "300px",
  verificationEndpoint,
  userId,
  setError,
  isNumeric = true,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [colorType, setColorType] = useState<string>("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const validateChar = (char: string) => {
    return isNumeric ? /^\d$/.test(char) : char.length === 1;
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (!validateChar(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input if available
    if (element.nextSibling instanceof HTMLInputElement) {
      element.nextSibling.focus();
    }
  };

  const handleResult = async (value: string) => {
    if (!verificationEndpoint) {
      logger.warn({ message: "Verification endpoint is not passed as prop" });
      return;
    }

    try {
      const response = await apiCaller({
        endpoint: verificationEndpoint,
        method: "POST",
        data: {
          userId,
          otp: value,
        },
      });

      if (!response.status) setError?.(response.messge);
      else if (response?.success) setResult(value);
      else {
        setColorType("colorError");
        setError?.("Invalid Code, Try Again!");
        setResult(null);

        setTimeout(() => {
          setOtp(Array(length).fill(""));
          setColorType("");
          setError?.("");
          inputRefs.current[0]?.focus();
        }, 3000);
      }
    } catch (err: any) {
      logger.error(err);
      setError?.("Verification failed");
      setResult(null);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = e.clipboardData.getData("Text").slice(0, length).split("");
    const filtered = data.filter((char) => validateChar(char)).slice(0, length);

    if (filtered.length === length) {
      setOtp(filtered);
      handleResult(filtered.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
      } else if (index > 0) {
        newOtp[index - 1] = "";
        inputRefs.current[index - 1]?.focus();
      }
      setOtp(newOtp);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    e.target.select();

  useEffect(() => {
    const joinedOtp = otp.join("");
    if (joinedOtp.length === length) handleResult(joinedOtp);
  }, [otp]);

  const cssVariable: CSSProperties = {
    "--color": color || "var(--color-primary)",
    "--width": width,
  } as CSSProperties;

  return (
    <div className={style.otpInputContainer} style={cssVariable}>
      {otp.map((char, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={char}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          className={`${style.otpInput} ${style[colorType]}`}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={handleFocus}
          onPaste={handlePaste}
          inputMode={isNumeric ? "numeric" : "text"}
        />
      ))}
    </div>
  );
};
