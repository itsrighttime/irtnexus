import React, { useState, useEffect } from "react";
import { Icons } from "@/assets/icons";
import type { TextInputProps } from "./TextInput.types";
import { TextInput } from "./TextInput";

export interface UrlInputProps extends Omit<TextInputProps, "textType"> {}

export const UrlInput = ({ setResult, ...props }: UrlInputProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [favicon, setFavicon] = useState<string | null>(null);
  const [faviconError, setFaviconError] = useState(false);

  const normalizeUrl = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(normalizeUrl(url));
      return true;
    } catch {
      return false;
    }
  };

  const extractDomain = (url: string) => {
    try {
      return new URL(normalizeUrl(url)).hostname;
    } catch {
      return "";
    }
  };

  useEffect(() => {
    if (!value) {
      setError(undefined);
      setFavicon(null);
      setFaviconError(false);
      return;
    }

    if (!isValidUrl(value)) {
      setError("Invalid URL");
      setFavicon(null);
      setFaviconError(false);
      return;
    }

    setError(undefined);

    const domain = extractDomain(value);
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    setFavicon(faviconUrl);
    setFaviconError(false);
  }, [value]);

  const handleChange = (val: string) => {
    setValue(val);
    setResult?.(val);
  };

  const renderLeftIcon = () => {
    if (!value) return null;

    if (favicon && !faviconError) {
      return (
        <img
          src={favicon}
          alt="favicon"
          style={{ width: 20, height: 20, objectFit: "contain" }}
          onError={() => setFaviconError(true)}
        />
      );
    }

    // Fallback icon
    return Icons["LinkIcon"]; // make sure you have this in your icon set
  };

  return (
    <TextInput
      {...props}
      textType="text"
      setResult={handleChange}
      error={error}
      iconLeft={renderLeftIcon()}
      placeholder="Enter website URL"
    />
  );
};
