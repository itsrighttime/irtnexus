import { Icons } from "@/assets/icons";
import type { ReactNode } from "react"; // Assuming these icons are React components

const {
  keyIcon,
  lockIcon,
  searchIcon,
  warningIcon,
  warningTimeIcon,
  warningWifiIcon,
} = Icons;

type IconType = ReactNode; // adjust if your icons have a more specific type

export const getErrorIcon = (statusCode: number): IconType => {
  const codeMap: Record<number, IconType> = {
    400: searchIcon,
    401: keyIcon,
    403: lockIcon,
    404: searchIcon,
    500: warningIcon,
    502: warningTimeIcon,
    503: warningTimeIcon,
    504: warningWifiIcon,
  };

  return codeMap[statusCode] || warningIcon;
};

export const getErrorTitle = (statusCode: number): string => {
  const codeMap: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Access Denied",
    404: "Page Not Found",
    500: "Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
  };

  return codeMap[statusCode] || "Something went wrong";
};
